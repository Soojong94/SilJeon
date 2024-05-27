from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from pydub import AudioSegment

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    # Convert webm to wav
    if filename.endswith('.webm'):
        audio = AudioSegment.from_file(file_path, format="webm")
        wav_filename = filename.rsplit('.', 1)[0] + '.wav'
        wav_path = os.path.join(app.config['UPLOAD_FOLDER'], wav_filename)
        audio.export(wav_path, format="wav")
        os.remove(file_path)  # Remove the original webm file

    return jsonify({"success": True, "filename": wav_filename})

if __name__ == '__main__':
    app.run(debug=True)
