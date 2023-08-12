import os 
def delete_spec(file_path: str):

    if os.path.exists(file_path):
        print(" >> Removing file......")
        os.remove(file_path)
        print(" >>  File removed")
    else:
        print(" >> File is not found ")

