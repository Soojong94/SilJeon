# login.py
from flask import Blueprint, request, jsonify, make_response
from db.db import connect_db
from google.oauth2 import id_token
from google.auth.transport import requests
import logging

login_bp = Blueprint('login', __name__)

@login_bp.route('/api/login', methods=['POST'])
def login():
    try:
        token = request.json.get('token')
        if not token:
            return jsonify({'error': '토큰이 제공되지 않았습니다.'}), 400

        # Google 토큰 검증
        id_info = id_token.verify_oauth2_token(token, requests.Request(), "848922845081-tubjkh6u80t5lleilc4r4bts1rrc1na6.apps.googleusercontent.com")
        
        # 유저 정보
        social_user_id = id_info.get('email')
        social_provider = id_info.get('iss')
        full_name = id_info.get('name')
        profile_picture_url = id_info.get('picture')
        
        # 데이터베이스 연결
        conn = connect_db()
        cursor = conn.cursor()
        
        # 유저 ID로 데이터베이스 조회
        cursor.execute("SELECT * FROM user_info WHERE social_user_id = %s", (social_user_id,))
        user = cursor.fetchone()
        
        if not user:
            cursor.execute("INSERT INTO user_info VALUES (%s, %s, %s, %s)", (social_user_id, social_provider, full_name, profile_picture_url))
            conn.commit()
          
        user_info = {'id': social_user_id, 'iss': social_provider, 'name': full_name, 'profile': profile_picture_url}
        response = make_response(jsonify({'user': user_info}))
        return response, 200

    except ValueError as e:
        logging.exception("Invalid token")
        return jsonify({'error': '유효하지 않은 토큰입니다.'}), 400
    except Exception as e:
        logging.exception("An error occurred during login")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
