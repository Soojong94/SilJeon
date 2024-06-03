import os
from flask import Blueprint, request, jsonify
from app.upload_and_predict import process_file, load_model1, preprocess_audio
import logging
import numpy as np

coughUpload_bp = Blueprint('coughUpload', __name__)

# TensorFlow 모델 로드
model = load_model1()

@coughUpload_bp.route('/api/coughUpload', methods=['POST'])
def coughUpload():
    try:
        if 'file' not in request.files:
            return jsonify({'error': '파일이 전송되지 않았습니다.'}), 400

        file = request.files['file']

        # 파일 처리 및 WAV 변환 (메모리에서 직접 처리)
        wav_data = process_file(file)
        if isinstance(wav_data, tuple):
            return wav_data

        # 모델 불러오기 및 예측
        mfcc = preprocess_audio(wav_data)
        mfcc = np.expand_dims(mfcc, axis=0)  # Add batch dimension
        mfcc = np.expand_dims(mfcc, axis=-1)  # Add channel dimension if necessary

        prediction = model.predict(mfcc)  # 수정: mfcc 데이터를 사용
        prediction = float(prediction[0][0])  # 수정: prediction 결과가 배열 형태일 수 있으므로 첫 번째 요소를 float로 변환
        print('모델 예측 결과에용 : ',prediction)

        return jsonify({'prediction': prediction}), 200
    except Exception as e:
        logging.exception("An error occurred during file upload.")
        return jsonify({'error': str(e)}), 500
