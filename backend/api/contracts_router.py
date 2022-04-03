from flask import request
from flask import Blueprint
from collector.data_inspector import contracts_inspector
from collector.db_connector import db_connector


CONTRACTS_DB_NAME = "contracts-data"

contracts_router = Blueprint("contracts_router", __name__)

db = db_connector.DbConnector()

@contracts_router.route('/contracts/<entity_id>/<date>')
def get_contracts_by_entity(entity_id, date):
    ci = contracts_inspector.ContractsInspector()
    response = {"data": ci.get_contracts_by_entity(entity_id, date)}
    return response

@contracts_router.route('/contracts/cnpj/<cnpj>')
def get_contracts_by_cnpj(cnpj):
    ci = contracts_inspector.ContractsInspector()
    response = {"data": ci.get_contracts_by_cnpj(cnpj)}
    return response

@contracts_router.route('/contracts/company-name/<name>')
def get_contracts_by_company_name(name):
    ci = contracts_inspector.ContractsInspector()
    response = {"data": ci.get_contracts_by_company_name(name)}
    return response

@contracts_router.route('/contracts/rank/<year>')
def get_contracts_rank(year):
    ci = contracts_inspector.ContractsInspector()
    response = {"data": ci.get_companies_rank(year)}
    return response

@contracts_router.route('/companies/list')
def get_companies_list():
    ci = contracts_inspector.ContractsInspector()
    response = {"data": ci.get_companies_list_from_redis()}
    return response
