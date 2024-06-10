import os
from flask import Blueprint, request, jsonify
from app.upload_and_predict import process_file, load_model1, preprocess_audio
import logging
import numpy as np
from db.db import connect_db
from datetime import datetime

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
        prediction_probabilities = {class_labels[i]: float(prediction[0][i]) for i in range(len(class_labels))}

        conn = connect_db()
        cursor = conn.cursor()

        current_date = datetime.now().strftime('%Y-%m-%d')

        for disease_name, probability in prediction_probabilities.items():
            cursor.execute("SELECT disease_id FROM cough_disease WHERE disease_name = %s", (disease_name,))
            disease_id_tuple = cursor.fetchone()

            if disease_id_tuple:
                disease_id = disease_id_tuple[0]
                print('질병번호 : ', disease_id)
            else:
                print(f'{disease_name}에 해당하는 질병번호를 찾을 수 없습니다.')
                continue

            cursor.execute(
                """
                SELECT status_idx FROM cough_status
                WHERE social_user_id = %s AND DATE(input_date) = %s AND disease_id = %s
                """,
                (user_id, current_date, disease_id)
            )
            existing_record = cursor.fetchone()

            if existing_record:
                status_idx = existing_record[0]
                cursor.execute(
                    """
                    UPDATE cough_status
                    SET cough_status = %s, input_date = NOW()
                    WHERE status_idx = %s
                    """,
                    (probability, status_idx)
                )
            else:
                cursor.execute(
                    """
                    INSERT INTO cough_status (social_user_id, cough_status, input_date, disease_id)
                    VALUES (%s, %s, NOW(), %s)
                    """,
                    (user_id, probability, disease_id)
                )

        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"prediction": predicted_label, "probabilities": prediction_probabilities}), 200
    except Exception as e:
        logging.exception("An error occurred during file upload.")
        return jsonify({"error": str(e)}), 500
