import radis
import numpy as np
from fastapi import APIRouter
import astropy.units as u
from src.models.payload import calcPayload as Payload
from src.helpers.calculateSpectrum import calculate_spectrum
from typing import Dict, Any

router = APIRouter()

@router.post(
    "/calculate-spectrum",
    response_model=Dict[str, Any],
    summary="Calculate Molecular Spectrum",
    description="""
Calculate a molecular spectrum using the RADIS library with specified parameters.

This endpoint performs high-resolution infrared molecular spectra calculations using various spectroscopic databases. 
The calculation can include multiple molecular species, different spectral modes, and optional slit function simulation.

## Key Features:
- **Multiple Databases**: HITRAN, HITEMP, GEISA, ExoMol, NIST
- **Spectral Modes**: Absorbance, transmittance, radiance (with/without slit)
- **Non-equilibrium**: Support for different vibrational and rotational temperatures
- **Slit Function**: Optional simulation of instrumental broadening
- **Flexible Units**: Various wavelength, pressure, and path length units

## Calculation Process:
1. Validates input parameters
2. Loads spectroscopic data from selected database
3. Performs line-by-line calculation
4. Applies slit function if requested
5. Returns spectrum data with coordinates and units

## Performance Notes:
- Large spectra are automatically resampled to reduce payload size
- Calculation time depends on spectral range and database size
- Memory usage scales with number of spectral lines
    """,
    responses={
        200: {
            "description": "Successful spectrum calculation",
            "content": {
                "application/json": {
                    "example": {
                        "data": {
                            "x": [2000.0, 2000.1, 2000.2, 2000.3, 2000.4],
                            "y": [0.001, 0.002, 0.003, 0.002, 0.001],
                            "units": "absorbance"
                        }
                    }
                }
            }
        }
    }
)
async def calc_spectrum(payload: Payload):
    """
    Calculate molecular spectrum using RADIS library.
    
    Args:
        payload: Payload object containing calculation parameters
        
    Returns:
        Dictionary containing spectrum data with x, y coordinates and units

    """
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
        # if the specified units were nm, convert the spectrum range (cm-1 by default) to nm
        if (payload.wavelength_units == 'u.nm'):
            xNan = 1e7 / xNan
            xNan = np.sort(xNan)
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
