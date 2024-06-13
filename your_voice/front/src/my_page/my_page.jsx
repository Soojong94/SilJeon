import './my_page.css';
import React, { useState, useEffect } from 'react';
import MenuBar from '../Route/menu';
import ChartComponent from './ChartComponent';
import { useNavigate } from 'react-router-dom';


function My_page() {

  const navigate = useNavigate();
  const navchange_member = () => {


    navigate('/initial_member');

  };

  return (
    <div className='my_page'>
      <MenuBar />
      <div className='my_page_head'>
        <button className='update_member' onClick={navchange_member}>회원 정보수정</button>
        <h1 >AI 분석 결과</h1>
      </div>
      <div className='my_page_container'>
        <div className='my_page_chart'>
          <ChartComponent />
        </div>
        <div className='my_page_body'>
          <p>
            <h2 className='myH2'>일반 건강 상태가 양호할 때 (0-20%)</h2>
            <br />
            행동 요령: 현재 건강 상태가 매우 좋습니다. 꾸준한 운동과 균형 잡힌 식단을 유지하세요.
            <br />
            <br />
            주의 사항: 특별한 주의 사항은 없지만, 정기적인 건강 체크를 계속하세요.
          </p>

        </div>
      </div>
    </div>
  );
}

export default My_page;
