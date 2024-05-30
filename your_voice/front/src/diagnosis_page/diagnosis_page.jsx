import React from 'react';
import { useLocation } from 'react-router-dom';
import './diagnosis_page.css';
import MenuBar from '../Route/menu';

const DiagnosisPage = () => {
  const location = useLocation();
  const { analysisResult } = location.state || { analysisResult: null };

  console.log(analysisResult);

  const formattedPrediction = analysisResult ? analysisResult.prediction.toFixed(2) : null;

  return (
    <div className='diagnosis_page'>
      <MenuBar />
      {!analysisResult ? (
        <h1>No analysis result found</h1>
      ) : (
        <div className='diagnosis_body_container'>
          <h3 className='contentDg'> 주파수 평균 <br /></h3>
          <h1 className='resultDg'>{formattedPrediction}</h1>
        </div>
      )}
    </div>
  );
};

export default DiagnosisPage;
