import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Recorder from 'recorder-js';
import WavEncoder from 'wav-encoder';
import './recording.css';
import MenuBar from '../Route/menu';
import { PropagateLoader } from 'react-spinners';
import { PuffLoader } from 'react-spinners';

const Record_voice = () => {

  const [audioBlob, setAudioBlob] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [message, setMessage] = useState('');
  const [fileName, setFileName] = useState('');
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const audioContextRef = useRef(new (window.AudioContext || window.webkitAudioContext)());
  const navigate = useNavigate();

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
        setFileName('record.wav');
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
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className='parent-box'>
      <MenuBar />
      <div className='up_box'>
        <div className='PropagateLoader-container'>
          <h1 className='udH1'>Recording</h1>
          <div className='PropagateLoader_container'>
            <PropagateLoader
              color="#1cb4f5"
              size={10}
              speedMultiplier={1}
            />
          </div>
        </div>

        <div className='divided_body'>
          <div className='left_box'>
            <h3 className='udh2'>'기침' 녹음 후 음성 파일을 <br />꼭!! 다운로드 해주세요</h3>
            <span>Please download File!</span>
          </div>
          <div className='right_box'>
            <audio ref={audioRef} controls />
            <div className="record-container">
              <button className='record-btn' onClick={recording ? stopRecording : startRecording}>
                {recording ? (
                  <>녹음 중지
                    <PuffLoader
                      color="black"
                      size={10}
                      speedMultiplier={1}
                      cssOverride={{ display: 'inline-block', marginBottom: '7px', marginLeft: '10px' }}
                    />
                  </>
                ) : '1. 기침 녹음 시작   ▶'}
              </button>
              {audioBlob && <p className='file-name'>녹음 파일: {fileName}</p>}
              <button className='btnUd' onClick={downloadAudio} disabled={!audioBlob}>2. 녹음 파일 다운로드</button>
              <button className='btnBack' onClick={() => navigate('/coughUd')}>3. 녹음 파일 업로드⬆️</button>
            </div>

          </div>
        </div>
        <button className='coughUp_Move_box' onClick={() => navigate('/coughUd')}>⬅️파일 업로드 페이지 돌아가기</button>
      </div>

    </div>
  );
};

export default Record_voice;
