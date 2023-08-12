from pydantic import BaseModel

class Species(BaseModel):
    molecule: str
    mole_fraction: float
