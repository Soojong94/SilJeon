import './my_page.css';
import React, { useState, useEffect } from 'react';
import MenuBar from '../Route/menu';
import ChartComponent from './ChartComponent';
import { useNavigate } from 'react-router-dom';

const diseaseNames = {
  1: '정상',
  2: '심부전',
  3: '천식',
  4: '코로나'
};

function My_page() {
  const navigate = useNavigate();
  const [showMonthly, setShowMonthly] = useState(false);
  const [userId, setUserId] = useState(null);
  const [todayData, setTodayData] = useState([]);

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem('user_info');
    if (storedUserInfo) {
      const { id } = JSON.parse(storedUserInfo);
      setUserId(id);
    }
  }, []);

  const toggleChart = () => {
    setShowMonthly(!showMonthly);
  };

  const navchange_member = () => {
    navigate('/initial_member');
  };

  return (
    <div className='my_page'>
      <MenuBar />
      <div className='my_page_head'>
        <button className='update_member' onClick={navchange_member}>회원 정보수정</button>
        <h1>AI 분석 결과</h1>
      </div>
      <div className='my_page_container'>
        <div className='my_page_chart'>
          <ChartComponent
            showMonthly={showMonthly}
            toggleChart={toggleChart}
            userId={userId}
            onTodayDataChange={setTodayData}
          />
        </div>
        {!showMonthly && todayData.length > 0 && (
          <div className='my_page_body'>
            <h3>오늘의 건강 상태</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>시간</th>
                    <th >질병</th>
                    <th>상태 값 (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {todayData.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.time}</td>
                      <td>{diseaseNames[entry.disease_id]}</td>
                      <td>{(entry.cough_status * 100).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default My_page;
