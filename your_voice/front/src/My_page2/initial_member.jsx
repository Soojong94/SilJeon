import React, { useState, useEffect } from 'react';
import './initial_member.css'; // ./initial_member.css 경로를 사용하여 수정
import MenuBar from '../Route/menu';
import axios from 'axios';

const Initial = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem('user_info');
    if (storedUserInfo) {
      const { id } = JSON.parse(storedUserInfo);
      setUserId(id);
    }
  }, []);

  const handleDeleteAccount = async () => {
    if (userId) {
      const confirmDelete = window.confirm('정말로 회원탈퇴를 하시겠습니까?');
      if (!confirmDelete) return;

      try {
        const response = await axios.post('http://localhost:5000/api/deleteAccount', { userId });
        if (response.status === 200) {
          alert('회원탈퇴가 완료되었습니다.');
          sessionStorage.removeItem('user_info');
          // 추가로 필요한 작업 수행 (예: 로그아웃 처리 등)
          window.location.href = '/'; // 홈으로 리디렉션
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('회원탈퇴 중 오류가 발생했습니다.');
      }
    } else {
      alert('유저 아이디를 불러올 수 없습니다.');
    }
  };

  const handleResetChart = async () => {
    if (userId) {
      const confirmReset = window.confirm('차트를 초기화하시겠습니까? 초기화하면 기록은 복구할 수 없습니다.');
      if (!confirmReset) return;

      try {
        await axios.post('http://localhost:5000/api/resetChart', { userId });
        alert('차트 초기화가 완료되었습니다.');
        // 추가로 필요한 작업 수행
      } catch (error) {
        console.error('Error resetting chart:', error);
        alert('차트 초기화 중 오류가 발생했습니다.');
      }
    } else {
      alert('유저 아이디를 불러올 수 없습니다.');
    }
  };

  return (
    <div className='initialBg'>
      <MenuBar />
      <div className='initial-box'>
        <button className='initialBtn' onClick={handleDeleteAccount}>회원탈퇴</button>
        <button className='initialBtn' onClick={handleResetChart}>차트 초기화</button>
      </div>
    </div>
  );
};

export default Initial;
