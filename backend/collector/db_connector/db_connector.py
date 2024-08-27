import pymongo
import logging

logging.getLogger("pymongo").setLevel(logging.WARNING)

# MONGO_ADDRESS = "mongo"
MONGO_ADDRESS = "127.0.0.1"


class DbConnector:
    def __init__(self):
        self.myclient = None
        self.mydb = None
        self.mycol = None

    def connect(self, db_name):
        self.myclient = pymongo.MongoClient(
            connect=False, host=MONGO_ADDRESS, port=27017
        )
        self.mydb = self.myclient["govdata"]
        self.mycol = self.mydb[db_name]

    def insert_data(self, data):
        if self.mycol is None:
            logging.error("Trying to use DB before connect(). Aborting.")
            return None

        # need to deal with possible key duplication
        self.mycol.insert_one(data)

    def delete_all(self):
        if self.mycol is None:
            logging.error("Trying to use DB before connect(). Aborting.")
            return None

        result = self.mycol.delete_many({})
        return result

    def count_entries(self, query_filter={}):
        if self.mycol is None:
            logging.error("Trying to use DB before connect(). Aborting.")
            return None

        result = self.mycol.count_documents(query_filter)
        return result

    def query(self, filter={}, fields=None):
        if self.mycol is None:
            logging.error("Trying to use DB before connect(). Aborting.")
            return None

        if not fields:
            result = self.mycol.find(filter)
        else:
            result = self.mycol.find(filter, fields)
        return result
