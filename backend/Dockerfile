# FROM python:3.10.13-slim
# LABEL maintainer="Arunava Basu <arunavabasudev@gmail.com>"
# LABEL org.opencontainers.image.source="https://github.com/arunavauni-03/radis_backend_container_test"


# WORKDIR /app
# COPY . /app
# RUN pip install --upgrade pip
# RUN pip install  -r requirements.txt
# EXPOSE 8080
# CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]

FROM python:3.10.13-slim

LABEL maintainer="Arunava Basu <arunavabasudev@gmail.com>"
LABEL org.opencontainers.image.source="https://github.com/arunavauni-03/radis_backend_container_test"

# Install Redis
RUN apt-get update && apt-get install -y redis-server && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . /app
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expose ports
EXPOSE 8080
EXPOSE 6379 

# Start Redis server and FastAPI app
CMD ["bash", "-c", "service redis-server start && uvicorn src.main:app --host 0.0.0.0 --port 8080"]
