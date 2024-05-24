# 베이스 이미지로 Python 3.9 사용
FROM python:3.9-slim

# 작업 디렉토리 설정
WORKDIR /app

# 종속성 설치
COPY requirements.txt requirements.txt

RUN pip install --no-cache-dir -r requirements.txt


# 소스 코드 복사
COPY . .

# 컨테이너 실행 시 Flask 서버 실행
CMD ["python", "app.py"]
