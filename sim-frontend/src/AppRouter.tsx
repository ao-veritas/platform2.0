import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './_pages/HomePage';
import RegisterProject from './_pages/RegisterProject';
import Saturn from './_pages/Saturn';
import Faucet from './_pages/Faucet';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterProject />} />
        <Route path="/saturn" element={<Saturn />} />
        <Route path="/faucet" element={<Faucet />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
