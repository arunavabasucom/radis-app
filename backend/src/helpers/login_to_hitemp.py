import os
import json
from dotenv import load_dotenv
from cryptography.fernet import Fernet
from radis.misc.config import init_radis_json

CONFIG_PATH_JSON = os.path.join(os.path.expanduser("~"), "radis.json")
load_dotenv()
EMAIL = os.getenv("HITRAN_EMAIL")
PASSWORD = os.getenv("HITRAN_PASSWORD")

def encrypt_password(password):
    key = get_encryption_key()
    f = Fernet(key)
    return f.encrypt(password.encode()).decode()

def get_encryption_key():
    if os.path.exists(CONFIG_PATH_JSON):
        with open(CONFIG_PATH_JSON, "r") as f:
            config = json.load(f)
    else:
        config = {}

    if "credentials" in config and "ENCRYPTION_KEY" in config["credentials"]:
        return config["credentials"]["ENCRYPTION_KEY"].encode()
    else:
        key = Fernet.generate_key()
        config.setdefault("credentials", {})["ENCRYPTION_KEY"] = key.decode()
        with open(CONFIG_PATH_JSON, "w") as f:
            json.dump(config, f, indent=4)
        os.chmod(CONFIG_PATH_JSON, 0o600)
        return key

def setup_hitemp_credentials():

    init_radis_json(CONFIG_PATH_JSON)

    if not EMAIL or not PASSWORD:
        raise ValueError("Missing HITRAN_EMAIL or HITRAN_PASSWORD from environment")

    encrypted_username = encrypt_password(EMAIL)
    encrypted_password = encrypt_password(PASSWORD)

    if os.path.exists(CONFIG_PATH_JSON):
        with open(CONFIG_PATH_JSON, "r") as f:
            config = json.load(f)
    else:
        config = {}

    config.setdefault("credentials", {})
    config["credentials"]["HITRAN_USERNAME"] = encrypted_username
    config["credentials"]["HITRAN_PASSWORD"] = encrypted_password

    with open(CONFIG_PATH_JSON, "w") as f:
        json.dump(config, f, indent=4)

    os.chmod(CONFIG_PATH_JSON, 0o600)
    print(f"HITRAN credentials stored in {CONFIG_PATH_JSON}")
