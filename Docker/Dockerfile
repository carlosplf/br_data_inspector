FROM ubuntu:20.04
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get update
RUN apt-get install -y build-essential python3 python3-pip mongodb git vim systemd libssl-dev libffi-dev python3-setuptools curl
COPY ./ /home/govdata
WORKDIR /home/govdata
RUN make backend_install