import logging
import json

from collector.db_connector import db_connector
from collector.db_connector import redis_connector
from collector.data_inspector import data_inspector


"""
REDIS DB mapping:
1: Entities list
2: Ranks
"""

# TODO: Build other constructors with db connections as args
class DataProcessor():
    def __init__(self):
        self.db_connector = None
        self.redis_connector = None
        self.__connect_mongo()

    def create_biggest_receivers_rank(self, rank_size=10, date_filter=[]):
        """
        Create a Rank for the Entities that recevied the most money.
        This built rank should be stored in the RedisDB.
        Args:
            rank_size: number os entities to put in the rank.
            date_filter: list of two dates to use as filter in DB query.
        """
        logging.debug("Creating Receivers Rank")
        self.__connect_redis(db=1)
        
        receivers_redis_key = "Subordinado_list"
        receivers_list = json.loads(self.redis_connector.get(receivers_redis_key))
        for receiver in receivers_list:
            r_data = self.__get_data_for_single_receiver(receiver['Código Órgão Subordinado'], "Subordinado") 
            r_total_value = self.__sum_receiver_values(r_data, "Valor Pago (R$)")

        logging.debug("Done.")
        return

    def __sum_receiver_values(self, receiver_data, value_key):
        """
        Sum all values received for a single Receiver.
        Args:
            receiver_data: LIST od dicts, with receiver entrances at DB.
            value_key: key dict field representing values received.
        """
        total_value = 0
        for single_d in receiver_data:
            #parsing value, cause it comes as 'XX,XXXXX' from DB
            value_str = single_d[value_key][:-2]
            value_str = value_str.replace(",", ".")
            total_value += float(value_str)
        return total_value


    def __get_data_for_single_receiver(self, receiver_id, entity_type):
        """
        Get from MongoDB data of a single Receiver Entity.
        Args:
            receiver_id: (int OR str) Entity ID ('ID Órgão Suberdinado')
        """
        di = data_inspector.DataInspector(self.db_connector)
        return di.get_entity_data(entity_id=receiver_id, entity_type=entity_type, date="")


    def create_entities_list(self, entity_type=None):
        """
        Create a list with all Entities (name, ID), removind duplicated.
        Save this list inside a RedisDB (db=1) to be used as a cache system
        by the API.
        """
        if not entity_type:
            logging.warning("No entity type selected at 'create_entities_list'. Returning...")
            return

        all_entities = self.__get_all_entities(entity_type=entity_type,
                                               date=None)
        self.__connect_redis(db=1)
        
        #TODO use date filtering as part of the key name
        key_name = entity_type + "_list"
        
        #TODO fix unicode in JSOM Dump str
        return self.redis_connector.set(key_name, json.dumps(all_entities))

    #TODO WARNING: duplicated code. Already inside DataInspector class.
    def __get_all_entities(self, entity_type=None, date=None):
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

    #TODO WARNING: duplicated code. Already inside DataInspector class.
    def __parse_date(self, date):
        return date[:4] + "/" + date[4:]

    #TODO WARNING: duplicated code. Already inside DataInspector class.
    def __transform_data_in_list(self, query_result, entity_type, remove_duplicated=False):
        """
        Return a LIST with all data collected.
        Args:
            query_result: Mongo query Object.
            remove_duplicated: Boolean. If True, call the '__remove_duplicated'
            method.
        """
        all_data = []
        results_counter = 0

        for data_entry in query_result:
            results_counter = results_counter + 1
            data_as_dict = dict(data_entry)
            data_as_dict.pop("_id", None)
            all_data.append(data_as_dict)
        logging.debug("Transforming", results_counter, " results.")
        
        if remove_duplicated:
            all_data = self.__remove_duplicated(all_data, entity_type)
        return all_data

    #TODO WARNING: duplicated code. Already inside DataInspector class.
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

    def __connect_mongo(self):
        logging.debug("Connecting Mongo DB")
        self.db_connector = db_connector.DbConnector()
        self.db_connector.connect()
        logging.debug("DONE")

    def __connect_redis(self, db=1):
        logging.debug("Connecting REDIS DB")
        self.redis_connector = redis_connector.RedisConnector()
        self.redis_connector.connect(db=db)
        logging.debug("DONE")

