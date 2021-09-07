from flask import Flask
from flask import request
from flask_cors import CORS
from collector.data_inspector import data_inspector
from collector.db_connector import db_connector
from collector.custom_link import custom_link

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
db = db_connector.DbConnector()
db.connect()

@app.route('/')
def index():
    return 'Govdata: Collect data from \"Portal da Transparência - Brasil\"'

@app.route('/superior/<date>')
def get_all_superior(date):
    di = data_inspector.DataInspector(db)
    response = {"data": di.get_all_entities("Superior", date)}
    return response

@app.route('/subordinado/<date>')
def get_all_subordinado(date):
    di = data_inspector.DataInspector(db)
    response = {"data": di.get_all_entities_from_redis("Subordinado", date)}
    return response

@app.route('/superior/<date>/<id>')
def get_superior_data(date, id):
    di = data_inspector.DataInspector(db)
    response = {"data": di.get_entity_data(id, "Superior", date)}
    return response

@app.route('/subordinado/<date>/<id>')
def get_subordinado_data(date, id):
    di = data_inspector.DataInspector(db)
    return {"data": di.get_entity_data(id, "Subordinado", date)}

@app.route('/rank')
def get_subordinado_rank():
    di = data_inspector.DataInspector(db)
    return {"data": di.get_entity_rank("Subordinado", None)}

@app.route('/save_custom_link', methods=['OPTIONS'])
def pre_create_custom_link():
    return {"Response": "OK"}

@app.route('/save_custom_link', methods=['POST'])
def create_custom_link():
    custom_url = request.get_json()["custom_url"]
    real_url = request.get_json()["real_url"]
    my_custom_link = custom_link.CustomLink()
    op_return = my_custom_link.create(custom_url, real_url)
    if op_return:
        return "OK"
    return "Error"