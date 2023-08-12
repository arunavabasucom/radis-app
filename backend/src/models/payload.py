from pydantic import BaseModel
from typing import List, Optional
from src.models.species import Species
from typing import Literal

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
    database: Literal["hitran", "geisa", "hitemp"]
    wavelength_units: Literal["1/u.cm", "u.nm"]
    pressure_units: Literal["u.bar", "u.mbar", "cds.atm", "u.torr", "u.mTorr", "u.Pa"]
    path_length_units: Literal["u.cm", "u.m", "u.km"]

