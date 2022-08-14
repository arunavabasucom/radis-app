import datetime
import radis
from typing import List, Optional
from fastapi import FastAPI
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
@app.get("/")
def read_root():
    return {"message": " Hello World"}
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
    simulate_slit: int
    use_simulate_slit:bool
    mode: Literal["absorbance", "transmittance_noslit", "radiance_noslit"]
    database: Literal["hitran", "geisa"]

def calculate_spectrum(payload):
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
    
    


@app.post("/calculate-spectrum")
async def cal_spectrum(payload: Payload):
    print(payload)

    try:
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

#[Date] _[database] _[molecule]_[temperature]K_[pressure]atm
@app.get("/download_spectrum")
async def download_spec(payload: Payload):
    print(payload)
    date = datetime.datetime.now().strftime("%Y_%m_%d_%H_%M_%S");
    file_name = f"downloaded_spectrum/{date}_{payload.database}_{payload.tgas}k_{payload.pressure}atm.spec"
    # file_path=f"create_spectrum/{file_name}"
    print(f".spec file is created here{file_name}")
   
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
        spectrum.store(file_name, compress=True, if_exists_then='replace')
        return FileResponse(file_name, media_type='application/octet-stream', filename=file_name)

