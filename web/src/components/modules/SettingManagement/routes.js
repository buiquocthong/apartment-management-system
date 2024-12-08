import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Setting from './Setting';


const SettingRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Setting />} />
    </Routes>
  );
};

export default SettingRoutes;
