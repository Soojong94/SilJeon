import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import BarChartIcon from '@mui/icons-material/BarChart';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './menu.css';
import logo from '../Route/Your voice.png'; // 이미지 파일을 import

function MenuBar() {

  return (
    <div className='menu_bar_container nav_header'>
      <nav className="navbar">
        <div className="logo"></div>

        <div className="nav-items">
          <div className='menu_bar'>
            <img src={logo} alt="Your Voice Logo" className="logo" />
            <a href='#'><button className="nav-button">
              <Tooltip title="로그인">
                <LoginIcon className='icon' />
              </Tooltip></button></a>
            <a href='#'><button className="nav-button">
              <Tooltip title="회원가입">
                <AccountCircleIcon className='icon' />
              </Tooltip></button></a>
            <a href='#'><button className="nav-button">
              <Tooltip title="진단페이지">
                <BarChartIcon className='icon' />
              </Tooltip></button></a>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default MenuBar;
