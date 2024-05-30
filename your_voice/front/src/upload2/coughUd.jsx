import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './bothload.css';
import MenuBar from '../Route/menu';

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

    return (
        <div className='parent-box'>
            <MenuBar />
            <div className='up_box'>
                {message && <p className='message'>{message}</p>}
                <h1 className='udH1'>Audio Recording & Upload</h1>
                <div className="input-container">
                    <button className="inputbtn" onClick={() => inputBtn.current.click()}>파일 선택</button>
                    <input type="file" onChange={handleFileChange} ref={inputBtn} className="file-input" />
                    {selectedFile && <p className='selectedfileName'>선택한 파일: {selectedFile.name}</p>}
                    <button className='inputbtn' onClick={navigateToLoadingPage} disabled={!selectedFile}>파일 업로드</button>
                    <div>
                        <button>녹음 페이지로 이동 </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoughUd;
