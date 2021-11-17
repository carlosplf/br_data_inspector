run:
	python run.py

clear:
	rm -f ./*.zip
	rm -f downloads/*

startup_arch:
	sudo systemctl start mongodb.service
	sudo systemctl start redis

start_macos_services:
	brew services start mongodb-community
	brew services start redis

stop_macos_services:
	brew services stop mongodb-community
	brew services stop redis
