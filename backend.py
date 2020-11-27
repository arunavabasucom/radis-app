import radis
from flask import Flask, request
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from radis.io import MOLECULES_LIST_EQUILIBRIUM, MOLECULES_LIST_NONEQUILIBRIUM

app = Flask(__name__)
CORS(app)
limiter = Limiter(
    app,
    key_func=get_remote_address,
)


@app.route("/calc-spectrum")
@limiter.limit("1/second")
def call_calc_spectrum():
    # If too many requests happen at once, RADIS will segfault!
    molecule = request.args["molecule"]
    min_wavelength_range = int(request.args["minWavelengthRange"])
    max_wavelength_range = int(request.args["maxWavelengthRange"])
    try:
        spectrum = radis.calc_spectrum(
            min_wavelength_range,
            max_wavelength_range,
            molecule=molecule,
            isotope="1",
            pressure=1.01325,
            Tgas=700,
            mole_fraction=0.1,
            path_length=1,
        )
    except radis.misc.warning.EmptyDatabaseError:
        return {"error": "No spectrum at specified wavelength range"}
    else:
        wunit = spectrum.get_waveunit()
        var = "radiance_noslit"
        iunit = "default"
        x, y = spectrum.get(var, wunit=wunit, Iunit=iunit)
        return {
            "data": {"x": list(x), "y": list(y), "title": f"Spectrum for {molecule}"}
        }


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
