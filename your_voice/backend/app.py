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

# 모델 로드
model_path = os.path.join(app.root_path, './models/model3.joblib')
model = load(model_path)


@app.route('/api/test')
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
    return jsonify({'data': data}), 200

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

        # 변된 WAV 파일 경로
        wav_filepath = result['filepath']
        wav_file = wav_filepath

        # 로그 추가
        logging.info(f"Processed file saved at {wav_filepath}")

        # 모델 불러오기 및 예측
        audio_model = load(model_path)  # model3.joblib에서 모델 로드
        prediction = audio_model.process_audio_file(wav_file)  # 오디오 파일 처리
        prediction = float(prediction)
        print(prediction)

        return jsonify({'prediction': prediction}), 200
    except Exception as e:
        logging.exception("An error occurred during file upload.")
        return jsonify({'error': str(e)}), 500


    
if __name__ == '__main__' :
    app.run(debug=True, port=5000, host='0.0.0.0')
