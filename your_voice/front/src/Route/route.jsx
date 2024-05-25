import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPg from '../MainPg/MainPg.jsx';
import LoadingPage from '../loading_page/loading_page.jsx';

const RoutesComponent  = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPg />} />
                <Route path="/loading_page" element={<LoadingPage />} />
            </Routes>
        </Router>
    );
};

export default RoutesComponent ;