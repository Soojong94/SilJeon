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

    # 4주 전의 날짜를 계산
    four_weeks_ago = datetime.datetime.now() - datetime.timedelta(days=28)
    four_weeks_ago_str = four_weeks_ago.strftime('%Y-%m-%d')

    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT disease_id, YEAR(input_date) as year, WEEK(input_date, 1) as week, AVG(cough_status) as average_cough_status
        FROM cough_status 
        WHERE social_user_id = %s AND input_date >= %s
        GROUP BY disease_id, YEAR(input_date), WEEK(input_date, 1)
        ORDER BY YEAR(input_date), WEEK(input_date, 1)
        """, 
        (userId, four_weeks_ago_str)
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

    # 데이터 형식 맞추기 및 주차 필터링
    filtered_weeks = sorted(grouped_data.keys())[-4:]  # 최근 4주를 선택
    weekly_averages = [{'week': week_str, 'data': grouped_data[week_str]} for week_str in filtered_weeks]

    return jsonify(weekly_averages), 200
