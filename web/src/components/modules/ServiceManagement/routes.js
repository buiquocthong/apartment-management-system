import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ServiceList from './ServiceList';
import ServiceSavePage from './ServiceSavePage';

const ServiceRoutes = () => {
  return (
          <Routes>
            <Route path="/" element={<ServiceList />} />
            <Route path="/new" element={<ServiceSavePage />} />
            <Route path="/edit/:serviceId" element={<ServiceSavePage />} />
          </Routes>
  );
};

export default ServiceRoutes;
