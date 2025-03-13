import radis
import csv
from fastapi import APIRouter
# from src.models.payload import Payload
from src.models.spectrum import Spectrum
from fastapi import BackgroundTasks
from fastapi.responses import FileResponse
from src.helpers.deleteDownloadDirectory import delete_spec
from src.helpers.calculateSpectrum import calculate_spectrum
from src.constants.constants import  DOWNLOADED_TXT_DIRECTORY
from src.helpers.createDownloadDirectory import create_download_directory
from typing import List, Any
from itertools import zip_longest

router = APIRouter()

@router.post("/download-txt")
async def download_txt(payload: List[Spectrum], background_tasks: BackgroundTasks):
    try:
        # print(">>> Obtained Payload : ", payload)
        create_download_directory(DOWNLOADED_TXT_DIRECTORY)
        molecules_name_string = "_".join([f"{x.species[0].molecule}" for x in payload])
        file_name = f"{payload[0].database}_{payload[0].mode}_{molecules_name_string}.csv"
        headers = []
        for i in range(len(payload)):
            headers.append(f"Wavelength_{payload[i].wavelength_units}")
            headers.append(f"{payload[i].mode} ({payload[i].species[0].molecule})")

        data = [[i.x, i.y] for i in payload]
        data_columns = []
        for x_data, y_data in data:
            data_columns.append(x_data)
            data_columns.append(y_data)
        rows = zip_longest(*data_columns, fillvalue="")
        with open(file_name, mode="w", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(headers)
            for row in rows:
                writer.writerow(row)

        print(f"File '{file_name}' created successfully with space-separated values!")
        # spectrum = calculate_spectrum(payload)
        # file_name_txt = spectrum.get_name()
        # file_name = f"{file_name_txt}.csv"
        # file_path = f"{DOWNLOADED_TXT_DIRECTORY}/{file_name}"
        # if payload.use_simulate_slit is True:
        #     print(" >> Applying simulate slit")
        #     spectrum.apply_slit(payload.simulate_slit, "nm")
    # returning the error response
    except radis.misc.warning.EmptyDatabaseError:
        return {"error": "No line in the specified wavenumber range"}
    except Exception as exc:
        print("Error", exc)
        return {"error": str(exc)}
    else:
        # running as a background task to delete the .spec file after giving the file response back
        background_tasks.add_task(delete_spec, file_name)
        print(file_name)
        return FileResponse(
            file_name, media_type="application/octet-stream", filename=file_name
        )