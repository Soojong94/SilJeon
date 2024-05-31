from flask import Blueprint, request, jsonify
from app.upload_and_predict import process_file
import logging
import os
from joblib import load
from models.model import AudioModel  # AudioModel 클래스를 가져옵니다.

coughUpload_bp = Blueprint('coughUpload', __name__)

# 모델 로드
model_path = os.path.join(os.path.dirname(__file__), '../models/model3.joblib')
model = load(model_path)


@coughUpload_bp.route('/api/coughUpload', methods=['POST'])
def coughUpload():
    try:
        if 'file' not in request.files:
            return jsonify({'error': '파일이 전송되지 않았습니다.'}), 400

        file = request.files['file']
        static_folder_path = os.path.join(os.path.dirname(__file__), '../static')

        # 파일 처리 및 WAV 변환
        result, status_code = process_file({'file': file}, static_folder_path)
        if status_code != 200:
            return jsonify(result), status_code

        # 변환된 WAV 파일 경로
        wav_filepath = result['filepath']

        # 모델 불러오기 및 예측
        prediction = model.process_audio_file(wav_filepath)  # 오디오 파일 처리
        prediction = float(prediction)

        return jsonify({'prediction': prediction}), 200
    except Exception as e:
        logging.exception("An error occurred during file upload.")
        return jsonify({'error': str(e)}), 500