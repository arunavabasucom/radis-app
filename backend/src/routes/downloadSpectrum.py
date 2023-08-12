import radis
from fastapi import APIRouter
from src.models.payload import Payload
from fastapi import BackgroundTasks
from fastapi.responses import FileResponse
from src.helpers.deleteDownloadDirectory import delete_spec
from src.helpers.calculateSpectrum import calculate_spectrum
from src.constants.constants import  DOWNLOADED_SPECFILES_DIRECTORY
from src.helpers.createDownloadDirectory import create_download_directory
router = APIRouter()
@router.post("/download-spectrum")
async def download_spec(payload: Payload, background_tasks: BackgroundTasks):

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