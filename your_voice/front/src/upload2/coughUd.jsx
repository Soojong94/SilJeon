import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Recorder from 'recorder-js';
import WavEncoder from 'wav-encoder';
import './bothload.css';
import MenuBar from '../Route/menu';

const CoughUd = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [recording, setRecording] = useState(false);
    const [recorder, setRecorder] = useState(null);
    const [message, setMessage] = useState('');
    const inputBtn = useRef(null);
    const audioRef = useRef(null);
    const timerRef = useRef(null);
    const audioContextRef = useRef(new (window.AudioContext || window.webkitAudioContext)());
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const startRecording = async () => {
        setMessage('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const workletNode = audioContext.createScriptProcessor(4096, 1, 1);
            workletNode.connect(audioContext.destination);
            const newRecorder = new Recorder(audioContext, {
                workletNode: workletNode
            });

            newRecorder.init(stream);
            newRecorder.start().then(() => {
                setRecording(true);
                setRecorder(newRecorder);


            });
        } catch (err) {
            console.error('음성 녹음 중 오류가 발생했습니다:', err);
            alert('음성 녹음 중 오류가 발생했습니다.');
        }
    };

    const stopRecording = async () => {
        if (recorder && recording) {
            try {
                const { buffer } = await recorder.stop();
                const wavData = await WavEncoder.encode({
                    sampleRate: audioContextRef.current.sampleRate,
                    channelData: buffer
                });
                const wavBlob = new Blob([new DataView(wavData)], { type: 'audio/wav' });
                setAudioBlob(wavBlob);
                const audioURL = URL.createObjectURL(wavBlob);
                audioRef.current.src = audioURL;

            } catch (err) {
                console.error('녹음 중지 오류가 발생했습니다:', err);
                alert('녹음 중지 오류가 발생했습니다.');
            } finally {
                setRecording(false);
                clearTimeout(timerRef.current);
            }
        }
    };

    const downloadAudio = () => {
        if (audioBlob) {
            const url = URL.createObjectURL(audioBlob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'recorded_audio.wav';
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            setMessage('');
        } else {
            setMessage('녹음 파일이 없습니다.');
        }
    };

    const navigateToLoadingPage = () => {
        if (selectedFile) {
            navigate('/loading_page', { state: { file: selectedFile } });
        } else {
            alert('파일을 선택해주세요.');
        }
    };

    return (
        <div className='parent-box'>
            <MenuBar />
            <div className='up_box'>
                {message && <p className='message'>{message}</p>}
                <h1 className='udH1'>Audio Recording & Upload</h1>
                <h2 className='udh2'>녹음 후 음성 파일을 업로드 해주세요.</h2>
                <div className="record-container">
                    <button className='record-btn' onClick={recording ? stopRecording : startRecording}>
                        {recording ? '녹음 중지' : '녹음 시작'}
                    </button>
                    <button className='btnUd' onClick={downloadAudio} disabled={!audioBlob}>파일 다운</button>
                </div>
                <audio ref={audioRef} controls />
                <div className="input-container">
                    <button className="inputbtn" onClick={() => inputBtn.current.click()}>파일 선택</button>
                    <input type="file" onChange={handleFileChange} ref={inputBtn} className="file-input" />
                    <button className='btnUd' onClick={navigateToLoadingPage} disabled={!selectedFile}>파일 업로드</button>
                </div>
            </div>
        </div>
    );
};

export default CoughUd;
