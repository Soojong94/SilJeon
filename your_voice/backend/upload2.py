from pydub import AudioSegment
from io import BytesIO

def process_file(file, static_folder_path):
    if 'file' not in file:
        return '파일이 전송되지 않았습니다.', 400

    # 파일을 메모리에 로드
    file_data = BytesIO(file['file'].read())
    
    # 파일을 WAV로 변환
    wav_file = convert_to_wav(file_data, file['file'].filename)
    
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

def convert_to_wav(file_data, filename):
    # 파일 확장자 추출
    file_extension = filename.split('.')[-1]
    
    # 지원하는 파일 형식에 따라 적절한 포맷을 사용
    if file_extension in ["mp3", "m4a", "mp4", "webm"]:
        audio = AudioSegment.from_file(file_data, format=file_extension)
    else:
        return f"지원하지 않는 파일 형식: {file_extension}", 400
    
    # WAV로 변환
    wav_file = BytesIO()
    audio.export(wav_file, format='wav')
    wav_file.seek(0)  # 파일 포인터를 처음으로 이동
    return wav_file