import radis
import numpy as np
from fastapi import APIRouter
import astropy.units as u
from src.models.payload import Payload
from src.helpers.calculateSpectrum import calculate_spectrum

router = APIRouter()
@router.post("/calculate-spectrum")
async def calc_spectrum(payload: Payload):
    print(payload)

    try:
        spectrum = calculate_spectrum(payload)
        if payload.use_simulate_slit is True:
            if(payload.wavelength_units=="1/u.cm"):
                slit_unit="cm-1"
            else:
                slit_unit="nm"
            print("Applying simulate slit")
            spectrum.apply_slit(payload.simulate_slit, slit_unit)

    except radis.misc.warning.EmptyDatabaseError:
        return {"error": "No line in the specified wavenumber range"}
    except Exception as exc:
        print("Error", exc)
        return {"error": str(exc)}
    else:

        wunit = spectrum.get_waveunit()
        iunit = "default"
        xNan, yNan = spectrum.get(payload.mode, wunit=wunit, Iunit=iunit)
        # to remove the nan values from x and y
        x = xNan[~np.isnan(xNan)]
        y = yNan[~np.isnan(yNan)]
        # Reduce payload size
        threshold = 5e7
        if len(spectrum) * 8 * 2 > threshold:
            print("Reducing the payload size")
            # Setting return payload size limit of 50 MB
            # one float is about 8 bytes
            # we return 2 arrays (w, I)
            #     (note: we could avoid returning the full w-range, and recompute it on the client
            #     from the x min, max and step --> less data transfer. TODO )
            resample = int(len(spectrum) * 8 * 2 // threshold)
            x, y = x[::resample], y[::resample]

        return {
            "data": {
                "x": list(x),
                "y": list(y),
                "units": spectrum.units[payload.mode],
            },
        }
