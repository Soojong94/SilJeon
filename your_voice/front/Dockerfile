# Node.js 14 버전 베이스 이미지 사용
FROM node:14

# 작업 디렉토리 설정
WORKDIR /app

# 종속성 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 리액트 개발 서버 실행
CMD ["npm", "start"]
