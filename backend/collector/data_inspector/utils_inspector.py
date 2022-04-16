import json
import logging
from collector.db_connector import redis_connector


# Each Collection in MongoDB has a different field to be used in
# date filtering.
FIELDS_TO_FILTER = {
    "expenses-data": {
        "field_name": "Ano e mês do lançamento",
        "format_method": "expenses_data_date_format"
    },
    "contracts-data": {
        "field_name": "Data Publicação DOU",
        "format_method": "contracts_data_date_format"
    },
    "biddings-data": {
        "field_name": "Data Abertura",
        "format_method": "biddings_data_date_format"
    }
}


class UtilsInspector():

    def __init__(self, db_connector):
        self.db_connector = db_connector

    @classmethod
    def expenses_data_date_format(self, date):
        """
        Build a data filter according to EXPENSES database.
        Args:
            date: (str) YYYYMM date format.
        Return:
            date_filter: (dict) {<date_field_name>: <date_formated>}
        """
        filter_year = date[:4]
        filter_month = date[4:]
        filter_date = filter_year + "/" + filter_month

        db_filter = {
            FIELDS_TO_FILTER["expenses-data"]["field_name"]: filter_date
        }

        return db_filter

    @classmethod
    def biddings_data_date_format(self, date):
        """
        Build a data filter according to BIDDINGS database.
        Args:
            date: (str) YYYYMM date format.
        Return:
            date_filter: (dict) {<date_field_name>: <date_formated>}
        """

        date_formated = date[4:6] + "/" + date[0:4]

        db_filter = {
            FIELDS_TO_FILTER["biddings-data"]["field_name"]:
                {"$regex": str(date_formated)}
        }

        return db_filter

    @classmethod
    def contracts_data_date_format(self, date):
        """
        Build a data filter according to CONTRACTS database.
        Args:
            date: (str) YYYYMM date format.
        Return:
            date_filter: (dict) {<date_field_name>: <date_formated>}
        """

        date_formated = date[4:6] + "/" + date[0:4]

        db_filter = {
            FIELDS_TO_FILTER["contracts-data"]["field_name"]:
                {"$regex": str(date_formated)}
        }

        return db_filter

    def get_count_entries(self):
        """
        Return the total number of entries for a collection.
        """
        count_result = self.db_connector.count_entries(query_filter={})
        return count_result

    def get_count_for_date(self, db_name, date):
        """
        Given a specific date, check how many entries we have at the DB.
        Args:
            date: (str)"YYYYMM"
        """

        if db_name not in FIELDS_TO_FILTER:
            logging.info("System don't have the field mapped to filter {}. Skipping.".format(db_name))
            return -1

        method_to_call = getattr(UtilsInspector, FIELDS_TO_FILTER[db_name]["format_method"])
        db_filter = method_to_call(date)

        count_result = self.db_connector.count_entries(query_filter=db_filter)

        logging.debug("Found {} results for {} and date {}".format(count_result, db_name, date))

        return count_result

    def get_downloaded_reports(self):
        rc = redis_connector.RedisConnector()
        rc.connect()
        return (json.loads(rc.get("downloaded_reports")))
