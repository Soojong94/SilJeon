# Node.js 14 버전 베이스 이미지 사용
FROM node:14

# 작업 디렉토리 설정
WORKDIR /app

# 종속성 설치
COPY package.json package-lock.json ./
RUN npm install

# .env 파일 복사
COPY .env .

# 환경 변수 설정
ENV WDS_SOCKET_HOST=0.0.0.0
ENV WDS_SOCKET_PATH=/ws
ENV WDS_SOCKET_PORT=443

# 소스 코드 복사
COPY . .

# 프론트엔드 애플리케이션 빌드
RUN npm run build

# 포트 설정
EXPOSE 3000

# 애플리케이션 실행 (nginx 없이)
CMD ["npm", "start"]
