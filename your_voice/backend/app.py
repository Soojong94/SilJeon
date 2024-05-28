from flask import Flask, request, jsonify
from db.db import connect_db  # DB 커넥션 풀을 가져오는 함수 import
from flask_cors import CORS
from upload_and_predict import process_file

app = Flask(__name__)
CORS(app)

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
    result, status = process_file(request.files, app.static_folder)
    if isinstance(result, dict) and 'error' in result:
        return jsonify(result), status
    return jsonify(result), status



    
if __name__ == '__main__' :
    app.run(debug=True, port=5000, host='0.0.0.0')
