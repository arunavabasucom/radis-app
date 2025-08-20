import radis
from fastapi import APIRouter
from src.models.payload import calcPayload as Payload
from fastapi import BackgroundTasks
from fastapi.responses import FileResponse
from src.helpers.deleteDownloadDirectory import delete_spec
from src.helpers.calculateSpectrum import calculate_spectrum
from src.constants.constants import DOWNLOADED_SPECFILES_DIRECTORY
from src.helpers.createDownloadDirectory import create_download_directory

router = APIRouter()

@router.post(
    "/download-spectrum",
    summary="Download Spectrum as .spec File",
    description="""
Download a calculated molecular spectrum as a RADIS .spec file.

This endpoint calculates a molecular spectrum using the specified parameters and returns it as a 
compressed RADIS .spec file. The file is automatically deleted from the server after download 
to conserve storage space.

## Key Features:
- **RADIS Format**: Downloads spectrum in native RADIS .spec format
- **Compression**: Files are compressed to reduce download size
- **Automatic Cleanup**: Files are automatically deleted after download
- **Background Processing**: File deletion happens in background
- **Slit Function**: Optional slit function application before download

## File Format:
- **Extension**: .spec
- **Format**: RADIS spectrum file (compressed)
- **Content**: Complete spectrum data with metadata
- **Compatibility**: Can be loaded by RADIS library

## Download Process:
1. Validates input parameters
2. Calculates spectrum using RADIS library
3. Applies slit function if requested
4. Saves spectrum to temporary .spec file
5. Returns file for download
6. Deletes temporary file in background

## Performance Notes:
- Calculation time depends on spectral range and database size
- File size depends on spectral resolution and compression
- Temporary files are automatically cleaned up
    """,
    responses={
        200: {
            "description": "Successful spectrum download",
            "content": {
                "application/octet-stream": {
                    "schema": {
                        "type": "string",
                        "format": "binary"
                    }
                }
            }
        }
    }
)
async def download_spec(payload: Payload, background_tasks: BackgroundTasks):
    """
    Download calculated spectrum as a RADIS .spec file.
    
    Args:
        payload: Payload object containing calculation parameters
        background_tasks: FastAPI background tasks for file cleanup
        
    Returns:
        FileResponse containing the .spec file for download
        
    """
    try:
        create_download_directory(DOWNLOADED_SPECFILES_DIRECTORY)
        spectrum = calculate_spectrum(payload)
        file_name_spec = spectrum.get_name()
        file_name = f"{file_name_spec}.spec"
        file_path = f"{DOWNLOADED_SPECFILES_DIRECTORY}/{file_name}"
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
        spectrum.store(file_path, compress=True, if_exists_then="replace")
        # running as a background task to delete the .spec file after giving the file response back
        background_tasks.add_task(delete_spec, file_path)
        return FileResponse(
            file_path, media_type="application/octet-stream", filename=file_name
        )