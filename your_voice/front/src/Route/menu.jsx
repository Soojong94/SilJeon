import React from 'react';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import BarChartIcon from '@mui/icons-material/BarChart';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './menu.css';
import logo from '../Route/Your voice.png'; // 이미지 파일을 import
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
            <button className="nav-button" onClick={() => navigate('/Login')}>
              <Tooltip title="로그인">
                <LoginIcon className='icon' />
              </Tooltip>
            </button>
            <button className="nav-button" onClick={() => navigate('/SignUp')}>
              <Tooltip title="회원가입">
                <AccountCircleIcon className='icon' />
              </Tooltip>
            </button>
            <button className="nav-button" onClick={() => navigate('/MyPage')}>
              <Tooltip title="마이페이지">
                <BarChartIcon className='icon' />
              </Tooltip>
            </button>
            <GoogleOAuthProvider clientId={CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                render={({ onClick }) => (
                  <button className="nav-button" onClick={onClick}>
                    <Tooltip title="구글 로그인">
                      <LoginIcon className='icon' />
                    </Tooltip>
                  </button>
                )}
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default MenuBar;
