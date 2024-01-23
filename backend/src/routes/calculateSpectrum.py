import radis
import numpy as np
from fastapi import APIRouter, Depends
import astropy.units as u
from src.models.payload import Payload
from src.helpers.calculateSpectrum import calculate_spectrum
import aioredis
import json
import logging

router = APIRouter()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def get_redis_client():
    # Create a Redis client
    redis = await aioredis.from_url('redis://localhost:6379')
    return redis

def serialize_payload(payload: Payload):
    # Serialize the Payload object to a JSON string
    return json.dumps(payload.dict())

@router.post("/calculate-spectrum")
async def calc_spectrum(
    payload: Payload,
    redis: aioredis.Redis = Depends(get_redis_client)
):
    # Serialize the payload for use in the key
    serialized_payload = serialize_payload(payload)

    # Check if the request is already in the cache
    cached_result = await redis.get(f"calc_spectrum:{serialized_payload}")
    if cached_result:
        # If cached result exists, log a hit and return it
        logger.info("Cache hit for payload: %s", serialized_payload)
        return json.loads(cached_result)
    else:
        # Log a cache miss
        logger.info("Cache miss for payload: %s", serialized_payload)

    try:
        spectrum = calculate_spectrum(payload)
        if payload.use_simulate_slit is True:
            if payload.wavelength_units == "1/u.cm":
                slit_unit = "cm-1"
            else:
                slit_unit = "nm"
            logger.info("Applying simulate slit")
            spectrum.apply_slit(payload.simulate_slit, slit_unit)

    except radis.misc.warning.EmptyDatabaseError:
        return {"error": "No line in the specified wavenumber range"}
    except Exception as exc:
        logger.error("Error: %s", exc)
        return {"error": str(exc)}
    else:
        wunit = spectrum.get_waveunit()
        iunit = "default"
        xNan, yNan = spectrum.get(payload.mode, wunit=wunit, Iunit=iunit)
        x = xNan[~np.isnan(xNan)]
        y = yNan[~np.isnan(yNan)]

        threshold = 5e7
        if len(spectrum) * 8 * 2 > threshold:
            logger.info("Reducing the payload size")
            resample = int(len(spectrum) * 8 * 2 // threshold)
            x, y = x[::resample], y[::resample]

        result = {
            "data": {
                "x": list(x),
                "y": list(y),
                "units": spectrum.units[payload.mode],
            },
        }

        # Use Redis for caching if the connection is available
        if redis:
            # Cache the result in Redis with a time-to-live (TTL) of 3600 seconds (1 hour)
            await redis.setex(f"calc_spectrum:{serialized_payload}", 3600, json.dumps(result))

        return result
