FROM ubuntu:20.04
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get update
RUN apt-get install -y build-essential python3 python3-pip npm mongodb git vim systemd nginx libssl-dev libffi-dev python3-setuptools curl
COPY ./ /home/govdata
WORKDIR /home/govdata
RUN make install
RUN cp ./nginx/nginx-api /etc/nginx/sites-available/br_data_collector_api
RUN cp ./nginx/nginx-api /etc/nginx/sites-enabled/br_data_collector_api