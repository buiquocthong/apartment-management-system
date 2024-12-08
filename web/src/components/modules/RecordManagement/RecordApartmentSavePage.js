import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, message, Form } from 'antd';
import RecordApartmentForm from './RecordApartmentForm';

const RecordApartmentSavePage = () => {
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const apartmentId = localStorage.getItem('apartment_id');
    if (!apartmentId) {
      message.error('No apartment selected');
      navigate('/records');
    } else {
      setInitialValues({ apartment_id: apartmentId });
    }
  }, [navigate]);

  const handleFinish = (values) => {
    // Navigate to the records page after successful submission
    navigate('/records');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card 
        title="Create New Record for Selected Apartment"
        className="shadow-md rounded-lg"
      >
        <RecordApartmentForm
          form={form}
          initialValues={initialValues}
          onFinish={handleFinish}
        />
      </Card>
    </div>
  );
};

export default RecordApartmentSavePage;
