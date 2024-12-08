import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InvoiceList from './InvoiceList'; 
import InvoiceSavePage from './InvoiceSavePage'; 
import InvoiceApartmentSavePage from './InvoiceApartmentSavePage'; 


const InvoiceRoutes = () => {
  return (
          <Routes>
            <Route path="/" element={<InvoiceList />} />
            <Route path="/new" element={<InvoiceSavePage />} />
            <Route path="/edit/:invoiceId" element={<InvoiceSavePage />} />
            <Route path="/new_on_apartment" element={<InvoiceApartmentSavePage />} />
          </Routes>
  );
};

export default InvoiceRoutes;
