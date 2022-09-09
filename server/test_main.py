import json

from json.decoder import JSONDecodeError
from urllib import request
from main import app  # importing app from main.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


# testing for calculate_spectrum endpoint
def test_calculate_spectrum():
    try:
        with open('./mocks/response.json', 'r') as f:
            client_response = json.load(f)
            responses = json.dumps(client_response)
        response = client.post("/calculate-spectrum/", headers={'Content-Type': 'application/json'}, json={
            "species": [
                {
                    "molecule": "CO",
                    "mole_fraction": 0.2
                }
            ],
            "mode": "absorbance",
            "database": "hitran",
            "tgas": 300,
            "min_wavenumber_range": 1900,
            "max_wavenumber_range": 2300,
            "pressure": 1.01325,
            "path_length": 11,
            "use_simulate_slit": "true",
            "simulate_slit": 5,
            "wavelength_units": "1/u.cm",
            "path_length_units": "u.km",
            "pressure_units": "cds.atm"
        })
        # assert response.status_code == 200
        assert response.json() == responses
    except JSONDecodeError as e:
        print("Error calculating")
