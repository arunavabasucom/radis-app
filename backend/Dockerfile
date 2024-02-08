FROM python:3.10.13-slim

WORKDIR /app

COPY . /app

RUN pip install --upgrade pip

RUN pip install  -r requirements.txt

EXPOSE 8080

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]


