run:
	python run.py

clear:
	rm -f ./*.zip
	rm -f downloads/*

backend_install:
	pip install -r requirements.txt

docker_clear:
	docker stop backend_container
	docker rm backend_container
	docker rmi backend_image

docker_build:
	docker build -t backend_image -f ./Docker/Dockerfile .
	docker run --name backend_container -p 5000:5000 -td backend_image
	docker exec -w /home/govdata -d backend_container uwsgi -d --ini br_data_collector.ini
	docker exec -d backend_container service mongodb start 