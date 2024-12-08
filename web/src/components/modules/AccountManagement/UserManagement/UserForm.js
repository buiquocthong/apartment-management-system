import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Card } from 'antd';

const { Option } = Select;

const COUNTRY_CODES = {
  'AF': 'Afghanistan',
  'AL': 'Albania',
  'AU': 'Australia',
  'BR': 'Brazil',
  'CA': 'Canada',
  'CN': 'China',
  'DE': 'Germany',
  'ES': 'Spain',
  'FR': 'France',
  'GB': 'United Kingdom',
  'IN': 'India',
  'IT': 'Italy',
  'JP': 'Japan',
  'KR': 'South Korea',
  'MX': 'Mexico',
  'MY': 'Malaysia',
  'NZ': 'New Zealand',
  'RU': 'Russia',
  'SG': 'Singapore',
  'TH': 'Thailand',
  'US': 'United States',
  'VN': 'Vietnam'
};

const UserForm = ({ initialValues, onFinish, loading = false, form, roles = [] }) => {
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleSubmit = (values) => {
    const userPayload = {
      username: values.username,
      status: values.status,
      role: {
        role_id: values.role.role_id,
        label: values.role.label,
      },
      user_info: {
        email: values.user_info.email,
        first: values.user_info.first,
        last: values.user_info.last,
        middle: values.user_info.middle || '',
        phone: values.user_info.phone || '',
        country: values.user_info.country || '',
      },
    };
    onFinish(userPayload);
  };

  return (
    <Card className="shadow-sm max-w-5xl mx-auto">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please enter a username' }]}
        >
          <Input placeholder="Enter username" size="large" />
        </Form.Item>

        <Form.Item
          label="Email"
          name={['user_info', 'email']}
          rules={[
            { required: true, message: 'Please enter an email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="Enter email" size="large" />
        </Form.Item>

        <Form.Item
          label="First Name"
          name={['user_info', 'first']}
          rules={[{ required: true, message: 'Please enter first name' }]}
        >
          <Input placeholder="Enter first name" size="large" />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name={['user_info', 'last']}
          rules={[{ required: true, message: 'Please enter last name' }]}
        >
          <Input placeholder="Enter last name" size="large" />
        </Form.Item>

        <Form.Item
          label="Middle Name"
          name={['user_info', 'middle']}
        >
          <Input placeholder="Enter middle name" size="large" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name={['user_info', 'phone']}
        >
          <Input placeholder="Enter phone number" size="large" />
        </Form.Item>

        <Form.Item
          label="Country"
          name={['user_info', 'country']}
          rules={[
            { required: true, message: 'Country is required' },
            {
              pattern: /^[A-Z]{2}$/,
              message: 'Country code must be 2 uppercase letters'
            }
          ]}
          validateTrigger={['onChange', 'onBlur']} 
        >
          <Select
            placeholder="Select country"
            size="large"
            options={Object.entries(COUNTRY_CODES).map(([code, name]) => ({
              value: code,
              label: `${code} - ${name}`
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select placeholder="Select status" size="large">
            <Option value="ACTIVE">Active</Option>
            <Option value="INACTIVE">Inactive</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: 'Please select role' }]}
        >
          <Select
            placeholder="Select role"
            size="large"
            onChange={(value, option) =>
              form.setFieldsValue({ role: { role_id: value, label: option.children } })
            }
          >
            {roles.map((role) => (
              <Option key={role.role_id} value={role.role_id}>
                {role.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          className="col-span-2"
        >
          <Input.TextArea placeholder="Enter description" size="large" rows={4} />
        </Form.Item>

        <Form.Item className="col-span-2 flex justify-end gap-4">
          <Button size="large" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="primary" size="large" htmlType="submit" loading={loading}>
            {initialValues ? 'Update User' : 'Create User'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UserForm;