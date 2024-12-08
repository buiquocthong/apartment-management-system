import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Tag, 
  Typography, 
  Card, 
  Space, 
  Tooltip, 
  Drawer,
  Descriptions
} from 'antd';
import { 
  MailOutlined,
  EyeOutlined
} from '@ant-design/icons';
import mailApi from '../../services/mailApi';

const { Text, Title } = Typography;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} items`
  });
  const [selectedNotification, setSelectedNotification] = useState(null);

  const fetchNotifications = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await mailApi().getAllMails();
      
      const mailData = response || { total_count: 0, items: [] };
      setNotifications(mailData.items);
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize,
        total: mailData.total_count
      }));
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGHEST': return 'red';
      case 'HIGH': return 'orange';
      case 'MEDIUM': return 'blue';
      case 'LOW': return 'green';
      default: return 'default';
    }
  };

  const handleTableChange = (newPagination) => {
    fetchNotifications(newPagination.current, newPagination.pageSize);
  };

  const viewNotificationDetails = (record) => {
    setSelectedNotification(record);
  };

  const columns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject) => (
        <Text ellipsis={{ tooltip: subject }}>
          {subject || 'No Subject'}
        </Text>
      )
    },
    {
      title: 'To',
      dataIndex: 'to',
      key: 'to',
      render: (to) => (
        <Text ellipsis>
          {Array.isArray(to) ? to.join(', ') : (to || 'N/A')}
        </Text>
      )
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>
          {priority || 'N/A'}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'SENT' ? 'green' : 'orange'}>
          {status || 'N/A'}
        </Tag>
      )
    },
    {
      title: 'Sent Date',
      dataIndex: 'sent_date',
      key: 'sent_date',
      render: (date) => (
        <Text>
          {date ? new Date(date).toLocaleString() : 'N/A'}
        </Text>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <EyeOutlined 
              onClick={() => viewNotificationDetails(record)}
              className="text-blue-500 cursor-pointer"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-7xl w-full mx-auto p-8 bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <Title level={2} className="flex items-center gap-2 !mb-0 text-2xl">
          <MailOutlined className="text-3xl mr-2" /> Notifications
        </Title>
      </div>

      <Card className="shadow-sm rounded-lg">
        <Table 
          columns={columns}
          dataSource={notifications}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          rowKey="id"
          size="large"
          scroll={{ x: 800 }}
        />
      </Card>

      <Drawer
        title="Notification Details"
        placement="right"
        onClose={() => setSelectedNotification(null)}
        open={!!selectedNotification}
        width={600}
      >
        {selectedNotification && (
          <div>
            <div className="mb-4">
              <Text strong>Subject: </Text>
              <Text>{selectedNotification.subject || 'No Subject'}</Text>
            </div>
            <div className="mb-4">
              <Text strong>To: </Text>
              <Text>
                {Array.isArray(selectedNotification.to) 
                  ? selectedNotification.to.join(', ') 
                  : (selectedNotification.to || 'N/A')}
              </Text>
            </div>
            <div className="mb-4">
              <Text strong>CC: </Text>
              <Text>
                {Array.isArray(selectedNotification.cc) 
                  ? selectedNotification.cc.join(', ') 
                  : (selectedNotification.cc || 'N/A')}
              </Text>
            </div>
            <div className="mb-4">
              <Text strong>BCC: </Text>
              <Text>
                {Array.isArray(selectedNotification.bcc) 
                  ? selectedNotification.bcc.join(', ') 
                  : (selectedNotification.bcc || 'N/A')}
              </Text>
            </div>
            <div className="mb-4">
              <Text strong>Priority: </Text>
              <Tag color={getPriorityColor(selectedNotification.priority)}>
                {selectedNotification.priority || 'N/A'}
              </Tag>
            </div>
            <div className="mb-4">
              <Text strong>Status: </Text>
              <Tag color={selectedNotification.status === 'SENT' ? 'green' : 'orange'}>
                {selectedNotification.status || 'N/A'}
              </Tag>
            </div>
            <div className="mb-4">
              <Text strong>Sent Date: </Text>
              <Text>
                {selectedNotification.sent_date 
                  ? new Date(selectedNotification.sent_date).toLocaleString() 
                  : 'N/A'}
              </Text>
            </div>
            {selectedNotification.parameters && (
              <div>
                <Text strong>Invoice Details:</Text>
                <Descriptions bordered column={1} className="mt-2">
                  <Descriptions.Item label="Apartment">
                    {selectedNotification.parameters.apartment_name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Resident Name">
                    {selectedNotification.parameters.resident_name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Amount">
                    {selectedNotification.parameters.total.toLocaleString()} VND
                  </Descriptions.Item>
                  <Descriptions.Item label="Created Date">
                    {selectedNotification.parameters.created_date}
                  </Descriptions.Item>
                  <Descriptions.Item label="Payment Deadline">
                    {selectedNotification.parameters.payment_deadline}
                  </Descriptions.Item>
                  <Descriptions.Item label="Invoice Status">
                    <Tag color={selectedNotification.parameters.status === 'UNPAID' ? 'red' : 'green'}>
                      {selectedNotification.parameters.status}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>

                <Text strong className="mt-4 block">Service Details:</Text>
                <Table 
                  dataSource={selectedNotification.parameters.service_details}
                  columns={[
                    {
                      title: 'Service Name',
                      dataIndex: ['service', 'name'],
                      key: 'serviceName'
                    },
                    {
                      title: 'Amount',
                      dataIndex: 'amount_of_using',
                      key: 'amount',
                      render: (amount, record) => `${amount} ${record.service.unit}`
                    },
                    {
                      title: 'Price',
                      dataIndex: 'money',
                      key: 'money',
                      render: (money) => `${money.toLocaleString()} VND`
                    }
                  ]}
                  pagination={false}
                  size="small"
                  className="mt-2"
                />
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Notifications;