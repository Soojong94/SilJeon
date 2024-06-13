import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import moment from 'moment';
import './my_page.css';
import axios from 'axios';

const fetchDailyChart = async (userId) => {
  try {
    const response = await axios.post('http://localhost:5000/api/dailyChart', { userId });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching daily chart data:', error);
    return [];
  }
};

const fetchWeeklyChart = async (userId) => {
  try {
    const response = await axios.post('http://localhost:5000/api/weeklyChart', { userId });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching weekly chart data:', error);
    return [];
  }
};

const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    days.push(moment().subtract(i, 'days').format('MM-DD'));
  }
  return days;
};

const ChartComponent = () => {
  const [userId, setUserId] = useState(null);
  const [showWeekly, setShowWeekly] = useState(false);
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem('user_info');
    if (storedUserInfo) {
      const { id } = JSON.parse(storedUserInfo);
      setUserId(id);
      fetchData(id);
    }
  }, []);

  const fetchData = async (id) => {
    setLoading(true);
    try {
      const [dailyResponse, weeklyResponse] = await Promise.all([
        fetchDailyChart(id),
        fetchWeeklyChart(id)
      ]);

      setDailyData(dailyResponse);
      setWeeklyData(weeklyResponse);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleChart = () => {
    setShowWeekly(!showWeekly);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const chartData = showWeekly ? weeklyData : dailyData;
  const labels = showWeekly
    ? chartData.map(data => data.week)
    : getLast7Days();

  const diseases = [1, 2, 3, 4]; // 질병 번호 리스트 // 1. 정상 2. 심부전, 3.천식, 4.코로나
  const diseaseNames = {
    1: '정상',
    2: '심부전',
    3: '천식',
    4: '코로나'
  };

  // 주간 데이터일 때, 각 질병의 확률을 하나의 막대로 통합해서 표시
  const datasets = showWeekly
    ? diseases.map(disease_id => {
      return {
        label: diseaseNames[disease_id] || `질병 ${disease_id}`,
        data: labels.map(label => {
          const record = chartData.find(d => d.week === label);
          if (record) {
            const diseaseRecord = record.data.find(r => r.disease_id === disease_id);
            const averageCoughStatus = diseaseRecord ? diseaseRecord.average_cough_status * 100 : 0;
            return averageCoughStatus;
          }
          return 0;
        }),
        backgroundColor: getColorForDisease(disease_id), // 막대의 배경색
      };
    })
    : diseases.map(disease_id => {
      return {
        label: diseaseNames[disease_id] || `질병 ${disease_id}`,
        data: labels.map(label => {
          const record = chartData.find(d => {
            const dateLabel = moment(d.date).format('MM-DD');
            return dateLabel === label;
          });
          if (record) {
            const diseaseRecord = record.data.find(r => r.disease_id === disease_id);
            const averageCoughStatus = diseaseRecord ? diseaseRecord.average_cough_status * 100 : 0;
            return averageCoughStatus; // 값에 100을 곱해줌
          }
          return 0;
        }),
        borderColor: getColorForDisease(disease_id), // 선의 색상
        backgroundColor: getColorForDisease(disease_id), // 막대의 배경색
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
      x: {
        stacked: showWeekly, // 주간 차트에서는 막대를 쌓아 올림
        ticks: {
          callback: function (value, index, values) {
            return labels[index]; // 'MM-DD' 또는 'YYYY년 WW주차' 형식으로 변환된 labels 사용
          }
        }
      },
      y: {
        stacked: showWeekly, // 주간 차트에서는 막대를 쌓아 올림
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
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
        {showWeekly ? (
          <Bar data={data} options={options} />
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    </div>
  );
};

const getColorForDisease = (disease_id) => {
  const colors = ['#8CD700', 'red', 'orange', 'yellow'];
  return colors[disease_id - 1] || 'black';
};

export default ChartComponent;
