clear:
	rm -f ./backend/*.zip
	rm -f ./backend/downloads/*

start_macos_services:
	brew services start mongodb-community
	brew services start redis

stop_macos_services:
	brew services stop mongodb-community
	brew services stop redis

up_dbs_dev:
	docker-compose -f docker/docker-compose-dev.yml up -d mongo redis
