import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Input, Card, Typography, Space, Tag, message, Dropdown, Drawer, Descriptions, Timeline, Popconfirm } from 'antd';
import { EditOutlined, PlusOutlined, EyeOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import { API } from '../../../../constant/constant';
const { Title } = Typography;

const RenterList = () => {
  const [renters, setRenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRenter, setSelectedRenter] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const API_URL = `${API}/master/api/renters`;

  // Fetch renters
  const fetchRenters = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRenters(Array.isArray(response.data.items) ? response.data.items : []);
      // message.success('Renters fetched successfully');
    } catch (error) {
      console.error('Fetch error:', error);
      if (error.response && error.response.status === 401) {
        message.error('Unauthorized. Please log in again.');
        navigate('/login');
      } else {
        message.error('Failed to fetch renters');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchRenters();
  }, [fetchRenters]);

  // Delete renter
  const deleteRenter = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Renter deleted successfully", 2);
      fetchRenters();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error("Renter is the head of the household.", 2);
      } else {
        message.error("Failed to delete renter", 2);
      }
    }
  };

  // Show renter details
  const showRenterDetails = (renter) => {
    setSelectedRenter(renter);
    setDrawerVisible(true);
  };

  // Dropdown actions
  const getActionItems = (renter) => [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: 'View Details',
      onClick: () => showRenterDetails(renter)
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Edit',
      onClick: () => navigate(`/residents/renters/edit/${renter.renter_id}`)
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: (
        <Popconfirm
          title="Are you sure you want to delete this renter?"
          onConfirm={() => deleteRenter(renter.renter_id)}
          okText="Yes"
          cancelText="No"
        >
          Delete
        </Popconfirm>
      ),
      danger: true
    },
  ];

  // Format date
  const formatDate = (date) => {
    return date ? dayjs(date).format('DD/MM/YYYY') : 'N/A';
  };

  // Table columns
  const columns = [
    {
      title: 'Full Name',
      key: 'full_name',
      render: (_, record) => (
        `${record.first_name} ${record.middle_name} ${record.last_name}`
      )
    },
    {
      title: 'Birth Day',
      dataIndex: 'birth_day',
      key: 'birth_day',
      render: (date) => formatDate(date)
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => (
        <Tag color={gender === 'MALE' ? 'blue' : 'pink'}>
          {gender}
        </Tag>
      )
    },
    {
      title: 'Career',
      dataIndex: 'career',
      key: 'career'
    },
    {
      title: 'Contact Info',
      key: 'contact',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>📱 {record.phone_number}</div>
          <div>✉️ {record.email}</div>
        </Space>
      )
    },
    {
      title: 'ID Card',
      dataIndex: 'id_card_number',
      key: 'id_card_number'
    },
    {
      title: 'Head',
      dataIndex: 'household_head',
      key: 'household_head',
      render: (isHead) => (
        <Tag color={isHead ? 'green' : 'default'}>
          {isHead ? 'Yes' : 'No'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, renter) => (
        <Dropdown
          menu={{ items: getActionItems(renter) }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            className="border-none shadow-none"
          />
        </Dropdown>
      ),
    },
  ];

  // Search handler
  const handleSearch = () => {
    if (searchText) {
      const filteredRenters = Array.isArray(renters)
        ? renters.filter((renter) =>
          renter.first_name?.toLowerCase().includes(searchText.toLowerCase()) ||
          renter.last_name?.toLowerCase().includes(searchText.toLowerCase()) ||
          renter.middle_name?.toLowerCase().includes(searchText.toLowerCase()) ||
          renter.email?.toLowerCase().includes(searchText.toLowerCase()) ||
          renter.phone_number?.includes(searchText) ||
          renter.id_card_number?.includes(searchText)
        )
        : [];
      setRenters(filteredRenters);
    } else {
      fetchRenters();
    }
  };

  return (
    <div className="p-8 max-w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Renter Management</Title>
        <Space>
          <Input.Search
            placeholder="Search renters..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
        </Space>
      </div>
      <Card className="shadow-sm rounded-lg">
        <Table
          dataSource={Array.isArray(renters) ? renters : []}
          columns={columns}
          loading={loading}
          rowKey="renter_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} renters`,
          }}
          scroll={{ x: 'max-content' }}
          size="middle"
        />
      </Card>

      <Drawer
        title="Renter Details"
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedRenter && (
          <div className="space-y-6">
            <Descriptions title="Renter Information" bordered>
              <Descriptions.Item label="Renter ID" span={3}>
                {selectedRenter.renter_id}
              </Descriptions.Item>
              <Descriptions.Item label="Full Name" span={3}>
                {`${selectedRenter.first_name} ${selectedRenter.middle_name} ${selectedRenter.last_name}`}
              </Descriptions.Item>
              <Descriptions.Item label="Birth Day" span={3}>
                {formatDate(selectedRenter.birth_day)}
              </Descriptions.Item>
              <Descriptions.Item label="Gender" span={3}>
                {selectedRenter.gender}
              </Descriptions.Item>
              <Descriptions.Item label="Career" span={3}>
                {selectedRenter.career}
              </Descriptions.Item>
              <Descriptions.Item label="Phone" span={3}>
                {selectedRenter.phone_number}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={3}>
                {selectedRenter.email}
              </Descriptions.Item>
              <Descriptions.Item label="ID Card" span={3}>
                {selectedRenter.id_card_number}
              </Descriptions.Item>
              <Descriptions.Item label="Household Head" span={3}>
                {selectedRenter.household_head ? 'Yes' : 'No'}
              </Descriptions.Item>
            </Descriptions>

            <Timeline items={[
              {
                label: 'Created At',
                children: formatDate(selectedRenter.create_date),
              },
              {
                label: 'Last Updated',
                children: formatDate(selectedRenter.update_date),
              }
            ]} />
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default RenterList;
