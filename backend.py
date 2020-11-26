from flask import Flask, request

from radis import calc_spectrum
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
limiter = Limiter(
    app,
    key_func=get_remote_address,
)

@app.route('/calc-spectrum')
@limiter.limit("1/second")
def call_calc_spectrum():
    """If too many requests happen at once, Radis will segfault!"""
    spectrum = calc_spectrum(
        1900,
        2300,
        molecule=request.args.get("molecule", "CO"),
        isotope="1,2,3",
        pressure=1.01325,
        Tgas=700,
        mole_fraction=0.1,
        path_length=1,
    )
    spectrum.apply_slit(0.5, "nm")
    wunit = spectrum.get_waveunit()
    var = "radiance"
    Iunit = "default"
    x, y = spectrum.get(var, wunit=wunit, Iunit=Iunit)
    return {"x": list(x), "y": list(y)}


if __name__ == "__main__":
    app.run()