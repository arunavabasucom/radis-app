from pydantic import BaseModel
from typing import List, Optional, AnyStr
from src.models.species import Species
from typing import Literal

class Spectrum(BaseModel):
    database: Literal["hitran", "geisa", "hitemp"]
    pressure: float
    pressure_units: Literal["u.bar", "u.mbar", "cds.atm", "u.torr", "u.mTorr", "u.Pa"]
    tgas: float
    tvib: Optional[float] = None
    trot: Optional[float] = None
    species: List[Species]
    mode: Literal[
        "absorbance",
        "transmittance_noslit",
        "radiance_noslit",
        "transmittance",
        "radiance",
    ]
    wavelength_units: Literal["1/u.cm", "u.nm"]
    x: List[float]
    y: List[float]
    units: AnyStr

