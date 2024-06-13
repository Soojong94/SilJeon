from flask import Blueprint, request, jsonify
from db.db import connect_db
import logging

resetChart_bp = Blueprint('resetChart', __name__)

@resetChart_bp.route('/api/resetChart', methods=["POST"])
def resetChart():
    try:
        user_id = request.json.get('userId')
        if not user_id:
            return jsonify({"error": "유저 아이디가 전송되지 않았습니다."}), 400

        conn = connect_db()
        cursor = conn.cursor()

        # 사용자 관련 cough_status 데이터 삭제
        cursor.execute("DELETE FROM cough_status WHERE social_user_id = %s", (user_id,))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "차트 초기화가 완료되었습니다."}), 200
    except Exception as e:
        logging.exception("An error occurred during chart reset.")
        return jsonify({"error": str(e)}), 500
