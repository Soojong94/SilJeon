import os
from werkzeug.utils import secure_filename
from db.db import connect_db
from pydub import AudioSegment
from datetime import datetime
import subprocess

def handle_upload(file, static_folder_path):
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    filename = secure_filename(file.filename)
    unique_filename = f"{timestamp}_{filename}"
    original_filepath = os.path.join(static_folder_path, unique_filename)
    print(f"원본 파일 경로: {original_filepath}")
    try:
        file.save(original_filepath)
        print(f"파일이 성공적으로 저장되었습니다: {original_filepath}")
    except Exception as e:
        print(f"파일 저장에 실패했습니다: {e}")
        raise
    wav_filepath = convert_to_wav(original_filepath)
    return wav_filepath

def process_file(file, static_folder_path):
    if 'file' not in file:
        return '파일이 전송되지 않았습니다.', 400
    wav_filepath = handle_upload(file['file'], static_folder_path)
    if isinstance(wav_filepath, tuple):
        return wav_filepath

    return {'filepath': wav_filepath}, 200

def convert_to_wav(source_path):
    try:
        file_extension = source_path.split('.')[-1]
        supported_formats = ["mp3", "m4a", "mp4", "webm", "ogg", "flac", "wav", "weba"]  # 'weba' added
        if file_extension in supported_formats:
            if file_extension in ["webm", "weba"]:  # Handle 'webm' and 'weba' files
                target_path = source_path.rsplit('.', 1)[0] + '.wav'
                command = ['ffmpeg', '-i', source_path, target_path]
                subprocess.run(command, check=True)
            else:
                audio = AudioSegment.from_file(source_path, format=file_extension)
                target_path = source_path.rsplit('.', 1)[0] + '.wav'
                audio.export(target_path, format='wav')
            os.remove(source_path)  # Delete original file
            return target_path
    except Exception as e:
        raise Exception(f"Error occurred during file conversion: {e}")

def convert_weba_to_wav(weba_filepath, output_wav_filepath):
    command = ['ffmpeg', '-i', weba_filepath, output_wav_filepath]
    subprocess.run(command, check=True)