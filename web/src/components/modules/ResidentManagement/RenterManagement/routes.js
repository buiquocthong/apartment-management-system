import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RenterList from './RenterList';
import RenterSavePage from './RenterSavePage';

const RenterRoutes = () => (
  <Routes>
    <Route path="/" element={<RenterList />} />
    <Route path="edit/:renterId" element={<RenterSavePage />} />
  </Routes>
);

export default RenterRoutes;
