import astropy.units as u 
from  astropy.units import cds 
from src.models.payload import fitPayload as Payload
from radis.tools.new_fitting import fit_spectrum as radis_fit_spectrum
from fastapi import UploadFile
from radis import load_spec
from radis import Spectrum
import os
import tempfile

# An arbitrary broadening formula as NIST databank requires `lbfunc`
def broad_arbitrary(**kwargs):
    """An arbitrary broadening formula for the Lorentzian component"""
    hwhm = kwargs["pressure_atm"] * (296 / kwargs["Tgas"])**0.7
    shift = None
    return hwhm, shift

async def fit_spectrum(payload: Payload, file: UploadFile):
    """Fit the spectrum using the RADIS library."""
    # Extract parameters from the payload
    ExperimentalConditions = payload.experimental_conditions
    FitParameters = payload.fit_parameters
    FitProperties = payload.fit_properties
    BoundingRanges = payload.bounding_ranges
    
    Wunit = None
    if(ExperimentalConditions.wavelength_units=="1/u.cm"):
        Wunit="cm-1"
    else:
        Wunit="nm"
    
    # Load the experimental spectrum from the uploaded file
    content = await file.read() 
    suffix = os.path.splitext(file.filename)[-1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(content)
        tmp_path = tmp.name
    s_experimental=None
    if(suffix == '.spec'):
        s_experimental = load_spec(tmp_path)
    else:
        s_experimental = Spectrum.from_txt(
                            tmp_path, 
                            payload.fit_properties.fit_var,
                            wunit=Wunit, 
                            unit=f'mW/cm2/sr/{Wunit}')

    isotope = None
    if ExperimentalConditions.database == "nist":
        isotope = 0
    elif ExperimentalConditions.specie.is_all_isotopes:
        isotope = 'all'
    else:
        isotope = '1'

    experimental_conditions = {
        "molecule": ExperimentalConditions.specie.molecule,  # Molecule ID
        "isotope": isotope,  # Isotopologue ID, hard-coded to 0 for NIST. # Species mole fraction, from 0 to 1.
        "wmin": ExperimentalConditions.min_wavenumber_range,  # Starting wavelength/wavenumber to be cropped out from the original experimental spectrum.
        "wmax": ExperimentalConditions.max_wavenumber_range,  # Ending wavelength/wavenumber for the cropping range.
        "wunit": Wunit,
        "mole_fraction": ExperimentalConditions.specie.mole_fraction,  # Species mole fraction, from 0 to 1.
        "pressure": ExperimentalConditions.pressure 
        * eval(ExperimentalConditions.pressure_units),
        "path_length": ExperimentalConditions.path_length 
        * eval(ExperimentalConditions.path_length_units),   # Experimental path length, in "cm" unit by default, but you can also use Astropy units.
        # "wstep": "auto",  
        # "export_lines": False,  
        # "lbfunc": broad_arbitrary if ExperimentalConditions.database == "nist" else None,
        # "cutoff": 0,  # (RADIS native) Discard linestrengths that are lower that this to reduce calculation time, in cm-1.
        # "slit": f"{ExperimentalConditions.simulate_slit} {slit_unit}",  # Experimental slit, must be a blank space separating slit amount and unit.
        # "slit": f"{ExperimentalConditions.simulate_slit} nm",  # Experimental slit, must be a blank space separating slit amount and unit.
        # "offset": "-0.2 nm",
        "databank": ExperimentalConditions.database,  # Databank used for calculation. Must be stated.
    }

    if ExperimentalConditions.use_simulate_slit:
        experimental_conditions["slit"] = f"{ExperimentalConditions.simulate_slit} nm"

    # List of parameters to be fitted.
    fit_parameters = {}
    if FitParameters.tgas is not None:
        fit_parameters["Tgas"] = FitParameters.tgas
    if FitParameters.tvib is not None:
        fit_parameters["Tvib"] = FitParameters.tvib
    if FitParameters.trot is not None:
        fit_parameters["Trot"] = FitParameters.trot
    if FitParameters.mole_fraction is not None:
        fit_parameters["mole_fraction"] = FitParameters.mole_fraction
    if FitParameters.pressure is not None:
        fit_parameters["pressure"] = FitParameters.pressure

    # List of bounding ranges applied for those fit parameters above.
    bounding_ranges = {}
    if FitParameters.tgas is not None:
        bounding_ranges["Tgas"] = [BoundingRanges.tgas.min, BoundingRanges.tgas.max]
    if FitParameters.tvib is not None:
        bounding_ranges["Tvib"] = [BoundingRanges.tvib.min, BoundingRanges.tvib.max]   
    if FitParameters.trot is not None:
        bounding_ranges["Trot"] = [BoundingRanges.trot.min, BoundingRanges.trot.max]
    if FitParameters.mole_fraction is not None:
        bounding_ranges["mole_fraction"] = [BoundingRanges.mole_fraction.min, BoundingRanges.mole_fraction.max]
    if FitParameters.pressure is not None:
        bounding_ranges["pressure"] = [BoundingRanges.pressure.min, BoundingRanges.pressure.max]

    # Fitting pipeline setups.
    fit_properties = {
        "method": "least_squares",  # TODO: (Hard Coded for now) Preferred fitting method from the 17 confirmed methods of LMFIT stated in week 4 blog. By default, "leastsq".
        "fit_var": FitProperties.fit_var,  # Spectral quantity to be extracted for fitting process, such as "radiance", "absorbance", etc.
        "normalize": FitProperties.normalize,  # Either applying normalization on both spectra or not.
        "max_loop": FitProperties.max_loops,  # Max number of loops allowed. By default, 200.
        "tol": FitProperties.tol,  # Fitting tolerance, only applicable for "lbfgsb" method.
    }

    s_best, result, log = radis_fit_spectrum(
        s_exp=s_experimental,  # Experimental spectrum.
        fit_params=fit_parameters,  # Fit parameters.
        bounds=bounding_ranges,  # Bounding ranges for those fit parameters.
        model=experimental_conditions,  # Experimental ground-truths conditions.
        pipeline=fit_properties,  # Fitting pipeline references.
        fit_kws={"gtol": 1e-12},
        show_plot=False,
    )
    print(log)

    os.remove(tmp_path)  # Clean up the temp file

    return s_experimental, s_best, result, log
