import redis


class RedisConnector():
    def __init__(self):
        self.db_connection = None
    
    def connect(self, host="localhost", port="6379", db=1):
        self.db_connection = redis.Redis(host=host, port=port, db=db)

    def set(self, key, value):
        self.db_connection.set(key, value)
    
    def hmset(self, key, value):
        self.db_connection.hmset(key, value)

    def get(self, key):
        return self.db_connection.get(key)
