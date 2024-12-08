import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Form, Input, DatePicker, Select, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import axios from "axios";
import { API } from '../../../../constant/constant';
const { Option } = Select;

const RenterForm = ({
  initialValues,
  onFinish,
  loading = false,
  form,
  isDirectAdd = false,
  onCancel,
}) => {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [floors, setFloors] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);

  // Memoize API calls configuration
  const apiConfig = useMemo(() => {
    const token = localStorage.getItem("token");
    return {
      headers: { Authorization: `Bearer ${token}` },
      baseURL: `${API}`,
    };
  }, []);

  // Handle form initialization
  useEffect(() => {
    if (initialValues) {
      const formattedValues = {
        ...initialValues,
        birth_day: initialValues.birth_day
          ? dayjs(initialValues.birth_day)
          : null,
      };
      form.setFieldsValue(formattedValues);
    }
  }, [initialValues, form]);

  // Fetch blocks data
  const fetchBlocks = useCallback(async () => {
    if (!isDirectAdd) return;
    
    setFetchingData(true);
    try {
      const response = await axios.get("/blocks", apiConfig);
      setBlocks(response.data);
    } catch (error) {
      message.error("Failed to fetch blocks. Please try again.");
      console.error("Failed to fetch blocks:", error);
    } finally {
      setFetchingData(false);
    }
  }, [isDirectAdd, apiConfig]);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  // Handle block selection
  const handleBlockChange = useCallback(async (blockId) => {
    setSelectedBlock(blockId);
    setSelectedFloor(null);
    form.setFieldsValue({ floor_id: undefined, apartment_id: undefined });
    setFetchingData(true);

    try {
      const response = await axios.get(
        `/blocks/${blockId}/floors`,
        apiConfig
      );
      setFloors(response.data);
      setApartments([]);
    } catch (error) {
      message.error("Failed to fetch floors. Please try again.");
      console.error("Failed to fetch floors:", error);
    } finally {
      setFetchingData(false);
    }
  }, [apiConfig, form]);

  // Handle floor selection
  const handleFloorChange = useCallback(async (floorId) => {
    setSelectedFloor(floorId);
    form.setFieldsValue({ apartment_id: undefined });
    setFetchingData(true);

    try {
      const response = await axios.get(
        `/blocks/${selectedBlock}/floors/${floorId}/apartments`,
        apiConfig
      );
      const availableApartments = response.data.filter(
        (apt) => apt.status !== "SOLD"
      );
      setApartments(availableApartments);
    } catch (error) {
      message.error("Failed to fetch apartments. Please try again.");
      console.error("Failed to fetch apartments:", error);
    } finally {
      setFetchingData(false);
    }
  }, [selectedBlock, apiConfig, form]);

  // Handle form submission
  const handleSubmit = useCallback(async (values) => {
    try {
      await onFinish(values);
    } catch (error) {
      message.error("Failed to submit form. Please try again.");
      console.error("Form submission error:", error);
    }
  }, [onFinish]);

  // Handle cancel action - Navigate back
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1); // Navigate back to previous page
    }
  }, [navigate, onCancel]);

  // Memoize form sections
  const ApartmentSelectionSection = useMemo(() => (
    isDirectAdd && (
      <Card title="Apartment Selection" className="mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item
            label="Block"
            name="block_id"
            rules={[{ required: true, message: "Please select a block" }]}
          >
            <Select 
              placeholder="Select block" 
              onChange={handleBlockChange}
              loading={fetchingData}
              disabled={fetchingData}
            >
              {blocks.map((block) => (
                <Option key={block.id} value={block.id}>
                  {block.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Floor"
            name="floor_id"
            rules={[{ required: true, message: "Please select a floor" }]}
          >
            <Select
              placeholder="Select floor"
              disabled={!selectedBlock || fetchingData}
              onChange={handleFloorChange}
              loading={fetchingData}
            >
              {floors.map((floor) => (
                <Option key={floor.id} value={floor.id}>
                  {floor.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Apartment"
            name="apartment_id"
            rules={[{ required: true, message: "Please select an apartment" }]}
          >
            <Select
              placeholder="Select apartment"
              disabled={!selectedFloor || fetchingData}
              loading={fetchingData}
            >
              {apartments.map((apartment) => (
                <Option key={apartment.id} value={apartment.id}>
                  {apartment.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </Card>
    )
  ), [isDirectAdd, blocks, floors, apartments, selectedBlock, selectedFloor, fetchingData, handleBlockChange, handleFloorChange]);

  return (
    <div className="max-h-[600px] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="max-w-4xl mx-auto p-6"
        requiredMark
        scrollToFirstError
      >
        {ApartmentSelectionSection}

        <Card title="Renter Information" className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="First Name"
              name="first_name"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Middle Name" name="middle_name">
              <Input />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="last_name"
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Birth Day"
              name="birth_day"
              rules={[{ required: true, message: "Please select birth day" }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Please select gender" }]}
            >
              <Select>
                <Option value="MALE">Male</Option>
                <Option value="FEMALE">Female</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Career" name="career">
              <Input />
            </Form.Item>
          </div>
        </Card>

        <Card title="Contact Information" className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Phone Number"
              name="phone_number"
              rules={[
                { required: true, message: "Please enter phone number" },
                { pattern: /^\d+$/, message: "Please enter valid phone number" }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter valid email" }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="ID Card Number"
              name="id_card_number"
              rules={[{ required: true, message: "Please enter ID card number" }]}
            >
              <Input />
            </Form.Item>
          </div>
        </Card>

        <Card title="Address" className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Street"
              name="street"
              rules={[{ required: true, message: "Please enter street" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item 
              label="Ward" 
              name="ward" 
              rules={[{ required: true, message: "Please enter ward" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="District"
              name="district"
              rules={[{ required: true, message: "Please enter district" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item 
              label="City" 
              name="city" 
              rules={[{ required: true, message: "Please enter city" }]}
            >
              <Input />
            </Form.Item>
          </div>
        </Card>

        <Card title="Head" className="mb-6 shadow-sm">
          <Form.Item label="Household Head" name="household_head">
            <div className="px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  initialValues?.household_head
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {initialValues?.household_head ? "Yes" : "No"}
              </span>
            </div>
          </Form.Item>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button 
            onClick={handleCancel} 
            className="min-w-[100px]"
            disabled={loading || fetchingData}
          >
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            disabled={fetchingData}
            className="min-w-[100px]"
          >
            {initialValues ? 'Update Renter' : 'Add Renter'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

RenterForm.propTypes = {
  initialValues: PropTypes.object,
  onFinish: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  form: PropTypes.object.isRequired,
  isDirectAdd: PropTypes.bool,
  onCancel: PropTypes.func,
};

export default RenterForm;