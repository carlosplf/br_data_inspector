import logging
import argparse
from logging.handlers import RotatingFileHandler
from collector import collector
from collector.data_processor import data_processor


#Path running local
LOG_FILE="./logs/br_data_collector_backend_log"

#Path for docker container
#LOG_FILE="/br_data_inspector/backend/logs/br_data_collector_backend_log"

formatter = logging.Formatter('%(asctime)s  %(name)s  %(levelname)s: %(message)s')

log_handler = RotatingFileHandler(
    LOG_FILE,
    mode='a',
    maxBytes=5*1024*1024,
    backupCount=1,
    encoding=None,
    delay=0
)

log_handler.setLevel(logging.DEBUG)
log_handler.setFormatter(formatter)
app_log = logging.getLogger()
app_log.setLevel(logging.DEBUG)
app_log.addHandler(log_handler)


parser = argparse.ArgumentParser()
parser.add_argument("-cl", "--createlists",
                    help="Run Data Processor. Create Entity list and a Rank list in Redis.",
                    action="store_true")
parser.add_argument("-c", "--collect",
                    help="Run Collector and collect data from Gov.",
                    action="store_true")
parser.add_argument("-u", "--update",
                    help="Check if have some dates without data collected and collect it.",
                    action="store_true")
args = parser.parse_args()


def call_collector():
    logging.debug("Starting Collector...")
    my_collector = collector.Collector()
    my_collector.collect_all()


def call_data_processor():
    my_dp = data_processor.DataProcessor()
    my_dp.create_entities_list("Subordinado")
    my_dp.create_biggest_spenders_rank(20, 2020)
    my_dp.create_biggest_spenders_rank(20, 2021)


def call_updater():
    my_collector = collector.Collector()
    my_collector.update_all_dates_in_task_list()


if args.createlists:
    call_data_processor()


if args.collect:
    call_collector()


if args.update:
    call_updater()
