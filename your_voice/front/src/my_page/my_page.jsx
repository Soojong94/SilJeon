import './my_page.css';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import MenuBar from '../Route/menu';
import ChartComponent from './ChartComponent';
import { useNavigate } from 'react-router-dom';

const diseaseNames = {
  1: '정상',
  2: '심부전',
  3: '천식',
  4: 'others'
};

function My_page() {
  const navigate = useNavigate();
  const [showMonthly, setShowMonthly] = useState(false);
  const [userId, setUserId] = useState(null);
  const [todayData, setTodayData] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem('user_info');
    if (storedUserInfo) {
      const { id } = JSON.parse(storedUserInfo);
      setUserId(id);
    }
  }, []);

  useEffect(() => {
    if (todayData.length > 0) {
      const latestDataEntry = todayData.reduce((latest, entry) => {
        const latestDate = moment(latest.time, 'HH:mm');
        const entryDate = moment(entry.time, 'HH:mm');
        return entryDate.isAfter(latestDate) ? entry : latest;
      }, todayData[0]);

      setSelectedTime(moment(latestDataEntry.time, 'HH:mm:ss').format('HH:mm'));
    } else {
      setSelectedTime('');
    }
  }, [todayData]);

  const toggleChart = () => {
    setShowMonthly(!showMonthly);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const timeOptions = [...new Set(todayData.map(entry => moment(entry.time, 'HH:mm:ss').format('HH:mm')))];

  const filteredTodayData = selectedTime
    ? todayData.filter(entry => moment(entry.time, 'HH:mm:ss').format('HH:mm') === selectedTime)
    : [];

  const sortedTodayData = filteredTodayData.sort((a, b) => a.disease_id - b.disease_id);

  return (
    <div className='my_page'>
      <MenuBar />
      <div className='my_page_head'>
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
        {!showMonthly && (
          <div className='my_page_body'>
            <h3>오늘의 건강 상태</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>
                      <div className="filter-container">
                        <label htmlFor="time-select">시간 </label>
                        <select id="time-select" value={selectedTime} onChange={handleTimeChange}>
                          <option value="">시간 선택</option>
                          {timeOptions.map((time, index) => (
                            <option key={index} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </th>
                    <th>질병</th>
                    <th>상태 값 (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4].map(disease_id => {
                    const entry = sortedTodayData.find(data => data.disease_id === disease_id) || { time: selectedTime, disease_id, cough_status: 0 };
                    return (
                      <tr key={disease_id}>
                        <td>{entry.time}</td>
                        <td>{diseaseNames[disease_id]}</td>
                        <td>{(entry.cough_status * 100).toFixed(2)}</td>
                      </tr>
                    );
                  })}
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
