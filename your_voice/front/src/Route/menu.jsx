import React from 'react';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import './menu.css';
import logo from '../Route/YourVoice.png';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const CLIENT_ID = '848922845081-tubjkh6u80t5lleilc4r4bts1rrc1na6.apps.googleusercontent.com'

function MenuBar() {
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse) => {
    console.log('Login Success:', credentialResponse);
    const token = credentialResponse.credential;

    try {
      // 인증 토큰을 백엔드로 전달
      const response = await axios.post('http://localhost:5000/api/login', {
        token,
      });

      console.log('Server response:', response.data);

      // 세션 스토리지에 user_info 저장
      if (response.data.user) {
        sessionStorage.setItem('user_info', JSON.stringify(response.data.user));
      }

      // 필요에 따라 추가 작업 수행
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  };




  return (
    <div className='menu_bar_container nav_header'>
      <nav className="navbar">
        <div className="logo" onClick={() => navigate('/NewMainPg')}>
          <img src={logo} alt="Your Voice Logo" className="logo_img" />
        </div>
        <div className="nav-items">
          <div className='menu_bar'>
            <div className='login_menu'>
              <GoogleOAuthProvider clientId={CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                />
              </GoogleOAuthProvider>
            </div>
            <button className="nav-button" onClick={() => navigate('/MyPage')}>
              <Tooltip title="마이페이지">
                <MedicalServicesOutlinedIcon className='icon' />
              </Tooltip>
            </button>

          </div>
        </div>
      </nav>
    </div>
  );
}

export default MenuBar;
