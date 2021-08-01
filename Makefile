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
	docker run --name br_data_container -td br_data_image