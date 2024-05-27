import React, { useState, useRef } from 'react';
import axios from 'axios'; // axios를 import합니다.
import './bothloard.css'

const CoughUd = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const inputBtn = useRef(null);
    const audioRef = useRef(null);

    const inputbtn = () => {
        inputBtn.current.click();
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!selectedFile && !audioBlob) {
            alert('파일을 선택하거나 녹음을 해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:5000/api/coughUpload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                alert('파일이 성공적으로 업로드되었습니다.');
            } else {
                alert('파일 업로드에 실패했습니다.');
            }
        } catch (error) {
            console.error('파일 업로드 중 오류가 발생했습니다:', error);
            alert('파일 업로드 중 오류가 발생했습니다.');
        }
    };

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const recorder = new MediaRecorder(stream);
                recorder.ondataavailable = (e) => {
                    setAudioBlob(e.data);
                    const audioURL = URL.createObjectURL(e.data);
                    audioRef.current.src = audioURL;
                };
                recorder.start();
                setMediaRecorder(recorder);
                setRecording(true);
            })
            .catch(err => console.error('음성 녹음 중 오류가 발생했습니다:', err));
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setRecording(false);
        }
    };

    return (
        <div className='parent-box'>
            <div className='box'>
                <h1 className='udH1'>Audio Recording & Upload</h1>
                <h2 className='udh2'> .mp3, .mp4, .weba 확장자 파일만 업로드</h2>
                <div className="record-container">
                    <button className='record-btn' onClick={recording ? stopRecording : startRecording}>
                        {recording ? '녹음 중지' : '녹음 시작'}
                    </button>
                    <audio ref={audioRef} controls />
                </div>
                <div className="input-container">
                    <button className="inputbtn" onClick={inputbtn}>파일 선택</button>
                    <input type="file" onChange={handleFileChange} ref={inputBtn} className="file-input" />
                    <button className='btnUd' onClick={handleFileUpload}>업로드</button>
                </div>
            </div>
        </div>
    );
};

export default CoughUd;