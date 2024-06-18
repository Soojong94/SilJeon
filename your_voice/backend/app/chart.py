from flask import Blueprint, request, jsonify
from db.db import connect_db
import datetime as dt

chart_bp = Blueprint("chart", __name__)

@chart_bp.route("/api/dailyChart", methods=["POST"])
def dailyChart():
    userId = request.json.get("userId")

    today = dt.datetime.now().date()
    week_ago = today - dt.timedelta(days=7)
    conn = connect_db()
    cursor = conn.cursor()

    # 해당 날짜의 모든 데이터 쿼리
    cursor.execute(
        """
        SELECT disease_id, input_date, cough_status
        FROM cough_status
        WHERE social_user_id = %s AND input_date >= %s
        ORDER BY input_date
        """,
        (userId, week_ago),
    )
    allData = cursor.fetchall()

    cursor.close()
    conn.close()

    # 데이터를 날짜별로 그룹화
    grouped_all_data = {}
    for disease_id, datetime_value, cough_status in allData:
        date_str = datetime_value.strftime("%Y-%m-%d")
        time_str = datetime_value.strftime("%H:%M:%S")
        if date_str not in grouped_all_data:
            grouped_all_data[date_str] = []
        grouped_all_data[date_str].append(
            {
                "disease_id": disease_id,
                "cough_status": cough_status,
                "time": time_str  # 시간을 추가
            }
        )
    
    # 각 날짜별 평균 데이터를 계산하고 JSON 응답에 추가
    daily_averages = []
    today_data = []
    for date_str, data in grouped_all_data.items():
        # 평균값 계산
        disease_sum = {}
        disease_count = {}

        for record in data:
            disease_id = record['disease_id']
            cough_status = record['cough_status']
            
            if disease_id not in disease_sum:
                disease_sum[disease_id] = 0
                disease_count[disease_id] = 0
            
            disease_sum[disease_id] += cough_status
            disease_count[disease_id] += 1

        average_data = [
            {
                "disease_id": disease_id,
                "average_cough_status": disease_sum[disease_id] / disease_count[disease_id]
            }
            for disease_id in disease_sum
        ]

        if date_str == today.strftime("%Y-%m-%d"):
            today_data = data

        daily_averages.append({
            "date": date_str,
            "average_data": average_data,
        })

    return jsonify({"daily_averages": daily_averages, "today_data": today_data}), 200

@chart_bp.route("/api/monthChart", methods=["POST"])
def monthChart():
    userId = request.json.get("userId")

    # 30일 전의 날짜를 계산
    thirty_days_ago = dt.datetime.now() - dt.timedelta(days=30)
    thirty_days_ago_str = thirty_days_ago.strftime("%Y-%m-%d")

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
        (userId, thirty_days_ago_str),
    )
    dailyChart = cursor.fetchall()
    cursor.close()
    conn.close()

    # 데이터를 날짜별로 그룹화
    grouped_data = {}
    for disease_id, date, average_cough_status in dailyChart:
        date_str = date.strftime("%Y-%m-%d")
        if date_str not in grouped_data:
            grouped_data[date_str] = []
        grouped_data[date_str].append(
            {"disease_id": disease_id, "average_cough_status": average_cough_status}
        )

    # 데이터 형식 맞추기
    daily_averages = [
        {"date": date_str, "data": data} for date_str, data in grouped_data.items()
    ]

    return jsonify(daily_averages), 200
