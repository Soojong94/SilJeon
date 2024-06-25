# 실전 프로젝트

## MFCC와 CRNN을 활용한 기침 소리 분석 서비스(5인 프로젝트)

- 현재 배포 중지

ppt
https://www.miricanvas.com/v/137qox2

### 프로젝트 기간
프로젝트 기간 : 2024 / 05 / 22 ~ 2024 / 06 / 20

프로젝트 내용 : MFCC와 CRNN을 활용한 기침 소리 분석 서비스(딥러닝)

### 사용 언어

#### 프론트 엔드

<img src="https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white"><img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"><img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"><img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">

#### 백엔드

<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white">

#### 데이터베이스

<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">

#### 배포

<img src="https://img.shields.io/badge/Amazon%20EC2-FF9900?style=for-the-badge&logo=Amazon%20EC2&logoColor=white"><img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"><img src="https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white"><img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=Ubuntu&logoColor=white"/>




### 개발 과정

#### scrum 1

- UI를 통해 녹음파일 업로드 or 실시간 녹음

- 소리의 특정값 frequency 보여주기

- UI로 output 출력

#### scrum 2

- MFCC 활용한 데이터 모델링

- DB 연결

- 소리 업로드 받으면, 모델링된 데이터와 비교 후 결과 출력

#### scrum 3

- 기침 소리 실시간 녹음

- 월간, 주간 기침 상태 차트 조회

- 배포

#### scrum 4

- UX, UI 개선

- 서비스 고도화

- 모델 정확도 개선

### 트러블 슈팅
- 개발자 서버와 배포용 서버의 차이에서 오는 어려움, 특히 배포하는 과정에서 구글 로그인 관련 정책 통과를 해야하는데 nginx와 letsEncrypt 보안 서비스를 이용하여 해결
- EKS를 이용해보고자 했는데, 요금이 비싼 것을 확인하고 서비스 볼륨에 맞춰 EC2 인스턴스를 우분투 환경에서 운용하여 배포 진행
