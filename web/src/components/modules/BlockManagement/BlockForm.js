import React from 'react';
import { Form, Input, InputNumber, Button, Checkbox, Space } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const BlockForm = ({ initialValues, onFinish, loading }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate(); // Khởi tạo navigate

  const handleCancel = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  const validateBlockName = (rule, value, callback) => {
    if (!/^[A-Z]$/.test(value)) {
      callback('Block name must be a single uppercase letter');
    } else {
      callback();
    }
  };

  const processedInitialValues = {
    ...initialValues,
    furnished: initialValues?.furnished || false
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        const processedValues = {
          ...values,
          furnished: values.furnished || false
        };
        onFinish(processedValues);
      }}
      initialValues={processedInitialValues}
    >
      <Form.Item
        name="name"
        label="Block Name"
        rules={[
          { required: true, message: 'Please input block name!' },
          { validator: validateBlockName }
        ]}
      >
        <Input placeholder="Enter block name" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please input description!' }]}
      >
        <Input.TextArea rows={4} placeholder="Enter description" />
      </Form.Item>

      <Form.Item
        name="total_floor"
        label="Total Floors"
        rules={[{ required: true, message: 'Please enter the total number of floors!' }]}
      >
        <InputNumber min={1} placeholder="Enter total floors" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="apartment_per_floor"
        label="Apartments Per Floor"
        rules={[{ required: true, message: 'Please enter the number of apartments per floor!' }]}
      >
        <InputNumber min={1} placeholder="Enter apartments per floor" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="area"
        label="Area (sqm)"
        rules={[{ required: true, message: 'Please enter the area!' }]}
      >
        <InputNumber min={1} placeholder="Enter area in sqm" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="number_of_bedroom"
        label="Number of Bedrooms"
        rules={[{ required: true, message: 'Please enter the number of bedrooms!' }]}
      >
        <InputNumber min={0} placeholder="Enter number of bedrooms" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="number_of_bathroom"
        label="Number of Bathrooms"
        rules={[{ required: true, message: 'Please enter the number of bathrooms!' }]}
      >
        <InputNumber min={0} placeholder="Enter number of bathrooms" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="purchase_price"
        label="Purchase Price"
        rules={[{ required: true, message: 'Please enter the purchase price!' }]}
      >
        <InputNumber
          min={0}
          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          placeholder="Enter purchase price"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="furnished"
        valuePropName="checked"
        label="Furnished"
      >
        <Checkbox>Furnished</Checkbox>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
            Submit
          </Button>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default BlockForm;
