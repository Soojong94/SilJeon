import os
from werkzeug.utils import secure_filename
from db.db import connect_db
# from ml_model import predict  # 머신러닝 모델 import
from pydub import AudioSegment

def handle_upload(file, static_folder_path):
    # 파일을 저장할 경로 생성
    filepath = os.path.join(static_folder_path, file.filename)
    
    # 디렉토리가 존재하는지 확인하고, 없으면 생성
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    # 파일 저장
    file.save(filepath)
    print(f"{file.filename} 파일이 {filepath}에 저장되었습니다.")  # 파일 저장 확인을 위한 프린트 문 추가
    return filepath

def process_file(file, static_folder_path):
    if 'file' not in file:
        return '파일이 전송되지 않았습니다.', 400
    saved_file = handle_upload(file['file'], static_folder_path)
    if isinstance(saved_file, tuple):  # 에러 메시지와 상태 코드를 반환하는 경우
        return saved_file

    # 파일을 WAV로 변환
    wav_file = convert_to_wav(saved_file)
    
    # 머신러닝 모델로 결과 예측
    result = predict(wav_file)
    print(result)

    # 데이터베이스에 결과 저장
    try:
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO results (score) VALUES (%s)", (result['score'],))
        conn.commit()
    except Exception as e:
        print(f"DB 저장 중 오류 발생: {e}")
        return {'error': 'DB 처리 중 오류 발생'}, 500
    finally:
        cursor.close()
        conn.close()

    return result, 200

def convert_to_wav(source_path):
    # 파일 확장자 추출
    file_extension = source_path.split('.')[-1]
    
    # 지원하는 파일 형식에 따라 적절한 포맷을 사용
    if file_extension in ["mp3", "m4a", "mp4", "webm"]:
        audio = AudioSegment.from_file(source_path, format=file_extension)
    else:
        return f"지원하지 않는 파일 형식: {file_extension}", 400
    
    target_path = source_path.rsplit('.', 1)[0] + '.wav'
    audio.export(target_path, format='wav')
    print(f"{source_path} 파일이 {target_path}로 변환되었습니다.")
    return target_path

def convert_to_wav(source_path):
    # 파일 확장자 추출
    file_extension = source_path.split('.')[-1]
    
    # 지원하는 파일 형식에 따라 적절한 포맷을 사용
    if file_extension in ["mp3", "m4a", "mp4", "webm"]:
        audio = AudioSegment.from_file(source_path, format=file_extension)
    else:
        return f"지원하지 않는 파일 형식: {file_extension}", 400
    
    target_path = source_path.rsplit('.', 1)[0] + '.wav'
    audio.export(target_path, format='wav')
    print(f"{source_path} 파일이 {target_path}로 변환되었습니다.")
    return target_path