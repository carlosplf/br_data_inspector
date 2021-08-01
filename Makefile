run:
	python run.py

clear:
	rm -f ./*.zip
	rm -f downloads/*

install:
	pip install -r requirements.txt
	cd frontend/govdata && npm install

docker_clear:
	docker stop br_data_container
	docker rm br_data_container
	docker rmi br_data_image

docker_build:
	docker build -t br_data_image -f ./Docker/Dockerfile .
	docker run --name br_data_container -p 5000:5000 -td br_data_image
	docker exec -w /home/govdata -d br_data_container uwsgi -d --ini br_data_collector.ini
	sleep 5
	docker exec -d br_data_container service nginx restart