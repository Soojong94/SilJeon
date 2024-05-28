import React, { useState, useRef } from 'react';
import axios from 'axios'; // axios를 import합니다.
import './bothload.css'

const CoughUd = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [message, setMessage] = useState('');
    const inputBtn = useRef(null);
    const audioRef = useRef(null);
    const timerRef = useRef(null);

    const inputbtn = () => {
        inputBtn.current.click();
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async (blob) => {
        const formData = new FormData();
        if (blob) {
            formData.append('file', blob, 'recording.webm');
        } else if (selectedFile) {
            formData.append('file', selectedFile);
        }

        try {
            const response = await axios.post('http://localhost:5000/api/coughUpload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                setMessage('파일이 성공적으로 업로드되었습니다.');
            } else {
                setMessage('파일 업로드에 실패했습니다.');
            }
        } catch (error) {
            console.error('파일 업로드 중 오류가 발생했습니다:', error);
            setMessage('파일 업로드 중 오류가 발생했습니다.');
        }
    };

    const startRecording = () => {
        setMessage('');
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const recorder = new MediaRecorder(stream);
                recorder.ondataavailable = (e) => {
                    setAudioBlob(e.data);
                };
                recorder.onstop = () => {
                    const audioURL = URL.createObjectURL(audioBlob);
                    audioRef.current.src = audioURL;
                    setMessage('녹음이 종료되었습니다.');
                    handleFileUpload(audioBlob); // 녹음이 종료되면 자동으로 업로드
                };
                recorder.start();
                setMediaRecorder(recorder);
                setRecording(true);

                // 5초 후에 녹음을 자동으로 중지
                timerRef.current = setTimeout(() => {
                    stopRecording();
                }, 5000);
            })
            .catch(err => console.error('음성 녹음 중 오류가 발생했습니다:', err));
    };

    const stopRecording = () => {
        if (mediaRecorder && recording) {
            mediaRecorder.stop();
            setRecording(false);
            clearTimeout(timerRef.current); // 타이머 클리어
        }
    };

    return (
        <div className='parent-box'>
            <div className='box'>
                <h1 className='udH1'>Audio Recording & Upload</h1>
                <h2 className='udh2'>.mp3, .mp4, .weba 확장자 파일만 업로드</h2>
                <div className="record-container">
                    <button className='record-btn' onClick={recording ? stopRecording : startRecording}>
                        {recording ? '녹음 중지' : '녹음 시작'}
                    </button>
                    <audio ref={audioRef} controls />
                </div>
                <div className="input-container">
                    <button className="inputbtn" onClick={inputbtn}>파일 선택</button>
                    <input type="file" onChange={handleFileChange} ref={inputBtn} className="file-input" />
                    <button className='btnUd' onClick={() => handleFileUpload(selectedFile)}>업로드</button>
                </div>
                {message && <p className='message'>{message}</p>}
            </div>
        </div>
    );
};

export default CoughUd;
