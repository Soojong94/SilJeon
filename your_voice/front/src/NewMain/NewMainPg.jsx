import React, { useEffect, useState } from 'react';
import './NewMainPg.css';
import Covidbtn from '../Button/Covidbtn.jsx';
import MenuBar from '../Route/menu.jsx';
import { RingLoader } from 'react-spinners';

function NewMainPg() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userInfo = sessionStorage.getItem('user_info');
    setIsLoggedIn(!!userInfo);
  }, []);

  const handleLoginStatusChange = (status) => {
    setIsLoggedIn(status);
  };

  return (
    <div className="mainPG_box">
      <MenuBar onLoginStatusChange={handleLoginStatusChange} />
      <div className='voice'>
        <div className='MainImg'>
          <RingLoader
            className='Mainbounce'
            color="#36d7b7"
            size={250}
            speedMultiplier={1} />
        </div>
        <div className='voiceContent'>
          <h2 className='voiceDsEg'>딥러닝 기반 기침소리 분석</h2>
          <div className='expln-box'>
            <span className="expln">AI가 당신의</span>
            <span className="expln expln1"> 기침 소리를 분석</span>
            <span className="expln">하여</span>
            <br />
            <span className="expln expln2">호흡기 질환 유무를 진단</span>
            <span className="expln">합니다</span>
          </div>
          <div className='mainBtn-box'>
            {isLoggedIn ? (
              <Covidbtn />
            ) : (
              <button className='expln_login'>로그인 후 이용해 주세요.</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewMainPg;
