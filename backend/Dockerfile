FROM python:3.10.13-slim
LABEL maintainer="Arunava Basu <arunavabasudev@gmail.com>"
LABEL org.opencontainers.image.source="https://github.com/arunavauni-03/radis_backend_container_test"


WORKDIR /app
COPY . /app
RUN pip install --upgrade pip
RUN pip install  -r requirements.txt
EXPOSE 8080
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]
