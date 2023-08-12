import os
def create_download_directory(FILE_NAME):

    if os.path.exists(FILE_NAME):
        print(" >> Folder already exists ")
    else:
        print(">> creating DOWNLOADED_SPECFILES folder")
        os.mkdir(FILE_NAME)
