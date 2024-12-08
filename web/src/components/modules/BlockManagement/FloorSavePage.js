import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import FloorForm from './FloorForm';
import { API } from '../../../constant/constant';
const FloorSavePage = ({ setTotalFloors }) => {
  const [saving, setSaving] = useState(false);
  const { blockId } = useParams();
  const navigate = useNavigate();
 const API_URL = `${API}`;
  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const payload = { ...values, block_id: blockId };

      await axios.post(`${API_URL}/master/api/floors`, payload, { headers });
      message.success('Floor added successfully');

      // Tăng total_floors trong UI
      setTotalFloors((prevTotal) => prevTotal + 1);

      // Điều hướng về trang /blocks
      navigate('/blocks');
    } catch (error) {
      message.error('Failed to save floor');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>Add New Floor</h2>
      <FloorForm onFinish={handleSubmit} initialValues={{}} loading={saving} />
    </div>
  );
};

export default FloorSavePage;
