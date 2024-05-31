from flask import Flask, request, jsonify, make_response
from db.db import connect_db  # DB 커넥션 풀을 가져오는 함수 import
from flask_cors import CORS
import os
import logging
from joblib import load
from google.oauth2 import id_token
from google.auth.transport import requests
import secrets
from models.model import AudioModel

app = Flask(__name__, static_folder="static")
CORS(
    app,
    supports_credentials=True,
    resources={r"/api/*": {"origins": "http://localhost:3000"}},
)
secret_key = secrets.token_hex(32)
app.secret_key = secret_key
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_COOKIE_HTTPONLY"] = False
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = False  # 로컬 환경에서 사용
Session(app)


# 모델 로드
model_path = os.path.join(app.root_path, "./models/model3.joblib")
model = load(model_path)


@app.route("/api/test")
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
    return jsonify({"data": data}), 200


@app.route("/api/coughUpload", methods=["POST"])
def coughUpload():
    try:
        if "file" not in request.files:
            return jsonify({"error": "파일이 전송되지 않았습니다."}), 400

        file = request.files["file"]
        static_folder_path = app.static_folder

        # 파일 처리 및 WAV 변환
        result, status_code = process_file({"file": file}, static_folder_path)
        if status_code != 200:
            return jsonify(result), status_code

        # 변환된 WAV 파일 경로
        wav_filepath = result["filepath"]

        # 모델 불러오기 및 예측
        prediction = model.process_audio_file(wav_filepath)  # 오디오 파일 처리
        prediction = float(prediction)

        return jsonify({"prediction": prediction}), 200
    except Exception as e:
        logging.exception("An error occurred during file upload.")
        return jsonify({"error": str(e)}), 500


@app.route("/api/login", methods=["POST"])
def login():
    try:
        token = request.json.get("token")

        if not token:
            return jsonify({"error": "토큰이 제공되지 않았습니다."}), 400

        # Google 토큰 검증
        id_info = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            "848922845081-tubjkh6u80t5lleilc4r4bts1rrc1na6.apps.googleusercontent.com",
        )

        # 유저 정보
        social_user_id = id_info.get("email")
        social_provider = id_info.get("iss")
        full_name = id_info.get("name")
        profile_picture_url = id_info.get("picture")

        # 데이터베이스 연결
        conn = connect_db()
        cursor = conn.cursor()

        # 유저 ID로 데이터베이스 조회
        cursor.execute(
            "SELECT * FROM user_info WHERE social_user_id = %s", (social_user_id,)
        )
        user = cursor.fetchone()

        if not user:
            cursor.execute(
                "INSERT INTO user_info VALUES (%s, %s, %s, %s)",
                (social_user_id, social_provider, full_name, profile_picture_url),
            )
            conn.commit()

            session["user_info"] = {
                "id": social_user_id,
                "iss": social_provider,
                "name": full_name,
                "profile": profile_picture_url,
            }
            response = make_response(
                jsonify(
                    {
                        "message": "새로운 사용자 등록 및 로그인 성공",
                        "user": {
                            "id": social_user_id,
                            "name": social_provider,
                            "profile": profile_picture_url,
                        },
                    }
                )
            )
            response.set_cookie(
                "session", session.sid, domain="localhost", samesite="None", secure=True
            )
            return response, 200
        else:
            session["user_info"] = {
                "id": user[0],
                "iss": user[1],
                "name": user[2],
                "profile": user[3],
            }
            print("Session value:", session.get("user_info"))  # 세션 값을 출력
            response = make_response(
                jsonify(
                    {
                        "message": "로그인 성공",
                        "user": {"id": user[0], "name": user[2], "profile": user[3]},
                    }
                )
            )
            response.set_cookie(
                "session", session.sid, domain="localhost", samesite="None", secure=True
            )
            return response, 200
    except ValueError as e:
        logging.exception("Invalid token")
        return jsonify({"error": "유효하지 않은 토큰입니다."}), 400
    except Exception as e:
        logging.exception("An error occurred during login")
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@app.route("/api/userInfo", methods=["GET"])
def user_info():
    user_info = session.get("user_info")
    print("session : ", user_info)
    if user_info:
        return jsonify(user_info), 200
    else:
        return jsonify({"error": "세션에 사용자 정보가 없습니다."}), 404


@app.route("/api/logout")
def logout():
    session.pop("user_info")
    return jsonify({"message": "로그아웃 성공 수고링"})


if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")
