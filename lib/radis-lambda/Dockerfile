FROM public.ecr.aws/lambda/python:3.8

COPY app.py requirements.txt download_hitran.py ./

RUN python3.8 -m pip install -r requirements.txt -t .

RUN python3.8 download_hitran.py

RUN chmod 666 $(find ~/.radisdb -type f)
RUN chmod 777 $(find ~/.radisdb -type d)
RUN chmod 666 ~/radis.json

# Command can be overwritten by providing a different command in the template directly.
CMD ["app.lambda_handler"]
