import os
from typing import List, Optional

import radis
from flask import Flask, request
from flask.helpers import send_from_directory
from flask_cors import CORS, cross_origin
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_pydantic import validate
from pydantic.main import BaseModel
from radis.db import MOLECULES_LIST_EQUILIBRIUM, MOLECULES_LIST_NONEQUILIBRIUM

app = Flask(__name__, static_folder="./build")
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

limiter = Limiter(
    app,
    key_func=get_remote_address,
)


class QueryModel(BaseModel):
    molecule: str
    mole_fraction: float
    min_wavenumber_range: int
    max_wavenumber_range: int
    tgas: float
    tvib: Optional[float]
    trot: Optional[float]
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
@cross_origin()
@limiter.limit("1/second")
@validate(query=QueryModel)
def call_calc_spectrum():
    # If too many requests happen at once, RADIS will segfault!
    try:
        spectrum = radis.calc_spectrum(
            wavenum_min=request.query_params.min_wavenumber_range,
            wavenum_max=request.query_params.max_wavenumber_range,
            molecule=request.query_params.molecule,
            mole_fraction=request.query_params.mole_fraction,
            isotope="1",
            pressure=request.query_params.pressure,
            Tgas=request.query_params.tgas,
            Tvib=request.query_params.tvib,
            Trot=request.query_params.trot,
            path_length=request.query_params.path_length,
        )
    except radis.misc.warning.EmptyDatabaseError:
        return ResponseModel(error="No line in the specified wavenumber range")
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
@cross_origin()
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


# Serve React App
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    app.run(use_reloader=True, threaded=True, port=5000)
