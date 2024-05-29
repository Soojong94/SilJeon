import React from 'react';
import { useLocation } from 'react-router-dom';
import './diagnosis_page.css';
import MenuBar from '../Route/menu';

const DiagnosisPage = () => {
  const location = useLocation();
  const { analysisResult } = location.state;

  return (
    <div className='diagnosis_page'>
      <MenuBar />
      <div className='diagnosis_head'>
        <h1>넘어오는지 확인
          <br />
        </h1>
      </div>
      <div className='diagnosis_body_container'>
        <div className='diagnosis_body'>
          <h3> 주파수 평균 <br />
            {analysisResult.prediction}</h3>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisPage;
