from typing import List, Optional

import radis
from flask import Flask, request
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_pydantic import validate
from pydantic.main import BaseModel
from radis.io import MOLECULES_LIST_EQUILIBRIUM, MOLECULES_LIST_NONEQUILIBRIUM

app = Flask(__name__)
CORS(app)
limiter = Limiter(
    app,
    key_func=get_remote_address,
)


class QueryModel(BaseModel):
    molecule: str
    min_wavenumber_range: int
    max_wavenumber_range: int
    tgas: float
    tvib: Optional[float]
    pressure: float
    path_length: float
    simulate_slit: bool


class CalcSpectrumResult(BaseModel):
    x: List[float]
    y: List[float]


class ResponseModel(BaseModel):
    error: Optional[str]
    data: Optional[CalcSpectrumResult]


@app.route("/calc-spectrum")
@limiter.limit("1/second")
@validate(query=QueryModel)
def call_calc_spectrum():
    # If too many requests happen at once, RADIS will segfault!
    try:
        spectrum = radis.calc_spectrum(
            wavenum_min=request.query_params.min_wavenumber_range,
            wavenum_max=request.query_params.max_wavenumber_range,
            molecule=request.query_params.molecule,
            isotope="1",
            pressure=request.query_params.pressure,
            Tgas=request.query_params.tgas,
            Tvib=request.query_params.tvib,
            mole_fraction=0.1,
            path_length=request.query_params.path_length,
        )
    except radis.misc.warning.EmptyDatabaseError:
        return ResponseModel(error="No spectrum at specified wavenumber range")
    else:
        if request.query_params.simulate_slit:
            spectrum.apply_slit(0.5, "nm")

        return plot_spectrum(spectrum)


def plot_spectrum(spectrum) -> ResponseModel:
    wunit = spectrum.get_waveunit()
    var = "radiance_noslit"
    iunit = "default"
    x, y = spectrum.get(var, wunit=wunit, Iunit=iunit)
    return ResponseModel(data=CalcSpectrumResult(x=list(x), y=list(y)))


@app.route("/molecules")
def molecules():
    """Get all possible molecules.

    Returns:
        All possible molecules (equilibrium and non-equilibrium).
    """
    return {
        "molecules": sorted(
            set(MOLECULES_LIST_EQUILIBRIUM) | set(MOLECULES_LIST_NONEQUILIBRIUM)
        )
    }


if __name__ == "__main__":
    app.run()
