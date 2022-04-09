from collector.data_inspector import entity_inspector
from collector.db_connector import db_connector
import logging


class DataUpdater():

    def __ini__(self):
        pass

    def check_data_for_date(self, date, db_name, threshold=0):
        """
        For a given date (str), check if we have data for that date.
        If we don't have it, we should search for it.
        Args:
            date: (str) date as the format YYYYMM
            threshold: (int) Minimal number of data found as DB registers to
                consider that "we have data".
        Return:
            (bool) True if we have data for the date selected. False otherwise.
        """
        log_message = "Checking if we have data for " + date + "..."
        logging.debug(log_message)

        my_db = db_connector.DbConnector()
        my_db.connect(db_name)

        my_dai = entity_inspector.EntityInspector(my_db)
        count_result = my_dai.get_count_for_date(date=date)

        if count_result <= threshold:
            log_message = "Didn't find enough data for " + date + ". Returnning False."
            logging.debug(log_message)
            return False

        logging.debug(str("Found " + str(count_result) + " entries!"))

        return True
