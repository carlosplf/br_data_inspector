# Backend

The BR Data Collector Backend is responsible for collecting all the data from Brazil Government platforms, process all of it and save into the DBs.

### How to run:

The backend can run with or without Docker containers. Let's look into the non-Docker approach.

The MongoDB and RedisDB addresses are set into the db_connection files. Please change `collector/db_connector/db_connector.py` and `collector/db_connector/redis_connector.py` to connect in a local DB instance.

*For development environment, DBs paths should be passed as args in a future release.*

First, create a virtualenv and install all the requirements.

`python3 -m venv ./env; source ./env/bin/activate`

`pip install -r requirements.txt`

The main files that controlls all the backend routines are `run.py` and `run_api.py`.

Running `run.py --help` should give you more details about what you can do, but, simply put, you can run all the collectors and data processors 
to collect data and save it.

Running `run.py --collect` will collect and save all the data present in the `task_list.json` file. The task_list file tells the software which
reports should be collected and saved.


**The task_list.json file:**

```python
{
    "task_1":{
        "task_name": "Expenses Reports",
        "db_name": "expenses-data",
        "link": "https://www.portaltransparencia.gov.br/download-de-dados/despesas-execucao/",
        "args": ["202001", "202002"],
    },
    "task_2":{

        # Name of the Task.
        "task_name": "Contracts Reports",

        # The collection name where data will be saved.
        "db_name": "contracts-data",

        # Base link to the report page.
        "link": "https://www.portaltransparencia.gov.br/download-de-dados/compras/",

        # Args to iterate. In this case, list of dates.
        "args": ["202001", "202002"],

        # If there is only a single file inside the downloaded ZIP file that
        # the software should extract.
        "inside_file_name": "_Compras.csv"
    }
}
```

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
