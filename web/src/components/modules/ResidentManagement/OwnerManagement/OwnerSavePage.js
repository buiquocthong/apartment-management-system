import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, message, Form } from 'antd';
import OwnerForm from './OwnerForm';
import axios from 'axios';
import dayjs from 'dayjs';
import { API } from '../../../../constant/constant';
const OwnerSavePage = () => {
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [form] = Form.useForm();
  const API_URL = `${API}/master/api/owners`;


  const handleCancel = () => {
    navigate('/residents/owners');
  };

  useEffect(() => {
    if (ownerId) {
      fetchOwnerDetails();
    }
  }, [ownerId]);

  const fetchOwnerDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Authorization token is missing. Please log in again.');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/${ownerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Transform dates before setting form values
      const transformedData = {
        ...response.data,
        birth_day: response.data.birth_day ? dayjs(response.data.birth_day) : undefined
      };

      setInitialValues(transformedData);
      form.setFieldsValue(transformedData);
      // message.success('Owner details fetched successfully');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        message.error('Owner not found. Returning to owner list.');
      } else {
        message.error('Failed to fetch owner details');
      }
      navigate('/residents/owners');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Authorization token is missing. Please log in again.');
        navigate('/login');
        return;
      }
      const householdId = localStorage.getItem('householdId');
      if (householdId) {
        values.household_id = householdId;
      }
      
      // Transform date before sending to API
      const transformedValues = {
        ...values,
        birth_day: values.birth_day 
          ? (dayjs.isDayjs(values.birth_day) 
            ? values.birth_day.format('YYYY-MM-DD') 
            : values.birth_day)
          : null
      };
      
      const method = ownerId ? 'put' : 'post';
      const endpoint = ownerId ? `${API_URL}/${ownerId}` : API_URL;
      await axios[method](endpoint, transformedValues, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      message.success(`Owner ${ownerId ? 'updated' : 'created'} successfully`);
      navigate('/residents/owners');
    } catch (error) {
      message.error(`Failed to ${ownerId ? 'update' : 'create'} owner`);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card title={<h2 className="text-xl font-semibold">{ownerId ? 'Edit Owner' : 'Add Owner'}</h2>} className="shadow-sm rounded-lg">
        <OwnerForm 
          form={form} 
          initialValues={initialValues} 
          onFinish={handleSubmit} 
          loading={loading}
          onCancel={handleCancel}
        />
      </Card>
    </div>
  );
};

export default OwnerSavePage;