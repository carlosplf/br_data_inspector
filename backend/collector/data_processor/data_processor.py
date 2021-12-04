import logging
import json

from collector.db_connector import db_connector
from collector.db_connector import redis_connector
from collector.data_inspector import data_inspector

EXPENSES_DB_NAME = "expenses-data"

class DataProcessor():
    def __init__(self):
        self.db_connector = None
        self.redis_connector = None
        self.__connect_mongo()

    def create_biggest_receivers_rank(self, rank_size=10, date_year=2020):
        """
        Create a Rank for the Entities that recevied the most money.
        This built rank should be stored in the RedisDB.
        Args:
            rank_size: number os entities to put in the rank.
            date_filter: list of two dates to use as filter in DB query.
        """
        logging.debug("Creating Receivers Rank...")
        self.__connect_redis(db=1)
        receivers_rank = []

        receivers_redis_key = "all_Subordinado_list_alltime"
        receivers_list = json.loads(self.redis_connector.get(receivers_redis_key))

        logging.debug("Building " + str(date_year) + " rank for " + str(len(receivers_list)) + " entities...")

        loop_counter = 0
        date_filter_regex = str(date_year) + "/*"

        # TODO: put this loop in another method
        for receiver in receivers_list:
            logging.debug(str(loop_counter) + ": Somando valores de " + receiver["Nome Órgão Subordinado"])
            r_data = self.__get_data_for_single_receiver(
                receiver['Código Órgão Subordinado'],
                "Subordinado",
                date_filter_regex,
                True
            )
            r_total_value = self.__sum_receiver_values(r_data, "Valor Pago (R$)")
            new_rank_line = {
                        "Nome Órgão Subordinado": receiver['Nome Órgão Subordinado'],
                        "Código Órgão Subordinado": receiver['Código Órgão Subordinado'],
                        "Total Recebido": r_total_value
                    }
            receivers_rank.append(new_rank_line)
            loop_counter += 1

        logging.debug("Done.")
        sorted_rank = self.__sort_rank(receivers_rank, "Total Recebido")
        sized_rank = sorted_rank[:rank_size]

        key_name = self.__build_key_name("recebedores_rank", date_year)
        return self.redis_connector.set(key_name, json.dumps(sized_rank))

    def __build_key_name(self, base_name, date_year=None):
        """
        Build the KEY to be used in Redis insertion. It is a independent method because this can be way
        more complex in future.
        Args:
            rank_type: STR base name to be used as part of key_value.
            date_year: INT year filtering.
        """

        if not date_year:
            date_filter_str = "alltime"
        else:
            date_filter_str = str(date_year)

        key_name = base_name + "_" + date_filter_str

        return key_name

    def __sort_rank(self, rank, key_value):
        """
        Sort the rank information and limit it size.
        Args:
            rank: LIST of dicts. The rank.
            key_value: STR dict key for the value to sort.
        """
        return sorted(rank, key=lambda k: k[key_value], reverse=True)

    def __sum_receiver_values(self, receiver_data, value_key):
        """
        Sum all values received for a single Receiver.
        Args:
            receiver_data: LIST od dicts, with receiver entrances at DB.
            value_key: key dict field representing values received.
        """
        total_value = 0
        for single_d in receiver_data:
            # parsing value, because it comes as 'XX,XXXXX' from DB
            value_str = single_d[value_key][:-2]
            value_str = value_str.replace(",", ".")
            total_value += float(value_str)

        logging.debug("Valor total: " + str(total_value))
        return total_value

    def __get_data_for_single_receiver(self, receiver_id, entity_type, date="", date_regex=False):
        """
        Get from MongoDB data of a single Receiver Entity.
        Args:
            receiver_id: (int OR str) Entity ID ('ID Órgão Suberdinado')
        """
        di = data_inspector.DataInspector(self.db_connector)
        return di.get_entity_data(entity_id=receiver_id, entity_type=entity_type, date=date, date_regex=date_regex)

    def create_entities_list(self, entity_type=None):
        """
        Create a list with all Entities (name, ID), removind duplicated.
        Save this list inside a RedisDB (db=1) to be used as a cache system
        by the API.
        """
        if not entity_type:
            logging.warning("No entity type selected at 'create_entities_list'. Returning...")
            return

        logging.debug("Creating Entities list...")
        di = data_inspector.DataInspector(self.db_connector)
        all_entities = di.get_all_entities(
            entity_type=entity_type,
            date=None
        )
        self.__connect_redis(db=1)

        base_name = "all_" + entity_type + "_list"
        key_name = self.__build_key_name(base_name)

        return self.redis_connector.set(key_name, json.dumps(all_entities))

    def __connect_mongo(self):
        logging.debug("Connecting Mongo DB")
        self.db_connector = db_connector.DbConnector()
        self.db_connector.connect(EXPENSES_DB_NAME)
        logging.debug("DONE")

    def __connect_redis(self, db=1):
        logging.debug("Connecting Redis DB")
        self.redis_connector = redis_connector.RedisConnector()
        self.redis_connector.connect(db=db)
        logging.debug("DONE")