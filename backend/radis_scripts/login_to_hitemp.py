import os
import json
from dotenv import load_dotenv
from cryptography.fernet import Fernet

CONFIG_PATH_JSON = os.path.join(os.path.expanduser("~"), "radis.json")
load_dotenv()  
EMAIL=os.getenv("HITRAN_EMAIL")
PASSWORD=os.getenv("HITRAN_PASSWORD")

def encrypt_password(password):
    """Encrypt password using Fernet symmetric encryption"""
    key = get_encryption_key()
    f = Fernet(key)
    return f.encrypt(password.encode()).decode()

def get_encryption_key():
    """Get or create encryption key for HITRAN credentials"""
    # Read existing radis.json
    if os.path.exists(CONFIG_PATH_JSON):
        with open(CONFIG_PATH_JSON, "r") as f:
            config = json.load(f)
    else:
        config = {}

    # Check if encryption key exists
    if "credentials" in config and "ENCRYPTION_KEY" in config["credentials"]:
        return config["credentials"]["ENCRYPTION_KEY"].encode()
    else:
        # Generate a new key
        key = Fernet.generate_key()

        # Add credentials section if it doesn't exist
        if "credentials" not in config:
            config["credentials"] = {}

        # Store the key
        config["credentials"]["ENCRYPTION_KEY"] = key.decode()

        # Write back to radis.json
        with open(CONFIG_PATH_JSON, "w") as f:
            json.dump(config, f, indent=4)

        # Set restrictive permissions
        os.chmod(CONFIG_PATH_JSON, 0o600)

        return key

config = {}

encrypted_username = encrypt_password(EMAIL)  # reuse same encryption function
encrypted_password = encrypt_password(PASSWORD)

# Read existing radis.json
if os.path.exists(CONFIG_PATH_JSON):
    with open(CONFIG_PATH_JSON, "r") as f:
        config = json.load(f)
else:
    config = {}

# Add credentials section if it doesn't exist
if "credentials" not in config:
    config["credentials"] = {}

# Store encrypted credentials
config["credentials"]["HITRAN_USERNAME"] = encrypted_username
config["credentials"]["HITRAN_PASSWORD"] = encrypted_password

print(
    f"Your HITRAN credentials will be saved securely in {CONFIG_PATH_JSON}."
)

# Write back to radis.json
with open(CONFIG_PATH_JSON, "w") as f:
    json.dump(config, f, indent=4)

# Set restrictive permissions
os.chmod(CONFIG_PATH_JSON, 0o600)
