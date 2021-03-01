from report_downloader import report_downloader
from csv_converter import csv_converter
from db_connector import db_connector
from data_inspector import data_inspector
import json

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
        Collect all reports based on the Task List (task_list.json file). Collect, parse as dict and save to DB.
        """
        self.__parse_tasklist()
        self.__collect_reports()
        for single_report in self.extracted_reports:
            data_as_dict = self.__convert_report(single_report)
            self.__insert_to_db(data_as_dict)

    def __start_db_connection(self):
        print ( "Connecting do DB...")
        self.db_connection = db_connector.DbConnector()
        self.db_connection.connect()
        print ("Done")

    def __parse_tasklist(self):
        json_file = open(TASKS_FILENAME)
        json_as_str = json_file.read()
        json_as_dict = json.loads(json_as_str)
        self.task_list = json_as_dict

    def __collect_reports(self):
        print ("Collecting data from gov...")
        self.report_downloader.download_multiple_reports(self.task_list)
        print ("Extracting...")
        self.report_downloader.extract_all_files()
        print ("Done")
        self.extracted_reports = self.report_downloader.get_extracted_reports()

    def __convert_report(self, report_name):
        print ("Converting report: ", report_name)
        data_as_dict = self.csv_converter.csv_to_dict(report_name)
        print ("Done")
        return data_as_dict

    def __insert_to_db(self, data_as_dict):
        print ("Saving to Db...")
        for data_key in data_as_dict.keys():
            self.db_connection.insert_data(data_as_dict[data_key])
        print ("Done")