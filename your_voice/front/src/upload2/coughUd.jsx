import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './bothload.css';
import MenuBar from '../Route/menu';
import BounceLoader from "react-spinners/BounceLoader";

const CoughUd = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1200);
  const inputBtn = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsSmallScreen(window.innerWidth <= 1200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const navigateToLoadingPage = (analysisType) => {
    if (selectedFile) {
      navigate('/loading_page', { state: { file: selectedFile, analysisType } });
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
      <div className='up_boxF'>
        {message && <p className='message'>{message}</p>}
        <h1 className='udH15'>녹음 파일 선택 후 진단</h1>
          <div className='inputFile-box'>
           
            <div className="left_content">
            <h2 className='ExplnUdF' id='explnupF'>아직 파일이 없다면, 녹음을 진행해 주세요.</h2>
            <div className='recordContents'>
            <BounceLoader className='Upbounce' size={80} color="#6375ff" />
            <button className='inputbtn' id='recordInput' onClick={ToRecordVoice}>녹음하기</button>
            </div>
          </div>
          <hr className='vertical' />
          <div className="middle_content">
            <h2 className='ExplnUdF'>파일 선택 후, 진단 버튼을 눌러주세요.</h2>
            
            <br></br>
            <br></br>
           
            <p className='notice'>질병 진단시 천식,심부전,코로나,정상으로 분류</p>
            <br/>
            <p className='notice'>코로나 진단시 의심,정상,코로나로 분류</p>
            <div className="file-buttons">
          
              <button className="inputbtn" onClick={() => inputBtn.current.click()}>1 파일 선택</button>
              <input type="file" onChange={handleFileChange} ref={inputBtn} className="file-input" />
              <div className="button-column">
                {selectedFile && <p className='selectedfileName'>{selectedFile.name}</p>}
                <button className="inputbtn" id='CovidGo' onClick={() => navigateToLoadingPage('covid')} disabled={!selectedFile}>2-1 코로나 분석</button>
                <button className='inputbtn' id='CovidGo' onClick={() => navigateToLoadingPage('disease')} disabled={!selectedFile}>2-2 질병 진단</button>
         
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoughUd;
