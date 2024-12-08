import React from 'react';
import { Form, Input, InputNumber, Switch, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ServiceForm = ({ initialValues, onFinish, loading, form }) => {
  const navigate = useNavigate(); // Initialize navigate

  // Transform initialValues to ensure boolean values
  const transformedInitialValues = {
    ...initialValues,
    metered_service: initialValues?.metered_service ?? false, // Set default false if null
  };

  const handleFinish = (values) => {
    // Transform values before submitting
    const transformedValues = {
      ...values,
      metered_service: values.metered_service ?? false, // Ensure boolean value
    };
    onFinish(transformedValues);
  };

  const handleCancel = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={transformedInitialValues}
      onFinish={handleFinish}
      className="max-w-2xl"
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[
          { required: true, message: 'Please input service name!' },
          { type: 'string', message: 'Name must be a string!' }
        ]}
      >
        <Input placeholder="Enter service name" />
      </Form.Item>

      <Form.Item
        label="Price"
        name="price"
        rules={[
          { required: true, message: 'Please input price!' },
          { type: 'number', message: 'Price must be a number!' }
        ]}
      >
        <InputNumber
          className="w-full"
          min={0}
          step={0.01}
          formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          placeholder="Enter price"
        />
      </Form.Item>

      <Form.Item
        label="Unit"
        name="unit"
        rules={[
          { required: true, message: 'Please input unit!' },
          { type: 'string', message: 'Unit must be a string!' }
        ]}
      >
        <Input placeholder="Enter unit (e.g., hour, piece, etc.)" />
      </Form.Item>

      <Form.Item
        label="Metered Service"
        name="metered_service"
        valuePropName="checked"
        initialValue={false} // Set default value to false
      >
        <Switch />
      </Form.Item>

      <Form.Item className="mt-6">
        <Space style={{ width: '100%' }}>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {initialValues?.service_id ? 'Update Service' : 'Create Service'}
          </Button>
          <Button block onClick={handleCancel}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ServiceForm;
