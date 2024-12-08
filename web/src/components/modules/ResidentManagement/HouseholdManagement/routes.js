import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HouseholdList from './HouseholdList';

const HouseholdRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HouseholdList />} />
    </Routes>
  );
};

export default HouseholdRoutes;
