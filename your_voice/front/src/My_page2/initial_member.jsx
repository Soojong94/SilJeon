import React from 'react';
import './initial_member.css';
import MenuBar from '../Route/menu';
// import { useChart } from './my_page/ChartContext.js';

const Initial = () => {
  // const { resetChartData } = useChart();

  return (
    <div className='initialBg'>
      <MenuBar />
      <div className='initial-box'>
        <button className='initialBtn'>회원탈퇴</button>
        <button className='initialBtn' >차트 초기화</button>
      </div>
    </div>
  );
};

export default Initial;
