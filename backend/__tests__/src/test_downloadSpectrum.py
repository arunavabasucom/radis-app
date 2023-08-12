from src.main import app
from fastapi.testclient import TestClient
from __tests__.helpers.payload_data import payload_data
client = TestClient(app)

def test_download_spec():
    """
    testing /download-spectrum endpoint 
    """
    response = client.post("/download-spectrum", json=payload_data)
    
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/octet-stream"
    content_disposition = response.headers["content-disposition"]
    filename_start = content_disposition.index("filename*=utf-8''") + len("filename*=utf-8''")
    expected_extension = ".spec"  # Adjust with the expected file extension
    assert content_disposition[filename_start:].endswith(expected_extension)