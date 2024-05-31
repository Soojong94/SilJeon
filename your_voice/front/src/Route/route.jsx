import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoadingPage from '../loading_page/loading_page.jsx';
import Diagnosis_page from '../diagnosis_page/diagnosis_page.jsx'
import CoughUd from '../upload2/coughUd.jsx'
import NewMainPg from '../NewMain/NewMainPg.jsx'
import MyPage from '../my_page/my_page.jsx'
import Record_voice from '../recording_page/recording.jsx';


const RoutesComponent = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<NewMainPg />} />
                <Route path="/loading_page" element={<LoadingPage />} />
                <Route path='/Diagnosis_page' element={<Diagnosis_page />} />
                <Route path="/coughUd" element={<CoughUd />} />
                <Route path="/NewMainPg" element={<NewMainPg />} />
                <Route path="/MyPage" element={<MyPage />} />
                <Route path="/Record_voice" element={<Record_voice />} />
            </Routes>
        </Router>
    );
};

export default RoutesComponent;
