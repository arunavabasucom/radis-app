from pydantic import BaseModel, Field

class Species(BaseModel):
    """
    Model representing a molecular species in a gas mixture.
    
    Defines the molecular species, its concentration, and whether to include all isotopes.
    """
    molecule: str = Field(
        ..., 
        description="Molecular formula (e.g., 'CO', 'H2O', 'CO2')",
        example="CO"
    )
    mole_fraction: float = Field(
        ..., 
        description="Mole fraction of the species in the gas mixture (0-1)",
        ge=0,
        le=1,
        example=0.1
    )
    is_all_isotopes: bool = Field(
        default=False, 
        description="Whether to include all natural isotopes of the molecule"
    )
