import os
from werkzeug.utils import secure_filename
from pydub import AudioSegment
from datetime import datetime


def handle_upload(file, static_folder_path):
    print("handle_upload 함수 호출됨")
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")  # 밀리초까지 포함
    filename = secure_filename(file.filename)
    unique_filename = f"{timestamp}_{filename}"
    original_filepath = os.path.join(static_folder_path, unique_filename)
    # 디렉토리가 존재하는지 확인하고, 없으면 생성
    os.makedirs(os.path.dirname(original_filepath), exist_ok=True)
    print(f"원본 파일 경로: {original_filepath}")
    try:
        file.save(original_filepath)
        print(f"파일 저장 완료: {original_filepath}")
    except Exception as e:
        print(f"파일 저장에 실패했습니다: {e}")
        raise
    
    # 이미 WAV로 변환된 파일인지 확인
    wav_filepath = original_filepath.rsplit(".", 1)[0] + ".wav"
    if os.path.exists(wav_filepath):
        print("이미 WAV로 변환된 파일입니다.")
        return wav_filepath
    
    # WAV 파일이 아니면 변환 작업 수행
    return convert_to_wav(original_filepath)



def process_file(file, static_folder_path):
    if "file" not in file:
        return "파일이 전송되지 않았습니다.", 400
    wav_filepath = handle_upload(file["file"], static_folder_path)
    if isinstance(wav_filepath, tuple):
        return wav_filepath

    return {"filepath": wav_filepath}, 200

def convert_to_wav(source_path):
    file_extension = source_path.split(".")[-1]
    if file_extension == "wav":
        return source_path  # 이미 wav 파일이면 변환 없이 경로 반환

    supported_formats = [
        "mp3", "m4a", "mp4", "webm", "ogg", "flac", "weba"
    ]
    if file_extension not in supported_formats:
        raise ValueError(f"지원하지 않는 파일 형식: {file_extension}")

    try:
        # 'weba' 파일은 'webm' 형식으로 처리
        if file_extension == "weba":
            audio = AudioSegment.from_file(source_path, format="webm")
        else:
            audio = AudioSegment.from_file(source_path, format=file_extension)
        
        target_path = source_path.rsplit(".", 1)[0] + ".wav"
        audio.export(target_path, format="wav")
        os.remove(source_path)  # 원본 파일 삭제
        return target_path
    except Exception as e:
        raise Exception(f"파일 변환 중 오류 발생: {e}")