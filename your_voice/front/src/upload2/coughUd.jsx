import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './bothload.css';
import MenuBar from '../Route/menu';
import BounceLoader from "react-spinners/BounceLoader";

const CoughUd = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');
    const inputBtn = useRef(null);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const navigateToLoadingPage = () => {
        if (selectedFile) {
            navigate('/loading_page', { state: { file: selectedFile } });
        } else {
            alert('파일을 선택해주세요.');
        }
    };

    const ToRecordVoice = () => {
        navigate('/Record_voice');
    };

    return (
        <div className='parent-box'>
            <MenuBar />
            <div className='up_box'>
                {message && <p className='message'>{message}</p>}
                <h1 className='udH1'>녹음 파일 선택 후 진단</h1>
                <div className="inputFile-box">
                    <div className='left_content'>
                        <BounceLoader className='bounce' size={230} color="#6375ff" />
                    </div>
                    <div className="middle_content">
                        <h2 className='ExplnUd'>파일 선택 후, 진단 시작 버튼을 눌러주세요.</h2>
                        
                        <div className="file-buttons">
                            {selectedFile && <p className='selectedfileName'>{selectedFile.name}</p>}
                            <button className="inputbtn" onClick={() => inputBtn.current.click()}>파일 선택</button>
                            <input type="file" onChange={handleFileChange} ref={inputBtn} className="file-input" />

                            <button className='inputbtn' onClick={navigateToLoadingPage} disabled={!selectedFile}>진단 시작</button>
                            <h2 className='ExplnUd'>아직 파일이 없다면, 녹음을 진행해 주세요.</h2>
                            <button className='inputbtn'onClick={ToRecordVoice}>녹음하기</button>
                        </div>
                    </div>
                    <div className='recordPg_Move_box'>
                        <button className="recordPg_Btb" id='CovidGo' onClick={navigateToLoadingPage} disabled={!selectedFile} >코로나 분석으로 이동➡️</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoughUd;
