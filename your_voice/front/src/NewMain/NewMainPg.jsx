import React, { useState } from 'react';
import './NewMainPg.css';
import CoughUd from '../upload2/coughUd.jsx';
import Covidbtn from '../Button/Covidbtn.jsx';
import MenuBar from '../Route/menu.jsx'
import { RingLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';


function NewMainPg() {

  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleRecord = () => {
    navigate('/Record_voice');
  };

  return (

    <div className="mainPG_box">
      <MenuBar />
      <div className='voice'>
        <div className='MainImg'>
          <RingLoader
            className='bounce'
            color="#36d7b7"
            size={250}
            speedMultiplier={0.8} />
        </div>
        <div className='voiceContent'>
          <h2 className='voiceDsEg'>딥러닝 기반 기침소리 분석</h2>
          <p className="expln">AI가 당신의 기침소리를 분석하여</p>
          <p className="expln">호흡기 질환 유무를 진단합니다.</p>
          <div className='mainBtn-box'>
            <Covidbtn />

          </div>
        </div>
      </div>
    </div>
  );
}

export default NewMainPg;
