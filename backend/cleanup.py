import os
import shutil

def delete_folders(folder_path, folders_to_delete):
    """
    Deletes specified folders within a directory.

    :param folder_path: Path to the directory where folders are to be deleted.
    :param folders_to_delete: List of folder names to delete.
    """
    for root, dirs, files in os.walk(folder_path, topdown=True):
        for folder in dirs:
            if folder in folders_to_delete:
                folder_to_delete = os.path.join(root, folder)
                print(f"Deleting folder: {folder_to_delete}")
                try:
                    shutil.rmtree(folder_to_delete)
                    print(f"Folder '{folder}' deleted successfully.")
                except OSError as e:
                    print(f"Error: {e.strerror}")

# List of folders to delete
folders_to_delete = ['__pycache__', '.pytest_cache','DOWNLOADED_SPECFILES','DOWNLOADED_TXT']

# Path to the directory containing the folders to delete
directory_path = '.'
# Call the function to delete folders
delete_folders(directory_path, folders_to_delete)
