from collector.report_downloader import report_downloader
from collector.csv_converter import csv_converter
from collector.db_connector import db_connector
from collector.data_inspector import data_inspector
from collector.data_updater import data_updater
import json
import logging

TASKS_FILENAME = "task_list.json"


class Collector():

    def __init__(self):
        self.db_connection = None
        self.extracted_reports = None
        self.task_list = None

        self.csv_converter = csv_converter.CSVConverter()
        self.report_downloader = report_downloader.ReportDownloader()
        self.__start_db_connection()

    def collect_all(self):
        """
        Collect all reports based on the Task List (task_list.json file).
        Collect, parse as dict and save to DB.
        """
        self.__parse_tasklist()
        self.__collect_reports()
        for single_report in self.extracted_reports:
            data_as_dict = self.__convert_report(single_report)
            self.__insert_to_db(data_as_dict)

    def update_all_dates_in_task_list(self):
        """
        Considering all dates inside the task_list file, check if we have data for all
        of then.
        """
        self.__parse_tasklist()
        for single_date in self.task_list["task_1"]["args"]:
            self.update_single_date(single_date)

    def update_single_date(self, date):
        """
        Collect data for a single date.
        Args:
            date: (str) YYYYMM
        """
        du = data_updater.DataUpdater()
        if not du.check_data_for_date(date, 0):
            logging.debug(str("Should collect data for date: " + date))

    def __start_db_connection(self):
        logging.debug("Connecting do DB...")
        self.db_connection = db_connector.DbConnector()
        self.db_connection.connect()
        logging.debug("Done")

    def __parse_tasklist(self):
        json_file = open(TASKS_FILENAME)
        json_as_str = json_file.read()
        json_as_dict = json.loads(json_as_str)
        self.task_list = json_as_dict

    def __collect_reports(self):
        logging.debug("Collecting data from gov...")
        self.report_downloader.download_multiple_reports(self.task_list)
        logging.debug("Extracting...")
        self.report_downloader.extract_all_files()
        logging.debug("Done")
        self.extracted_reports = self.report_downloader.get_extracted_reports()

    def __convert_report(self, report_name):
        logging.debug("Converting report: %s", report_name)
        data_as_dict = self.csv_converter.csv_to_dict(report_name)
        logging.debug("Done")
        return data_as_dict

    def __insert_to_db(self, data_as_dict):
        logging.debug("Saving to Db...")
        for data_key in data_as_dict.keys():
            self.db_connection.insert_data(data_as_dict[data_key])
        logging.debug("Done")
