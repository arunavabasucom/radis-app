from fastapi import APIRouter, UploadFile, File, Form
from src.models.payload import fitPayload as Payload
from src.helpers.fitSpectrum import fit_spectrum
import astropy.units as u
from json import loads
import numpy as np
import radis
from typing import Dict, Any

router = APIRouter()


@router.post(
    "/fit-spectrum",
    response_model=Dict[str, Any],
    operation_id="fitPayload",
    summary="Fit Experimental Spectrum",
    description="""
Fit an experimental spectrum to theoretical models using the RADIS library.

This endpoint performs spectrum fitting by comparing experimental data with theoretical calculations. 
The fitting process optimizes molecular parameters (temperature, pressure, mole fraction) to minimize 
the difference between experimental and theoretical spectra.

## Key Features:
- **File Upload**: Accepts .spec, .txt, or .csv files with experimental data
- **Multiple Fitting Variables**: Absorbance, transmittance, radiance (with/without slit)
- **Parameter Optimization**: Fits temperature, pressure, mole fraction, and other parameters
- **Bounding Ranges**: Constrains parameter values within specified ranges
- **Convergence Control**: Configurable tolerance and maximum iterations

## Fitting Process:
1. Uploads and validates experimental spectrum file
2. Sets up theoretical calculation with initial parameters
3. Performs iterative optimization using least squares method
4. Returns fitted spectrum, experimental spectrum, and fitting statistics

## Supported File Formats:
- **.spec**: RADIS spectrum files
- **.txt**: Text files with wavelength/intensity data
- **.csv**: Comma-separated values with spectral data

## Performance Notes:
- Fitting time depends on spectral complexity and parameter ranges
- Large spectra are automatically resampled to reduce processing time
- Memory usage scales with spectral resolution and fitting parameters
    """,
    responses={
        200: {
            "description": "Successful spectrum fitting",
            "content": {
                "application/json": {
                    "example": {
                        "data": {
                            "experimental_spectrum": {
                                "x": [2000.0, 2000.1, 2000.2, 2000.3, 2000.4],
                                "y": [0.001, 0.002, 0.003, 0.002, 0.001],
                                "units": "absorbance"
                            },
                            "best_spectrum": {
                                "x": [2000.0, 2000.1, 2000.2, 2000.3, 2000.4],
                                "y": [0.001, 0.002, 0.003, 0.002, 0.001],
                                "units": "absorbance"
                            },
                            "units": "absorbance",
                            "fit_vals": {
                                "tgas": 296.0,
                                "pressure": 1.0,
                                "mole_fraction": 0.1
                            },
                            "residual": 0.001,
                            "time_fitting": 5.2
                        }
                    }
                }
            }
        }
    }
)
async def fit_spectrum_route(
    data: str = Form(..., description="JSON string containing fitting parameters"),
    file: UploadFile = File(..., description="Experimental spectrum file (.spec, .txt, or .csv)")
):
    """
    Fit experimental spectrum to theoretical models.
    
    Args:
        data: JSON string containing fitting parameters (fitPayload model)
        file: Uploaded experimental spectrum file
        
    Returns:
        Dictionary containing fitted spectrum, experimental spectrum, and fitting statistics
        
    """
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