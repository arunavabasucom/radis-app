import pytest
from src.main import app
from fastapi.testclient import TestClient

@pytest.fixture
def client():
    return TestClient(app)

def test_calculate_spectrum(client):
    payload = {
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
  "path_length": 1,
  "use_simulate_slit": True,
  "simulate_slit": 5,
  "path_length_units": "u.cm",
  "pressure_units": "u.bar",
  "wavelength_units":"1/u.cm"
}
    response = client.post("/calculate-spectrum", json=payload)
    assert response.status_code == 200
    assert "data" in response.json()
    assert "x" in response.json()["data"]
    assert "y" in response.json()["data"]
    assert "units" in response.json()["data"]
