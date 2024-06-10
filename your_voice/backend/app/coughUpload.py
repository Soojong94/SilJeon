import os
from flask import Blueprint, request, jsonify
from app.upload_and_predict import process_file, load_model1, preprocess_audio
import logging
import numpy as np
from db.db import connect_db

coughUpload_bp = Blueprint("coughUpload", __name__)

# TensorFlow 모델 로드
model = load_model1()

@coughUpload_bp.route("/api/coughUpload", methods=["POST"])
def coughUpload():
    try:
        if "file" not in request.files:
            return jsonify({"error": "파일이 전송되지 않았습니다."}), 400

        file = request.files["file"]
        user_id = request.form.get('userId')  # 사용자 아이디 받기
        print(f"파일 이름: {file.filename}, 사용자 아이디: {user_id}")

        # 파일 처리 및 WAV 변환 (메모리에서 직접 처리)
        wav_data = process_file(file)
        if isinstance(wav_data, tuple):
            return wav_data

        # 전처리 과정 수정된 부분 반영
        mfcc = preprocess_audio(wav_data)

        # 모델 예측
        prediction = model.predict(mfcc)
        predicted_class = np.argmax(prediction, axis=1)
        class_labels = ['정상', '심부전', '천식', '코로나']
        predicted_label = class_labels[predicted_class[0]]
        
        # conn = connect_db()
        # cursor = conn.cursor()
        # cursor.execute("SELECT disease_id FROM cough_disease WHERE disease_name = %s", (predicted_label,))
        # disease_id = cursor.fetchone()
        
        # cursor.execute(
        #     "INSERT INTO cough_status (social_user_id, cough_status, input_date, disease_id) VALUES (%s, %s, NOW(), %s)",
        #     (user_id, predicted_label, disease_id)
        # )
        # conn.commit()

        # 각 클래스에 대한 예측 확률을 포함한 결과 반환
        prediction_probabilities = {class_labels[i]: float(prediction[0][i]) for i in range(len(class_labels))}
        
        return jsonify({"prediction": predicted_label, "probabilities": prediction_probabilities}), 200
    except Exception as e:
        logging.exception("An error occurred during file upload.")
        return jsonify({"error": str(e)}), 500
