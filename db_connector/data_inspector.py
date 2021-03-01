from db_connector import db_connector

class DataInspector():

    def __init__(self):
        self.db_connector = None

    def __init__(self, db_connector):
        self.db_connector = db_connector

    def get_entity_data(self, entity_id, date):
        """
        Get all data from an entity within a specific date.
        Args:
            entity_id = Entity ID.
            date: (str) "YYYYMM"
        """
        #WARNING: date filtering not implemented
        query_filter = {
            "Código Órgão Superior": str(entity_id)
        }
        result = self.db_connector.query(filter=query_filter)
        return self.__transform_data_in_list(query_result=result)

    def __transform_data_in_list(self, query_result):
        all_data = []
        for data_entry in query_result:
            all_data.append(
                dict(data_entry)
            )
        return all_data


