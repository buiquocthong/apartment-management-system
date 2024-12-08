import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd';
import axios from 'axios';
import BlockForm from './BlockForm';
import { API } from '../../../constant/constant';
const BlockSavePage = () => {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const API_URL = `${API}`;

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/master/api/blocks`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Block added successfully');
      navigate('/blocks');
    } catch (error) {
      if (error.response) {
        message.error(`Failed to add block: ${error.response.data.message || 'Unknown error'}`);
      } else {
        message.error('An error occurred while adding the block');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>Add New Block</h2>
      {saving ? <Spin size="large" /> : <BlockForm onFinish={handleSubmit} initialValues={{}} loading={saving} />}
    </div>
  );
};

export default BlockSavePage;