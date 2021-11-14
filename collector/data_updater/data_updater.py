from collector.data_inspector import data_inspector
from collector.db_connector import db_connector
import logging


class DataUpdater():

    def __ini__(self):
        pass

    def check_data_for_date(self, date=""):
        """
        For a given date (str), check if we have data for that date.
        If we don't have it, we should search for it.
        Args:
            date: (str) date as the format YYYYMM
        """
        my_db = db_connector.DbConnector()
        my_db.connect()

        my_dai = data_inspector.DataInspector(my_db)
        count_result = my_dai.get_count_for_date(date=date)

        if count_result == 0:
            log_message = "Didn't find data for " + date + ". Searching for it..."
            print(log_message)

        return
        
