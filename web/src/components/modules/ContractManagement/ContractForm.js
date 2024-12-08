import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Select, Button, Card, message } from "antd";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from '../../../constant/constant';
const { Option } = Select;
const API_URL = `${API}`;

const ContractForm = ({
  initialValues,
  onFinish,
  loading = false,
  form,
  apartmentIdProp,
}) => {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [floors, setFloors] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingApartments, setLoadingApartments] = useState(false);

  const fetchData = async (url) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      message.error("Failed to fetch data");
      return null;
    }
  };

  useEffect(() => {
    const loadBlocks = async () => {
      setLoadingBlocks(true);
      try {
        const data = await fetchData(`${API_URL}/master/api/blocks`);
        if (data) {
          setBlocks(data);
        }
      } finally {
        setLoadingBlocks(false);
      }
    };
    loadBlocks();
  }, []);

  const handleBlockChange = async (blockId) => {
    setSelectedBlock(blockId);
    form.setFieldsValue({
      floor: null,
      apartment_id: null,
      apartment_name: null,
    });
    setFloors([]);
    setApartments([]);

    if (!blockId) return;

    setLoadingFloors(true);
    try {
      const data = await fetchData(`${API_URL}/master/api/blocks/${blockId}/floors`);
      if (data) {
        setFloors(data);
      }
    } finally {
      setLoadingFloors(false);
    }
  };

  const handleFloorChange = async (floorId) => {
    setSelectedFloor(floorId);
    form.setFieldsValue({
      apartment_id: null,
      apartment_name: null,
    });
    setApartments([]);

    if (!floorId) return;

    setLoadingApartments(true);
    try {
      const data = await fetchData(`${API_URL}/master/api/floors/${floorId}/apartments`);
      if (data) {
        const availableApartments = data
          .filter((apartment) => apartment.status === "AVAILABLE")
          .map((apartment) => ({
            apartment_id: apartment.apartment_id,
            name: apartment.name,
          }));
        setApartments(availableApartments);
      }
    } finally {
      setLoadingApartments(false);
    }
  };

  const handleApartmentChange = (selectedApartmentId) => {
    const selectedApartment = apartments.find(
      (apt) => apt.apartment_id === selectedApartmentId
    );
    if (selectedApartment) {
      form.setFieldsValue({
        apartment_id: selectedApartment.apartment_id,
        apartment_name: selectedApartment.name,
      });
    }
  };

  const handleFormFinish = (values) => {
    const formData = {
      ...values,
      apartment_id: values.apartment_id || apartmentIdProp,
      apartment: {
        id: values.apartment_id || apartmentIdProp,
        name: values.apartment_name,
      },
    };

    onFinish(formData);
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="max-h-[600px] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormFinish}
        className="max-w-4xl mx-auto p-6"
        requiredMark
        scrollToFirstError
        initialValues={initialValues}
      >
        <Card title="Contract Information" className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Block"
              name="block"
              rules={[{ required: true, message: "Please select block!" }]}
            >
              <Select
                placeholder="Select block"
                onChange={handleBlockChange}
                loading={loadingBlocks}
              >
                {blocks.map((block) => (
                  <Option key={block.block_id} value={block.block_id}>
                    {block.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Floor"
              name="floor"
              rules={[{ required: true, message: "Please select floor!" }]}
              dependencies={["block"]}
            >
              <Select
                placeholder="Select floor"
                onChange={handleFloorChange}
                loading={loadingFloors}
                disabled={!selectedBlock}
              >
                {floors.map((floor, index) => (
                  <Option key={floor.floor_id} value={floor.floor_id}>
                    {floor.name || `Floor ${index + 1}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Apartment"
              name="apartment_id"
              rules={[{ required: true, message: "Please select apartment!" }]}
              dependencies={["block", "floor"]}
            >
              <Select
                placeholder="Select apartment"
                loading={loadingApartments}
                disabled={!selectedFloor}
                onChange={handleApartmentChange}
              >
                {apartments.map((apartment) => (
                  <Option
                    key={apartment.apartment_id}
                    value={apartment.apartment_id}
                  >
                    {apartment.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="apartment_name" hidden>
              <Input />
            </Form.Item>
          </div>

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
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
              />
            </Form.Item>

            <Form.Item
              label="End Date"
              name="end_date"
              getValueProps={(value) => ({
                value: value ? dayjs(value) : null,
              })}
            >
              <DatePicker
                className="w-full"
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="Select end date and time"
                disabled={true}
              />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select status!" }]}
              initialValue="ACTIVE"
            >
              <Select placeholder="Select status">
                <Option value="ACTIVE">ACTIVE</Option>
                <Option value="INACTIVE">INACTIVE</Option>
              </Select>
            </Form.Item>
          </div>
        </Card>

        <Card title="Owner Information" className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              label="First Name"
              name={["owner", "first_name"]}
              rules={[
                { required: true, message: "Please input first name!" },
                { max: 50, message: "First name cannot exceed 50 characters" },
              ]}
            >
              <Input placeholder="Enter first name" />
            </Form.Item>

            <Form.Item
              label="Middle Name"
              name={["owner", "middle_name"]}
              rules={[
                { max: 50, message: "Middle name cannot exceed 50 characters" },
              ]}
            >
              <Input placeholder="Enter middle name" />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name={["owner", "last_name"]}
              rules={[
                { required: true, message: "Please input last name!" },
                { max: 50, message: "Last name cannot exceed 50 characters" },
              ]}
            >
              <Input placeholder="Enter last name" />
            </Form.Item>

            <Form.Item
              label="Birth Date"
              name={["owner", "birth_day"]}
              rules={[{ required: true, message: "Please select birth date!" }]}
              getValueProps={(value) => ({
                value: value ? dayjs(value) : null,
              })}
            >
              <DatePicker
                className="w-full"
                format="YYYY-MM-DD"
                placeholder="Select birth date"
                disabledDate={(current) =>
                  current && current > dayjs().startOf("day")
                }
              />
            </Form.Item>

            <Form.Item
              label="Gender"
              name={["owner", "gender"]}
              rules={[{ required: true, message: "Please select gender!" }]}
            >
              <Select placeholder="Select gender">
                <Option value="MALE">Male</Option>
                <Option value="FEMALE">Female</Option>
                <Option value="OTHER">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="ID Card Number"
              name={["owner", "id_card_number"]}
              rules={[
                { required: true, message: "Please input ID card number!" },
              ]}
            >
              <Input placeholder="Enter ID card number" />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name={["owner", "phone_number"]}
              rules={[
                { required: true, message: "Please input phone number!" },
              ]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item
              label="Email"
              name={["owner", "email"]}
              rules={[
                { type: "email", message: "Please input a valid email!" },
                { required: true, message: "Please input email!" },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>

            <Form.Item
              label="Street"
              name={["owner", "street"]}
              rules={[{ required: true, message: "Please input street!" }]}
            >
              <Input placeholder="Enter street" />
            </Form.Item>

            <Form.Item
              label="City"
              name={["owner", "city"]}
              rules={[{ required: true, message: "Please input city!" }]}
            >
              <Input placeholder="Enter city" />
            </Form.Item>

            <Form.Item
              label="District"
              name={["owner", "district"]}
              rules={[{ required: true, message: "Please input district!" }]}
            >
              <Input placeholder="Enter district" />
            </Form.Item>

            <Form.Item
              label="Ward"
              name={["owner", "ward"]}
              rules={[{ required: true, message: "Please input ward!" }]}
            >
              <Input placeholder="Enter ward" />
            </Form.Item>

            <Form.Item label="Career" name={["owner", "career"]}>
              <Input placeholder="Enter career" />
            </Form.Item>
          </div>
        </Card>

        <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 mt-6">
          <Form.Item className="mb-0">
            <div className="flex gap-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Submit
              </Button>
              <Button 
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

ContractForm.propTypes = {
  initialValues: PropTypes.object,
  onFinish: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  form: PropTypes.object.isRequired,
  apartmentIdProp: PropTypes.string,
};

export default ContractForm;