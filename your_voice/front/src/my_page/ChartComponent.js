import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import moment from 'moment';
import './my_page.css'
import axios from 'axios';


// 세션 스토리지에서 id 값만 불러오는 코드
const userInfo = sessionStorage.getItem('user_info');
const { id } = userInfo ? JSON.parse(userInfo) : {};
const userId = id

// 서버에서 일간 및 주간 데이터를 가져오는 함수
const fetchDailyChart = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/dailyChart', { 'id' : userId});
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching daily chart data:', error);
    return null;
  }
};




const fetchWeeklyChart = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/weeklyChart', { 'id' : userId });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching weekly chart data:', error);
    return null;
  }
};

const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    days.push(moment().subtract(i, 'days').format('MM-DD'));
  }
  return days;
};

const getLast4Weeks = () => {
  const weeks = [];
  for (let i = 3; i >= 0; i--) {
    weeks.push(moment().subtract(i, 'weeks').format('MM-DD'));
  }
  return weeks;
};

const ChartComponent = () => {
  const [showWeekly, setShowWeekly] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = showWeekly ? await fetchWeeklyChart() : await fetchDailyChart();
      setChartData(data);
    };

    fetchData();
  }, [showWeekly]);

  const toggleChart = () => {
    setShowWeekly(!showWeekly);
  };

  const labels = showWeekly ? getLast4Weeks() : getLast7Days();
  const data = {
    labels,
    datasets: [
      {
        label: showWeekly ? '주간 차트' : '일간 차트',
        data: chartData, 
        backgroundColor: 'red',
        borderColor: 'red',
        borderWidth: 4,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  return (
    <div>
      <button className="chart-button" onClick={toggleChart}>
        {showWeekly ? '일간 차트 보기' : '주간 차트 보기'}
      </button>
      <div style={{ height: '60vh', width: '30vw' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartComponent;