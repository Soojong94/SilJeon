import os
from flask import Flask, redirect, url_for
from flask_cors import CORS
import secrets
from app.login import login_bp
from app.coughUpload import coughUpload_bp
from app.chart import chart_bp
from app.deleteAccount import deleteAccount_bp
from app.resetChart import resetChart_bp
import tensorflow as tf

# TensorFlow 환경 변수 설정
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

app = Flask(__name__, static_folder="static")

# CORS 설정
CORS(
    app,
    supports_credentials=True,
    resources={r"/api/*": {"origins": "http://localhost:3000"}},
)
# Flask 시크릿 키 설정
secret_key = secrets.token_hex(32)
app.secret_key = secret_key

# Blueprint 등록
app.register_blueprint(login_bp)
app.register_blueprint(coughUpload_bp)
app.register_blueprint(chart_bp)
app.register_blueprint(deleteAccount_bp)
app.register_blueprint(resetChart_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)


@sockets.route("/ws")
def echo_socket(ws):
    while not ws.closed:
        message = ws.receive()
        ws.send(message)
