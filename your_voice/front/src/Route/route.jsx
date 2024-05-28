import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPg from '../MainPg/MainPg.jsx';
import LoadingPage from '../loading_page/loading_page.jsx';
import Diagnosis_page from '../diagnosis_page/diagnosis_page.jsx'
import CoughUd from '../upload2/coughUd.jsx'
import MyPage from '../my_page/my_page.jsx'

const RoutesComponent = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPg />} />
                <Route path="/loading_page" element={<LoadingPage />} />
                <Route path='/diagnosis_page' element={<Diagnosis_page />} />
                <Route path="/coughUd" element={<CoughUd />} />
                <Route path="/my_page" element={<MyPage />} />
            </Routes>
        </Router>
    );
};

export default RoutesComponent;