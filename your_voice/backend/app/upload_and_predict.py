import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
from werkzeug.utils import secure_filename
from pydub import AudioSegment
import io
import tensorflow as tf
import numpy as np
import librosa
import soundfile as sf

def process_file(file):
    print("process_file 함수 호출됨")

    # 파일을 메모리로 읽어들임
    file_bytes = io.BytesIO(file.read())
    file_extension = secure_filename(file.filename).split(".")[-1].lower()

    # 파일 확장자가 WAV인 경우 바로 반환
    if file_extension == "wav":
        return file_bytes

    # WAV 파일이 아니면 변환 작업 수행
    return convert_to_wav(file_bytes, file_extension)

def convert_to_wav(file_bytes, file_extension):
    supported_formats = [
        "mp3", "m4a", "mp4", "webm", "ogg", "flac", "weba"
    ]
    if file_extension not in supported_formats:
        raise ValueError(f"지원하지 않는 파일 형식: {file_extension}")

    try:
        # 'weba' 파일은 'webm' 형식으로 처리
        if file_extension == "weba":
            audio = AudioSegment.from_file(file_bytes, format="webm")
        else:
            audio = AudioSegment.from_file(file_bytes, format=file_extension)
        
        wav_bytes = io.BytesIO()
        audio.export(wav_bytes, format="wav")
        wav_bytes.seek(0)  # 시작 위치로 되돌림
        print(f"WAV 파일 변환 완료")
        return wav_bytes
    except Exception as e:
        raise Exception(f"파일 변환 중 오류 발생: {e}")

def preprocess_audio(file_bytes, duration=5, sr=44100, n_mfcc=20, n_fft=2048, hop_length=512):
    print(f"preprocess_audio 함수 호출됨")
    audio_data, samplerate = sf.read(file_bytes)
    
    # 입력 신호 길이가 n_fft보다 짧은 경우 처리하지 않음
    if len(audio_data) < n_fft:
        raise ValueError(f"입력 신호 길이가 너무 짧습니다: {len(audio_data)}")

    # 오디오 데이터를 모노로 변환
    if audio_data.ndim == 2:
        audio_data = librosa.to_mono(audio_data.T)

    audio = librosa.resample(audio_data, orig_sr=samplerate, target_sr=sr)
    mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=n_mfcc, n_fft=n_fft, hop_length=hop_length)
    
    # mfcc 배열의 차원 확인
    if mfcc.ndim != 2:
        raise ValueError(f"MFCC 배열의 차원이 올바르지 않습니다: {mfcc.ndim}차원")

    fixed_shape = [n_mfcc, 431]  # 모델 입력 차원에 맞춰 수정
    if mfcc.shape[1] < fixed_shape[1]:
        pad_width = fixed_shape[1] - mfcc.shape[1]
        mfcc = np.pad(mfcc, ((0, 0), (0, pad_width)), mode='constant')
    elif mfcc.shape[1] > fixed_shape[1]:
        mfcc = mfcc[:, :fixed_shape[1]]

    return mfcc

def load_model1():
    model_path = 'SilJeon/your_voice/backend/models/my_model.keras'
    try:
        model = tf.keras.models.load_model(model_path)
        print("모델 로딩 성공")
        return model
    except Exception as e:
        raise RuntimeError("모델을 로드하는 중 오류 발생") from e
