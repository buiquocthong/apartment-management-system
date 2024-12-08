import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Row, Col, Checkbox, Divider, DatePicker, InputNumber, Card, message } from 'antd';
import moment from 'moment';

const { Option } = Select;

const EditApartmentForm = ({
  onSubmit,
  initialValues = {},
  loading = false,
  onCancel,
  floorId,
  apartmentNames = [],
}) => {
  const [form] = Form.useForm();
  const [status, setStatus] = useState(initialValues?.status || 'AVAILABLE');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        status: initialValues.status || 'AVAILABLE',
        sale_info: {
          purchase_price: initialValues?.sale_info?.purchase_price,
          sale_date: initialValues?.sale_info?.sale_date ? moment(initialValues.sale_info.sale_date) : null,
        },
        number_of_bedroom: initialValues?.number_of_bedroom || 1,
        number_of_bathroom: initialValues?.number_of_bathroom || 1,
      });
      setStatus(initialValues.status || 'AVAILABLE');
    }
  }, [initialValues, form]);

  const handleFinish = async (values) => {
    setNameError('');

    if (apartmentNames.includes(values.name) && values.name !== initialValues.name) {
      setNameError('This apartment name already exists. Please choose a different name.');
      return;
    }

    const transformedValues = {
      ...values,
      status,
      floor_id: floorId,
      sale_info: {
        purchase_price: values.sale_info?.purchase_price || 0,
        sale_date: values.sale_info?.sale_date ? values.sale_info.sale_date.toISOString() : null,
      },
      number_of_bedroom: values.number_of_bedroom,
      number_of_bathroom: values.number_of_bathroom,
    };
    onSubmit(transformedValues);
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
          <h2 className="text-2xl font-semibold text-center mb-6">Edit Apartment Details</h2>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Apartment Name"
                name="name"
                rules={[{ required: true, message: 'Please enter apartment name' }]}
                validateStatus={nameError ? 'error' : ''}
                help={nameError}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Area (sqm)"
                name="area"
                rules={[{ required: true, message: 'Please enter area' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Furniture" name="furniture" valuePropName="checked">
                <Checkbox>Has Furniture</Checkbox>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Status" name="status">
                <Select value={status} onChange={(value) => setStatus(value)}>
                  <Option value="AVAILABLE">Available</Option>
                  <Option value="SOLD">Sold</Option>
                </Select>
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
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Number of Bathrooms"
                name="number_of_bathroom"
                rules={[{ required: true, message: 'Please enter the number of bathrooms' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Purchase Price" name={['sale_info', 'purchase_price']}>
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Sale Date" name={['sale_info', 'sale_date']}>
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          {status === 'SOLD' && (
            <>
              <Divider>Owner Information</Divider>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Owner First Name" name={['owner', 'first_name']}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Owner Last Name" name={['owner', 'last_name']}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Phone Number" name={['owner', 'phone_number']}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Email" name={['owner', 'email']}>
                    <Input type="email" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="ID Card Number" name={['owner', 'id_card_number']}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Career" name={['owner', 'career']}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="City" name={['owner', 'city']}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="District" name={['owner', 'district']}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Street" name={['owner', 'street']}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Ward" name={['owner', 'ward']}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Divider>Resident Information</Divider>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Resident First Name" name={['residents', 0, 'first_name']}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Resident Last Name" name={['residents', 0, 'last_name']}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Resident Phone Number" name={['residents', 0, 'phone_number']}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Resident Email" name={['residents', 0, 'email']}>
                    <Input type="email" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Resident ID Card Number" name={['residents', 0, 'id_card_number']}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Resident Career" name={['residents', 0, 'career']}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          <Divider />
          <div className="flex justify-end space-x-4 pt-4">
            <Button onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save Changes
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default EditApartmentForm
