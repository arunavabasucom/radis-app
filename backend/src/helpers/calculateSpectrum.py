import radis
import astropy.units as u 
from  astropy.units import cds 
from src.models.payload import Payload
from src.helpers.login_to_hitemp import setup_hitemp_credentials

# An arbitrary broadening formula as NIST databank requires `lbfunc`
def broad_arbitrary(**kwargs):
    """An arbitrary broadening formula for the Lorentzian component"""
    hwhm = kwargs["pressure_atm"] * (296 / kwargs["Tgas"])**0.7
    shift = None
    return hwhm, shift


def calculate_spectrum(payload: Payload):
    """Calculate the spectrum using the RADIS library."""
    print(">> Payload : ")
    print(payload)

    if payload.database == "hitemp" or payload.database == "nist":
        setup_hitemp_credentials()

    spectrum = radis.calc_spectrum(
        payload.min_wavenumber_range * eval(payload.wavelength_units),
        payload.max_wavenumber_range * eval(payload.wavelength_units),
        molecule=[species.molecule for species in payload.species],
        mole_fraction={
            species.molecule: species.mole_fraction
            for species in payload.species
        },
        # TODO: Hard-coding "1,2,3" as the isotopologue for the time-being
        isotope={species.molecule: "1,2,3" for species in payload.species}
        if payload.database != "nist" else 0,
        pressure=payload.pressure * eval(payload.pressure_units),
        Tgas=payload.tgas,
        Tvib=payload.tvib,
        Trot=payload.trot,
        path_length=payload.path_length * eval(payload.path_length_units),
        export_lines=False,
        wstep="auto",
        databank=payload.database,
        use_cached=True,
        lbfunc=broad_arbitrary if payload.database == "nist" else None,
        # TODO: add nist and kurucz as options here
        # pfsource=payload.database if payload.database == "nist" else None,
    )
    return spectrum
