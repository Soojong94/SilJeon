import './my_page.css';
import React from 'react';
import MenuBar from '../Route/menu';
import ChartComponent from './ChartComponent';
import { RingLoader } from 'react-spinners';

function My_page() {
  return (
    <div className='my_page'>
      <MenuBar />
      <div className='my_page_head'>
        <h1>Your voice state is..</h1>
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
            <br />
            <br />
            <h2 className='myH2'>경미한 건강 문제 (20-40%)</h2>
            <br />

            행동 요령: 충분한 수면과 휴식을 취하세요. 스트레스 관리에 신경 쓰고, 수분 섭취를 늘리세요.
            <br />
            <br />
            주의 사항: 경미한 증상이 지속되면 전문가와 상담하세요. 면역력을 높이기 위해 비타민 섭취를 고려하세요.

            <br />



          </p>
        </div>
      </div>
    </div>
  );
}

export default My_page;
