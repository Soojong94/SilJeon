import React, { useState } from 'react';
import './NewMainPg.css';
import CoughUd from '../upload2/coughUd.jsx';
import Covidbtn from '../Button/Covidbtn.jsx';
import doctor from '../NewMain/doctor.jpg'
import MenuBar from '../Route/menu.jsx'

function NewMainPg() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
       
        <div className="mainPG_box">
             <MenuBar/ >
            <div className='voice'>
                <div className='MainImg'>
                    <img src={doctor} alt='의사' />
                </div>
                <div className='voiceContent'>
                    <h2 className='voiceDsEg'>Voice disorder</h2>
                    <p className="expln">AI가 당신의 음성을 분석하여</p>
                    <p className="expln">음성질환 유무를 진단합니다.</p>
                    <Covidbtn />
                </div>
            </div>
        </div>
    );
}

export default NewMainPg;
