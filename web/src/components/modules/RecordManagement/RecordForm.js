import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Select, Button, Card, message } from "antd";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import renterRecordApi from "../../../services/renterRecordApi";
import { API } from '../../../constant/constant';
const { Option } = Select;
const API_URL = `${API}`;

const RecordForm = ({ initialValues, onFinish, loading = false, form: externalForm }) => {
  const [form] = Form.useForm(externalForm);
  const [blocks, setBlocks] = useState([]);
  const [floors, setFloors] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingApartments, setLoadingApartments] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [records, setRecords] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const loadBlocks = async () => {
      setLoadingBlocks(true);
      try {
        const data = await fetchData(`${API_URL}/master/api/blocks`);
        if (data) setBlocks(data);
      } finally {
        setLoadingBlocks(false);
      }
    };
    const loadRecords = async () => {
      try {
        const data = await renterRecordApi().getAllRecords();
        if (data) setRecords(data);
      } finally {
      }
    };
    loadBlocks();
    loadRecords();
  }, []);

  const fetchData = async (url) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authorization token is missing");
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      message.error("Failed to fetch data");
      return null;
    }
  };

  const handleBlockChange = async (blockId) => {
    setSelectedBlock(blockId);
    form.setFieldsValue({ floor: null, apartment_id: null, owner_id: null });
    setFloors([]);
    setApartments([]);
    if (!blockId) return;
    setLoadingFloors(true);
    try {
      const data = await fetchData(`${API_URL}/master/api/blocks/${blockId}/floors`);
      if (data) setFloors(data);
    } finally {
      setLoadingFloors(false);
    }
  };

  const handleFloorChange = async (floorId) => {
    setSelectedFloor(floorId);
    form.setFieldsValue({ apartment_id: null, owner_id: null, apartment_name: null, });
    setApartments([]);
    if (!floorId) return;
    setLoadingApartments(true);
    try {
      let data = await fetchData(`${API_URL}/master/api/floors/${floorId}/apartments`);
      if (data) {
        const filteredApartments = data.filter((apt) => {
          const hasRecord = records.some(
            (record) => record.owner?.apartment?.apartment_id === apt.apartment_id
          );
          return apt.status === "SOLD" && !hasRecord;
        });
        setApartments(filteredApartments);
      }
    } finally {
      setLoadingApartments(false);
    }
  };
  

  const handleApartmentChange = async (selectedApartmentId) => {
    if (!selectedApartmentId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/master/api/apartments/${selectedApartmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  const validateEndDate = (_, value) => {
    const startDate = form.getFieldValue("start_date");
    if (startDate && value && value.isBefore(startDate)) {
      return Promise.reject("End date must be after start date");
    }
    return Promise.resolve();
  };

  const checkExistingRecord = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/master/api/records`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          apartment_id: values.apartment_id,
          start_date: values.start_date.toISOString(),
          end_date: values.end_date.toISOString(),
        },
      });
      return response.data.length > 0;
    } catch (error) {
      message.error("Failed to check existing record");
      return false;
    }
  };

  const handleSubmit = async (values) => {
    if (submitLoading) return;
    setSubmitLoading(true);

    try {
      const existingRecord = await checkExistingRecord(values);
      if (existingRecord) {
        message.info("Record already exists, no need to create a new one.");
        if (onFinish) onFinish(values);
        navigate("/records");
        return;
      }

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

      message.success("Record created successfully");
      if (onFinish) onFinish(values);
      navigate("/records");
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
        initialValues={initialValues}
      >
        <Card title="Record Information" className="mb-6 shadow-sm">
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
                  <Option key={apartment.apartment_id} value={apartment.apartment_id}>
                    {apartment.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="owner_id" hidden>
              <Input />
            </Form.Item>

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
              rules={[
                { required: true, message: "Please select end date!" },
                { validator: validateEndDate },
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
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
                }
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
              rules={[
                { required: true, message: "Please input phone number!" },
              ]}
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

          <Form.Item
            label="Career"
            name={["renter", "career"]}
          >
            <Input placeholder="Enter Career" maxLength={12} />
          </Form.Item>

          <Form.Item
            label="ID Card Number"
            name={["renter", "id_card_number"]}
            rules={[
              { required: true, message: "Please input ID card number!" },
            ]}
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

RecordForm.propTypes = {
  initialValues: PropTypes.object,
  onFinish: PropTypes.func,
  loading: PropTypes.bool,
  form: PropTypes.object,
};

export default RecordForm;
