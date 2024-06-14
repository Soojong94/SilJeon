# Node.js 14 버전 베이스 이미지 사용
FROM node:14

# 작업 디렉토리 설정
WORKDIR /app

# 종속성 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 프론트엔드 애플리케이션 빌드
RUN npm run build

# Nginx 설치 및 설정
RUN apt-get update && apt-get install -y nginx
COPY default /etc/nginx/sites-available/default
COPY nginx.conf /etc/nginx/nginx.conf
COPY ssl-config /etc/letsencrypt

# 포트 설정
EXPOSE 80
EXPOSE 443

# Nginx 서버 실행
CMD ["nginx", "-g", "daemon off;"]
