# creating a base env
FROM python:3.10.13-slim

# creating a workspace
WORKDIR /app

# copy the workspace directory
COPY . /app

# install dependencies
RUN pip install --upgrade pip && pip install  -r requirements.txt

# expose PORT 8080
EXPOSE 8080

# run this on start 
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]