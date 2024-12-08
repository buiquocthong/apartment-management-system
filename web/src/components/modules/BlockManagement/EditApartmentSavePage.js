import React, { useState, useEffect } from 'react';
import { Typography, message, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditApartmentForm from './EditApartmentForm';
import { API } from '../../../constant/constant';
const { Title } = Typography;
const API_URL = `${API}`;

const EditApartmentSavePage = () => {
  const { blockId, floorId, id: apartmentId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [apartmentData, setApartmentData] = useState(null);
  const [existingNames, setExistingNames] = useState([]);

  useEffect(() => {
    if (apartmentId) {
      fetchApartmentDetails();
    }
    fetchAllApartmentNames();
  }, [apartmentId]);

  const fetchApartmentDetails = async () => {
    setLoading(true);
    try {
      console.log("Fetching apartment details for ID:", apartmentId);
      const token = localStorage.getItem('token');
      if (!token) {
        message.error("Token missing. Please login again.");
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_URL}/master/api/apartments/${apartmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Apartment details fetched:", response.data);
      setApartmentData(response.data);
    } catch (error) {
      handleError(error, "Unable to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllApartmentNames = async () => {
    try {
      console.log("Fetching all apartment names...");
      const token = localStorage.getItem('token');
      if (!token) {
        message.error("Token missing. Please login again.");
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_URL}/master/api/apartments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ensure response.data is an array before mapping
      const names = Array.isArray(response.data) 
        ? response.data.map(apartment => apartment.name) 
        : [];

      console.log("Apartment names fetched:", names);
      setExistingNames(names);
    } catch (error) {
      handleError(error, "Unable to fetch apartment names");
    }
  };

  const handleError = (error, defaultMessage) => {
    console.error("Error encountered:", error);

    if (error.response) {
      const errorMessage = error.response.data?.error_desc || defaultMessage;
      console.log("Server Error Details:", error.response.data);
      message.error(errorMessage);

      if (error.response.status === 401) {
        console.log("Redirecting to login due to 401 error.");
        navigate("/login");
      }
    } else if (error.request) {
      console.log("Network Error Details:", error.message);
      message.error("Network error. Please check your connection and try again.");
    } else {
      console.log("Unexpected Error Details:", error.message);
      message.error("An unexpected error occurred.");
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log("Submitting form with values:", values);
      const token = localStorage.getItem('token');
      if (!token) {
        message.error("Token missing. Please login again.");
        navigate("/login");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      
      if (existingNames.includes(values.name) && values.name !== apartmentData.name) {
        message.error("This apartment name already exists. Please choose a different name.");
        setLoading(false);
        return;
      }

      const payload = {
        ...values,
        floor_id: floorId,
        sale_info: {
          purchase_price: values.sale_info?.purchase_price || 0,
          sale_date: values.sale_info?.sale_date || null,
        },
      };
      console.log("Payload for submission:", payload);

      const response = await axios.put(`${API_URL}/master/api/apartments/${apartmentId}`, payload, { headers });
      console.log("Update response:", response);
      message.success('Apartment updated successfully');
      navigate(`/blocks/${blockId}/floors/${floorId}/apartments`);
    } catch (error) {
      handleError(error, "Failed to save apartment");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/blocks/${blockId}/floors/${floorId}/apartments`);
  };

  if (loading && !apartmentData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Title level={3} className="mb-6">Edit Apartment</Title>
      <EditApartmentForm
        initialValues={apartmentData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        apartmentNames={existingNames}
      />
    </div>
  );
};

export default EditApartmentSavePage;
