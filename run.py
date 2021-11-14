import logging
import argparse
from collector import collector
from collector.data_processor import data_processor
from collector.data_inspector import data_inspector
from collector.db_connector import db_connector
    

logging.basicConfig(level=logging.DEBUG)

parser = argparse.ArgumentParser()
parser.add_argument("-cl", "--createlists", help="Run Data Processor. Create Entity list and a Rank list in Redis.", action="store_true")
parser.add_argument("-c", "--collect", help="Run Collector and collect data from Gov.", action="store_true")
parser.add_argument("-u", "--update", help="Check if have some dates without data collected and collect it.", action="store_true")
args = parser.parse_args()

def call_collector():
    logging.debug("Starting Collector...")
    my_collector = collector.Collector()
    my_collector.collect_all()

def call_data_processor():
    my_dp = data_processor.DataProcessor()
    my_dp.create_entities_list("Subordinado")
    my_dp.create_biggest_receivers_rank(20, 2020)
    my_dp.create_biggest_receivers_rank(20, 2021)

def call_updater():
    my_dbc = db_connector.DbConnector()
    my_dbc.connect()
    my_dai = data_inspector.DataInspector(my_dbc)
    my_dai.get_count_for_date("202001")

if args.createlists:
    call_data_processor()

if args.collect:
    call_collector()

if args.update:
    call_updater()
