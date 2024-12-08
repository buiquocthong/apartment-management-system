import React from 'react';
import { Form, Input, Button, Row, Col, Checkbox, DatePicker, InputNumber, Card } from 'antd';
import { useNavigate } from 'react-router-dom';

const AddApartmentForm = ({ onSubmit, loading = false, floorId, existingApartmentNames }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleFinish = (values) => {
    const transformedValues = {
      ...values,
      status: 'AVAILABLE',
      floor_id: floorId,
      sale_info: {
        purchase_price: values.sale_info?.purchase_price || 0,
        sale_date: values.sale_info?.sale_date ? values.sale_info.sale_date.toISOString() : null,
      },
    };
    onSubmit(transformedValues);
  };

  const validateUniqueName = (_, value) => {
    if (existingApartmentNames.includes(value)) {
      return Promise.reject(new Error('Apartment name already exists. Please choose another name.'));
    }
    return Promise.resolve();
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <Card className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          disabled={loading}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-center mb-6">Add New Apartment</h2>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Apartment Name"
                name="name"
                rules={[
                  { required: true, message: 'Please enter apartment name' },
                  { validator: validateUniqueName },
                ]}
              >
                <Input placeholder="Enter apartment name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Area (sqm)"
                name="area"
                rules={[{ required: true, message: 'Please enter area' }]}
              >
                <InputNumber 
                  min={0} 
                  style={{ width: '100%' }} 
                  placeholder="Enter area in square meters"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label="Furniture" 
                name="furniture" 
                valuePropName="checked"
                initialValue={false}
              >
                <Checkbox>Has Furniture</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label="Number of Bedrooms" 
                name="number_of_bedroom" 
                rules={[{ required: true, message: 'Please enter the number of bedrooms' }]}
              >
                <InputNumber 
                  min={1} 
                  style={{ width: '100%' }} 
                  placeholder="Enter number of bedrooms"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label="Number of Bathrooms" 
                name="number_of_bathroom" 
                rules={[{ required: true, message: 'Please enter the number of bathrooms' }]}
              >
                <InputNumber 
                  min={1} 
                  style={{ width: '100%' }} 
                  placeholder="Enter number of bathrooms"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label="Purchase Price" 
                name={['sale_info', 'purchase_price']}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="Enter purchase price"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label="Sale Date" 
                name={['sale_info', 'sale_date']}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="YYYY-MM-DD"
                  placeholder="Select sale date" 
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="default" 
              onClick={handleCancel} 
              disabled={loading}
              className="min-w-[120px]"
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="min-w-[120px] bg-blue-600 hover:bg-blue-700"
            >
              Add Apartment
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddApartmentForm;