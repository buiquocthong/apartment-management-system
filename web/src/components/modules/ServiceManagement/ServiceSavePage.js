import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, message, Form } from 'antd'; // Thêm import Form từ antd
import ServiceForm from './ServiceForm';
import axios from 'axios';
import { API } from '../../../constant/constant';
const ServiceSavePage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [form] = Form.useForm(); // Khai báo form từ Ant Design

  const API_URL = `${API}/master/api`;

  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInitialValues(response.data);
      form.setFieldsValue(response.data); // Đồng bộ dữ liệu vào form sau khi nhận được
    } catch (error) {
      message.error('Failed to fetch service details');
      navigate('/services');
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const method = serviceId ? 'put' : 'post';
      const endpoint = serviceId ? `${API_URL}/services/${serviceId}` : `${API_URL}/services`;

      await axios[method](endpoint, values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success(`Service ${serviceId ? 'updated' : 'created'} successfully`);
      navigate('/services');
    } catch (error) {
      message.error(`Failed to ${serviceId ? 'update' : 'create'} service`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card
        title={serviceId ? 'Edit Service' : 'Create New Service'}
        className="max-w-3xl mx-auto"
      >
        <ServiceForm
          form={form} // Truyền form instance vào component con
          initialValues={initialValues}
          onFinish={handleSubmit}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default ServiceSavePage;
