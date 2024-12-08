import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Card, Table, Button, message, Space, Input, Typography, Tag, Tooltip, Drawer, Descriptions, Timeline, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { API } from '../../../../constant/constant';

const { Title } = Typography;
const API_URL = `${API}/identity/api`;

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

const UserDetailsDrawer = ({ user, visible, onClose }) => {
  if (!user) return null;

  const formatDate = (date) => dayjs(date).format('DD/MM/YYYY HH:mm');
  const getFullCountryName = (countryCode) => COUNTRY_CODES[countryCode] || countryCode;

  return (
    <Drawer
      title="User Details"
      placement="right"
      width={600}
      onClose={onClose}
      open={visible}
    >
      <div className="space-y-6">
        <Descriptions title="User Information" bordered>
          <Descriptions.Item label="User ID" span={3}>{user.user_id}</Descriptions.Item>
          <Descriptions.Item label="Username" span={3}>{user.username}</Descriptions.Item>
          <Descriptions.Item label="Email" span={3}>{user.user_info.email}</Descriptions.Item>
          <Descriptions.Item label="Phone" span={3}>{user.user_info.phone}</Descriptions.Item>
          <Descriptions.Item label="Country" span={3}>
            {getFullCountryName(user.user_info.country)}
          </Descriptions.Item>
          <Descriptions.Item label="Role" span={3}>{user.role.label}</Descriptions.Item>
        </Descriptions>

        <Timeline
          items={[
            {
              label: 'Created At',
              children: formatDate(user.created_at),
            },
            {
              label: 'Last Updated',
              children: formatDate(user.updated_at),
            }
          ]}
        />
      </div>
    </Drawer>
  );
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.items);
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = useCallback(() => {
    if (!searchText) {
      fetchUsers();
      return;
    }
    
    const filteredUsers = users.filter(user =>
      user.username.toLowerCase().includes(searchText.toLowerCase())
    );
    setUsers(filteredUsers);
  }, [searchText, users, fetchUsers]);

  const handleDeleteUser = useCallback(async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to delete user');
    }
  }, [fetchUsers]);

  const columns = useMemo(() => [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <span className="font-medium">{text}</span>,
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: 'Email',
      dataIndex: ['user_info', 'email'],
      key: 'email',
    },
    {
      title: 'Country',
      dataIndex: ['user_info', 'country'],
      key: 'country',
      render: (countryCode) => COUNTRY_CODES[countryCode] || countryCode,
      filters: Object.entries(COUNTRY_CODES).map(([code, name]) => ({
        text: name,
        value: code,
      })),
      onFilter: (value, record) => record.user_info.country === value,
      sorter: (a, b) => 
        (COUNTRY_CODES[a.user_info.country] || '').localeCompare(
          COUNTRY_CODES[b.user_info.country] || ''
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>{status}</Tag>
      ),
      filters: [
        { text: 'Active', value: 'ACTIVE' },
        { text: 'Inactive', value: 'INACTIVE' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Role',
      dataIndex: ['role', 'label'],
      key: 'role',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined className="text-green-500" />}
              onClick={() => {
                setSelectedUser(record);
                setDrawerVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined className="text-blue-500" />}
              onClick={() => navigate(`/users/edit/${record.user_id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this user?"
              onConfirm={() => handleDeleteUser(record.user_id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                icon={<DeleteOutlined className="text-red-500" />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ], [navigate, handleDeleteUser]);

  return (
    <div className="max-w-7xl w-full mx-auto p-8 bg-gray-100">
      <div className="flex justify-between items-center mb-8 gap-4">
        <Title level={2} className="flex items-center gap-2 !mb-0 text-2xl">
          <UserOutlined className="text-3xl" /> User Management
        </Title>
        <Space size="middle">
          <Input.Search
            placeholder="Search user..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            className="w-64"
            size="large"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/users/new')}
            size="large"
          >
            Add New User
          </Button>
        </Space>
      </div>

      <Card className="shadow-sm rounded-lg">
        <Table
          dataSource={users}
          columns={columns}
          loading={loading}
          rowKey="user_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          size="large"
        />
      </Card>

      <UserDetailsDrawer
        user={selectedUser}
        visible={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
};

export default UserList;