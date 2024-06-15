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

# 포트 설정
EXPOSE 3000

# 애플리케이션 실행 (nginx 없이)
CMD ["npm", "start"]
