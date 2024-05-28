from flask import Flask, request, jsonify
from db.db import connect_db  # DB 커넥션 풀을 가져오는 함수 import
from flask_cors import CORS
from upload_and_predict import process_file
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route('/')
def home():
    return '<h>ㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠ</h>'

@app.route('/test')
def test():
    try:
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM test") 
        data = cursor.fetchall()
    except Exception as e:
        print(f"An error occurred: {e}")
        return f"An error occurred: {e}", 500
    finally:
        cursor.close()
        conn.close()    
    return f'<h1>Data:{data}</h1>'

@app.route('/api/hello')
def hello():
    data = "hello"
    return jsonify(data)


@app.route('/api/coughUpload', methods=['POST'])
def coughUpload():
    if 'file' not in request.files:
        return jsonify({'error': '파일이 전송되지 않았습니다.'}), 400

    file = request.files['file']
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.static_folder, filename)

    # 디렉토리가 존재하는지 확인하고, 없으면 생성
    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    # 파일 저장
    file.save(filepath)
    return jsonify({'message': f'{filename} 파일이 {filepath}에 저장되었습니다.'}), 200



    
if __name__ == '__main__' :
    app.run(debug=True, port=5000, host='0.0.0.0')
