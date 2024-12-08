import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RecordList from './RecordList';
import InactiveRecordList from './InactiveRecordList';
import RecordSavePage from './RecordSavePage';
import RecordApartmentSavePage from './RecordApartmentSavePage';
import RenterAddSavePage from './RenterAddSavePage';

const RecordRoutes = () => {
  return (
          <Routes>
            <Route path="/" element={<RecordList />} />
            <Route path="/inactive_record" element={<InactiveRecordList />} />
            <Route path="/new" element={<RecordSavePage />} />
            <Route path="/edit/:recordId" element={<RecordSavePage />} />
            <Route path="/new_on_apartment" element={<RecordApartmentSavePage/>} />
            <Route path="/add_new_sub_renter" element={<RenterAddSavePage />} />
          </Routes>
  );
};

export default RecordRoutes;
