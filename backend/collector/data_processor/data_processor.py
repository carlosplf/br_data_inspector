import logging
import json

from collector.db_connector import db_connector
from collector.db_connector import redis_connector
from collector.data_inspector import entity_inspector
from collector.data_inspector import contracts_inspector


EXPENSES_DB_NAME = "expenses-data"
CONTRACTS_DB_NAME = "contarcts-data"


class DataProcessor():
    def __init__(self):
        self.db_connector = None
        self.redis_connector = None

    def create_biggest_contracts_receivers_rank(self, rank_size=50, date_year=2020):
        """
        Create a Rank for Companies that earned most from Federal Government with Contracts.
        Collect all Contracts data from MongoDB. Process all data, sum values and create the Rank.
        The Rank created is saved on a RedisDB instance.
        Contracts are filtered by publication date.
        Args:
            rank_size: number os entities to put in the rank.
            date_filter: list of two dates to use as filter in DB query.
        """
        logging.debug("Creating Companies earnings rank...")
        self.__connect_redis(db=1)
        ci = contracts_inspector.ContractsInspector()

        all_contracts = ci.get_contracts_by_year("Data Publicação DOU", date_year)

        contracts_summary_dict = {}
        contracts_summary_list = []

        # TODO: this could be in separated method.
        for single_contract in all_contracts:
            previous_total_value = 0
            contracts_count = 0
            if single_contract["CNPJ Contratado"] in contracts_summary_dict.keys():
                previous_total_value = contracts_summary_dict[single_contract["CNPJ Contratado"]]["Total recebido"]
                contracts_count = contracts_summary_dict[single_contract["CNPJ Contratado"]]["Quantidade de contratos"]

            single_contract_value = float(single_contract["Valor Final Compra"].replace(",", "."))

            contracts_summary_dict[single_contract["CNPJ Contratado"]] = {
                "CNPJ": single_contract["CNPJ Contratado"],
                "Nome": single_contract["Nome Contratado"],
                "Total recebido": previous_total_value + single_contract_value,
                "Quantidade de contratos": contracts_count + 1
            }

        # TODO: need a better logic for this. Just passing the dict to list to use the already implemented methods.
        for k in contracts_summary_dict.keys():
            contracts_summary_list.append(contracts_summary_dict[k])

        sorted_rank = self.__sort_rank(contracts_summary_list, "Total recebido")
        sized_rank = sorted_rank[:rank_size]

        redis_key_name = "biggest_receivers_" + str(date_year)
        return self.redis_connector.set(redis_key_name, json.dumps(sized_rank))

    def create_biggest_spenders_rank(self, rank_size=10, date_year=2020):
        """
        Create a Rank for the Entities that recevied the most money.
        This built rank should be stored in the RedisDB.
        Args:
            rank_size: number os entities to put in the rank.
            date_filter: list of two dates to use as filter in DB query.
        """
        logging.debug("Creating Spenders Entities rank...")
        self.__connect_redis(db=1)
        self.__connect_mongo(EXPENSES_DB_NAME)
        spenders_rank = []

        spenders_redis_key = "all_Subordinado_list_alltime"
        spenders_list = json.loads(self.redis_connector.get(spenders_redis_key))

        logging.debug("Building " + str(date_year) + " rank for " + str(len(spenders_list)) + " entities...")

        loop_counter = 0
        date_filter_regex = str(date_year) + "/*"

        # TODO: put this loop in another method
        for spender in spenders_list:
            logging.debug(str(loop_counter) + ": Somando valores de " + spender["Nome Órgão Subordinado"])
            r_data = self.__get_data_for_single_spender(
                spender['Código Órgão Subordinado'],
                "Subordinado",
                date_filter_regex,
                True
            )
            r_total_value = self.__sum_spender_values(r_data, "Valor Pago (R$)")
            new_rank_line = {
                        "Nome Órgão Subordinado": spender['Nome Órgão Subordinado'],
                        "Código Órgão Subordinado": spender['Código Órgão Subordinado'],
                        "Total gasto": r_total_value
                    }
            spenders_rank.append(new_rank_line)
            loop_counter += 1

        logging.debug("Done.")
        sorted_rank = self.__sort_rank(spenders_rank, "Total gasto")
        sized_rank = sorted_rank[:rank_size]

        key_name = self.__build_key_name("spenders_rank", date_year)
        return self.redis_connector.set(key_name, json.dumps(sized_rank))

    def __build_key_name(self, base_name, date_year=None):
        """
        Build the KEY to be used in Redis insertion.
        Args:
            rank_type: STR base name to be used as part of key_value.
            date_year: INT year filtering.
        """

        date_filter_str = "alltime"

        if date_year:
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

    def __sum_spender_values(self, spender_data, value_key):
        """
        Sum all values received for a single Receiver.
        Args:
            spender_data: LIST od dicts, with spender entrances at DB.
            value_key: key dict field representing values received.
        """
        total_value = 0
        for single_d in spender_data:
            # parsing value, because it comes as 'XX,XXXXX' from DB
            value_str = single_d[value_key][:-2]
            value_str = value_str.replace(",", ".")
            total_value += float(value_str)

        logging.debug("Valor total: " + str(total_value))
        return total_value

    def __get_data_for_single_spender(self, spender_id, entity_type, date="", date_regex=False):
        """
        Get from MongoDB data of a single Receiver Entity.
        Args:
            spender_id: (int OR str) Entity ID ('ID Órgão Suberdinado')
        """
        di = entity_inspector.EntityInspector(self.db_connector)
        return di.get_entity_data(entity_id=spender_id, entity_type=entity_type, date=date, date_regex=date_regex)

    def create_entities_list(self, entity_type=None):
        """
        Create a list with all Entities (name, ID), removing duplicated.
        Save this list inside a RedisDB (db=1) to be used as a cache system
        by the API.
        """
        self.__connect_mongo(EXPENSES_DB_NAME)

        if not entity_type:
            logging.warning("No entity type selected at 'create_entities_list'. Returning...")
            return

        logging.debug("Creating Entities list...")
        di = entity_inspector.EntityInspector(self.db_connector)
        all_entities = di.get_all_entities(
            entity_type=entity_type,
            date=None
        )
        self.__connect_redis(db=1)

        base_name = "all_" + entity_type + "_list"
        key_name = self.__build_key_name(base_name)

        return self.redis_connector.set(key_name, json.dumps(all_entities))

    def create_companies_list(self):
        """
        Create a list with all Companies (Name, CNPJ), removing duplicated.
        Save this list inside a RedisDB (db=1) to be used as a cache system
        by the API.
        """
        self.__connect_mongo(CONTRACTS_DB_NAME)

        logging.debug("Creating Companies list based on Contracts data...")
        ci = contracts_inspector.ContractsInspector()
        all_contracts = ci.get_all_contracts()
        self.__connect_redis(db=1)

        companies_dict = {}
        companies_list = []

        for item in all_contracts:
            companies_dict[item["Nome Contratado"]] = {
                "Nome": item["Nome Contratado"],
                "CNPJ": item["CNPJ Contratado"]
            }

        for k in companies_dict.keys():
            companies_list.append(companies_dict[k])

        key_name = "all_companies_list"

        return self.redis_connector.set(key_name, json.dumps(companies_list))

    def __connect_mongo(self, db_name):
        logging.debug("Connecting Mongo DB")
        self.db_connector = db_connector.DbConnector()
        self.db_connector.connect(db_name)
        logging.debug("DONE")

    def __connect_redis(self, db=1):
        logging.debug("Connecting Redis DB")
        self.redis_connector = redis_connector.RedisConnector()
        self.redis_connector.connect(db=db)
        logging.debug("DONE")
