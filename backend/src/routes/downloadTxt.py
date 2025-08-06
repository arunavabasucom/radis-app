import radis
from fastapi import APIRouter
from src.models.payload import calcPayload as Payload
from fastapi import BackgroundTasks
from fastapi.responses import FileResponse
from src.helpers.deleteDownloadDirectory import delete_spec
from src.helpers.calculateSpectrum import calculate_spectrum
from src.constants.constants import DOWNLOADED_TXT_DIRECTORY
from src.helpers.createDownloadDirectory import create_download_directory

router = APIRouter()

@router.post(
    "/download-txt",
    summary="Download Spectrum as CSV File",
    description="""
Download a calculated molecular spectrum as a CSV (Comma-Separated Values) file.

This endpoint calculates a molecular spectrum using the specified parameters and returns it as a 
CSV file containing wavelength/intensity data. The file is automatically deleted from the server 
after download to conserve storage space.

## Key Features:
- **CSV Format**: Downloads spectrum in standard CSV format
- **Flexible Units**: Supports both cm-1 and nm wavelength units
- **Automatic Cleanup**: Files are automatically deleted after download
- **Background Processing**: File deletion happens in background
- **Slit Function**: Optional slit function application before download

## File Format:
- **Extension**: .csv
- **Format**: Comma-separated values
- **Columns**: Wavelength/Intensity pairs
- **Compatibility**: Can be opened in Excel, Python, or any CSV reader

## CSV Structure:
```csv
wavelength,intensity
2000.0,0.001
2000.1,0.002
2000.2,0.003
...
```

## Download Process:
1. Validates input parameters
2. Calculates spectrum using RADIS library
3. Applies slit function if requested
4. Converts spectrum to CSV format
5. Saves to temporary CSV file
6. Returns file for download
7. Deletes temporary file in background

## Performance Notes:
- Calculation time depends on spectral range and database size
- File size depends on spectral resolution
- Temporary files are automatically cleaned up
- CSV format is human-readable and widely compatible
    """,
    responses={
        200: {
            "description": "Successful CSV download",
            "content": {
                "text/csv": {
                    "schema": {
                        "type": "string",
                        "format": "binary"
                    }
                }
            }
        }
    }
)
async def download_txt(payload: Payload, background_tasks: BackgroundTasks):
    """
    Download calculated spectrum as a CSV file.
    
    Args:
        payload: Payload object containing calculation parameters
        background_tasks: FastAPI background tasks for file cleanup
        
    Returns:
        FileResponse containing the CSV file for download
        
    """
    try:
        create_download_directory(DOWNLOADED_TXT_DIRECTORY)
        spectrum = calculate_spectrum(payload)
        file_name_txt = spectrum.get_name()
        file_name = f"{file_name_txt}.csv"
        file_path = f"{DOWNLOADED_TXT_DIRECTORY}/{file_name}"
        if payload.use_simulate_slit is True:
            print(" >> Applying simulate slit")
            spectrum.apply_slit(payload.simulate_slit, "nm")
    # returning the error response
    except radis.misc.warning.EmptyDatabaseError:
        return {"error": "No line in the specified wavenumber range"}
    except Exception as exc:
        print("Error", exc)
        return {"error": str(exc)}
    else:
        
        wunit = "cm-1"
        if(payload.wavelength_units=="1/u.cm"):
            wunit="cm-1"
        else:
            wunit="nm"
        iunit = "default"
        spectrum.savetxt(file_path,payload.mode,wunit=wunit,Iunit=iunit)
        # running as a background task to delete the .spec file after giving the file response back
        background_tasks.add_task(delete_spec, file_path)
        return FileResponse(
            file_path, media_type="application/octet-stream", filename=file_name
        )