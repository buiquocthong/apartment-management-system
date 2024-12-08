import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ContractList from './ContractList';
import ContractSavePage from './ContractSavePage';
import ContractApartmentSavePage from './ContractApartmentSavePage';

const ContractRoutes = () => {
  return (
          <Routes>
            <Route path="/" element={<ContractList />} />
            <Route path="/new" element={<ContractSavePage />} />
            <Route path="/edit/:contractId" element={<ContractSavePage />} />
            <Route path="/new_on_apartment" element={<ContractApartmentSavePage/>} />
          </Routes>
  );
};

export default ContractRoutes;
