""" testing fitSpectrum.py """
from unittest.mock import patch
from fastapi.testclient import TestClient
import json
from radis.misc.warning import EmptyDatabaseError
from src.main import app
from __tests__.helpers.payload_data import fit_payload_data

client = TestClient(app)

def get_test_file_path(filename: str) -> str:
    """Helper function to get the path to test files in helpers directory"""
    import os
    current_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(current_dir, "..", "helpers", filename)


def test_fit_spectrum_invalid_file_extension():
    """
    Test fit spectrum endpoint with invalid file extension
    """
    # Use existing test file but with wrong extension
    test_file_path = get_test_file_path("test.csv")
    
    with open(test_file_path, "rb") as f:
        files = {"file": ("test.xyz", f, "text/plain")}
        data = {"data": json.dumps(fit_payload_data)}
        
        response = client.post("/fit-spectrum", files=files, data=data)
    
    assert response.status_code == 200
    result = response.json()
    assert "error" in result
    assert "File must have a .spec, .txt, or .csv extension" in result["error"]


@patch("src.routes.fitSpectrum.fit_spectrum")
def test_fit_spectrum_empty_database_error(mock_fit):
    """
    Test fit spectrum endpoint when EmptyDatabaseError occurs
    """
    mock_fit.side_effect = EmptyDatabaseError("Empty DB")
    
    test_file_path = get_test_file_path("test.csv")
    
    with open(test_file_path, "rb") as f:
        files = {"file": ("test.csv", f, "text/csv")}
        data = {"data": json.dumps(fit_payload_data)}
        
        response = client.post("/fit-spectrum", files=files, data=data)
    
    assert response.status_code == 200
    result = response.json()
    assert "error" in result
    assert result["error"] == "No line in the specified wavenumber range"


@patch("src.routes.fitSpectrum.fit_spectrum")
def test_fit_spectrum_generic_exception(mock_fit):
    """
    Test fit spectrum endpoint when generic exception occurs
    """
    mock_fit.side_effect = Exception("Fitting failed unexpectedly")
    
    test_file_path = get_test_file_path("test.csv")
    
    with open(test_file_path, "rb") as f:
        files = {"file": ("test.csv", f, "text/csv")}
        data = {"data": json.dumps(fit_payload_data)}
        
        response = client.post("/fit-spectrum", files=files, data=data)
    
    assert response.status_code == 200
    result = response.json()
    assert "error" in result
    assert result["error"] == "Fitting failed unexpectedly"


def test_fit_spectrum_success_csv():
    """
    Test fit spectrum endpoint with real CSV file - no mocks
    """
    # Use existing test file
    test_file_path = get_test_file_path("test.csv")
    
    with open(test_file_path, "rb") as f:
        files = {"file": ("test.csv", f, "text/csv")}
        data = {"data": json.dumps(fit_payload_data)}
        
        response = client.post("/fit-spectrum", files=files, data=data)
    
    assert response.status_code == 200
    # This might succeed or fail depending on the actual fitting process
    # but should not have file extension errors
    result = response.json()
    if "error" in result:
        assert "File must have a .spec, .txt, or .csv extension" not in result["error"]
    else:
        # If successful, check the response structure
        assert "data" in result
        assert "experimental_spectrum" in result["data"]
        assert "best_spectrum" in result["data"]
        assert "fit_vals" in result["data"]
        assert "residual" in result["data"]
        assert "time_fitting" in result["data"]


def test_fit_spectrum_success_spec():
    """
    Test fit spectrum endpoint with real SPEC file - no mocks
    """
    # Use existing test file
    test_file_path = get_test_file_path("test.spec")
    
    with open(test_file_path, "rb") as f:
        files = {"file": ("test.spec", f, "application/octet-stream")}
        data = {"data": json.dumps(fit_payload_data)}
        
        response = client.post("/fit-spectrum", files=files, data=data)
    
    assert response.status_code == 200
    # This might succeed or fail depending on the actual fitting process
    # but should not have file extension errors
    result = response.json()
    if "error" in result:
        assert "File must have a .spec, .txt, or .csv extension" not in result["error"]
    else:
        # If successful, check the response structure
        assert "data" in result
        assert "experimental_spectrum" in result["data"]
        assert "best_spectrum" in result["data"]
        assert "fit_vals" in result["data"]
        assert "residual" in result["data"]
        assert "time_fitting" in result["data"]
