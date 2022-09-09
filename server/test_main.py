import json

from json.decoder import JSONDecodeError
from urllib import request
from main import app # importing app from main.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


# testing for calculate_spectrum endpoint
def test_calculate_spectrum():
    try:
        with open('./mocks/response.json', 'r') as f:
          client_response = json.load(f)
          responses = json.dumps(client_response)
        with open('./mocks/request.json', 'r') as f:
          client_request = json.load(f)
          request = json.dumps(client_request)
        response = client.post("/calculate-spectrum/",json=request)
        # assert response.status_code == 200
        assert response.json() == responses
    except JSONDecodeError as e:
        print("Error calculating")