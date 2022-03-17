from flask import request
from flask import Blueprint
from collector.data_inspector import biddings_inspector
from collector.db_connector import db_connector


BIDDINGS_DB_NAME = "biddings-data"

biddings_router = Blueprint("biddings_router", __name__)

db = db_connector.DbConnector()

@biddings_router.route('/biddings/<entity_id>/<open_date>/<close_date>')
def search_biddings_open_and_close(entity_id, open_date, close_date):
    bi = biddings_inspector.BiddingsInspector()
    response = {"data": bi.get_biddings_by_entity(entity_id, open_date, close_date)}
    return response

@biddings_router.route('/biddings/<entity_id>/<open_date>')
def search_biddings_open(entity_id, open_date):
    bi = biddings_inspector.BiddingsInspector()
    response = {"data": bi.get_biddings_by_entity(entity_id, open_date)}
    return response

@biddings_router.route('/biddings/<entity_id>')
def search_biddings(entity_id):
    bi = biddings_inspector.BiddingsInspector()
    response = {"data": bi.get_biddings_by_entity(entity_id)}
    return response
