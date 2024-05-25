import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import BarChartIcon from '@mui/icons-material/BarChart';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './menu.css'; 

function MenuBar() {
  return (
    <div className='menu_bar_container'> {/* 메뉴를 감싸는 div */}
      <div className='menu_bar'> {/* 메뉴 바 */}
        <Tooltip title="로그인">
          <LoginIcon className='icon' />
        </Tooltip>
        <Tooltip title="회원가입">
          <AccountCircleIcon className='icon' />
        </Tooltip>
        <Tooltip title="진단페이지">
          <BarChartIcon className='icon' />
        </Tooltip>
        
      </div>
    </div>
  );
}

export default MenuBar;
