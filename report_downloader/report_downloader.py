import zipfile
import time
import glob
import urllib.request


class ReportDownloader():
    def __init__(self):
        pass

    def download_multiple_reports(self, task_list):
        """
        Receives a Dict containing instructions to download reports from gov.
        All reports are stored as a ZIP file.
        """
        logging.debug("Downloading multiple reports...")
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
        link = link + arg
        zip_filename = arg + "-repot.zip"
        logging.debug("Link:", link)
        logging.debug("Output filename: ", zip_filename)
        urllib.request.urlretrieve(link, zip_filename)
        logging.debug("Done")
        time.sleep(1)
        
    def extract_all_files(self):
        """
        Extract all ZIP files inside project folder.
        """
        all_files = glob.glob("./*.zip")
        logging.debug(all_files)
        for file in all_files:
            self.extract_file(file)

    def extract_file(self, filename):
        """
        Extract a single ZIP file.
        """
        with zipfile.ZipFile(filename, 'r') as zip_ref:
            zip_ref.extractall("./downloads")

    def get_extracted_reports(self):
        """
        Get all filenames of extract CSV reports.
        """
        CSV_folder_path = "./downloads/"
        all_files = glob.glob(CSV_folder_path + "*.csv")
        return all_files