import pytest
from main import app
from httpx import AsyncClient

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
        response = await ac.post("/calculate-spectrum", json=request_body, headers={"Content-Type": "application/json"})
        assert response.status_code == 200 
#TODO: add a efficient way to cmapare mock response with actual response