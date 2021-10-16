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

docker_build_from_scratch:
	rm -f frontend/br_data_inspector/.env
	@read -p "Enter API IP: " api_ip; \
		echo "REACT_APP_API_URL = \"HTTP://$$api_ip\"" > frontend/br_data_inspector/.env
	echo "REACT_APP_API_PORT = \"8080\"" >> frontend/br_data_inspector/.env
	rm -rf frontend/br_data_inspector/build/
	npm run build --prefix ./frontend/br_data_inspector
	docker-compose build
	docker-compose up -d

docker_collect_data:
	docker exec br_data_inspector_backend_1 python3 run.py --collect
	docker exec br_data_inspector_backend_1 python3 run.py --update


