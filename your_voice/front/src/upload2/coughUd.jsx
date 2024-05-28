import React, { useState, useRef } from 'react';
import axios from 'axios';
import Recorder from 'recorder-js';
import './bothload.css';
import MenuBar from '../Route/menu';



const CoughUd = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [recording, setRecording] = useState(false);
    const [recorder, setRecorder] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [message, setMessage] = useState('');
    const inputBtn = useRef(null);
    const audioRef = useRef(null);
    const timerRef = useRef(null);
    const audioContextRef = useRef(new (window.AudioContext || window.webkitAudioContext)());

    const inputbtn = () => {
        inputBtn.current.click();
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async (blob) => {
        const formData = new FormData();
        if (blob) {
            formData.append('file', blob, 'recording.webm');  // webm 형식으로 변경
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
                alert('파일 업로드에 실패했습니다.');
            }
        } catch (error) {
            console.error('파일 업로드 중 오류가 발생했습니다:', error);
            alert('파일 업로드 중 오류가 발생했습니다.');
        }
    };

    const startRecording = async () => {
        setMessage('');  // Clear any previous messages
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const newRecorder = new Recorder(audioContextRef.current, {
                onAnalysed: data => console.log(data)
            });

            newRecorder.init(stream);
            newRecorder.start().then(() => {
                setRecording(true);
                setRecorder(newRecorder);

                // 5초 후에 녹음을 자동으로 중지
                timerRef.current = setTimeout(() => {
                    stopRecording();
                }, 5000);
            });
        } catch (err) {
            console.error('음성 녹음 중 오류가 발생했습니다:', err);
            alert('음성 녹음 중 오류가 발생했습니다.');
        }
    };

    const stopRecording = () => {
        if (recorder && recording) {
            recorder.stop().then(({ blob }) => {
                setAudioBlob(blob);
                const audioURL = URL.createObjectURL(blob);
                audioRef.current.src = audioURL;
                setMessage('녹음이 종료되었습니다.');
                handleFileUpload(blob);
            }).catch(err => {
                console.error('녹음 중지 오류가 발생했습니다:', err);
                alert('녹음 중지 오류가 발생했습니다.');
            }).finally(() => {
                setRecording(false);
                clearTimeout(timerRef.current); // 타이머 클리어
            });
        }
    };

    return (
        <div className='parent-box'>
            <MenuBar />
            <div className='box'>
                {message && <p className='message'>{message}</p>}
                <h1 className='udH1'>Audio Recording & Upload</h1>
                <h2 className='udh2'>녹음 후 음성 파일을 업로드 해주세요.</h2>
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
            </div>
        </div>
    );
};

export default CoughUd;
