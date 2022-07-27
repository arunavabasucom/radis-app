from typing import List, Optional
from fastapi import FastAPI
from pydantic import BaseModel
import radis
from fastapi.middleware.cors import CORSMiddleware
from pydantic.typing import Literal
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
    simulate_slit: Optional[int] = None
    mode: Literal["absorbance", "transmittance_noslit", "radiance_noslit"]
    database: Literal["hitran", "geisa"]
    use_simulate_slit: bool = False


@app.post("/calculate-spectrum")
async def calculate_spectrum(payload: Payload):
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
        if use_simulate_slit is True:
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
