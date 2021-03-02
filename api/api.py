from flask import Flask
from flask import request
from collector.data_inspector import data_inspector
from collector.db_connector import db_connector

app = Flask(__name__)
db = db_connector.DbConnector()
db.connect()

@app.route('/')
def index():
    return 'Govdata: Collect data from \"Portal da Transparência - Brasil\"'

@app.route('/superior/<date>')
def get_all_superior(date):
    di = data_inspector.DataInspector(db)
    return di.get_all_entities("Superior", date)

@app.route('/subordinado/<date>')
def get_all_subordinado(date):
    di = data_inspector.DataInspector(db)
    return di.get_all_entities("Subordinado", date)

@app.route('/superior/<date>/<d>')
def get_superior_data(date, id):
    di = data_inspector.DataInspector(db)
    return {"data": di.get_entity_data(id, "Superior", date)}

@app.route('/subordinado/<date>/<id>')
def get_subordinado_data(date, id):
    di = data_inspector.DataInspector(db)
    return {"data": di.get_entity_data(id, "Subordinado", date)}

@app.route('/search_entity', methods=['POST'])
def search_entity():
    search_term = request.form.get('search_term')
    entity_type = request.form.get('entity_type')
    date = request.form.get('date')
    di = data_inspector.DataInspector(db)
    result = di.search_entity(search_term, entity_type, date)
    return {"data": result}
