import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Typography,
  Space,
  Tag,
  Tooltip,
  message,
  Drawer,
  Descriptions,
  Timeline,
  Popconfirm,
  Avatar
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  HomeOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import dayjs from 'dayjs';
import { API } from '../../../../constant/constant';
const { Title, Text } = Typography;
const API_URL = `${API}/master/api/owners`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const OwnerList = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
  });
  const [totalOwners, setTotalOwners] = useState(0);
  const navigate = useNavigate();

  const fetchOwners = useCallback(async (page = 1, pageSize = 50) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const offset = (page - 1) * 1;
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          offset: offset,
          limit: pageSize,
          direction: 'ASC',
          query: searchText || '',
        },
      });
      setOwners(response.data.items || []);
      setTotalOwners(response.data.total_count || 0);
      // message.success('Owners fetched successfully');
    } catch (error) {
      message.error('Failed to fetch owners');
    } finally {
      setLoading(false);
    }
  }, [searchText]);

  const handleTableChange = (pagination) => {
    const newPage = pagination.current || 1;
    const newPageSize = pagination.pageSize || pagination.pageSize;

    setPagination({
      current: newPage,
      pageSize: newPageSize,
    });

    fetchOwners(newPage, newPageSize);
  };


  const fetchOwnerDetail = async (ownerId) => {
    try {
      const response = await api.get(`/${ownerId}`);
      setSelectedOwner(response.data);
      setDrawerVisible(true);
    } catch (error) {
      message.error('Failed to fetch owner details');
    }
  };

  useEffect(() => {
    fetchOwners();
  }, [fetchOwners]);

  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      const filteredOwners = owners.filter(owner =>
        `${owner.first_name} ${owner.last_name}`.toLowerCase().includes(value.toLowerCase()) ||
        owner.email?.toLowerCase().includes(value.toLowerCase()) ||
        owner.phone_number?.includes(value)
      );
      setOwners(filteredOwners);
    } else {
      fetchOwners();
    }
  };

  const deleteOwner = async (ownerId) => {
    try {
      const response = await api.delete(`/${ownerId}`);
      if (response.status === 200) {
        message.success('Owner deleted successfully');
        fetchOwners();
      } else {
        message.error(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response);
        const { status } = error.response;
        if (status === 404) {
          message.error('Owner not found');
        } else if (status === 403) {
          message.error('Access denied. Check your permissions.');
        } else {
          message.error('Failed to delete owner. Try again.');
        }
      } else {
        console.error('Unknown error:', error);
        message.error('An unknown error occurred');
      }
    }
  };

  const getStatusColor = (occupancy) => {
    return occupancy ? 'green' : 'orange';
  };

  const getStatusText = (occupancy) => {
    return occupancy ? 'RESIDENT' : 'NON-RESIDENT';
  };

  const columns = [
    {
      title: 'Owner',
      key: 'owner',
      render: (_, record) => (
        <Space>
          <Avatar
            icon={<UserOutlined />}
            className={`bg-${getStatusColor(record.occupancy)}-500`}
          />
          <Space direction="vertical" size={0}>
            <Text strong>{`${record.first_name} ${record.middle_name} ${record.last_name}`}</Text>
            <Text type="secondary" className="text-xs">
              ID: {record.owner_id}
            </Text>
          </Space>
        </Space>
      ),
      sorter: (a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <Space direction="vertical" size={1}>
          <Space>
            <MailOutlined className="text-gray-400" />
            <Text>{record.email || 'N/A'}</Text>
          </Space>
          <Space>
            <PhoneOutlined className="text-gray-400" />
            <Text>{record.phone_number || 'N/A'}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'ID Card',
      dataIndex: 'id_card_number',
      key: 'id_card_number',
      render: (text) => (
        <Space>
          <IdcardOutlined className="text-gray-400" />
          <Text>{text || 'N/A'}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={getStatusColor(record.occupancy)}>
          {getStatusText(record.occupancy)}
        </Tag>
      ),
      filters: [
        { text: 'Resident', value: true },
        { text: 'Non-Resident', value: false },
      ],
      onFilter: (value, record) => record.occupancy === value,
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
              onClick={() => fetchOwnerDetail(record.owner_id)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined className="text-blue-500" />}
              onClick={() => navigate(`/residents/owners/edit/${record.owner_id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Owner"
              description="Are you sure you want to delete this owner? This action cannot be undone."
              onConfirm={() => deleteOwner(record.owner_id)}
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
  ];

  const drawerContent = () => (
    selectedOwner && (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <Avatar
            size={64}
            icon={<UserOutlined />}
            className={`bg-${getStatusColor(selectedOwner.occupancy)}-500`}
          />
          <Title level={4} className="mt-2 mb-0">
            {`${selectedOwner.first_name} ${selectedOwner.last_name}`}
          </Title>
          <Tag color={getStatusColor(selectedOwner.occupancy)} className="mt-2">
            {getStatusText(selectedOwner.occupancy)}
          </Tag>
        </div>

        <Descriptions
          title={
            <Space>
              <UserOutlined />
              Personal Information
            </Space>
          }
          bordered
          column={1}
        >
          <Descriptions.Item label="First Name">{selectedOwner.first_name}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{selectedOwner.last_name}</Descriptions.Item>
          <Descriptions.Item label="Middle Name">{selectedOwner.middle_name || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Gender">{selectedOwner.gender}</Descriptions.Item>
          <Descriptions.Item label="Birthday">
            {selectedOwner.birth_day
              ? dayjs(selectedOwner.birth_day).format('YYYY-MM-DD')
              : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{selectedOwner.email || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Phone Number">{selectedOwner.phone_number}</Descriptions.Item>
          <Descriptions.Item label="ID Card Number">{selectedOwner.id_card_number || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Career">{selectedOwner.career || 'N/A'}</Descriptions.Item>
        </Descriptions>

        <Descriptions
          title={
            <Space>
              <HomeOutlined />
              Address Information
            </Space>
          }
          bordered
          column={1}
        >
          <Descriptions.Item label="Street">{selectedOwner.street || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Ward">{selectedOwner.ward || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="District">{selectedOwner.district || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="City">{selectedOwner.city || 'N/A'}</Descriptions.Item>
        </Descriptions>

        {selectedOwner.apartment && (
          <Descriptions
            title={
              <Space>
                <HomeOutlined />
                Apartment Information
              </Space>
            }
            bordered
            column={1}
          >
            <Descriptions.Item label="Name">{selectedOwner.apartment.name}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color="blue">{selectedOwner.apartment.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Area">{selectedOwner.apartment.area} m²</Descriptions.Item>
            <Descriptions.Item label="Furnished">
              <Tag color={selectedOwner.apartment.furnished ? 'green' : 'red'}>
                {selectedOwner.apartment.furnished ? 'Yes' : 'No'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Bedrooms">{selectedOwner.apartment.number_of_bedroom}</Descriptions.Item>
            <Descriptions.Item label="Bathrooms">{selectedOwner.apartment.number_of_bathroom}</Descriptions.Item>
          </Descriptions>
        )}

        <Timeline
          items={[
            {
              dot: <HomeOutlined style={{ fontSize: '16px' }} />,
              children: (
                <Space direction="vertical">
                  <Text type="secondary">Created Date</Text>
                  <Text>{moment(selectedOwner.create_date).format('DD/MM/YYYY HH:mm')}</Text>
                </Space>
              ),
            },
            {
              dot: <EditOutlined style={{ fontSize: '16px' }} />,
              children: (
                <Space direction="vertical">
                  <Text type="secondary">Last Updated</Text>
                  <Text>{moment(selectedOwner.update_date).format('DD/MM/YYYY HH:mm')}</Text>
                </Space>
              ),
            }
          ]}
        />
      </div>
    )
  );

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center gap-2 !mb-0">
          <HomeOutlined className="text-blue-500" />
          Owner Management
        </Title>
        <Space size="middle">
          <Input.Search
            placeholder="Search by name, email or phone..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            className="w-64"
            size="large"
          />
        </Space>
      </div>

      <Card className="shadow-sm rounded-lg">
        <Table
          dataSource={owners}
          columns={columns}
          loading={loading}
          rowKey="owner_id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: totalOwners,
            showSizeChanger: true,
            onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
            onShowSizeChange: (current, size) => {
              setPagination({ ...pagination, pageSize: size });
              fetchOwners(current, size);
            },
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          }}
          scroll={{ x: true }}
        />
      </Card>

      <Drawer
        title={
          <Space>
            <UserOutlined />
            Owner Details
          </Space>
        }
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        extra={
          <Space>
            <Button onClick={() => setDrawerVisible(false)}>Close</Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setDrawerVisible(false);
                navigate(`/residents/owners/edit/${selectedOwner?.owner_id}`);
              }}
            >
              Edit
            </Button>
          </Space>
        }
      >
        {drawerContent()}
      </Drawer>
    </div>
  );
};

export default OwnerList;