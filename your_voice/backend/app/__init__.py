import os

os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
from flask import Flask
from flask_cors import CORS
import secrets
from .login import login_bp
from .coughUpload import coughUpload_bp


def create_app():
    app = Flask(__name__, static_folder="static")
    CORS(
        app,
        supports_credentials=True,
        resources={r"/api/*": {"origins": "http://yourcough.site"}},
    )
    secret_key = secrets.token_hex(32)
    app.secret_key = secret_key

    app.register_blueprint(login_bp)  # login Blueprint를 등록합니다.
    app.register_blueprint(coughUpload_bp)

    return app
