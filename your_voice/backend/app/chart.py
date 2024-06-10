from flask import Blueprint, request, jsonify
from db.db import connect_db
import datetime
from math import ceil

chart_bp = Blueprint("chart", __name__)

@chart_bp.route('/api/dailyChart', methods=["POST"])
def dailyChart():
    userId = request.json.get('id')
    print('userId 1 : ', userId)
    
    week_ago = datetime.datetime.now() - datetime.timedelta(days=7)
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT disease_id, cough_status, input_date FROM cough_status WHERE social_user_id = %s AND input_date >= %s", 
        (userId, week_ago)
    )
    dailyChart = cursor.fetchall()
    print('일간 출력 : ', dailyChart)
    cursor.close()
    conn.close()

    # 데이터를 날짜별로 그룹화
    grouped_data = {}
    for record in dailyChart:
        disease_id, cough_status, input_date = record
        date_str = input_date.strftime('%Y-%m-%d')
        if date_str not in grouped_data:
            grouped_data[date_str] = {}
        if disease_id not in grouped_data[date_str]:
            grouped_data[date_str][disease_id] = []
        grouped_data[date_str][disease_id].append(cough_status)

    # 날짜별 평균 계산 및 정렬
    daily_averages = []
    for date_str, diseases in grouped_data.items():
        date_data = {'date': date_str, 'data': []}
        for disease_id, statuses in diseases.items():
            average_status = sum(statuses) / len(statuses)
            date_data['data'].append({
                'disease_id': disease_id,
                'average_cough_status': average_status
            })
        daily_averages.append(date_data)

    # 날짜별로 정렬 (빠른 날짜가 맨 위로 오도록)
    daily_averages = sorted(daily_averages, key=lambda x: x['date'])

    print('Grouped data: ', daily_averages)
    return jsonify(daily_averages), 200

@chart_bp.route('/api/weeklyChart', methods=["POST"])
def weeklyChart():
    userId = request.json.get('id')
    print('userId 2 : ', userId)

    four_weeks_ago = datetime.datetime.now() - datetime.timedelta(weeks=4)
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT disease_id, cough_status, input_date FROM cough_status WHERE social_user_id = %s AND input_date >= %s", 
        (userId, four_weeks_ago)
    )
    weeklyChart = cursor.fetchall()
    cursor.close()
    conn.close()
    print('주간 출력 : ', weeklyChart)

    # 데이터를 주별로 그룹화
    grouped_data = {}
    for record in weeklyChart:
        disease_id, cough_status, input_date = record
        year = input_date.year
        week_of_year = input_date.strftime('%U')
        week_str = f"{year}년 {week_of_year}주차"
        if week_str not in grouped_data:
            grouped_data[week_str] = {}
        if disease_id not in grouped_data[week_str]:
            grouped_data[week_str][disease_id] = []
        grouped_data[week_str][disease_id].append(cough_status)

    # 주별 평균 계산 및 주차별 정렬
    weekly_averages = []
    for week_str, diseases in grouped_data.items():
        week_data = {'week': week_str, 'data': []}
        for disease_id, statuses in diseases.items():
            average_status = sum(statuses) / len(statuses)
            week_data['data'].append({
                'disease_id': disease_id,
                'average_cough_status': average_status
            })
        weekly_averages.append(week_data)

    # 주차별로 정렬 (빠른 주차가 맨 위로 오도록)
    weekly_averages = sorted(weekly_averages, key=lambda x: datetime.datetime.strptime(x['week'], '%Y년 %U주차'))

    print('주간 평균 출력 : ', weekly_averages)
    return jsonify(weekly_averages), 200
