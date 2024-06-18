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
            className='Mainbounce'
            color="#36d7b7"
            size={300}
            speedMultiplier={1} />
        </div>
        <div className='voiceContent'>
          <h2 className='voiceDsEg'>딥러닝 기반 기침소리 분석</h2>
          <span className="expln ">AI가 당신의</span>
          <span className="expln expln1"> 기침 소리를 분석</span>
          <br />
          <span className="expln expln2">하여 호흡기 질환 유무를 진단</span>
          <span className="expln">합니다</span>
          <div className='mainBtn-box'>
            <Covidbtn />

          </div>
        </div>
      </div>
    </div>
  );
}

export default NewMainPg;
