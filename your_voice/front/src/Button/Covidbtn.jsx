import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BtnDg.css'
const Covidbtn = () => {
    const navigate = useNavigate();

    const CovidClick = () => {
        navigate('/coughUd');
    };

    return (
        <button className='dgBtn' onClick={CovidClick}>진단받기</button>
    );
};

export default Covidbtn;