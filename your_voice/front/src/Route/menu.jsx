import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import './menu.css';
import logo from '../Route/your_cough.png';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function MenuBar({ onLoginStatusChange }){

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userInfo = sessionStorage.getItem('user_info');
    const loggedIn = !!userInfo;
    setIsLoggedIn(loggedIn);
    if (onLoginStatusChange) {
      onLoginStatusChange(loggedIn); // Notify the parent component
    }
  }, [onLoginStatusChange]);

  const handleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      const response = await axios.post('http://localhost:5000/api/login', { token }, { withCredentials: true });

      
      if (response.data.user) {
        sessionStorage.setItem('user_info', JSON.stringify(response.data.user));
        setIsLoggedIn(true);
        if (onLoginStatusChange) {
          onLoginStatusChange(true); // Notify the parent component
        }
      }
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user_info');
    setIsLoggedIn(false);
    if (onLoginStatusChange) {
      onLoginStatusChange(false); // Notify the parent component
    }
    navigate('/');
  };

  const navchange_member = () => {
    navigate('/initial_member');
  };
  

  return (
    <div className='menu_bar_container nav_header'>
      <nav className="navbar">
        <div className="logo" onClick={() => navigate('/NewMainPg')}>
          <img src={logo} alt="Your Voice Logo" className="logo_img" />
        </div>
        <div className="nav-items">
          <div className='menu_bar'>
              <div className='Setting'>
            {isLoggedIn ? (
              <button className='icon nav-button' onClick={navchange_member}>
                Setting
              </button>
            ) : (
              <></>
            )}
              </div>

            <div></div>
            {isLoggedIn && (
              <button className="nav-button my_page_btn" onClick={() => navigate('/MyPage')}>
                <Tooltip title="마이페이지">
                  <span className="icon">Mypage</span>
                </Tooltip>
              </button>
            )}
                <div className='login_menu'>
              <GoogleOAuthProvider clientId={CLIENT_ID}>
                {isLoggedIn ? (
                  <button className="nav-button" onClick={handleLogout}>
                    <Tooltip title="로그아웃">
                      <span className="icon ">Logout</span>
                    </Tooltip>
                  </button>
                ) : (
                  <GoogleLogin onSuccess={handleLoginSuccess} />
                )}
              </GoogleOAuthProvider>
            </div>

          </div>

        </div>
      </nav>
    </div>
  );
}

export default MenuBar;
