import React, { useEffect, useState } from "react";
import { Card, Button, Form, Input, message, Typography } from "antd";
import axios from "axios";
import { API } from '../constant/constant';
const { Title } = Typography;

const ServiceDetailsView = ({ serviceDetailId }) => {
  const [serviceDetail, setServiceDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const API_URL = "http://localhost:8080/master/api";

  const fetchServiceDetail = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/service_details/${serviceDetailId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServiceDetail(response.data);
      form.setFieldsValue(response.data);
      // message.success("Service detail fetched successfully");
    } catch (error) {
      message.error("Failed to fetch service detail");
      console.error("Error fetching service detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateServiceDetail = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/service_details/${serviceDetailId}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Service detail updated successfully");
      fetchServiceDetail(); // Refresh the data after update
    } catch (error) {
      message.error("Failed to update service detail");
      console.error("Error updating service detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serviceDetailId) {
      fetchServiceDetail();
    }
  }, [serviceDetailId]);

  return (
    <div className="p-6 max-w-md mx-auto">
      <Card loading={loading} title="Service Detail" className="shadow-sm">
        {serviceDetail ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={updateServiceDetail}
            initialValues={serviceDetail}
          >
            <Form.Item label="Service Detail ID" name="service_detail_id">
              <Input readOnly />
            </Form.Item>
            <Form.Item
              label="New Value"
              name="new_value"
              rules={[{ required: true, message: "Please input the new value!" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Old Value"
              name="old_value"
              rules={[{ required: true, message: "Please input the old value!" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Service Detail
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <p>No service detail data available.</p>
        )}
      </Card>
    </div>
  );
};

export default ServiceDetailsView;
