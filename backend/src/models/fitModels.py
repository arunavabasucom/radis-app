from pydantic import BaseModel,field_validator, RootModel
from src.models.species import Species
from typing import List, Optional
from typing import Literal

class FloatRangeObject(BaseModel):
    min: Optional[float] = None
    max: Optional[float] = None

    @field_validator('max')
    def check_range(cls, max_value, info):
        min_value = info.data.get('min')
        if min_value is not None and min_value >= max_value:
            raise ValueError("Range must be in the form {min < max}")
        return max_value

class BoundingRanges(BaseModel):
    tgas: Optional[FloatRangeObject] = None
    tvib: Optional[FloatRangeObject] = None
    trot: Optional[FloatRangeObject] = None
    mole_fraction: Optional[FloatRangeObject] = None
    pressure: Optional[FloatRangeObject] = None

class FitParameters(BaseModel):
    tgas: Optional[float] = None
    tvib: Optional[float] = None
    trot: Optional[float] = None
    mole_fraction: Optional[float] = None 
    pressure: Optional [float] = None 

class FitProperties(BaseModel):
    method: Literal["least_squares"]
    fit_var: Literal["absorbance",
        "transmittance_noslit",
        "radiance_noslit",
        "transmittance",
        "radiance"]
    normalize: bool = False
    max_loops: int = 200
    tol: float = 1e-15

class ExperimentalConditions(BaseModel):
    min_wavenumber_range: float
    max_wavenumber_range: float
    specie: Species
    pressure: float
    path_length: float
    simulate_slit: Optional[float] = 1
    use_simulate_slit: bool
    mode: Optional[Literal[
        "absorbance",
        "transmittance_noslit",
        "radiance_noslit",
        "transmittance",
        "radiance",
    ]] = None
    database: Literal["hitran", "geisa", "hitemp", "exomol", "nist"]
    wavelength_units: Literal["1/u.cm", "u.nm"]
    pressure_units: Literal["u.bar", "u.mbar", "cds.atm", "u.torr", "u.mTorr", "u.Pa"]
    path_length_units: Literal["u.cm", "u.m", "u.km", "u.mm"]
