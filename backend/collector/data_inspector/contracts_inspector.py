import logging
import json
from collector.db_connector import db_connector
from collector.db_connector import redis_connector
from collector.data_inspector.utils import transform_data_in_list


CONTRACTS_DB_NAME = "contracts-data"


class ContractsInspector():

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

    def get_contracts_by_company_name(self, company_name):
        """
        Get all Contracts filtering by Company Name.
        Args:
            company_name: (str) Company name.
        Return:
            (list) of (dicts) with all data.
        """
        logging.debug("Searching all contracts filtering by Company Name (" + company_name + ").")

        if not self.db_connection:
            self.__connect_mongo_db()

        query_filter = {
            "Nome Contratado": str(company_name)
        }
        
        query_result = self.db_connection.query(filter=query_filter)

        return transform_data_in_list(query_result=query_result, entity_type=None, remove_duplicated=False)

    def get_contracts_by_cnpj(self, company_cnpj):
        """
        Get all Contracts filtering by Company CNPJ.
        Args:
            company_name: (str) Company CNPJ.
        Return:
            (list) of (dicts) with all data.
        """
        logging.debug("Searching all contracts filtering by Company CNPJ (" + company_cnpj + ").")

        if not self.db_connection:
            self.__connect_mongo_db()

        query_filter = {
            "CNPJ Contratado": str(company_cnpj)
        }
        
        query_result = self.db_connection.query(filter=query_filter)

        return transform_data_in_list(query_result=query_result, entity_type=None, remove_duplicated=False)

    def get_contracts_by_entity(self, entity_id="", date=""):
        """
        Return all contracts for a Single Entity for a date.
        Args:
            entity_id: (str) ID number of the Entity
            date: (str) date format YYYYMM
        """
        logging.debug("Geting Contracts for " + entity_id + " filtering by " + date)

        if not self.db_connection:
            self.__connect_mongo_db()

        query_filter = {
            "Código Órgão": str(entity_id)
        }

        if not date:
            logging.warning("Didn't receive a date to filter... Returning no contracts.")
            return []

        date_formated = date[4:6] + "/" + date[0:4]

        query_filter["Data Assinatura Contrato"] = {"$regex": str(date_formated)}

        logging.debug(query_filter)
        print(query_filter)

        result = self.db_connection.query(filter=query_filter)

        return transform_data_in_list(query_result=result, entity_type=None, remove_duplicated=False)
