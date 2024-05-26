import React from 'react';
import './MainPg.css';

function MainPg() {
    return (
        <div className="main-container">
            <header className="header">
                <nav className="navbar">
                    <div className="logo">Your Voice</div>
                    <div className="nav-items">
                        <a href='#'><button className="nav-button">Sign in</button></a>
                        <a href='#'><button className="nav-button">My page</button></a>
                        <div className="hamburger-menu">☰</div>
                    </div>
                </nav>
            </header>
            <div className="main-box">
                <div className="voice">
                    <h2 className='voiceDsEg'>Disease in voice</h2>
                    <p className="expln">AI가 목소리를 분석하여</p>
                    <p className="expln">음성질환유무를 진단합니다.</p>
                    <a href="#"><button className='voiceDg'>진단받기</button></a>
                </div>
                <div className='covid'>
                    <h2 className='voiceDsEg'>COVID-19</h2>
                    <p className="expln">AI가 당신의 기침소리를 분석하여</p>
                    <p className="expln">COVID-19를 진단합니다.</p>
                    <a href="#"><button className='covidDg'>진단받기</button></a>
                </div>
            </div>
        </div>
    );
}

export default MainPg;