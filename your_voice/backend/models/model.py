import librosa
import numpy as np
import joblib

class AudioModel:
    def __init__(self):
        self.sample_rate = 44100

    def process_audio_file(self, wav_file):
        audio_data, original_sample_rate = librosa.load(wav_file, sr=None)
        if original_sample_rate != self.sample_rate:
            audio_data = librosa.resample(audio_data, orig_sr=original_sample_rate, target_sr=self.sample_rate)

        # 주파수 대역 설정
        start_freq = 1000
        end_freq = 2000
        start_idx = int(start_freq * len(audio_data) / self.sample_rate)
        end_idx = int(end_freq * len(audio_data) / self.sample_rate)
        extracted_audio = audio_data[start_idx:end_idx]

        return extracted_audio.mean()

# 모델 인스턴스 생성
model_instance = AudioModel()

# 모델을 파일로 저장
# joblib.dump(model_instance, 'model3.joblib')
