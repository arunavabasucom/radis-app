import json
import pytest
from httpx import AsyncClient
from main import app  
from json.decoder import JSONDecodeError
from fastapi.testclient import TestClient

client = TestClient(app)

# testing for calculate_spectrum endpoint
@pytest.mark.anyio
async def test_calculate_spectrum():
    async with AsyncClient(app=app, base_url="https://api.radis.app") as ac:
         with open('./mocks/request.json', 'r') as f:
              client_request = json.load(f)
              request_json = json.dumps(client_request)
         response = await ac.post("/calculate-spectrum",json=request_json)
         # open the response.json 
         with open('./mocks/response.json', 'r') as f:
              server_response = json.load(f)
              response_json = json.dumps(server_response)
    assert response.status_code == 200
    assert response.json() == response_json