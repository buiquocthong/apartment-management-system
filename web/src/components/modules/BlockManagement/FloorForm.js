import React from 'react';
import { Form, InputNumber, Button, Select, Space } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const { Option } = Select;

const FloorForm = ({ initialValues, onFinish, loading }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate(); // Khởi tạo navigate

  const handleCancel = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
    >
      <Form.Item
        name="floor_number"
        label="Floor Number"
        rules={[{ required: true, message: 'Please input floor number!' }]}
      >
        <InputNumber min={1} placeholder="Enter floor number" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="floor_type"
        label="Floor Type"
        rules={[{ required: true, message: 'Please select floor type!' }]}
      >
        <Select placeholder="Select floor type" style={{ width: '100%' }}>
          <Option value="RESIDENTIAL">Resident</Option>
          <Option value="COMMERCIAL">Commercial</Option>
          <Option value="TECHNICAL">Technical</Option>
        </Select>
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

export default FloorForm;
