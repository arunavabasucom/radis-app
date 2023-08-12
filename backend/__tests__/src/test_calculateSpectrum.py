from src.main import app   # assuming your FastAPI app instance is named 'app'
from fastapi.testclient import TestClient
from __tests__.helpers.payload_data import payload_data
client = TestClient(app)

def test_calc_spectrum():
    
    response = client.post("/calculate-spectrum", json=payload_data)
    
    data = response.json()["data"]
    assert response.status_code == 200
    assert "x" in data
    assert "y" in data
    assert "units" in data


