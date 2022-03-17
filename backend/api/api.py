from flask import Flask
from flask_cors import CORS
from api.router import api_router

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

app.register_blueprint(api_router)
