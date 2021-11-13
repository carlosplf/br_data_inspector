import logging
import argparse
from collector import collector
from collector.data_processor import data_processor
    

logging.basicConfig(level=logging.DEBUG)

parser = argparse.ArgumentParser()
parser.add_argument("-u", "--update", help="Run Data Processor and update data.", action="store_true")
parser.add_argument("-c", "--collect", help="Run Collector and collect data from Gov.", action="store_true")
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

if args.update:
    call_data_processor()

if args.collect:
    call_collector()
