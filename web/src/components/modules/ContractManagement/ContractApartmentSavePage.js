import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, message, Form } from 'antd';
import ContractApartmentForm from './ContractApartmentForm';
import axios from 'axios';
import { API } from '../../../constant/constant';
const ContractApartmentSavePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const API_URL = `${API}/master/api`;

  // Lấy apartmentId từ Local Storage
  const apartmentId = localStorage.getItem('apartment_id');

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = `${API_URL}/contracts`;

      // Chuẩn bị payload để gửi lên server
      const payload = {
        ...values,
        apartment_id: apartmentId, // Thêm apartment_id từ Local Storage
      };

      // Gửi yêu cầu tạo contract
      await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Hiển thị thông báo thành công và điều hướng
      message.success('Contract created successfully');
      navigate('/contracts');
    } catch (error) {
      // Hiển thị thông báo lỗi
      message.error('Failed to create contract');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card
        title={<h2 className="text-xl font-semibold">Create New Apartment Contract</h2>}
        className="shadow-sm rounded-lg"
      >
        <ContractApartmentForm
          form={form}
          onFinish={handleSubmit}
          loading={loading}
          initialValues={{ apartment_id: apartmentId }}
        />
      </Card>
    </div>
  );
};

export default ContractApartmentSavePage;
