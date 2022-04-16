import logging
from collector.db_connector import db_connector
from collector.db_connector import redis_connector
from collector.data_inspector.utils import transform_data_in_list


BIDDINGS_DB_NAME = "biddings-data"
BIDDINGS_COMPANIES_DB_NAME = "biddings-companies-data"


class BiddingsInspector():

    def __init__(self):
        self.db_connection = None
        self.redis_connection = None

    def __connect_mongo_db(self, db_name):
        if self.db_connection:
            return

        self.db_connection = db_connector.DbConnector()
        self.db_connection.connect(db_name)

    def __connect_redis_db(self):
        if self.redis_connection:
            return

        self.redis_connection = redis_connector.RedisConnector()
        self.redis_connection.connect()

    def get_biddings_by_entity(self, entity_id="", open_date="", close_date=""):
        """
        Return all Biddings for a Single Entity for a date. If any of the data params are
        passed as empty, they are not considered.
        Args:
            entity_id: (str) ID number of the Entity
            open_date: (str) date format YYYYMM. Date which the bidding process was opened.
            close_date: (str) date format YYYYMM. Date which the bidding process was closed.
        """
        logging.debug("Geting Biddings for " + entity_id)

        if not self.db_connection:
            self.__connect_mongo_db(BIDDINGS_DB_NAME)

        query_filter = {"Código Órgão": str(entity_id)}

        # If open_date is passed ar arg, use it as filter condition. Format: MM/YYYY.
        if open_date != "":
            opened_date_formated = open_date[4:6] + "/" + open_date[0:4]
            query_filter["Data Abertura"] = {"$regex": str(opened_date_formated)}

        # If close_date is passed ar arg, use it as filter condition. Format: MM/YYYY.
        if close_date != "":
            closed_date_formated = close_date[4:6] + "/" + close_date[0:4]
            query_filter["Data Resultado Compra"] = {"$regex": str(closed_date_formated)}

        result = self.db_connection.query(filter=query_filter)

        return transform_data_in_list(query_result=result)

    def get_bidding_companies(self, bidding_id, entity_id, process_id):
        """
        Get the Companies that took part in a Bidding process.
        Args:
            bidding_id: (str) Bidding ID.
            entity_id: (str) Entity ID.
            process_id: (str) Process ID.
        """

        logging.debug("Geting Companies for Bidding " + bidding_id)

        if not self.db_connection:
            self.__connect_mongo_db(BIDDINGS_COMPANIES_DB_NAME)

        query_filter = {
            "Código Órgão": str(entity_id),
            "Número Licitação": str(bidding_id),
            "Número Processo": str(process_id),
        }

        result = self.db_connection.query(filter=query_filter)

        return transform_data_in_list(query_result=result)

    def get_all_companies(self):
        """
        Get all Companies IDs in the Companies Bidding Database.
        Return:
            (list) List of dicts with the Ids and Names of the Companies.
        """

        self.__connect_mongo_db(BIDDINGS_COMPANIES_DB_NAME)

        query_fields = {
            "Código Participante": 1,
            "Nome Participante": 1
        }

        result = self.db_connection.query(filter={}, fields=query_fields)
        return transform_data_in_list(query_result=result, key_field="Código Participante", remove_duplicated=True)

    def get_bidding_by_company(self, company_id):
        """
        Get the Biddings that a Company participated.
        Args:
            (str) Company ID.
        Return:
            (list) List of Dicts with the data requested.
        """
        logging.debug("Geting Company '{}' Bidding IDs... ".format(company_id))

        if not self.db_connection:
            self.__connect_mongo_db(BIDDINGS_COMPANIES_DB_NAME)

        query_filter = {
            "Código Participante": str(company_id)
        }

        result = self.db_connection.query(filter=query_filter)

        return transform_data_in_list(query_result=result)

    def get_bidding(self, bidding_id=None, ug_id=None, process_id=None, entity_id=None):
        """
        Get a Bidding using some filed to filtering.
        OBS.: Filtering by the process_id will give you a unique Bidding.
        Args:
            bidding_id: (str) Bidding ID in Database.
            ug_id: (str) "Código UG" in Database.
            process_id: (str) Number of the Bidding Process in Databse.
            entity_id: (str) "Código Órgão" in Databse.
        Return:
            (list) of Dicts with all the Biddings that match the filtering.
        """

        if not self.db_connection:
            self.__connect_mongo_db(BIDDINGS_DB_NAME)

        query_filter = {}

        if bidding_id:
            query_filter["Número Licitação"] = str(bidding_id)

        if ug_id:
            query_filter["Código UG"] = str(ug_id)

        if process_id:
            query_filter["Número Processo"] = str(process_id)

        if entity_id:
            query_filter["Código Órgão"] = str(entity_id)

        if not query_filter:
            return []

        logging.debug("Geting specific Bid details. Filters: {}".format(str(query_filter)))

        result = self.db_connection.query(filter=query_filter)

        return transform_data_in_list(query_result=result)
