import astropy.units as u 
from  astropy.units import cds 
from src.models.payload import Payload
from radis import SpectrumFactory
from radis.los.slabs import MergeSlabs
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


    # List of all species spectra to be merged later
    s_list =[]
    for species in payload.species:
        generated_spectrum = None

        # Conditions
        load_columns='equilibrium'
        spectrum_conditions = {}
        if payload.tvib is not None and payload.trot is not None:
            spectrum_conditions["Tvib"] = payload.tvib
            spectrum_conditions["Trot"] = payload.trot
            load_columns='noneq'
        else:
            spectrum_conditions["Tgas"] = payload.tgas
        spectrum_conditions["mole_fraction"] = species.mole_fraction
        spectrum_conditions["pressure"] = payload.pressure * eval(payload.pressure_units)
        spectrum_conditions["path_length"] = payload.path_length * eval(payload.path_length_units)

        # Options
        spectrum_options={}
        spectrum_options["wavenum_min"] = payload.min_wavenumber_range * eval(payload.wavelength_units)
        spectrum_options["wavenum_max"] = payload.max_wavenumber_range * eval(payload.wavelength_units)
        if(payload.wavelength_units=="1/u.cm"):
            spectrum_options["waveunit"]="cm-1"
        else:
            spectrum_options["waveunit"]="nm"
        spectrum_options["isotope"] = '1,2,3' if payload.database != "nist" else 0
        spectrum_options["molecule"] = species.molecule
        spectrum_options["dbformat"] = payload.database
        spectrum_options["load_columns"] = load_columns

        # 1. spectrum factory
        sf = SpectrumFactory(
        wmin=spectrum_options["wavenum_min"] ,
        wmax=spectrum_options["wavenum_max"] ,
        wunit=spectrum_options["waveunit"],
        isotope=spectrum_options["isotope"],
        molecule=spectrum_options["molecule"],
        lbfunc=broad_arbitrary if payload.database == "nist" else None,
        wstep="auto",
        )

        # 2. fetch databank
        sf.fetch_databank(
            source=spectrum_options["dbformat"],
            load_columns=spectrum_options["load_columns"],
            # broadf_download=False, # TODO Uncomment when radis 0.16.3 is released to prevent unnecessary exomol db broad files downloads
            ) 

        # 3. generate spectrum
        if spectrum_options["load_columns"] == 'noneq':
            generated_spectrum = sf.non_eq_spectrum(**spectrum_conditions)
        else:
            useGpu=False # TODO: Add option in the frontend
            if useGpu:
                spectrum_conditions["device_id"] = 'intel' # or 'nvidia'
                generated_spectrum = sf.eq_spectrum_gpu(**spectrum_conditions)
            else:
                generated_spectrum = sf.eq_spectrum(**spectrum_conditions)

        s_list.append(generated_spectrum)

    spec = MergeSlabs(*s_list,resample="intersect")
    return spec
