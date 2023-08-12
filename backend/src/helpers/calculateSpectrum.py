import radis
import astropy.units as u 
from  astropy.units import cds 
from src.models.payload import Payload

def calculate_spectrum(payload: Payload):
    print(">> Payload : ")
    print(payload)
    spectrum = radis.calc_spectrum(
        payload.min_wavenumber_range * eval(payload.wavelength_units),
        payload.max_wavenumber_range * eval(payload.wavelength_units),
        molecule=[species.molecule for species in payload.species],
        mole_fraction={
            species.molecule: species.mole_fraction for species in payload.species
        },
        # TODO: Hard-coding "1,2,3" as the isotopologue for the time-being
        isotope={species.molecule: "1,2,3" for species in payload.species},
        pressure=payload.pressure * eval(payload.pressure_units),
        Tgas=payload.tgas,
        Tvib=payload.tvib,
        Trot=payload.trot,
        path_length=payload.path_length * eval(payload.path_length_units),
        export_lines=False,
        wstep="auto",
        databank=payload.database,
        use_cached=True,
    )
    return spectrum
