payload_data = {
    "species": [
        {
            "molecule": "CO",
            "mole_fraction": 0.2,
            "is_all_isotopes": False
        }
    ],
    "mode": "absorbance",
    "database": "hitran",
    "tgas": 300,
    "min_wavenumber_range": 1900,
    "max_wavenumber_range": 2300,
    "pressure": 1.01325,
    "path_length": 11,
    "use_simulate_slit": 'true',
    "simulate_slit": 5,
    "wavelength_units": "1/u.cm",
    "path_length_units": "u.km",
    "pressure_units": "cds.atm"
}

fit_payload_data = {
    "fit_properties": {
        "method": "least_squares",
        "fit_var": "radiance",
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
        "specie": {"molecule": "NH3", "mole_fraction": 0.1, "is_all_isotopes": False},
        "pressure": 1.0,
        "path_length": 1.0,
        "simulate_slit": 5.0,
        "use_simulate_slit": True,
        "mode": "radiance",
        "database": "hitran",
        "wavelength_units": "1/u.cm",
        "pressure_units": "u.bar",
        "path_length_units": "u.cm"
    },
    "use_simulate_slit": True,
    "simulate_slit": 5.0
}