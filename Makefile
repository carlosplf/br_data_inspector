run:
	python run.py

clear:
	rm -f ./*.zip
	rm -f downloads/*

start_macos_services:
	brew services start mongodb-community
	brew services start redis

stop_macos_services:
	brew services stop mongodb-community
	brew services stop redis

docker_build:
	# Build Images and Container for the Application
	docker run -p 27017:27017 --name mongo-container -d mongo
	docker run -p 6379:6379 --name redis-container -d redis
	# Build Image for Python API
	docker build -t backend_image -f Docker/build_docker_api .
	# Build and run Python API Container
	docker run --name backend_container -p 8080:8080 -td bacend_image

