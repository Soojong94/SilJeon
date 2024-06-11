# app.py
import os

os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
from flask import Flask, redirect, url_for
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
    resources={r"/api/*": {"origins": "http://localhost:3000"}},
)
secret_key = secrets.token_hex(32)
app.secret_key = secret_key

# Blueprint 등록
app.register_blueprint(login_bp)
app.register_blueprint(coughUpload_bp)
app.register_blueprint(chart_bp)


# 새로운 로그인 리디렉션 경로
@app.route("/login")
def login():
    return redirect(
        "https://oauth.provider.com/auth?redirect_uri=https://yourcough.site/auth/callback"
    )


if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000,
        host="0.0.0.0",
        ssl_context=(
            "/etc/letsencrypt/live/yourcough.site/fullchain.pem",
            "/etc/letsencrypt/live/yourcough.site/privkey.pem",
        ),
    )
