import os
from typing import List, Optional

import radis
from flask import Flask, render_template, request
from flask_cors import CORS, cross_origin
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_pydantic import validate
from pydantic.main import BaseModel
from radis.db import MOLECULES_LIST_EQUILIBRIUM, MOLECULES_LIST_NONEQUILIBRIUM

app = Flask(__name__, static_folder="build/static", template_folder="build")
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

limiter = Limiter(
    app,
    key_func=get_remote_address,
)


class Species(BaseModel):
    molecule: str
    mole_fraction: float


class RequestModel(BaseModel):
    species: List[Species]
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


@app.route("/calc-spectrum", methods=["POST"])
@cross_origin()
@limiter.limit("1/second")
@validate(body=RequestModel)
def call_calc_spectrum():

    # If too many requests happen at once, RADIS will segfault!
    try:
        spectrum = radis.calc_spectrum(
            wavenum_min=request.body_params.min_wavenumber_range,
            wavenum_max=request.body_params.max_wavenumber_range,
            molecule=[species.molecule for species in request.body_params.species],
            mole_fraction={
                species.molecule: species.mole_fraction
                for species in request.body_params.species
            },
            # TODO: Hard-coding "1" as the isotopologue for the time-being
            isotope={species.molecule: "1" for species in request.body_params.species},
            pressure=request.body_params.pressure,
            Tgas=request.body_params.tgas,
            Tvib=request.body_params.tvib,
            Trot=request.body_params.trot,
            path_length=request.body_params.path_length,
            export_lines=False,
            warnings={
                "AccuracyError": "warn",  # do not raise error if grid too coarse. Discard once we have wstep='auto'. https://github.com/radis/radis/issues/184
            },
        )
    except radis.misc.warning.EmptyDatabaseError:
        return ResponseModel(error="No line in the specified wavenumber range")
    else:
        if request.body_params.simulate_slit:
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


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=os.environ.get("PORT", 80))
