// RecordSavePage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, message, Form } from "antd";
import RecordForm from "./RecordForm";
import axios from "axios";
import dayjs from "dayjs";
import { API } from '../../../constant/constant';
const API_URL = `${API}`;

const RecordSavePage = () => {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (recordId) {
      fetchRecordDetails();
    }
  }, [recordId]);

  const fetchRecordDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authorization token is missing");

      const response = await axios.get(`${API_URL}/master/api/records/${recordId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedData = {
        ...response.data,
        start_date: response.data.start_date && dayjs(response.data.start_date),
        end_date: response.data.end_date && dayjs(response.data.end_date),
        renter: {
          ...response.data.renter,
          birth_day: response.data.renter?.birth_day && dayjs(response.data.renter.birth_day),
        },
      };

      setInitialValues(formattedData);
      form.setFieldsValue(formattedData);
    } catch (error) {
      message.error("Failed to fetch record details");
      navigate("/records");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card
        title={
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">
              {recordId ? "Edit Record" : "Create New Record"}
            </h1>
          </div>
        }
        className="shadow-md rounded-lg"
      >
        <RecordForm
          form={form}
          initialValues={initialValues}
          loading={loading}
          onFinish={() => navigate("/records")}
        />
      </Card>
    </div>
  );
};

export default RecordSavePage;
