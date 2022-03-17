from flask import request
from flask import Blueprint
from collector.data_inspector import data_inspector
from collector.data_inspector import contracts_inspector
from collector.db_connector import db_connector
from collector.custom_link import custom_link


EXPENSES_DB_NAME = "expenses-data"
CONTRACTS_DB_NAME = "contracts-data"

api_router = Blueprint("api_router", __name__)

db = db_connector.DbConnector()

@api_router.route('/')
def index():
    return 'API Govdata: Collect data from \"Portal da Transparência - Brasil\"'

@api_router.route('/superior/<date>')
def get_all_superior(date):
    db.connect(EXPENSES_DB_NAME)
    di = data_inspector.DataInspector(db)
    response = {"data": di.get_all_entities("Superior", date)}
    return response

@api_router.route('/subordinado/<date>')
def get_all_subordinado(date):
    db.connect(EXPENSES_DB_NAME)
    di = data_inspector.DataInspector(db)
    response = {"data": di.get_all_entities_from_redis("Subordinado", date)}
    return response

@api_router.route('/superior/<date>/<id>')
def get_superior_data(date, id):
    db.connect(EXPENSES_DB_NAME)
    di = data_inspector.DataInspector(db)
    response = {"data": di.get_entity_data(id, "Superior", date)}
    return response

@api_router.route('/subordinado/<date>/<id>')
def get_subordinado_data(date, id):
    db.connect(EXPENSES_DB_NAME)
    di = data_inspector.DataInspector(db)
    return {"data": di.get_entity_data(id, "Subordinado", date)}

@api_router.route('/rank/<date_year>')
def get_subordinado_rank(date_year):
    db.connect(EXPENSES_DB_NAME)
    di = data_inspector.DataInspector(db)
    return {"data": di.get_entity_rank(entity_type="Subordinado", rank_size=20, date_year=date_year)}

@api_router.route('/save_custom_link', methods=['OPTIONS'])
def pre_create_custom_link():
    return {"Response": "OK"}

@api_router.route('/save_custom_link', methods=['POST'])
def create_custom_link():
    custom_url = request.get_json()["custom_url"]
    real_url = request.get_json()["real_url"]
    my_custom_link = custom_link.CustomLink()
    op_return = my_custom_link.create(custom_url, real_url)
    if op_return:
        return "OK"
    return "Error"

@api_router.route('/get_real_url/<custom_url>')
def get_real_url(custom_url):
    my_custom_link = custom_link.CustomLink()
    return {"real_url": str(my_custom_link.get(custom_url))}

@api_router.route('/contracts/<entity_id>/<date>')
def get_contracts_by_entity(entity_id, date):
    ci = contracts_inspector.ContractsInspector()
    response = {"data": ci.get_contracts_by_entity(entity_id, date)}
    return response

@api_router.route('/contracts/cnpj/<cnpj>')
def get_contracts_by_cnpj(cnpj):
    ci = contracts_inspector.ContractsInspector()
    response = {"data": ci.get_contracts_by_cnpj(cnpj)}
    return response

@api_router.route('/contracts/company-name/<name>')
def get_contracts_by_company_name(name):
    ci = contracts_inspector.ContractsInspector()
    response = {"data": ci.get_contracts_by_company_name(name)}
    return response

@api_router.route('/contracts/rank/<year>')
def get_contracts_rank(year):
    ci = contracts_inspector.ContractsInspector()
    response = {"data": ci.get_companies_rank(year)}
    return response

@api_router.route('/companies/list')
def get_companies_list():
    ci = contracts_inspector.ContractsInspector()
    response = {"data": ci.get_companies_list_from_redis()}
    return response

@api_router.route('/db_size')
def get_engine_status():
    status_return = {}
    db.connect(CONTRACTS_DB_NAME)
    di = data_inspector.DataInspector(db)
    status_return["total_contracts"] = di.get_count_entries()
    db.connect(EXPENSES_DB_NAME)
    di = data_inspector.DataInspector(db)
    status_return["total_expenses"] = di.get_count_entries()
    return status_return

@api_router.route('/downloaded_reports')
def get_downloaded_reports():
    di = data_inspector.DataInspector(None)
    return di.get_downloaded_reports()
