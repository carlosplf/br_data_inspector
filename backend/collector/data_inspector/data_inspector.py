import logging
import json
from collector.db_connector import db_connector
from collector.db_connector import redis_connector
from collector.data_inspector.utils import transform_data_in_list


class DataInspector():

    def __init__(self, db_connector):
        self.db_connector = db_connector
        self.redis_connector = None

    def get_count_entries(self):
        """
        Return the total number of entries for a collection.
        """
        count_result = self.db_connector.count_entries(query_filter={})
        return count_result

    def get_count_for_date(self, date=""):
        """
        Given a specific date, check how many entries we have at the DB.
        Args:
            date: (str)"YYYYMM"
        """
        filter_date = date[:4] + "/" + date[4:]
        db_filter = {
            "Ano e mês do lançamento": filter_date
        }
        count_result = self.db_connector.count_entries(query_filter=db_filter)
        return count_result

    def get_contracts_by_entity(self, entity_id="", date=""):
        """
        Return all contracts for a Single Entity for a date.
        Args:
            entity_id: (str) ID number of the Entity
            date: (str) date format YYYYMM
        """
        logging.debug("Geting Contracts for " + entity_id + " filtering by " + date)

        query_filter = {
            "Código Órgão": str(entity_id)
        }

        if not date:
            logging.warning("Didn't receive a date to filter... Returning no contracts.")
            return []

        date_formated = date[4:6] + "/" + date[0:4]

        query_filter["Data Publicação DOU"] = {"$regex": str(date_formated)}

        logging.debug(query_filter)
        print(query_filter)

        result = self.db_connector.query(filter=query_filter)

        return transform_data_in_list(query_result=result, key_field="", remove_duplicated=False)

    def get_entity_data(self, entity_id="", entity_type=None, date="", date_regex=False):
        """
        Get all data from an entity within a specific date.
        Args:
            entity_id = Entity ID.
            entity_type: (str) "Superior" or "Subordinado"
            date: (str) "YYYYMM"
        """
        if not entity_type:
            logging.warning("Superior ou Subordinado not select! Return empty list.")
            return []

        query_filter = {
            "Código Órgão " + entity_type: str(entity_id)
        }

        if date:
            if date_regex:
                query_filter["Ano e mês do lançamento"] = {"$regex": str(date)}
            else:
                query_filter["Ano e mês do lançamento"] = self.__parse_date(date)

        logging.debug(query_filter)

        result = self.db_connector.query(filter=query_filter)
        return transform_data_in_list(query_result=result, key_field="", remove_duplicated=False)

    def get_downloaded_reports(self):
        rc = redis_connector.RedisConnector()
        rc.connect()
        return (json.loads(rc.get("downloaded_reports")))

    def get_entity_rank(self, entity_type=None, rank_size=20, date_year=2020):
        """
        Get the Entity Rank from RedisDB.
        Args:
            entity_type: (str) "Superior" or "Subordinado"
            date_year: (str) Year for the Rank selected.
        """
        if not entity_type:
            logging.warning("Superior ou Subordinado not select! Return empty list.")
            return []

        self.redis_connector = redis_connector.RedisConnector()
        self.redis_connector.connect()

        if entity_type == "Subordinado":
            redis_key = "spenders_rank_" + str(date_year)
        elif entity_type == "Superior":
            redis_key = "superiors_spenders_rank_" + date_year
        else:
            return []

        logging.debug(redis_key)

        return json.loads(self.redis_connector.get(redis_key))

    # TODO could be an option for the get_all_entitites method, Redis or Mongo
    def get_all_entities_from_redis(self, entity_type=None, date=None):
        """
        Get all Entities list from Redis DB, instead of Mongo DB.
        Args:
            entity_type: (str) "Superior" or "Subordinado"
        """
        if not entity_type:
            logging.warning("Entity type is None. Returning empty list...")
            return []

        key_name = "all_" + entity_type + "_list_alltime"
        self.redis_connector = redis_connector.RedisConnector()
        self.redis_connector.connect()

        entities_list = self.redis_connector.get(key_name)
        return json.loads(entities_list)

    def get_all_entities(self, entity_type=None, date=None):
        """
        Get all entities names and IDs.
        Args:
            entity_type: (str) "Superior" or "Subordinado"
        """
        if not entity_type:
            logging.warning("Superior ou Subordinado not select! Return empty list.")
            return []

        query_filter = {}

        if date:
            filter_date = self.__parse_date(date)
            query_filter = {"Ano e mês do lançamento": filter_date}

        key_field = "Código Órgão " + entity_type

        query_fields = {
            "Código Órgão " + entity_type: 1,
            "Nome Órgão " + entity_type: 1
        }
        result = self.db_connector.query(filter=query_filter, fields=query_fields)
        return transform_data_in_list(query_result=result, key_field=key_field, remove_duplicated=True)

    def search_entity(self, search_term=None, entity_type=None, date=None):
        """
        Search for an entity, 'Subirdonado' ou 'Superior' in DB.
        Args:
            search_term: (str) search term for entity name
            entity_type: (str) "Superior" or "Subordinado"
            date: (str) "YYYYMM"
        """
        query_filter = {
            str("Nome Órgão " + entity_type): {"$regex": search_term}
        }

        if date:
            filter_date = self.__parse_date(date)
            query_filter["Ano e mês do lançamento"] = filter_date

        result = self.db_connector.query(filter=query_filter)
        return transform_data_in_list(query_result=result)

    def __parse_date(self, date):
        return date[:4] + "/" + date[4:]
