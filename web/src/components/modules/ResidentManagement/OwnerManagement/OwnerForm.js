import React from 'react';
import { Form, Input, Button, Card, Select, DatePicker, message } from 'antd';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const { Option } = Select;

const OwnerForm = ({ initialValues = {}, onFinish, loading = false, form, onCancel }) => {
  const handleSubmit = async (values) => {
    const payload = {
      owner_id: initialValues?.owner_id || null,
      birth_day: values.birth_day?.format('YYYY-MM-DD') || null,
      career: values.career || null,
      city: values.city || '',
      district: values.district || '',
      email: values.email || null,
      first_name: values.first_name || null,
      middle_name: values.middle_name || '',
      last_name: values.last_name || null,
      phone_number: values.phone_number || null,
      id_card_number: values.id_card_number || null,
      gender: values.gender || 'OTHER',
      street: values.street || '',
      ward: values.ward || '',
      household_head: initialValues?.household_head ?? false,
      occupancy: initialValues?.occupancy ?? false,
    };

    try {
      await onFinish(payload);
      message.success('Owner data submitted successfully!');
    } catch (error) {
      if (error.response?.status === 404) {
        message.error('Owner not found. Please check the ID.');
      } else if (error.response?.status === 405) {
        message.error('Method not allowed. Please check the API endpoint.');
      } else {
        message.error('Failed to process the owner data. Please try again.');
      }
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        ...initialValues,
        birth_day: initialValues?.birth_day ? dayjs(initialValues.birth_day) : undefined,
      }}
      className="max-w-2xl mx-auto"
    >
      <Card title="Personal Information" className="mb-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[{ required: true, message: 'Please input first name!' }]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>

          <Form.Item label="Middle Name" name="middle_name">
            <Input placeholder="Enter middle name" />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[{ required: true, message: 'Please input last name!' }]}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone_number"
            rules={[{ required: true, message: 'Please input phone number!' }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: 'email', message: 'Please enter a valid email!' }]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="ID Card Number"
            name="id_card_number"
            rules={[{ required: true, message: 'Please input ID card number!' }]}
          >
            <Input placeholder="Enter ID card number" />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: 'Please select gender!' }]}
          >
            <Select placeholder="Select gender">
              <Option value="MALE">Male</Option>
              <Option value="FEMALE">Female</Option>
              <Option value="OTHER">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            name="birth_day"
            rules={[{ required: true, message: 'Please input birth day!' }]}
          >
            <DatePicker placeholder="Select birth day" className="w-full" />
          </Form.Item>

          <Form.Item label="Career" name="career">
            <Input placeholder="Enter career (optional)" />
          </Form.Item>
        </div>
      </Card>

      <Card title="Address Information" className="mb-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="City" name="city">
            <Input placeholder="Enter city" />
          </Form.Item>
          <Form.Item label="District" name="district">
            <Input placeholder="Enter district" />
          </Form.Item>
          <Form.Item label="Street" name="street">
            <Input placeholder="Enter street" />
          </Form.Item>
          <Form.Item label="Ward" name="ward">
            <Input placeholder="Enter ward" />
          </Form.Item>
        </div>
      </Card>

      <Card title="Additional Information" className="mb-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Household Head">
            <Input
              value={initialValues?.household_head ? 'Yes' : 'No'}
              disabled
            />
          </Form.Item>
          <Form.Item label="Occupancy">
            <Input
              value={initialValues?.occupancy ? 'Occupied' : 'Vacant'}
              disabled
            />
          </Form.Item>
        </div>
      </Card>

      <Form.Item className="flex justify-between">
        <div className="flex space-x-4">
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues?.owner_id ? 'Update Owner' : 'Create Owner'}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </div>
      </Form.Item>
    </Form>
  );
};

OwnerForm.propTypes = {
  initialValues: PropTypes.object,
  onFinish: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  form: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default OwnerForm;
