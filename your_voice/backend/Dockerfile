# Python 3.9 베이스 이미지 사용
FROM python:3.9-slim

# ffmpeg 설치
RUN apt-get update && \
    apt-get install -y ffmpeg

# 작업 디렉토리 설정
WORKDIR /app

# 종속성 설치
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 복사
COPY . .

# Flask 애플리케이션을 Gunicorn으로 실행
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
