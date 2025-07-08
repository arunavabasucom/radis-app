from fastapi import APIRouter, UploadFile, File, Form
from src.models.payload import fitPayload as Payload
from src.helpers.fitSpectrum import fit_spectrum
import astropy.units as u
from json import loads
import numpy as np
import radis

router = APIRouter()
@router.post("/fit-spectrum")
async def fit_spectrum_route(
    data: str = Form(...),
    file: UploadFile = File(...)
    ):
    payload = Payload(**loads(data)) 

    # cause radiance_noslit and transmittance_noslit are not supported by fit_spectrum function
    if payload.fit_properties.fit_var == 'radiance_noslit':
        payload.fit_properties.fit_var = 'radiance'
    elif payload.fit_properties.fit_var == 'transmittance_noslit':
        payload.fit_properties.fit_var = 'transmittance'


    if not file.filename.endswith((".spec", ".txt", ".csv")):
        return {"error": "File must have a .spec, .txt, or .csv extension"}

    try:
        s_experimental, s_best, result, log = await fit_spectrum(payload, file)

    except radis.misc.warning.EmptyDatabaseError:
        return {"error": "No line in the specified wavenumber range"}
    except Exception as exc:
        print("Error", exc)
        return {"error": str(exc)}
    else:
        experimental_spectrum = get_spectrum(s_experimental, payload)
        best_spectrum = get_spectrum(s_best, payload)

        return {
            "data": {
                "experimental_spectrum": experimental_spectrum,
                "best_spectrum": best_spectrum,
                "units": s_experimental.units[payload.fit_properties.fit_var],
                "fit_vals": log["fit_vals"],
                "residual": log["residual"],
                "time_fitting": log["time_fitting"],
            },
        }

def get_spectrum(s_experimental, payload):
    wunit = s_experimental.get_waveunit()
    iunit = "default"
    xNan, yNan = s_experimental.get(payload.fit_properties.fit_var, wunit=wunit, Iunit=iunit)
    # if the specified units were nm, convert the spectrum range (cm-1 by default) to nm
    if (payload.experimental_conditions.wavelength_units == 'u.nm'):
        xNan = 1e7 / xNan
        xNan = np.sort(xNan)
    # to remove the nan values from x and y
    x = xNan[~np.isnan(xNan)]
    y = yNan[~np.isnan(yNan)]
    # Reduce payload size
    threshold = 5e7
    if len(s_experimental) * 8 * 2 > threshold:
        print("Reducing the payload size")
        # Setting return payload size limit of 50 MB
        # one float is about 8 bytes
        # we return 2 arrays (w, I)
        #     (note: we could avoid returning the full w-range, and recompute it on the client
        #     from the x min, max and step --> less data transfer. TODO )
        resample = int(len(s_experimental) * 8 * 2 // threshold)
        x, y = x[::resample], y[::resample]
    return {
        "x": list(x),
        "y": list(y),
        "units": s_experimental.units[payload.fit_properties.fit_var],
    }