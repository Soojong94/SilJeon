import React, { useState } from 'react';
import './NewMainPg.css';
import CoughUd from '../upload2/coughUd.jsx'
import Covidbtn from '../Button/Covidbtn.jsx';
function NewMainPg() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };


    
    

    return (
        <div className="main-container">
           
            <div className="main-box">
             
                <div className='voice'>
                    <h2 className='voiceDsEg'>COVID-19</h2>
                    <p className="expln">AI가 당신의 기침소리를 분석하여</p>
                    <p className="expln">COVID-19를 진단합니다.</p>
                    <Covidbtn />
                </div>
            </div>
        </div>
    );
}

export default NewMainPg;
