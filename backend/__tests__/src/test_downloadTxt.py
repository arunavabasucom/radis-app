from src.main import app
from fastapi.testclient import TestClient
from __tests__.helpers.spectrum_data import spectrum_data

client = TestClient(app)

def test_download_txt():
  
    response = client.post("/download-txt", json=spectrum_data)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/octet-stream"
    assert "Content-Disposition" in response.headers
    assert 'attachment; filename="hitran_absorbance_CH4_C2H6.csv"' in response.headers["Content-Disposition"]
    assert response.content
