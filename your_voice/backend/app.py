import os

os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
from flask import Flask
from flask_cors import CORS
import secrets
from app.login import login_bp
from app.coughUpload import coughUpload_bp
from app.chart import chart_bp
import tensorflow as tf


app = Flask(__name__, static_folder="static")
CORS(
    app,
    supports_credentials=True,
    resources={r"/api/*": {"origins": "http://3.39.0.139:3000"}},
)
secret_key = secrets.token_hex(32)
app.secret_key = secret_key

app.register_blueprint(login_bp)
app.register_blueprint(coughUpload_bp)
app.register_blueprint(chart_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")
