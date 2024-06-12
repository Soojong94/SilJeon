import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RingLoader } from 'react-spinners';
import './loading_page.css';
import MenuBar from '../Route/menu';

function LoadingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { file } = location.state;

  const userInfo = sessionStorage.getItem('user_info');
  const { id: userId } = userInfo ? JSON.parse(userInfo) : {};

  useEffect(() => {
    const uploadAndAnalyzeFile = async () => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      try {
        const response = await axios.post('https://3.39.0.139/api/coughUpload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200) {
          const analysisResult = response.data;
          console.log(analysisResult)
          navigate('/diagnosis_page', { state: { analysisResult } });
        } else {
          alert('파일 분석에 실패했습니다.');
          navigate('/');
        }
      } catch (error) {
        console.error('파일 분석 중 오류가 발생했습니다:', error);
        alert('파일 분석 중 오류가 발생했습니다.');
        navigate('/');
      }
    };

    uploadAndAnalyzeFile();
  }, [file, navigate, userId]);

  return (
    <div className='ringLoader'>
      <MenuBar />
      <RingLoader
        color="#36d7b7"
        size={400}
        speedMultiplier={0.8}
      />
      <div className='loaderText'>
        <h1>분석중..</h1>
      </div>
    </div>
  );
}

export default LoadingPage;
