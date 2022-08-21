from collector.db_connector import redis_connector


class CustomLink:
    def __init__(self):
        self.redis_connection = redis_connector.RedisConnector()
        self.redis_connection.connect(db=2)

    def create(self, custom_url, real_url):
        return self.redis_connection.set(custom_url, real_url)

    def get(self, custom_url):
        return self.redis_connection.get(custom_url)
