import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Select, Button, Card, message } from "antd";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from '../../../constant/constant';
const { Option } = Select;
const API_URL = `${API}`;

const RecordApartmentForm = ({ initialValues, onFinish, loading = false, form: externalForm }) => {
  const [form] = Form.useForm(externalForm);
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApartmentDetails = async () => {
      const apartmentId = localStorage.getItem("apartment_id");
      if (!apartmentId) {
        message.error("Apartment ID not found in local storage");
        return;
      }
      await handleApartmentChange(apartmentId);
    };

    fetchApartmentDetails();
  }, [form]);

  const handleApartmentChange = async (selectedApartmentId) => {
    if (!selectedApartmentId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/master/api/apartments/${selectedApartmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const selectedApartment = response.data;
      if (selectedApartment) {
        form.setFieldsValue({
          apartment_id: selectedApartment.apartment_id,
          owner_id: selectedApartment.owner?.owner_id || null,
        });
      }
    } catch (error) {
      message.error("Failed to fetch apartment details");
    }
  };

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    try {
      const payload = {
        owner_id: form.getFieldValue("owner_id"),
        renter: {
          birth_day: values.renter.birth_day.format("YYYY-MM-DD"),
          career: values.renter.career,
          city: values.renter.city,
          district: values.renter.district,
          email: values.renter.email,
          first_name: values.renter.first_name,
          gender: values.renter.gender,
          id_card_number: values.renter.id_card_number,
          last_name: values.renter.last_name,
          middle_name: values.renter.middle_name,
          phone_number: values.renter.phone_number,
          street: values.renter.street,
          ward: values.renter.ward,
          record_id: values.apartment_id,
        },
        start_date: values.start_date.toISOString(),
        end_date: values.end_date.toISOString(),
        status: values.status,
      };

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authorization token is missing");

      await axios.post(`${API_URL}/master/api/records`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // message.success("Record created successfully");
      if (onFinish) onFinish(values);
    } catch (error) {
      message.error("Failed to create record");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-h-[600px] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="max-w-4xl mx-auto p-6"
        requiredMark
        scrollToFirstError
        initialValues={{ ...initialValues, apartment_id: localStorage.getItem("apartment_id") }}
      >
        <Card title="Record Information" className="mb-6 shadow-sm">
          <Form.Item name="apartment_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="owner_id" hidden>
            <Input />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Start Date"
              name="start_date"
              rules={[
                { required: true, message: "Please select start date!" },
                {
                  validator: (_, value) => {
                    if (value && value.isBefore(dayjs(), "day")) {
                      return Promise.reject("Start date cannot be in the past");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              getValueProps={(value) => ({
                value: value ? dayjs(value) : null,
              })}
            >
              <DatePicker
                className="w-full"
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="Select start date and time"
                disabledDate={(current) => current && current < dayjs().startOf("day")}
              />
            </Form.Item>

            <Form.Item
              label="End Date"
              name="end_date"
              rules={[
                { required: true, message: "Please select end date!" },
                {
                  validator: (_, value) => {
                    const startDate = form.getFieldValue("start_date");
                    if (startDate && value && value.isBefore(startDate)) {
                      return Promise.reject("End date must be after start date");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              getValueProps={(value) => ({
                value: value ? dayjs(value) : null,
              })}
            >
              <DatePicker
                className="w-full"
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="Select end date and time"
              />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select status!" }]}
              initialValue="ACTIVE"
            >
              <Select placeholder="Select status">
                <Option value="ACTIVE">Active</Option>
                <Option value="INACTIVE">Inactive</Option>
              </Select>
            </Form.Item>
          </div>
        </Card>

        <Card title="Renter Information" className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              label="First Name"
              name={["renter", "first_name"]}
              rules={[{ required: true, message: "Please input first name!" }]}
            >
              <Input placeholder="Enter first name" />
            </Form.Item>

            <Form.Item
              label="Middle Name"
              name={["renter", "middle_name"]}
              rules={[{ required: true, message: "Please input middle name!" }]}
            >
              <Input placeholder="Enter middle name" />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name={["renter", "last_name"]}
              rules={[{ required: true, message: "Please input last name!" }]}
            >
              <Input placeholder="Enter last name" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Birth Day"
              name={["renter", "birth_day"]}
              rules={[{ required: true, message: "Please select birth day!" }]}
              getValueProps={(value) => ({
                value: value ? dayjs(value) : null,
              })}
            >
              <DatePicker
                className="w-full"
                format="YYYY-MM-DD"
                placeholder="Select birth day"
                disabledDate={(current) => current && current > dayjs().endOf("day")}
              />
            </Form.Item>

            <Form.Item
              label="Gender"
              name={["renter", "gender"]}
              rules={[{ required: true, message: "Please select gender!" }]}
              initialValue="MALE"
            >
              <Select placeholder="Select gender">
                <Option value="MALE">Male</Option>
                <Option value="FEMALE">Female</Option>
                <Option value="OTHER">Other</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Email"
              name={["renter", "email"]}
              rules={[{ required: true, message: "Please input email!" }]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name={["renter", "phone_number"]}
              rules={[{ required: true, message: "Please input phone number!" }]}
            >
              <Input placeholder="Enter phone number" maxLength={11} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Form.Item
              label="City"
              name={["renter", "city"]}
              rules={[{ required: true, message: "Please input city!" }]}
            >
              <Input placeholder="Enter city" />
            </Form.Item>

            <Form.Item
              label="District"
              name={["renter", "district"]}
              rules={[{ required: true, message: "Please input district!" }]}
            >
              <Input placeholder="Enter district" />
            </Form.Item>

            <Form.Item
              label="Ward"
              name={["renter", "ward"]}
              rules={[{ required: true, message: "Please input ward!" }]}
            >
              <Input placeholder="Enter ward" />
            </Form.Item>

            <Form.Item
              label="Street"
              name={["renter", "street"]}
              rules={[{ required: true, message: "Please input street!" }]}
            >
              <Input placeholder="Enter street" />
            </Form.Item>
          </div>

          <Form.Item label="Career" name={["renter", "career"]}>
            <Input placeholder="Enter career" />
          </Form.Item>

          <Form.Item
            label="ID Card Number"
            name={["renter", "id_card_number"]}
            rules={[{ required: true, message: "Please input ID card number!" }]}
          >
            <Input placeholder="Enter ID card number" maxLength={12} />
          </Form.Item>
        </Card>

        <div className="flex justify-end space-x-4 sticky bottom-0 bg-white pt-4 border-t border-gray-200 mt-6">
          <Button onClick={() => navigate(-1)} className="bg-gray-200 hover:bg-gray-300">
            Cancel
          </Button>
          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              loading={submitLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

RecordApartmentForm.propTypes = {
  initialValues: PropTypes.object,
  onFinish: PropTypes.func,
  loading: PropTypes.bool,
  form: PropTypes.object,
};

export default RecordApartmentForm;
