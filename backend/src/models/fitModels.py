from pydantic import BaseModel, field_validator, Field
from src.models.species import Species
from typing import List, Optional
from typing import Literal

class FloatRangeObject(BaseModel):
    """
    Model representing a range of float values with minimum and maximum bounds.
    
    Used for constraining fitting parameters within specified ranges.
    """
    min: Optional[float] = Field(
        default=None, 
        description="Minimum value of the range",
        example=200.0
    )
    max: Optional[float] = Field(
        default=None, 
        description="Maximum value of the range",
        example=400.0
    )

    @field_validator('max')
    def check_range(cls, max_value, info):
        min_value = info.data.get('min')
        if min_value is not None and min_value >= max_value:
            raise ValueError("Range must be in the form {min < max}")
        return max_value

class BoundingRanges(BaseModel):
    """
    Model defining bounding ranges for fitting parameters.
    
    Constrains the optimization algorithm to search within specified ranges.
    """
    tgas: Optional[FloatRangeObject] = Field(
        default=None, 
        description="Bounding range for gas temperature (K)"
    )
    tvib: Optional[FloatRangeObject] = Field(
        default=None, 
        description="Bounding range for vibrational temperature (K)"
    )
    trot: Optional[FloatRangeObject] = Field(
        default=None, 
        description="Bounding range for rotational temperature (K)"
    )
    mole_fraction: Optional[FloatRangeObject] = Field(
        default=None, 
        description="Bounding range for mole fraction (0-1)"
    )
    pressure: Optional[FloatRangeObject] = Field(
        default=None, 
        description="Bounding range for pressure"
    )

class FitParameters(BaseModel):
    """
    Model containing initial values for parameters to be fitted.
    
    Provides starting points for the optimization algorithm.
    """
    tgas: Optional[float] = Field(
        default=None, 
        description="Initial gas temperature (K)",
        gt=0,
        example=296.0
    )
    tvib: Optional[float] = Field(
        default=None, 
        description="Initial vibrational temperature (K)",
        gt=0,
        example=296.0
    )
    trot: Optional[float] = Field(
        default=None, 
        description="Initial rotational temperature (K)",
        gt=0,
        example=296.0
    )
    mole_fraction: Optional[float] = Field(
        default=None, 
        description="Initial mole fraction (0-1)",
        ge=0,
        le=1,
        example=0.1
    )
    pressure: Optional[float] = Field(
        default=None, 
        description="Initial pressure",
        gt=0,
        example=1.0
    )

class FitProperties(BaseModel):
    """
    Model defining properties of the fitting algorithm.
    
    Controls the optimization method, target variable, and convergence criteria.
    """
    method: Literal["least_squares"] = Field(
        default="least_squares", 
        description="Fitting method to use"
    )
    fit_var: Literal[
        "absorbance",
        "transmittance_noslit",
        "radiance_noslit",
        "transmittance",
        "radiance"
    ] = Field(
        ..., 
        description="Spectral variable to fit"
    )
    normalize: bool = Field(
        default=False, 
        description="Whether to normalize the spectra before fitting"
    )
    max_loops: int = Field(
        default=200, 
        description="Maximum number of fitting iterations",
        ge=1,
        le=1000
    )
    tol: float = Field(
        default=1e-15, 
        description="Tolerance for convergence",
        gt=0
    )

class ExperimentalConditions(BaseModel):
    """
    Model defining experimental conditions for spectrum fitting.
    
    Contains parameters for theoretical spectrum calculation during fitting.
    """
    min_wavenumber_range: float = Field(
        ..., 
        description="Minimum wavenumber for spectral calculation (cm-1)",
        ge=0,
        example=2000.0
    )
    max_wavenumber_range: float = Field(
        ..., 
        description="Maximum wavenumber for spectral calculation (cm-1)",
        ge=0,
        example=2500.0
    )
    specie: Species = Field(
        ..., 
        description="Molecular species for calculation"
    )
    pressure: float = Field(
        ..., 
        description="Gas pressure",
        gt=0,
        example=1.0
    )
    path_length: float = Field(
        ..., 
        description="Optical path length",
        gt=0,
        example=1.0
    )
    simulate_slit: Optional[float] = Field(
        default=1, 
        description="Slit width for simulation",
        gt=0,
        example=5.0
    )
    use_simulate_slit: bool = Field(
        default=False, 
        description="Whether to apply slit function simulation"
    )
    mode: Optional[Literal[
        "absorbance",
        "transmittance_noslit",
        "radiance_noslit",
        "transmittance",
        "radiance",
    ]] = Field(
        default=None, 
        description="Spectral mode for calculation"
    )
    database: Literal["hitran", "geisa", "hitemp", "exomol", "nist"] = Field(
        ..., 
        description="Spectroscopic database to use"
    )
    wavelength_units: Literal["1/u.cm", "u.nm"] = Field(
        ..., 
        description="Units for wavelength/wavenumber"
    )
    pressure_units: Literal["u.bar", "u.mbar", "cds.atm", "u.torr", "u.mTorr", "u.Pa"] = Field(
        ..., 
        description="Units for pressure"
    )
    path_length_units: Literal["u.cm", "u.m", "u.km", "u.mm"] = Field(
        ..., 
        description="Units for path length"
    )

