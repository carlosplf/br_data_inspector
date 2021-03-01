import logging
from collector import collector

def run():
    logging.debug("Starting Collector...")
    my_collector = collector.Collector()
    my_collector.collect_all()


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    run()