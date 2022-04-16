import json
import logging
from collector.db_connector import db_connector
from collector.db_connector import redis_connector
from collector.data_inspector import biddings_inspector


BIDDINGS_COMPANIES_DB_NAME = "biddings-data"


class BiddingProcessor():
    def __init__(self):
        self.db_connector = None
        self.redis_connector = None

    def build_companies_bidding_rank(self):
        """
        Create a rank list for Companies using Bidding Data.
        This rank should ordered by the number of Biddings that a Company
        participated.
        This list should also store the Win rate of a Company in Biddings,
        and some basic info from the Company.
        Args:
            (none)
        Return:
            (str) status from redis insert operation. "OK" if everything
            was inserted.
        """
        logging.debug("Creating Companies Biddings rank...")

        redis_key_name = "all_companies_bidding_info"

        if not self.redis_connector:
            self.__connect_redis(db=1)

        # Get from RedisDB all Companies that participated in some Bidding process.
        all_companies_list = json.loads(self.redis_connector.get("all_biddings_companies_list"))
        all_companies_data = []

        # For each Company, get all Biddings that it participated, the value and the Win/Loss.
        for single_company in all_companies_list:
            logging.debug("Calculating Biddings and Win rate for {}".format(single_company["Nome Participante"]))
            company_data = self.__calculate_company_biddings(single_company["Código Participante"])
            all_companies_data.append(company_data)

        self.redis_connector.set(redis_key_name, json.dumps(all_companies_data))
    
    def build_companies_bidding_list(self):
        """
        Create a simple list of Names and IDS (CNPJ) of Companies inside Redis.
        This list should not contain duplicated Companies.
        Return:
            (str) status from redis insert operation. "OK" if everything
            was inserted.
        """
        logging.debug("Creating a Companies LIST (Names and IDs).")
        bi = biddings_inspector.BiddingsInspector()

        all_data = bi.get_all_companies()

        self.__connect_redis(db=1)

        key_name = "all_biddings_companies_list"

        return self.redis_connector.set(key_name, json.dumps(all_data))

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
