import os
import radis
import numpy as np
from typing import List, Optional
from fastapi import BackgroundTasks, FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pydantic.typing import Literal
from fastapi.responses import FileResponse


# for high resolution
radis.config["GRIDPOINTS_PER_LINEWIDTH_WARN_THRESHOLD"] = 7

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# structure of the request
class Species(BaseModel):
    molecule: str
    mole_fraction: float


class Payload(BaseModel):
    min_wavenumber_range: float
    max_wavenumber_range: float
    species: List[Species]
    pressure: float
    tgas: float
    tvib: Optional[float] = None
    trot: Optional[float] = None
    path_length: float
    simulate_slit: Optional[int] = None
    use_simulate_slit: bool
    mode: Literal[
        "absorbance",
        "transmittance_noslit",
        "radiance_noslit",
        "transmittance",
        "radiance",
    ]
    database: Literal["hitran", "geisa","hitemp"]


# calculating the spectrum return back the spectrum
def calculate_spectrum(payload):
    print(">> Payload : ")
    print(payload)
    spectrum = radis.calc_spectrum(
        payload.min_wavenumber_range,
        payload.max_wavenumber_range,
        molecule=[species.molecule for species in payload.species],
        mole_fraction={
            species.molecule: species.mole_fraction for species in payload.species
        },
        # TODO: Hard-coding "1,2,3" as the isotopologue for the time-being
        isotope={species.molecule: "1,2,3" for species in payload.species},
        pressure=payload.pressure,
        Tgas=payload.tgas,
        Tvib=payload.tvib,
        Trot=payload.trot,
        path_length=payload.path_length,
        export_lines=False,
        wstep="auto",
        databank=payload.database,
        use_cached=True,
    )
    return spectrum


# create the folder in server for better organization
DOWNLOADED_SPECFILES_DIRECTORY = "DOWNLOADED_SPECFILES"


def create_download_directory():

    if os.path.exists(DOWNLOADED_SPECFILES_DIRECTORY):
        print(" >> Folder already exists ")
    else:
        print(">> creating DOWNLOADED_SPECFILES folder")
        os.mkdir(DOWNLOADED_SPECFILES_DIRECTORY)


# delete the file after giving the file response back to the user
def delete_spec(file_path: str):

    if os.path.exists(file_path):
        print(" >> Removing file......")
        os.remove(file_path)
        print(" >>  File removed")
    else:
        print(" >> File is not found ")


# "/calculate-spectrum " --> to calculate the spectrum and return back the x and y coordinates
@app.post("/calculate-spectrum")
async def calc_spectrum(payload: Payload):
    print(payload)

    try:
        spectrum = calculate_spectrum(payload)
        if payload.use_simulate_slit is True:
            print("Applying simulate slit")
            spectrum.apply_slit(payload.simulate_slit, "nm")

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


# "/download-spectrum"--> to return back the .spec file and delete that file after giving the fileresponse back
@app.post("/download-spectrum")
async def download_spec(payload: Payload, background_tasks: BackgroundTasks):

    try:
        create_download_directory()
        spectrum = calculate_spectrum(payload)
        file_name_spec = spectrum.get_name()
        file_name = f"{file_name_spec}.spec"
        file_path = f"{DOWNLOADED_SPECFILES_DIRECTORY/file_name}"
        if payload.use_simulate_slit is True:
            print(" >> Applying simulate slit")
            spectrum.apply_slit(payload.simulate_slit, "nm")
    # returning the error response
    except radis.misc.warning.EmptyDatabaseError:
        return {"error": "No line in the specified wavenumber range"}
    except Exception as exc:
        print("Error", exc)
        return {"error": str(exc)}
    else:
        spectrum.store(file_path, compress=True, if_exists_then="replace")
        # running as a background task to delete the .spec file after giving the file response back
        background_tasks.add_task(delete_spec, file_path)
        return FileResponse(
            file_path, media_type="application/octet-stream", filename=file_name
        )
