import json
from urllib import request
from main import app # importing app from main.py
from fastapi.testclient import TestClient

client = TestClient(app)


# testing for calculate_spectrum endpoint
def test_calculate_spectrum():
    with open('mocks/response.json', 'r') as f:
        client_response = json.load(f)
    with open('mocks/request.json', 'r') as f:
        client_request = json.load(f)
    response = client.post("/calculate-spectrum/",json=client_request)
    assert response.status_code == 200
    assert response.json() == client_response