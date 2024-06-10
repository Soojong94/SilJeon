from flask import Blueprint, request, jsonify
from db.db import connect_db
import datetime

chart_bp = Blueprint("chart", __name__)

@chart_bp.route('/api/dailyChart', methods=["POST"])
def dailyChart():
    userId = request.json.get('id')
    print('userId 1 : ', userId )
    
    week_ago = datetime.datetime.now() - datetime.timedelta(days=7)
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM cough_status WHERE social_user_id = %s AND input_date >= %s", 
        (userId, week_ago)
    )
    dailyChart = cursor.fetchall()
    print('일간 출력 : ', dailyChart)
    cursor.close()
    conn.close()

    return jsonify({"chart1": "chart1"}), 200


@chart_bp.route('/api/weeklyChart', methods=["POST"])
def weeklyChart():
    userId = request.json.get('id')
    print('userId 2 : ', userId )

    four_weeks_ago = datetime.datetime.now() - datetime.timedelta(weeks=4)
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM cough_status WHERE social_user_id = %s AND input_date >= %s", 
        (userId, four_weeks_ago)
    )
    weeklyChart = cursor.fetchall()
    cursor.close()
    conn.close()
    print('주간 출력 : ', weeklyChart)
    
    
    return jsonify({"chart2": "chart2"}), 200


