from report_downloader import report_downloader
from csv_converter import csv_converter
from db_connector import db_connector, data_inspector
import json


#This should be inside a module
def read_tasks_from_file(filename):
    json_file = open(filename)
    json_as_str = json_file.read()
    json_as_dict = json.loads(json_as_str)
    return json_as_dict

def collect_reports(task_list):
    print ("Collecting data from gov...")
    rd = report_downloader.ReportDownloader()
    rd.download_multiple_reports(task_list)
    print ("Extracting...")
    rd.extract_all_files()
    print ("Done")
    return rd.get_extracted_reports()

def convert_report(report_name):
    print ("Converting CSV to dict...")
    csv_c = csv_converter.CSVConverter()
    csv_c.csv_to_dict(report_name)
    print ("Done")
    return csv_c

def insert_to_db(csv_c):
    print ( "Connecting do DB...")
    db = db_connector.DbConnector()
    db.connect()
    print ("Done")

    print ("Saving to Db...")
    for data_key in csv_c.data.keys():
        db.insert_data(csv_c.data[data_key])
    print ("Done")


task_list = read_tasks_from_file("task_list.json")
extracted_reports = collect_reports(task_list)
print ("Extracted: ", extracted_reports)

for report in extracted_reports:
    report_data = convert_report(report)
    insert_to_db(report_data)