import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import moment from 'moment';
import './my_page.css';
import axios from 'axios';

const userInfo = sessionStorage.getItem('user_info');
const { id } = userInfo ? JSON.parse(userInfo) : {};
const userId = id;

const fetchDailyChart = async () => {
  try {
    const response = await axios.post('http://3.39.0.139:5000/api/dailyChart', { id: userId });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching daily chart data:', error);
    return null;
  }
};

const fetchWeeklyChart = async () => {
  try {
    const response = await axios.post('http://3.39.0.139:5000/api/weeklyChart', { id: userId });
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
    days.push(moment().subtract(i, 'days').format('YYYY-MM-DD'));
  }
  return days;
};

const ChartComponent = () => {
  const [showWeekly, setShowWeekly] = useState(false);  // Default to daily chart
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = showWeekly ? await fetchWeeklyChart() : await fetchDailyChart();
      if (data) {
        if (showWeekly) {
        }
        setChartData(data);
      }
    };

    fetchData();
  }, [showWeekly]);

  const toggleChart = () => {
    setShowWeekly(!showWeekly);
  };

  const labels = showWeekly ? chartData.map(data => data.week).reverse() : getLast7Days();

  const diseases = [1, 2, 3, 4]; // 질병 번호 리스트 // 1. 정상 2. 심부전, 3.천식, 4.코로나
  const datasets = diseases.map(disease_id => {
    return {
      label: `Disease ${disease_id}`,
      data: labels.map(label => {
        const record = chartData.find(d => (showWeekly ? d.week : d.date) === label);
        if (record) {
          const diseaseRecord = record.data.find(r => r.disease_id === disease_id);
          return diseaseRecord ? diseaseRecord.average_cough_status : 0;
        }
        return 0;
      }),
      borderColor: getColorForDisease(disease_id), // 각 질병 번호에 대해 고유한 색상 지정
      fill: false
    };
  });

  const data = {
    labels,
    datasets
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 1,
        ticks: {
          stepSize: 0.1,
        },
      },
    },
  };

  return (
    <div>
      <button className="chart-button" onClick={toggleChart}>
        {showWeekly ? '일간 차트 보기' : '주간 차트 보기'}
      </button>
      <div style={{ height: '60vh', width: '60vw' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

const getColorForDisease = (disease_id) => {
  const colors = ['red', 'blue', 'green', 'orange'];
  return colors[disease_id - 1] || 'black';
};

export default ChartComponent;
