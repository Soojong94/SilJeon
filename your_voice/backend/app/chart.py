from flask import Blueprint, request, jsonify
from db.db import connect_db
import datetime

chart_bp = Blueprint("chart", __name__)

@chart_bp.route('/api/dailyChart', methods=["POST"])
def dailyChart():
    userId = request.json.get('userId')
    print('userId 1 : ', userId)
    
    week_ago = datetime.datetime.now() - datetime.timedelta(days=7)
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT disease_id, DATE(input_date) as date, AVG(cough_status) as average_cough_status
        FROM cough_status 
        WHERE social_user_id = %s AND input_date >= %s
        GROUP BY disease_id, DATE(input_date)
        ORDER BY DATE(input_date)
        """, 
        (userId, week_ago)
    )
    dailyChart = cursor.fetchall()

    cursor.close()
    conn.close()

    # 데이터를 날짜별로 그룹화
    grouped_data = {}
    for disease_id, date, average_cough_status in dailyChart:
        date_str = date.strftime('%Y-%m-%d')
        if date_str not in grouped_data:
            grouped_data[date_str] = []
        grouped_data[date_str].append({
            'disease_id': disease_id,
            'average_cough_status': average_cough_status
        })

    # 데이터 형식 맞추기
    daily_averages = [{'date': date_str, 'data': data} for date_str, data in grouped_data.items()]

    return jsonify(daily_averages), 200

@chart_bp.route('/api/weeklyChart', methods=["POST"])
def weeklyChart():
    userId = request.json.get('userId')
    print('userId 2 : ', userId)

    four_weeks_ago = datetime.datetime.now() - datetime.timedelta(weeks=4)
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT disease_id, YEAR(input_date) as year, WEEK(input_date) as week, AVG(cough_status) as average_cough_status
        FROM cough_status 
        WHERE social_user_id = %s AND input_date >= %s
        GROUP BY disease_id, YEAR(input_date), WEEK(input_date)
        ORDER BY YEAR(input_date), WEEK(input_date)
        """, 
        (userId, four_weeks_ago)
    )
    weeklyChart = cursor.fetchall()
    cursor.close()
    conn.close()

    # 데이터를 주별로 그룹화
    grouped_data = {}
    for disease_id, year, week, average_cough_status in weeklyChart:
        week_str = f"{year}년 {week}주차"
        if week_str not in grouped_data:
            grouped_data[week_str] = []
        grouped_data[week_str].append({
            'disease_id': disease_id,
            'average_cough_status': average_cough_status
        })

    # 데이터 형식 맞추기
    weekly_averages = [{'week': week_str, 'data': data} for week_str, data in grouped_data.items()]

    return jsonify(weekly_averages), 200
