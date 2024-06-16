import os
from flask import Blueprint, request, jsonify
from app.upload_and_predict import process_file, load_model1, load_model2, preprocess_audio_model1, preprocess_audio_model2
import logging
import numpy as np
from db.db import connect_db
from datetime import datetime

coughUpload_bp = Blueprint("coughUpload", __name__)
# TensorFlow 모델 로드
disease_model = load_model1()
covid_model = load_model2()

@coughUpload_bp.route("/api/coughUpload", methods=["POST"])
def coughUpload():
    try:
        if "file" not in request.files or "analysisType" not in request.form:
            return jsonify({"error": "파일 또는 분석 유형이 전송되지 않았습니다."}), 400

        file = request.files["file"]
        analysis_type = request.form.get("analysisType")
        user_id = request.form.get("userId")  # 사용자 아이디 받기
        print(f"파일 이름: {file.filename}, 사용자 아이디: {user_id}, 분석 유형: {analysis_type}")

        # 파일 처리 및 WAV 변환 (메모리에서 직접 처리)
        wav_data = process_file(file)
        if isinstance(wav_data, tuple):
            return wav_data

        # 모델 선택 및 전처리
        if analysis_type == "covid":
            model = covid_model
            class_labels = ["정상", "코로나", "코로나 의심"]
            features = preprocess_audio_model2(wav_data)
            features = np.expand_dims(np.expand_dims(features, axis=-1), axis=-1)  # 모델이 기대하는 형태로 변환
        else:
            model = disease_model
            class_labels = ["정상", "심부전", "천식", "코로나"]
            features = preprocess_audio_model1(wav_data)
            features = np.expand_dims(features, axis=-1)  # 모델이 기대하는 형태로 변환

        # 모델 예측
        prediction = model.predict(features)
        predicted_class = np.argmax(prediction, axis=1)[0]
        predicted_label = class_labels[predicted_class]
        prediction_probabilities = {
            class_labels[i]: float(prediction[0][i]) for i in range(len(class_labels))
        }

        # 예측 결과 콘솔 출력
        print(f"Predicted class: {predicted_class} ({predicted_label})")
        print(f"Prediction probabilities: {prediction_probabilities}")

        # 진단 메시지 설정
        if analysis_type == "covid":
            if predicted_class == 1:
                diagnosis_message = "AI 분석 결과, 코로나 양성일 확률이 높습니다. 증상이 있다면 병원에 방문해 보시는 것을 권장 드립니다."
            elif predicted_class == 2:
                diagnosis_message = "AI 분석 결과, 코로나가 의심될 확률이 있습니다. 증상이 있다면 병원에 방문해 보시는 것을 권장 드립니다."
            else:
                diagnosis_message = "AI 분석 결과, 건강한 기침 소리입니다."
        else:
            diagnosis_message = ""

        # 질병 분석인 경우 데이터베이스에 결과 저장 및 진단 메시지 가져오기
        if analysis_type == "disease":
            conn = connect_db()
            cursor = conn.cursor()

            current_date = datetime.now().strftime("%Y-%m-%d")

            for disease_name, probability in prediction_probabilities.items():
                cursor.execute(
                    "SELECT disease_id FROM cough_disease WHERE disease_name = %s",
                    (disease_name,),
                )
                disease_id_tuple = cursor.fetchone()

                if not disease_id_tuple:
                    print(f"{disease_name}에 해당하는 질병번호를 찾을 수 없습니다.")
                    continue

                disease_id = disease_id_tuple[0]
                print("질병번호 : ", disease_id)

                # 무조건 새로운 레코드 삽입
                print(f"Inserting new record: user_id={user_id}, probability={probability}, disease_id={disease_id}")
                cursor.execute(
                    """
                    INSERT INTO cough_status (social_user_id, cough_status, input_date, disease_id)
                    VALUES (%s, %s, NOW(), %s)
                    """,
                    (user_id, probability, disease_id),
                )
                print(f"Insert executed: {cursor.rowcount} rows affected")

            conn.commit()
            print("Transaction committed")

            # 예측된 질병의 진단 내용 가져오기
            cursor.execute(
                """
                SELECT disease_diagnosis
                FROM disease_diagnosis
                WHERE disease_id = %s
                """,
                (predicted_class + 1,)  # predicted_class는 0부터 시작하므로 +1
            )
            diagnosis_result = cursor.fetchone()
            diagnosis_message = diagnosis_result[0] if diagnosis_result else "진단 내용을 찾을 수 없습니다."

            cursor.close()
            conn.close()

        return (
            jsonify(
                {
                    "prediction": predicted_label,
                    "probabilities": prediction_probabilities,
                    "diagnosis_message": diagnosis_message,
                }
            ),
            200,
        )
    except Exception as e:
        logging.exception("An error occurred during file upload.")
        return jsonify({"error": str(e)}), 500
