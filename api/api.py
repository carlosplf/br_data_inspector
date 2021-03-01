from flask import Flask
from data_inspector import data_inspector
from db_connector import db_connector

app = Flask(__name__)
db = db_connector.DbConnector()
db.connect()

@app.route('/')
def index():
    return 'Govdata: Collect data from \"Portal da Transparência - Brasil\"'

@app.route('/superiores/<date>')
def get_all_superior(date):
    di = data_inspector.DataInspector(db)
    return di.get_all_entities("Superior", date)

@app.route('/subordinados/<date>')
def get_all_subordinado(date):
    di = data_inspector.DataInspector(db)
    return di.get_all_entities("Subordinado", date)

@app.route('/subordinado/<id>/<date>')
def get_subordinado_data(id, date):
    di = data_inspector.DataInspector(db)
    return {"data": di.get_entity_data(id, "Subordinado", date)}

@app.route('/superior/<id>/<date>')
def get_superior_data(id, date):
    di = data_inspector.DataInspector(db)
    return {"data": di.get_entity_data(id, "Superior", date)}