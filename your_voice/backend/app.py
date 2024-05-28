from flask import Flask, request, jsonify
from db.db import connect_db  # DB 커넥션 풀을 가져오는 함수 import
from flask_cors import CORS
from upload_and_predict import process_file
from werkzeug.utils import secure_filename
import os
import logging
from joblib import load
import librosa
import numpy as np
import joblib
from models.model import AudioModel  # AudioModel 클래스를 가져옵니다.

app = Flask(__name__, static_folder='static')
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route('/')
def home():
    return '<h>ㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠ</h>'

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



@app.route('/api/coughUpload', methods=['POST'])
def coughUpload():
    try:
        if 'file' not in request.files:
            return jsonify({'error': '파일이 전송되지 않았습니다.'}), 400

        file = request.files['file']
        filename = secure_filename(file.filename)
        static_folder_path = app.static_folder

        # 파일 처리 및 WAV 변환
        result, status_code = process_file({'file': file}, static_folder_path)
        if status_code != 200:
            logging.error(f"File processing failed with status {status_code}: {result}")
            return jsonify(result), status_code

        # 변��된 WAV 파일 경로
        wav_filepath = result['filepath']
        wav_file = wav_filepath

        # 로그 추가
        logging.info(f"Processed file saved at {wav_filepath}")

        # 모델 불러오기 및 예측
        # 모델 경로 업데이트
        loaded_model = joblib.load('./models/model2.joblib')
        prediction = loaded_model.process_audio_file(wav_file)  # 모델 사용 방식은 모델에 따라 다를 수 있음
        prediction = float(prediction)
        print(prediction)

        return jsonify({'prediction': prediction}), 200
    except Exception as e:
        logging.exception("An error occurred during file upload.")
        return jsonify({'error': str(e)}), 500


    
if __name__ == '__main__' :
    app.run(debug=True, port=5000, host='0.0.0.0')
