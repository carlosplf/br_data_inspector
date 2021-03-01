from db_connector import db_connector

class DataInspector():

    def __init__(self):
        self.db_connector = None

    def __init__(self, db_connector):
        self.db_connector = db_connector

    def get_entity_data(self, entity_id="", entity_type=None, date=""):
        """
        Get all data from an entity within a specific date.
        Args:
            entity_id = Entity ID.
            entity_type: (str) "Superior" or "Subordinado"
            date: (str) "YYYYMM"
        """
        #WARNING: date filtering not implemented

        if not entity_type:
            print ("Superior ou Subordinado not select! Return empty list.")
            return []

        query_filter = {
            "Código Órgão " + entity_type: str(entity_id)
            
        }

        result = self.db_connector.query(filter=query_filter)
        return self.__transform_data_in_list(query_result=result)

    def get_all_entities(self, entity_type=None):
        """
        Get all entities names and IDs.
        Args:
            entity_type: (str) "Superior" or "Subordinado"
        """
        query_filter = {}
        query_fields = {
            "Código Órgão " + entity_type: 1,
            "Nome Órgão " + entity_type: 1
        }
        result = self.db_connector.query(filter=query_filter, fields=query_fields)
        return self.__transform_data_in_dict(query_result=result, entity_type=entity_type)

    def __transform_data_in_list(self, query_result):
        """
        Return a LIST with all data collected.
        Args:
            query_result: Mongo query Object.
        """
        all_data = []
        for data_entry in query_result:
            all_data.append(
                dict(data_entry)
            )
        return all_data
    
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
            all_data[data_entry[id_key_field]] = data_entry
        return all_data


