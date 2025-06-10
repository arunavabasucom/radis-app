import os
import sys
import logging
from logtail import LogtailHandler

LOGTAIL_SOURCE_TOKEN = os.environ.get("LOGTAIL_SOURCE_TOKEN")
LOGTAIL_HOST = os.environ.get("LOGTAIL_HOST")

handler = None
if LOGTAIL_SOURCE_TOKEN and LOGTAIL_HOST:
    handler = LogtailHandler(
        source_token=LOGTAIL_SOURCE_TOKEN,
        host=LOGTAIL_HOST,
    )
    logging.basicConfig(handlers=[handler], level=logging.INFO, format='%(message)s')
else:
    logging.basicConfig(level=logging.INFO, format='%(message)s')

logger = logging.getLogger("radis-app")
uvicorn_access_logger = logging.getLogger("uvicorn.access")
uvicorn_error_logger = logging.getLogger("uvicorn.error")
fastapi_logger = logging.getLogger("fastapi")

if handler:
    for log in [uvicorn_access_logger, uvicorn_error_logger, fastapi_logger]:
        log.handlers = [handler]
        log.setLevel(logging.INFO)
        log.propagate = False

class StreamToLogger:
    def __init__(self, logger, level):
        self.logger = logger
        self.level = level

    def write(self, buf):
        for line in buf.rstrip().splitlines():
            self.logger.log(self.level, line.rstrip())

    def flush(self):
        pass

sys.stdout = StreamToLogger(logger, logging.INFO)
sys.stderr = StreamToLogger(logger, logging.ERROR)