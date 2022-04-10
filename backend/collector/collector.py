from collector.report_downloader import report_downloader
from collector.csv_converter import csv_converter
from collector.db_connector import db_connector
from collector.db_connector import redis_connector
from collector.data_updater import data_updater
import json
import logging

TASKS_FILENAME = "task_list.json"
DOWNLOADS_PATH = "./downloads/"


class Collector():

    def __init__(self):
        self.db_connection = None
        self.extracted_reports = None
        self.task_list = None

    def collect_all(self):
        """
        Collect all reports based on the Task List (task_list.json file).
        Collect, parse as dict and save to DB.
        """
        rpd = report_downloader.ReportDownloader()
        rpd.clear_download_folder()
        self.__remove_reports_downloads()

        task_list = self.__parse_tasklist()

        # When this key is present, indicates the only file that should
        # be extracted from inside the downloaded ZIP file.
        inside_file_name = None

        for key in task_list:
            url = task_list[key]["link"]
            db_name = task_list[key]["db_name"]

            for arg in task_list[key]["args"]:
                if "inside_file_name" in task_list[key]:
                    inside_file_name = arg + task_list[key]["inside_file_name"]
                self.do_report_full_cycle(url, arg, db_name, inside_file_name)

    def do_report_full_cycle(self, url, arg, db_name, inside_file_name):
        """
        Do a full cycle for a report (task). Download, extract, proccess and save
        to DB.
        Args:
            url: (str) link to the report
            arg: (str) URL param
            db_name: (str) mongo db name to save data
            inside_file_name: (str) indicates the only file that
                should be extracted from ZIP file.
        """

        logging.debug("Starting full cycle...")
        logging.debug("URL: " + url)
        logging.debug("Arg: " + arg)

        csv_c = csv_converter.CSVConverter()
        rpd = report_downloader.ReportDownloader()

        # Download report and get the ZIP filename
        downloaded_report = rpd.download_report(url, arg)

        if not downloaded_report:
            logging.warning("Stoping cycle for this report...")
            return

        # Extract the ZIP file downloaded and get the CSV filename(s)
        extracted_reports = rpd.extract_file(downloaded_report, inside_file_name)

        # For loop is necessary, because we can get multiple CSVs inside
        # the ZIP file.
        for single_report in extracted_reports:
            data_as_dict = csv_c.csv_to_dict(DOWNLOADS_PATH + single_report)
            self.__insert_to_db(data_as_dict, db_name)

        self.__register_report_downloaded(url, arg)
        logging.debug("Finished cycle.")

    def update_all_dates_in_task_list(self):
        """
        Considering all dates inside the task_list file,
        check if the system is missing any data.
        """
        task_list = self.__parse_tasklist()

        # For all Tasks in task_list.json, check if the system has enough data.
        for task in task_list:
            url = task_list[task]["link"]
            db_name = task_list[task]["db_name"]
            for arg in task_list[task]["args"]:
                self.update_single_date(url, arg, db_name)

    def update_single_date(self, url, arg, db_name):
        """
        Collect data for a single date.
        Args:
            date: (str) YYYYMM
        """
        du = data_updater.DataUpdater()

        if not du.check_data_for_date(arg, db_name, 0):
            logging.debug(str("Should collect data for date: " + arg))
            self.do_report_full_cycle(url, arg, db_name)

        else:
            logging.debug("The system has enough data for that... Skipping.")

    def __parse_tasklist(self):
        json_file = open(TASKS_FILENAME)
        json_as_str = json_file.read()
        json_as_dict = json.loads(json_as_str)
        return json_as_dict

    def __insert_to_db(self, data_as_dict, db_name):
        db_c = db_connector.DbConnector()
        db_c.connect(db_name)

        logging.debug("Saving to Db...")
        logging.debug("DB name: " + db_name)

        for data_key in data_as_dict.keys():
            db_c.insert_data(data_as_dict[data_key])

        logging.debug("Done")

    def __remove_reports_downloads(self):
        """
        Remove from Redis information about downloaded reports.
        """
        rc = redis_connector.RedisConnector()
        rc.connect()
        rc.set("downloaded_reports", json.dumps({"downloaded_reports": []}))

    def __register_report_downloaded(self, report_url, report_url_arg):
        """
        Based on the Downloaded Report, save at the RedisDB the information about the Report.
        The format saved on Redis is:
            {
                "downloaded_reports": [
                    {
                        "url": "url_to_report",
                        "info": "some info about the report"
                    },
                ]
            }
        Args:
            report_url: (str) Report URL
            report_url_arg: (str) Report URL arg
        """
        logging.debug("Registering downloaded report...")
        report_url = report_url + report_url_arg

        rc = redis_connector.RedisConnector()
        rc.connect()

        downloaded_report_info = {}
        already_in_redis = rc.get("downloaded_reports")

        if already_in_redis:
            downloaded_report_info = json.loads(already_in_redis)
        else:
            downloaded_report_info["downloaded_reports"] = []

        downloaded_report_info["downloaded_reports"].append(
            {
                "url": report_url,
                "info": ""
            }
        )

        return rc.set("downloaded_reports", json.dumps(downloaded_report_info))
