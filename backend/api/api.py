from flask import Flask
from flask_cors import CORS
from api.expenses_router import expenses_router
from api.contracts_router import contracts_router
from api.biddings_router import biddings_router

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

app.register_blueprint(expenses_router)
app.register_blueprint(contracts_router)
app.register_blueprint(biddings_router)
