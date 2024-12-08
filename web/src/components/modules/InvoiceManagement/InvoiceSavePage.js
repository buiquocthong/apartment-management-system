import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, message, Form } from "antd";
import axios from "axios";
import InvoiceForm from "./InVoiceForm";
import { API } from '../../../constant/constant';
const InvoiceSavePage = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [form] = Form.useForm();
 const API_URL = `${API}/master/api`;

  useEffect(() => {
    if (invoiceId) {
      fetchInvoiceDetails();
    }
  }, [invoiceId]);

  const fetchInvoiceDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/invoices/${invoiceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInitialValues(response.data);
      form.setFieldsValue(response.data);
    } catch (error) {
      message.error("Failed to fetch invoice details");
      navigate("/invoices");
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const method = invoiceId ? "put" : "post";
      const endpoint = invoiceId
        ? `${API_URL}/invoices/${invoiceId}`
        : `${API_URL}/invoices`;

      const payload = { ...values, apartment_id: values.apartment_id || null };
      await axios[method](endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success(
        `Invoice ${invoiceId ? "updated" : "created"} successfully`
      );
      navigate("/invoices");
    } catch (error) {
      message.error(`Failed to ${invoiceId ? "update" : "create"} invoice`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card
        title={
          <h2 className="text-xl font-semibold">
            {invoiceId ? "Edit Invoice" : "Create New Invoice"}
          </h2>
        }
        className="shadow-sm rounded-lg"
      >
        <InvoiceForm
          form={form}
          initialValues={initialValues}
          onFinish={handleSubmit}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default InvoiceSavePage;
