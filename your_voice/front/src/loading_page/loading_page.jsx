import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RingLoader } from 'react-spinners';
import './loading_page.css';
import MenuBar from '../Route/menu';

function LoadingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { file, analysisType } = location.state;

  const userInfo = sessionStorage.getItem('user_info');
  const { id: userId } = userInfo ? JSON.parse(userInfo) : {};

  useEffect(() => {
    const uploadAndAnalyzeFile = async () => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('analysisType', analysisType); // 분석 유형 추가
 
      try {
        const response = await axios.post('https://yourcough.site/api/coughUpload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true // withCredentials 옵션 추가
        });

        if (response.status === 200) {
          const analysisResult = response.data;

          navigate('/diagnosis_page', { state: { analysisResult } });
        } else if (response.status === 400) {
          alert('분석할 수 없는 소리입니다. 기침 소리를 다시 녹음해 주세요');
          navigate('/');
        } else {
          alert('파일 분석에 실패했습니다.');
          navigate('/');
        }
      } catch (error) {
        console.error('파일 분석 중 오류가 발생했습니다:', error);
        if (error.response && error.response.status === 400) {
          alert('올바른 기침 소리를 녹음해주세요.');
        } else {
          alert('파일 분석 중 오류가 발생했습니다.');
        }
        navigate('/');
      }
    };

    uploadAndAnalyzeFile();
  }, [file, navigate, userId, analysisType]);

  return (
    <div className='ringLoader'>
      <MenuBar />
      <div className='ring-loader-wrapper'>
        <RingLoader
          color="#36d7b7"
          size={300}
          speedMultiplier={0.8}
        />
      </div>
      <div className='loaderText'>
        <h1>분석중..</h1>
      </div>
    </div>
  );
}

export default LoadingPage;
