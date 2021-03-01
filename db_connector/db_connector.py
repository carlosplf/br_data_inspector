import pymongo

class DbConnector():
    def __init__(self):
        self.myclient = None
        self.mydb = None
        self.mucol = None

    def connect(self):
        self.myclient = pymongo.MongoClient("mongodb://localhost:27017/")
        self.mydb = self.myclient["govdata"]
        self.mycol = self.mydb["reports-data"]

    def insert_data(self, data):
        #need to deal with possible key duplication
        db_response = self.mycol.insert_one(data)
        print("Document inserted with id: ", db_response.inserted_id)

    def delete_all(self):
        result = self.mycol.delete_many({})
        return result

    def count_entries(self):
        result = self.mycol.count_documents({})
        return result

    def query(self, filter={}):
        result = self.mycol.find(filter)
        return result
    

