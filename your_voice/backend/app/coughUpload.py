import os
from flask import Blueprint, request, jsonify
from app.upload_and_predict import process_file, load_model1, load_model2, preprocess_audio_model1, preprocess_audio_model2, is_audio_present
import logging
import numpy as np
from db.db import connect_db
from datetime import datetime
import io
from pydub import AudioSegment

coughUpload_bp = Blueprint("coughUpload", __name__)
# TensorFlow 모델 로드
disease_model = load_model1()
covid_model = load_model2()

# disease_model의 클래스 레이블 순서
disease_class_labels = ['정상', '천식', '심부전', 'others']

# 기존 시스템의 클래스 레이블 순서 (수정됨)
existing_class_labels = ['정상', '심부전', '천식', 'others']

# disease_model 클래스 매핑 생성
disease_class_mapping = {disease_class_labels.index(lbl): existing_class_labels.index(lbl) for lbl in disease_class_labels}

# covid_model의 클래스 레이블 순서
covid_class_labels = ['정상', '코로나', '코로나 의심']

@coughUpload_bp.route("/api/coughUpload", methods=["POST"])
def coughUpload():
    try:
        if "file" not in request.files or "analysisType" not in request.form:
            return jsonify({"error": "파일 또는 분석 유형이 전송되지 않았습니다."}), 400

        file = request.files["file"]
        analysis_type = request.form.get("analysisType")
        user_id = request.form.get("userId")  # 사용자 아이디 받기

        # 파일 처리 및 WAV 변환 (메모리에서 직접 처리)
        wav_data = process_file(file)
        if isinstance(wav_data, tuple):
            return wav_data

        # 오디오 데이터에 소리가 있는지 확인
        has_audio, wav_data = is_audio_present(wav_data)
        if not has_audio:
            return jsonify({"error": "업로드된 파일에 유의미한 소리가 없습니다."}), 400

        # 모델 선택 및 전처리
        if analysis_type == "covid":
            model = covid_model
            class_labels = covid_class_labels
            features = preprocess_audio_model2(wav_data)
            features = np.expand_dims(np.expand_dims(features, axis=-1), axis=-1)  # 모델이 기대하는 형태로 변환
        else:
            model = disease_model
            class_labels = existing_class_labels
            features = preprocess_audio_model1(wav_data)
            features = np.expand_dims(features, axis=-1)  # 모델이 기대하는 형태로 변환

        # 모델 예측
        prediction = model.predict(features)
        predicted_index = np.argmax(prediction, axis=1)[0]
        
        # 클래스 매핑 처리
        if analysis_type == "covid":
            predicted_label = class_labels[predicted_index]
            prediction_probabilities = {
                class_labels[i]: float(prediction[0][i]) for i in range(len(class_labels))
            }
        else:
            mapped_index = disease_class_mapping[predicted_index]
            predicted_label = existing_class_labels[mapped_index]
            prediction_probabilities = {
                existing_class_labels[i]: float(prediction[0][disease_class_mapping.get(i, i)]) for i in range(len(existing_class_labels))
            }

        # 진단 메시지 설정
        if analysis_type == "covid":
            if predicted_index == 1:
                diagnosis_message = "AI 분석 결과, 코로나 양성일 확률이 높습니다. 증상이 있다면 병원에 방문해 보시는 것을 권장 드립니다."
            elif predicted_index == 2:
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
                    continue

                disease_id = disease_id_tuple[0]


                # 무조건 새로운 레코드 삽입
                cursor.execute(
                    """
                    INSERT INTO cough_status (social_user_id, cough_status, input_date, disease_id)
                    VALUES (%s, %s, NOW(), %s)
                    """,
                    (user_id, probability, disease_id),
                )

            conn.commit()

            # 예측된 질병의 진단 내용 가져오기
            cursor.execute(
                """
                SELECT disease_diagnosis
                FROM disease_diagnosis
                WHERE disease_id = %s
                """,
                (mapped_index + 1,)  # mapped_index는 0부터 시작하므로 +1
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
