import { useParams, useNavigate } from 'react-router-dom'; 
import { Card, message, Form, Typography } from 'antd';
import UserForm from './UserForm';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { API } from '../../../../constant/constant';
const { Title } = Typography;

const UserSavePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [roles, setRoles] = useState([]);
  const [form] = Form.useForm();

  const API_URL = `${API}/identity/api`;

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInitialValues(response.data);
    } catch (error) {
      message.error('Failed to fetch user details');
      navigate('/users');
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(response.data);
    } catch (error) {
      message.error('Failed to fetch roles');
    }
  };

  useEffect(() => {
    fetchRoles();
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const handleSubmit = async (userPayload) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      if (userId) {
        await axios.put(`${API_URL}/users/${userId}`, userPayload, { headers });
        message.success('User updated successfully');
      } else {
        await axios.post(`${API_URL}/users`, userPayload, { headers });
        message.success('User created successfully');
      }

      navigate('/users');
    } catch (error) {
      console.error('Error with API:', error.response || error);
      if (error.response && error.response.status === 500) {
        message.error('Internal server error');
      } else {
        message.error('Failed to save user');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <Title level={2}>{userId ? 'Edit User' : 'Create New User'}</Title>
      <UserForm
        form={form}
        initialValues={initialValues}
        onFinish={handleSubmit}
        loading={loading}
        roles={roles}
      />
    </div>
  );
};

export default UserSavePage;
