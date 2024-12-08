import React, { useEffect, useState, useCallback } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  message, 
  Space, 
  Input, 
  Typography, 
  Tag, 
  Tooltip, 
  Drawer, 
  Descriptions, 
  Timeline, 
  Popconfirm
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  EditOutlined, 
  PlusOutlined, 
  SearchOutlined, 
  DeleteOutlined, 
  ToolOutlined, 
  EyeOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { API } from '../../../constant/constant';
const { Title } = Typography;

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  const navigate = useNavigate();
  const API_URL = `${API}/master/api`;

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const transformedServices = response.data.map(service => ({
        ...service,
        metered_service: Boolean(service.metered_service)
      }));
      
      setServices(transformedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
      message.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSearch = () => {
    if (searchText) {
      const filteredServices = services.filter(service =>
        (service.name || '').toLowerCase().includes(searchText.toLowerCase())
      );
      setServices(filteredServices);
    } else {
      fetchServices();
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return dayjs(date).format('DD/MM/YYYY HH:mm');
  };

  const showServiceDetails = (record) => {
    setSelectedService(record);
    setDrawerVisible(true);
  };

  const deleteService = async (serviceId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      message.error('Failed to delete service');
    }
  };

  const columns = [
    {
      title: 'Service Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span className="font-medium">{text || 'Unnamed Service'}</span>
      ),
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <span className="text-green-600 font-medium">
          {formatPrice(price)}
        </span>
      ),
      sorter: (a, b) => (a.price || 0) - (b.price || 0),
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      render: (unit) => <Tag color="blue">{unit || 'N/A'}</Tag>,
    },
    {
      title: 'Type',
      dataIndex: 'metered_service',
      key: 'metered_service', 
      render: (metered) => {
        const isMetered = Boolean(metered);
        return (
          <Tag color={isMetered ? 'green' : 'red'}>
            {isMetered ? 'Metered' : 'Non-Metered'}
          </Tag>
        );
      },
      filters: [
        { text: 'Metered', value: true },
        { text: 'Non-Metered', value: false },
      ],
      onFilter: (value, record) => Boolean(record.metered_service) === value,
    },

    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined className="text-green-500" />}
              onClick={() => showServiceDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined className="text-blue-500" />}
              onClick={() => navigate(`/services/edit/${record.service_id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this service?"
              onConfirm={() => deleteService(record.service_id)}
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

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6 gap-4">
        <Title level={2} className="flex items-center gap-2 !mb-0">
          <ToolOutlined /> Service Management
        </Title>
        <div className="flex gap-2">
          <Input
            placeholder="Search services..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            className="w-64"
            suffix={<SearchOutlined onClick={handleSearch} />}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/services/new')}
            className="bg-blue-600 hover:bg-blue-500"
          >
            Add New Service
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <Table
          dataSource={services}
          columns={columns}
          loading={loading}
          rowKey="service_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} services`
          }}
        />
      </Card>

      <Drawer
        title="Service Details"
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedService && (
          <div className="space-y-6">
            <Descriptions title="Service Information" bordered column={1}>
              <Descriptions.Item label="Service ID">
                {selectedService.service_id}
              </Descriptions.Item>
              <Descriptions.Item label="Name">
                {selectedService.name}
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                {formatPrice(selectedService.price)}
              </Descriptions.Item>
              <Descriptions.Item label="Unit">
                {selectedService.unit}
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                <Tag color={selectedService.metered_service ? 'green' : 'red'}>
                  {selectedService.metered_service ? 'Metered' : 'Non-Metered'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Timeline mode="left">
              <Timeline.Item 
                dot={<FileTextOutlined className="text-blue-500" />}
                label="Created At"
              >
                {formatDate(selectedService.create_date)}
              </Timeline.Item>
              <Timeline.Item 
                dot={<EditOutlined className="text-green-500" />}
                label="Last Updated"
              >
                {formatDate(selectedService.update_date)}
              </Timeline.Item>
            </Timeline>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ServiceList;