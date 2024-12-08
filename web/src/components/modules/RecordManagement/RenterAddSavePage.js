import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, message, Form } from "antd";
import RenterAddForm from "./RenterAddForm";
import axios from "axios";
import { API } from '../../../constant/constant';
const RenterAddSavePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const API_URL = `${API}/master/api/renters`;

  const record_id = location.state?.record_id;

  useEffect(() => {
    console.log("Received record_id:", record_id);
    if (!record_id) {
      message.error("Record ID is missing. Unable to proceed.");
      navigate("/records");
      return;
    }
  }, [record_id, navigate]);

  const handleSave = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...values,
        birth_day: values.birth_day ? values.birth_day.format("YYYY-MM-DD") : null,
        record_id,
      };

      await axios.post(API_URL, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Renter added successfully!");
      navigate("/records");
    } catch (error) {
      message.error("Failed to add renter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card title="Add New Sub Renter">
        <RenterAddForm
          form={form}
          initialValues={{}}
          onFinish={handleSave}
          loading={loading}
          record_id={record_id}
        />
      </Card>
    </div>
  );
};

export default RenterAddSavePage;
