import zipfile
import time
import glob
import urllib.request
import logging
import ssl
import os


DOWNLOAD_RETRIES = 3

class ReportDownloader():
    def __init__(self):
        self.reports_downloaded = []

    def download_multiple_reports(self, task_list):
        """
        Receives a Dict containing instructions to download reports from gov.
        All reports are stored as a ZIP file.
        """
        logging.debug("Downloading multiple reports...")
        self.reports_downloaded = []
        for key in task_list:
            url = task_list[key]["link"]
            for arg in task_list[key]["args"]:
                self.download_report(url, arg)

    def download_report(self, link, arg):
        """
        Download a single report.
        Args:
            link: File base URL
            arg: URL last part (date)
        """
        ssl._create_default_https_context = ssl._create_unverified_context
        link = link + arg
        zip_filename = arg + "-repot.zip"
        logging.debug("Downloading from Link: %s", link)
        logging.debug("Output filename: %s", zip_filename)

        try_number = 0

        while True:
            
            if try_number == DOWNLOAD_RETRIES:
                logging.warning("Falied to download: maximum retries. Returning empty.")
                return None

            try:
                urllib.request.urlretrieve(link, zip_filename)
                break
            except urllib.error.URLError as e:
                logging.warning("Couldn't download Report.")
                logging.warning(e.reason)
                try_number += 1
        
        logging.debug("Done")
        
        time.sleep(1)

        self.reports_downloaded.append(zip_filename)
        return zip_filename

    def extract_all_files(self):
        """
        Extract all ZIP files inside project folder.
        """
        if not self.reports_downloaded:
            logging.warning("No files to extract.")
            return

        logging.debug("Cleaning downloads folder...")
        self.clear_download_folder()

        logging.debug(self.reports_downloaded)
        for file in self.reports_downloaded:
            self.extract_file(file)

    def extract_file(self, filename, extract_only_filename=None):
        """
        Extract a single ZIP file.
        Args:
            filename: (str) ZIP file name.
            extract_only_filename: (str) if present, extract only this file
                from ZIP.
        Return:
            The Name(s) of the file(s) extracted.
        """
        logging.debug("Extracting file: " + filename)

        all_files_inside = []
        
        with zipfile.ZipFile(filename, 'r') as zip_ref:
            if not extract_only_filename:
                all_files_inside = zip_ref.namelist()
                zip_ref.extractall("./downloads")
            else:
                all_files_inside = [extract_only_filename]
                zip_ref.extract(extract_only_filename, "./downloads")

        return all_files_inside

    def get_extracted_reports(self):
        """
        Get all filenames of extract CSV reports.
        """
        CSV_folder_path = "./downloads/"
        all_files = glob.glob(CSV_folder_path + "*.csv")
        return all_files

    def clear_download_folder(self):
        """
        Remove all files from download folder.
        """
        CSV_folder_path = "./downloads/"
        all_files = glob.glob(CSV_folder_path + "*.csv")
        for single_file in all_files:
            os.remove(single_file)
