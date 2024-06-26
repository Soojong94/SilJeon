import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import moment from 'moment';
import './my_page.css';
import './ChartComponent.css'; // Import the new CSS file
import axios from 'axios';

const fetchDailyChart = async (userId) => {
  try {
    const response = await axios.post('https://yourcough.site/api/dailyChart', { userId }, { withCredentials: true });

    return response.data;
  } catch (error) {
    console.error('Error fetching daily chart data:', error);
    return { daily_averages: [], today_data: [] };
  }
};

const fetchMonthlyChart = async (userId) => {
  try {
    const response = await axios.post('https://yourcough.site/api/monthChart', { userId }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly chart data:', error);
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

const getLast30Days = () => {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    days.push(moment().subtract(i, 'days').format('MM-DD'));
  }
  return days;
};

const ChartComponent = ({ showMonthly, toggleChart, userId, onTodayDataChange }) => {
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(userId);
  }, [userId, showMonthly]);

  const fetchData = async (id) => {
    setLoading(true);
    try {
      const dailyResponse = await fetchDailyChart(id);
      const monthlyResponse = await fetchMonthlyChart(id);

      setDailyData(dailyResponse.daily_averages);
      setMonthlyData(monthlyResponse);

      if (!showMonthly) {
        onTodayDataChange(dailyResponse.today_data);
      } else {
        onTodayDataChange([]);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const chartData = showMonthly ? monthlyData : dailyData;
  const labels = showMonthly ? getLast30Days() : getLast7Days();

  const diseases = [1, 2, 3, 4]; // 질병 번호 리스트 // 1. 정상 2. 심부전, 3.천식, 4.코로나
  const diseaseNames = {
    1: '정  상',
    2: '심부전',
    3: '천  식',
    4: 'others'
  };

  const datasets = showMonthly
    ? diseases.map(disease_id => ({
      label: diseaseNames[disease_id] || `질병 ${disease_id}`,
      data: labels.map(label => {
        const record = chartData.find(d => moment(d.date).format('MM-DD') === label);
        if (record && record.data) {
          const diseaseRecord = record.data.find(r => r.disease_id === disease_id);
          return diseaseRecord ? diseaseRecord.average_cough_status * 100 : 0;
        }
        return 0;
      }),
      backgroundColor: getColorForDisease(disease_id),
    }))
    : diseases.map(disease_id => ({
      label: diseaseNames[disease_id] || `질병 ${disease_id}`,
      data: labels.map(label => {
        const record = chartData.find(d => moment(d.date).format('MM-DD') === label);
        if (record && record.average_data) {
          const diseaseRecord = record.average_data.find(r => r.disease_id === disease_id);
          return diseaseRecord ? diseaseRecord.average_cough_status * 100 : 0;
        }
        return 0;
      }),
      borderColor: getColorForDisease(disease_id),
      backgroundColor: getColorForDisease(disease_id),
      fill: false,
    }));

  const data = {
    labels,
    datasets,
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: showMonthly,
        ticks: {
          callback: function (value, index, values) {
            return labels[index];
          },
        },
      },
      y: {
        stacked: showMonthly,
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button className="chart-button" onClick={toggleChart}>
        {showMonthly ? '일간 차트 보기' : '월간 차트 보기'}
      </button>
      <div className={`chart-container ${showMonthly ? 'bar' : 'line'}`}>
        {showMonthly ? <Bar data={data} options={options} /> : <Line data={data} options={options} />}
      </div>
    </div>
  );
};

const getColorForDisease = (disease_id) => {
  const colors = ['#8CD700', '#30AADD', '#43919B', '#8E7AB5'];
  return colors[disease_id - 1] || 'black';
};

export default ChartComponent;
