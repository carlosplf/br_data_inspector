## Backend

The BR Data Collector Backend is responsible for collecting all the data from Brazil Government platforms, process all of it and save into the DBs.

### How to run:

The backend can run with or without Docker containers. Let's look into the non-Docker approach.

First, create a virtualenv and install all the requirements.

`python3 -m venv ./env; source ./env/bin/activate`

`pip install -r requirements.txt`

The main files that controlls all the backend routines are `run.py` and `run_api.py`.

Running `run.py --help` should give you more details about what you can do, but, simply put, you can run all the collectors and data processors 
to collect data and save it.

Running `run.py --collect` will collect and save all the data present in the `task_list.json` file. The task_list file tells the software which
reports should be collected and saved.

Running `run.py --createlists` will create all the entities lists, rankings and indexes necessary to run the full software. This lists are basically
consolidations of the already collected data, and avoid the software to process all the data everytime that the API/Frontend requests for the list of
all entities, for example. The lists are saved into a **RedisDB** instance, and not at the MongoDB.

### Modules:

The Backend structure depends on some modules:
- api (respond to HTTP requests)
- collector/data_inspector (interface to search things into DB)
- collector/data_processor (process data and create the indexes and lists)
- collector/csv_converter (process the CSV and generated valid Pythons structure)
- collector/report_downloader (download reports from internet)
- collector/db_connector (create the connections with the DBs (Mongo and Redis))
- collector/db_updater (routine to update the DBs in case of data is missing)

Each module should have its own documentation.
