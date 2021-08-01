FROM ubuntu:20.04
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get update
RUN apt-get install -y build-essential
RUN apt install -y python3 python3-pip npm mongodb git vim systemd
COPY ./ /home/govdata
RUN cd /home/govdata/ && make install