import './diagnosis_page.css';
import React from 'react';
import Sample1 from '../images/sample3.jpg';
import MenuBar from '../Route/menu';

function DiagnosisPage() {
  return (
    <div className='diagnosis_page'>
      <MenuBar />
      <div className='diagnosis_head'>
        <h1>진단 제목(서버에서 데이터를 받아서
          <br />
          코로나 or 건강하다 등의 문구로 변경)</h1>
      </div>
      <div className='diagnosis_body_container'>
        <div className='diagnosis_img'>
          <img className='Sample1' src={Sample1} alt="Sample" />
        </div>
        <div className='diagnosis_body'>
          <h3>
            당신의 목상태는 현재 매우 건강합니다
            <br />
            건강한 습관을 가지고 계시는 군요
          </h3>
        </div>
      </div>
    </div>
  );
}

export default DiagnosisPage;
