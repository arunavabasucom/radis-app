from pydantic import BaseModel, Field
from typing import List, Optional
from src.models.species import Species
from src.models.fitModels import FitProperties, BoundingRanges, FitParameters, ExperimentalConditions
from typing import Literal

class fitPayload(BaseModel):
    """
    Payload model for spectrum fitting requests.
    
    Contains all parameters needed to fit an experimental spectrum to theoretical models.
    """
    fit_properties: FitProperties = Field(
        ..., 
        description="Properties controlling the fitting algorithm and parameters"
    )
    bounding_ranges: BoundingRanges = Field(
        ..., 
        description="Bounding ranges for fitting parameters to constrain optimization"
    )
    fit_parameters: FitParameters = Field(
        ..., 
        description="Initial values for parameters to be fitted"
    )
    experimental_conditions: ExperimentalConditions = Field(
        ..., 
        description="Experimental conditions and calculation parameters"
    )
    use_simulate_slit: bool = Field(
        default=False, 
        description="Whether to apply slit function simulation"
    )
    simulate_slit: Optional[float] = Field(
        default=None, 
        description="Slit width for simulation (in nm or cm-1 depending on wavelength units)"
    )

    class Config:
        schema_extra = {
            "example": {
                "fit_properties": {
                    "method": "least_squares",
                    "fit_var": "radiance_noslit",
                    "normalize": False,
                    "max_loops": 200,
                    "tol": 1e-15
                },
                "bounding_ranges": {
                    "tgas": {"min": 200, "max": 400},
                    "pressure": {"min": 0.1, "max": 10.0},
                    "mole_fraction": {"min": 0.01, "max": 1.0}
                },
                "fit_parameters": {
                    "tgas": 296.0,
                    "pressure": 1.0,
                    "mole_fraction": 0.1
                },
                "experimental_conditions": {
                    "min_wavenumber_range": 2000,
                    "max_wavenumber_range": 2010,
                    "specie": {"molecule": "CO", "mole_fraction": 0.1, "is_all_isotopes": False},
                    "pressure": 1.0,
                    "path_length": 1.0,
                    "simulate_slit": 5.0,
                    "use_simulate_slit": True,
                    "mode": "radiance_noslit",
                    "database": "hitran",
                    "wavelength_units": "1/u.cm",
                    "pressure_units": "u.bar",
                    "path_length_units": "u.cm"
                },
                "use_simulate_slit": True,
                "simulate_slit": 5.0
            }
        }

class calcPayload(BaseModel):
    """
    Payload model for spectrum calculation requests.
    
    Contains all parameters needed to calculate a molecular spectrum using the RADIS library.
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
        example=2010.0
    )
    species: List[Species] = Field(
        ..., 
        description="List of molecular species with their concentrations",
        min_items=1,
        example=[{"molecule": "CO", "mole_fraction": 0.1, "is_all_isotopes": False}]
    )
    pressure: float = Field(
        ..., 
        description="Gas pressure",
        gt=0,
        example=1.0
    )
    tgas: float = Field(
        ..., 
        description="Gas temperature (K)",
        gt=0,
        example=296.0
    )
    tvib: Optional[float] = Field(
        default=None, 
        description="Vibrational temperature (K) for non-equilibrium calculations",
        gt=0,
        example=296.0
    )
    trot: Optional[float] = Field(
        default=None, 
        description="Rotational temperature (K) for non-equilibrium calculations",
        gt=0,
        example=296.0
    )
    path_length: float = Field(
        ..., 
        description="Optical path length",
        gt=0,
        example=1.0
    )
    simulate_slit: Optional[float] = Field(
        default=None, 
        description="Slit width for simulation (in nm or cm-1 depending on wavelength units)",
        gt=0,
        example=5.0
    )
    use_simulate_slit: bool = Field(
        default=False, 
        description="Whether to apply slit function simulation"
    )
    mode: Literal[
        "absorbance",
        "transmittance_noslit",
        "radiance_noslit",
        "transmittance",
        "radiance",
    ] = Field(
        ..., 
        description="Spectral mode for calculation"
    )
    database: Literal["hitran", "geisa", "hitemp", "exomol", "nist"] = Field(
        ..., 
        description="Spectroscopic database to use for calculation"
    )
    wavelength_units: Literal["1/u.cm", "u.nm"] = Field(
        ..., 
        description="Units for wavelength/wavenumber"
    )
    pressure_units: Literal["u.bar", "u.mbar", "cds.atm", "u.torr", "u.mTorr", "u.Pa"] = Field(
        ..., 
        description="Units for pressure"
    )
    path_length_units: Literal["u.cm", "u.m", "u.km"] = Field(
        ..., 
        description="Units for path length"
    )

    class Config:
        schema_extra = {
            "example": {
                "min_wavenumber_range": 2000.0,
                "max_wavenumber_range": 2010.0,
                "species": [
                    {"molecule": "CO", "mole_fraction": 0.1, "is_all_isotopes": False}
                ],
                "pressure": 1.0,
                "tgas": 296.0,
                "tvib": 296.0,
                "trot": 296.0,
                "path_length": 1.0,
                "use_simulate_slit": False,
                "mode": "radiance_noslit",
                "database": "hitran",
                "wavelength_units": "1/u.cm",
                "pressure_units": "u.bar",
                "path_length_units": "u.cm"
            }
        }

