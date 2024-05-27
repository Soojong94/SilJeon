import os
from werkzeug.utils import secure_filename
from db.db import connect_db
# from ml_model import predict

def handle_upload(file, static_folder_path):
    if file.filename == '':
        return '파일 이름이 없습니다.', 400
    filename = secure_filename(file.filename)
    filepath = os.path.join(static_folder_path, filename)
    file.save(filepath)
    print(f"{filename} 파일이 {filepath}에 저장되었습니다.")  # 파일 저장 확인을 위한 프린트 문 추가
    return filepath

def process_file(file, static_folder_path):
    if 'file' not in file:
        return '파일이 전송되지 않았습니다.', 400
    saved_file = handle_upload(file['file'], static_folder_path)
    if isinstance(saved_file, tuple):  # 에러 메시지와 상태 코드를 반환하는 경우
        return saved_file

    # 머신러닝 모델로 결과 예측
    result = predict(saved_file)

    # 데이터베이스에 결과 저장
    # try:
    #     conn = connect_db()
    #     cursor = conn.cursor()
    #     cursor.execute("INSERT INTO results (score) VALUES (%s)", (result['score'],))
    #     conn.commit()
    # except Exception as e:
    #     print(f"DB 저장 중 오류 발생: {e}")
    #     return {'error': 'DB 처리 중 오류 발생'}, 500
    # finally:
    #     cursor.close()
    #     conn.close()

    return result, 200
