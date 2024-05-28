// 차트 페이지

import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import moment from 'moment';

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

  const toggleChart = () => {
    setShowWeekly(!showWeekly);
  };

  const labels = showWeekly ? getLast4Weeks() : getLast7Days();
  const data = {
    labels,
    datasets: [
      {
        label: showWeekly ? '주간 차트' : '일간 차트',
        data: showWeekly ? [90, 70, 65, 45] : [5, 30, 40, 50, 20, 80, 100], // 예시 데이터
        backgroundColor: 'coral',
        borderColor: 'coral',
        borderWidth: 1,

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
          stepSize: 10,
        },
      },
    },
  };

  return (
    <div>
      <button onClick={toggleChart}>
        {showWeekly ? '일간 차트 보기' : '주간 차트 보기'}
      </button>
      <div style={{ height: '60vh', width: '30vw' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartComponent;
