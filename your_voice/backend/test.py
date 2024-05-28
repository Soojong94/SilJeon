import subprocess
input_file = "C:/Users/d/Siljeon/SilJeon/your_voice/backend/data/기침.m4a"

def convert_to_wav(input_file):
    output_file = input_file.rsplit('.', 1)[0] + '.wav'  # 확장자를 .wav로 변경
    command = ['ffmpeg', '-i', input_file, output_file]
    subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print(f"Converted {input_file} to {output_file}")
    return output_file


# 사용 예시


convert_to_wav(input_file)

print(output_file)