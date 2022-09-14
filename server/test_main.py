import json
import pytest
from httpx import AsyncClient
from main import app  
import response as response

response_dict = response.response
request_body = {
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
    "use_simulate_slit": True,
    "simulate_slit": 5,
    "wavelength_units": "1/u.cm",
    "path_length_units": "u.km",
    "pressure_units": "cds.atm"
}

# testing for calculate_spectrum endpoint
@pytest.mark.anyio
async def test_calculate_spectrum():
    async with AsyncClient(app=app, base_url="https://api.radis.app") as ac:  
        # response_json = json.dumps(request_body)
        response = await ac.post("/calculate-spectrum",json=request_body,headers={"Content-Type": "application/json"})
         # open the response.json 
        response_json = json.dumps(response_dict)
#     assert response.status_code == 200
    assert response.json() == response_json