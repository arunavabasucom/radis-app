FROM public.ecr.aws/lambda/python:3.8

COPY app.py requirements.txt download_hitran.py ./

RUN python3.8 -m pip install -r requirements.txt -t .

RUN python3.8 download_hitran.py

RUN chmod 666 /root/radis.json
RUN cp /root/radis.json /tmp/radis.json

RUN chmod 666 $(find /root/.radisdb -type f)
RUN chmod 777 $(find /root/.radisdb -type d)
RUN cp -r /root/.radisdb /tmp/.radis.db

# Command can be overwritten by providing a different command in the template directly.
CMD ["app.lambda_handler"]
