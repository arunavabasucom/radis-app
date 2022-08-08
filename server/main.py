import radis
import datetime
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
    simulate_slit: Optional[int]
    mode: Literal["absorbance", "transmittance_noslit", "radiance_noslit", "transmittance", "radiance"]
    database: Literal["hitran", "geisa"]
    use_simulate_slit: bool = False


def calculate_spectrum(payload):
    global spectrum
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
def download_spec_file():
    file_name_notation = datetime.datetime.now()
    global file_name
    file_name = f'radis{file_name_notation}.spec'
    spectrum.store(file_name, compress=True, if_exists_then='replace')
    return "spectrum file is created successfully"
def return_spec_file():
    return FileResponse(file_name, media_type='application/octet-stream', filename=f'{file_name}.txt')


@app.post("/calculate-spectrum")
async def calculate_spectrum(payload: Payload, background_taks: BackgroundTasks):
    print(payload)
    try:
        calculate_spectrum(payload)
        if payload.use_simulate_slit is True:
            spectrum.apply_slit(payload.simulate_slit, "nm")
        # downloading the molecule as a background task so that the retrieving
        # x and y values are are not effected
        background_taks.add_task(download_spec())
    except radis.misc.warning.EmptyDatabaseError:
        return {"error": "No line in the specified wavenumber range"}
    except Exception as exc:
        print("Error", exc)
        return {"error": str(exc)}
    else:
        wunit = spectrum.get_waveunit()
        iunit = "default"
        x, y = spectrum.get(payload.mode, wunit=wunit, Iunit=iunit)
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


@app.get("/download")
async def download():
    try:
        return_spec_file()
    except radis.misc.warning.EmptyDatabaseError:
        return {"error": "No line in the specified wavenumber range"}
    except Exception as exc:
        print("Error", exc)
        return {"error": str(exc)}
    else:
        return "file returned successfully"