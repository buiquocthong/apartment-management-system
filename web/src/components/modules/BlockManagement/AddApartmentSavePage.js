import React, { useState, useEffect } from 'react';
import { Typography, message, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddApartmentForm from './AddApartmentForm';
import { API } from '../../../constant/constant';
const { Title } = Typography;
const API_URL = `${API}/master/api`;

const AddApartmentSavePage = () => {
  const { blockId, floorId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [existingApartmentNames, setExistingApartmentNames] = useState([]);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/floors/${floorId}/apartments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExistingApartmentNames(response.data.map(apartment => apartment.name));
      } catch (error) {
        console.error("Error fetching apartments:", error);
      }
    };
    fetchApartments();
  }, [floorId]);

  const handleSubmit = async (values) => {
    // Check for duplicate names
    if (existingApartmentNames.includes(values.name)) {
      message.error("Apartment name already exists. Please choose another name.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const payload = {
        name: values.name,
        area: values.area,
        furniture: values.furniture,
        status: "AVAILABLE",
        sale_info: {
          purchase_price: values.sale_info?.purchase_price || 0,
          sale_date: values.sale_info?.sale_date instanceof Date ? values.sale_info.sale_date.toISOString() : null,
        },
        number_of_bedroom: values.number_of_bedroom,
        number_of_bathroom: values.number_of_bathroom,
        floor_id: floorId,
      };

      await axios.post(`${API_URL}/apartments`, payload, { headers });
      message.success('Apartment added successfully');
      navigate(`/blocks/${blockId}/floors/${floorId}/apartments`);
    } catch (error) {
      console.error("Error:", error.message);
      message.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/blocks/${blockId}/floors/${floorId}/apartments`);
  };

  return (
    <div className="p-6">
      <Title level={3} className="mb-6">Add New Apartment</Title>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <AddApartmentForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          existingApartmentNames={existingApartmentNames}
        />
      )}
    </div>
  );
};

export default AddApartmentSavePage;