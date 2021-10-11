# BR Data Inspector - "Portal da Transparência" data collector and Analyzer

Data collector from Brazil government open reports.


![alt text](schema.png "Project Schema")


## Back-end

All Back-end is built using Python, Flask and MongoDB. Software back-end collect some reports from "Portal da Trasparência" as CSV, process and save the data at a MongoDB instance.

The back-end has a routine called DataProcessor, that is responsible for processing some data collected and creating some lists inside Redis DB, as Entities list and Receivers rank.

The Back-end also has an API to export the data saved.

## Front-end

All Front-end is built with React. For now, the Front-end just let the user consult some investments from Brazil government to some other institutions, like Universities and Army.

![alt text](page-screenshot.png "Application Screenshot")


![alt text](page-screenshot-2.png "Application Screenshot 2")

# How to run it

## Pre-requisites

Softwares needed for the application:

### Databases

The software uses **Python 3.8** and **NPM 7.21**.

**MongoDB**

Linux (apt):

    sudo apt install mongodb-server

MacOS (homebrew):

    brew install mongodb-community

**Redis DB**

Linux (apt):

    sudo apt install redis-server
You may want to take a look on how to setup Redis as a systemctl service.

MacOS (homebrew):

    brew install redis

### Run (development enviroment)

As a softwares that is currently being developed,the software does not have a production environment.

To run the back-end, simply run the *run.py* file. All requirements are inside requirements.txt file.

To collect data from "Portal da Transparência", run:

    python run.py --collect

To run the DataProcessor routine and create some cache listing, run:

    python run.py --update

Now, to run the API as dev enviroment, run:
    
    python run_api.py

Note that this will run Flask in a development enviroment. The API default port is 8080.

To run the frontend part for development enviroment, just run the following command inside the *frontend/br_data_collector* folder.

    npm start


### Run with Docker Compose

Before get the containers running, a `.env` file is needed inside `frontend/br_data_inspector/` folder. This file shoud contain:

    REACT_APP_API_URL = "API_ADDRESS"
    REACT_APP_API_PORT = "API_PORT"

Get all containers running:

    docker-compose up

To get the DB populated with data, simply run:

    docker exec -it 'backend_container_name' sh
    python3 run.py --collect
    python3 run.py --update


