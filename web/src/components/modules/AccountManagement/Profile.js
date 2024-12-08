import React, { useState, useEffect, useCallback } from 'react';
import { Card, Tabs, Form, Input, Button, Space, Spin, Typography, message, Select } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, GlobalOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API } from '../../../constant/constant';
const { Title } = Typography;

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

const Profile = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const API_URL = `${API}/identity/api`;

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/my/account`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
      form.setFieldsValue({
        username: response.data.username,
        ...response.data.user_info
      });
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Handle profile update
  const handleProfileUpdate = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const payload = {
        user_id: userData.user_id,
        username: userData.username,
        status: userData.status,
        role: userData.role,
        user_info: {
          email: values.email,
          first: values.first,
          middle: values.middle,
          last: values.last,
          prefix: values.prefix,
          phone: values.phone,
          country: values.country
        }
      };

      await axios.put(`${API_URL}/users/${userData.user_id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success('Profile updated successfully');
      await fetchUserData();
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/my/account/change_password`, {
        user_id: userData.user_id,
        old_password: values.currentPassword,
        new_password: values.newPassword,
        confirm_password: values.confirmPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success('Password changed successfully');
      passwordForm.resetFields();
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: 'profile',
      label: 'Personal Information',
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleProfileUpdate}
          initialValues={userData}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item
                name="username"
                label="Username"
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  disabled
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input prefix={<MailOutlined className="site-form-item-icon" />} />
              </Form.Item>

              <Form.Item
                name="first"
                label="First Name"
                rules={[{ required: true, message: 'Please input your first name!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="last"
                label="Last Name"
                rules={[{ required: true, message: 'Please input your last name!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="middle"
                label="Middle Name"
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="prefix"
                label="Title"
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
              >
                <Input prefix={<PhoneOutlined className="site-form-item-icon" />} />
              </Form.Item>

              <Form.Item
                name="country"
                label="Country"
              >
                <Select
                  prefix={<GlobalOutlined className="site-form-item-icon" />}
                  placeholder="Select a country"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={Object.entries(COUNTRY_CODES).map(([code, name]) => ({
                    value: code,
                    label: name,
                  }))}
                />
              </Form.Item>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Update Information
              </Button>
            </Form.Item>
          </Space>
        </Form>
      ),
    },
    {
      key: 'password',
      label: 'Change Password',
      children: (
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[{ required: true, message: 'Please input your current password!' }]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: 'Please input your new password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Change Password
              </Button>
            </Form.Item>
          </Space>
        </Form>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>
        <UserOutlined /> Account Information
      </Title>

      <Spin spinning={loading && !userData}>
        <Card>
          <Tabs items={items} />
        </Card>
      </Spin>
    </div>
  );
};

export default Profile;