import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, message, Form } from 'antd';
import RenterForm from './RenterForm';
import axios from 'axios';
import { API } from '../../../../constant/constant';
const RenterSavePage = () => {
  const { renterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [form] = Form.useForm();
  const API_URL = `${API}/master/api/renters`;
  
  // Check if we're adding directly from Renter Management
  const isDirectAdd = location.pathname.includes('/direct-add');

  useEffect(() => {
    if (renterId) {
      const fetchRenter = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_URL}/${renterId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setInitialValues({
            ...response.data,
            birth_day: response.data.birth_day
              ? response.data.birth_day.split('T')[0]
              : null,
          });
        } catch (error) {
          message.error('Failed to fetch renter details');
          navigate('/residents/renters');
        } finally {
          setLoading(false);
        }
      };

      fetchRenter();
    }
  }, [renterId, navigate, API_URL]);

  const handleSave = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...values,
        birth_day: values.birth_day.format('YYYY-MM-DD'),
      };

      if (renterId) {
        await axios.put(`${API_URL}/${renterId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success('Renter updated successfully');
      } else {
        // If adding directly, we already have apartment_id from the form
        // If not, we get it from localStorage
        if (!isDirectAdd) {
          payload.apartment_id = localStorage.getItem('selected_apartment_id');
        }
        
        await axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success('Renter added successfully');
      }

      navigate('/residents/renters');
    } catch (error) {
      message.error(`Failed to ${renterId ? 'update' : 'add'} renter`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card title={renterId ? 'Edit Renter' : 'Add New Renter'}>
        <RenterForm
          form={form}
          initialValues={initialValues}
          onFinish={handleSave}
          loading={loading}
          isDirectAdd={isDirectAdd}
        />
      </Card>
    </div>
  );
};

export default RenterSavePage;