import logging
import json
from collector.db_connector import db_connector
from collector.db_connector import redis_connector
from collector.data_inspector.utils import transform_data_in_list


CONTRACTS_DB_NAME = "biddings-data"


class BiddingsInspector():

    def __init__(self):
        self.db_connection = None
        self.redis_connection = None

    def __connect_mongo_db(self):
        if self.db_connection:
            return

        self.db_connection = db_connector.DbConnector()
        self.db_connection.connect(CONTRACTS_DB_NAME)

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
            self.__connect_mongo_db()

        query_filter = {"Código Órgão": str(entity_id)}

        #If open_date is passed ar arg, use it as filter condition. Format: MM/YYYY.
        if open_date != "":
            opened_date_formated = open_date[4:6] + "/" + open_date[0:4]
            query_filter["Data Abertura"] = {"$regex": str(opened_date_formated)}
        
        #If close_date is passed ar arg, use it as filter condition. Format: MM/YYYY.
        if close_date != "":
            closed_date_formated = close_date[4:6] + "/" + close_date[0:4]
            query_filter["Data Resultado Compra"] = {"$regex": str(closed_date_formated)}

        result = self.db_connection.query(filter=query_filter)

        return transform_data_in_list(query_result=result, entity_type=None, remove_duplicated=False)
