import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OwnerList from './OwnerList';
import OwnerSavePage from './OwnerSavePage';

const OwnerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<OwnerList />} />
      <Route path="/new" element={<OwnerSavePage />} />
      <Route path="/edit/:ownerId" element={<OwnerSavePage />} />
    </Routes>
  );
};

export default OwnerRoutes;
