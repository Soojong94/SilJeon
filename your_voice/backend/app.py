from flask import Flask
from flask_cors import CORS
import secrets
from models.model import AudioModel
from app.login import login_bp
from app.coughUpload import coughUpload_bp

app = Flask(__name__, static_folder='static')
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "http://localhost:3000"}})
secret_key = secrets.token_hex(32)
app.secret_key = secret_key

app.register_blueprint(login_bp)
app.register_blueprint(coughUpload_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
