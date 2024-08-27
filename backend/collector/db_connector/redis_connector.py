import redis
import logging


# REDIS_ADDRESS = "redis"
REDIS_ADDRESS = "127.0.0.1"


class RedisConnector:
    def __init__(self):
        self.db_connection = None

    def connect(self, host=REDIS_ADDRESS, port=6379, db=1):
        self.db_connection = redis.Redis(host=host, port=port, db=db)

    def set(self, key, value):
        if self.db_connection is None:
            logging.error("Trying to use DB before connect(). Aborting.")
            return None

        return self.db_connection.set(key, value)

    def hmset(self, key, value):
        if self.db_connection is None:
            logging.error("Trying to use DB before connect(). Aborting.")
            return None

        return self.db_connection.hmset(key, value)

    def get(self, key):
        if self.db_connection is None:
            logging.error("Trying to use DB before connect(). Aborting.")
            return None

        return self.db_connection.get(key)
