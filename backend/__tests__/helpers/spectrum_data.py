import json

file = open("../helpers/spectrum-data_test.json")
data = json.load(file)

spectrum_data = [
    {
        "species": [
            {
                "molecule": "CH4",
                "mole_fraction": 0.1
            }
        ],
        "mode": "absorbance",
        "database": "hitran",
        "tgas": 300,
        "pressure": 1.01325,
        "wavelength_units": "u.nm",
        "pressure_units": "u.bar",
        "x": data['CH4']['x'],
        "y": data['CH4']['y'],
        "units": ""
    },
    {
        "species": [
            {
                "molecule": "C2H6",
                "mole_fraction": 0.1
            }
        ],
        "mode": "absorbance",
        "database": "hitran",
        "tgas": 300,
        "pressure": 1.01325,
        "wavelength_units": "u.nm",
        "pressure_units": "u.bar",
        "x": data['C2H6']['x'],
        "y": data['CH4']['y'],
        "units": ""
    }
]