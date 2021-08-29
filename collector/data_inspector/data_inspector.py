from collector.db_connector import db_connector
from collector.db_connector import redis_connector
import logging
import json


class DataInspector():

    def __init__(self, db_connector):
        self.db_connector = db_connector
        self.redis_connector = None

    def get_entity_data(self, entity_id="", entity_type=None, date=""):
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
            filter_date = self.__parse_date(date)
            query_filter["Ano e mês do lançamento"] = filter_date

        result = self.db_connector.query(filter=query_filter)
        return self.__transform_data_in_list(query_result=result, entity_type=entity_type, remove_duplicated=False)

    #TODO could be an option for the get_all_entitites method, Redis ou Mongo
    def get_all_entities_from_redis(self, entity_type=None, date=None):
        """
        Get all Entities list from Redis DB, instead of Mongo DB.
        Args:
            entity_type: (str) "Superior" or "Subordinado"
        """
        if not entity_type:
            logging.warning("Entity type is None. Returning empty list...")
            return []

        key_name = "all_" + entity_type + "_list_all-time"
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

        query_fields = {
            "Código Órgão " + entity_type: 1,
            "Nome Órgão " + entity_type: 1
        }
        result = self.db_connector.query(filter=query_filter, fields=query_fields)
        return self.__transform_data_in_list(query_result=result, entity_type=entity_type, remove_duplicated=True)

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
        return self.__transform_data_in_list(query_result=result)

    def __parse_date(self, date):
        return date[:4] + "/" + date[4:]

    def __transform_data_in_list(self, query_result, entity_type, remove_duplicated=False):
        """
        Return a LIST with all data collected.
        Args:
            query_result: Mongo query Object.
        """
        all_data = []
        for data_entry in query_result:
            data_as_dict = dict(data_entry)
            data_as_dict.pop("_id", None)
            all_data.append(data_as_dict)
        
        if remove_duplicated:
            all_data = self.__remove_duplicated(all_data, entity_type)
        return all_data

    def __remove_duplicated(self, original_list, entity_type):
        """
        Remove duplicated entries from BD.
        Args:
            original_list: (list) List with all elements.
            entity_type: (str) "Superior" or "Subordinado"
        """
        buffer_ids_list = []
        new_data_list = []
        id_key_field = "Código Órgão " + entity_type
        
        for data in original_list:
            if data[id_key_field] not in buffer_ids_list:
                buffer_ids_list.append(data[id_key_field])
                new_data_list.append(data)
        
        return new_data_list
    
    def __transform_data_in_dict(self, query_result, entity_type):
        """
        Return a DICT with all data collected. Each dict key is the Entity ID, removing duplicates.
        Args:
            query_result: Mongo query Object.
            entity_type: (str) "Superior" or "Subordinado"
        """
        all_data = {}
        id_key_field = "Código Órgão " + entity_type
        for data_entry in query_result:
            data_entry.pop("_id", None)
            all_data[data_entry[id_key_field]] = data_entry
        return all_data


