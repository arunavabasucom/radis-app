from pydantic import BaseModel
from typing import List, Optional
from src.models.species import Species
from src.models.fitModels import FitProperties, BoundingRanges, FitParameters, ExperimentalConditions
from typing import Literal

class fitPayload(BaseModel):
    fit_properties: FitProperties
    bounding_ranges: BoundingRanges
    fit_parameters: FitParameters
    experimental_conditions: ExperimentalConditions
    use_simulate_slit: bool = False
    simulate_slit: Optional[float] = None

class Payload(BaseModel):
    min_wavenumber_range: float
    max_wavenumber_range: float
    species: List[Species]
    pressure: float
    tgas: float
    tvib: Optional[float] = None
    trot: Optional[float] = None
    path_length: float
    simulate_slit: Optional[float] = None
    use_simulate_slit: bool
    mode: Literal[
        "absorbance",
        "transmittance_noslit",
        "radiance_noslit",
        "transmittance",
        "radiance",
    ]
    database: Literal["hitran", "geisa", "hitemp", "exomol", "nist"]
    wavelength_units: Literal["1/u.cm", "u.nm"]
    pressure_units: Literal["u.bar", "u.mbar", "cds.atm", "u.torr", "u.mTorr", "u.Pa"]
    path_length_units: Literal["u.cm", "u.m", "u.km"]

