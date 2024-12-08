import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Badge,
  Collapse,
  Popconfirm,
  Form,
  Modal,
  DatePicker,
  List,
  Avatar,
} from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { API } from '../../../constant/constant';
const { Title, Text } = Typography;
const { Panel } = Collapse;

const API_URL = `${API}/master/api`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const getGenderTag = (gender) => {
  const color = gender === "MALE" ? "blue" : "pink";
  return <Tag color={color}>{gender}</Tag>;
};

const formatDateTime = (date) =>
  date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A";

const formatDate = (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "N/A");

const getStatusColor = (status) => {
  const statusColors = {
    AVAILABLE: "green",
    OCCUPIED: "orange",
    MAINTENANCE: "red",
    RESERVED: "blue",
  };
  return statusColors[status] || "default";
};

const InactiveRecordList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [extensionModalVisible, setExtensionModalVisible] = useState(false);
  const [extensionForm] = Form.useForm();
  const [error, setError] = useState(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/records/expired");
      setRecords(response.data?.items || []);
      // message.success("Expired records fetched successfully");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch expired records";
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const filteredRecords = useMemo(() => {
    if (!searchText) return records;
    const searchLower = searchText.toLowerCase();
    return records.filter((record) => {
      const apartmentName = record?.owner?.apartment?.name?.toLowerCase() || "";
      const ownerName = `${record?.owner?.last_name || ""} ${
        record?.owner?.middle_name || ""
      } ${record?.owner?.first_name || ""}`.toLowerCase();
      const renterNames = record?.renters
        ?.map((renter) =>
          `${renter.last_name || ""} ${renter.middle_name || ""} ${
            renter.first_name || ""
          }`.toLowerCase()
        )
        .join(" ");

      return (
        apartmentName.includes(searchLower) ||
        ownerName.includes(searchLower) ||
        renterNames.includes(searchLower)
      );
    });
  }, [records, searchText]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const deleteRecord = async (id) => {
    try {
      await api.delete(`/records/${id}`);
      message.success("Record permanently deleted");
      fetchRecords();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete record";
      message.error(errorMsg);
    }
  };

  const handleExtensionSubmit = async (values) => {
    try {
      await api.put(`/records/${selectedRecord.record_id}`, {
        end_date: values.end_date.format("YYYY-MM-DD"),
      });
      message.success("Record reactivated successfully");
      setExtensionModalVisible(false);
      fetchRecords();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to reactivate record";
      message.error(errorMsg);
    }
  };

  const showExtensionModal = (record) => {
    setSelectedRecord(record);
    extensionForm.setFieldsValue({
      end_date: dayjs().add(1, 'month'), // Default to one month from today
    });
    setExtensionModalVisible(true);
  };

  const showRecordDetails = (record) => {
    setSelectedRecord(record);
    setDrawerVisible(true);
  };

  const renderAddress = (person) => (
    <Text type="secondary">
      {[person.street, person.ward, person.district, person.city]
        .filter(Boolean)
        .join(", ")}
    </Text>
  );

  const columns = [
    {
      title: "Apartment",
      dataIndex: ["owner", "apartment"],
      key: "apartment",
      render: (apartment) => (
        <Space direction="vertical" size="small">
          <Text strong>{apartment?.name || "N/A"}</Text>
          <Space size="small">
            <Tag color="green">{apartment?.number_of_bedroom} Bedrooms</Tag>
            <Tag color="blue">{apartment?.number_of_bathroom} Bathrooms</Tag>
            <Tag color="purple">{apartment?.area}m²</Tag>
          </Space>
        </Space>
      ),
    },
    {
      title: "Owner",
      key: "owner",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text strong>
            {record?.owner
              ? `${record.owner.last_name || ""} ${
                  record.owner.middle_name || ""
                } ${record.owner.first_name || ""}`
              : "N/A"}
          </Text>
          {record?.owner && (
            <>
              <Text type="secondary">{record.owner.phone_number}</Text>
              <Text type="secondary">{record.owner.email}</Text>
              {getGenderTag(record.owner.gender)}
            </>
          )}
        </Space>
      ),
    },
    {
      title: "Duration",
      key: "duration",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <CalendarOutlined /> Start: {formatDate(record.start_date)}
          </Space>
          <Space>
            <ClockCircleOutlined className="text-red-500" /> Expired: {formatDate(record.end_date)}
          </Space>
        </Space>
      ),
    },
    {
      title: "Expired For",
      key: "expiredDuration",
      render: (_, record) => {
        const days = dayjs().diff(dayjs(record.end_date), 'day');
        return <Tag color="red">{days} days</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined className="text-green-500" />}
              onClick={() => showRecordDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Reactivate Record">
            <Button
              type="text"
              icon={<EditOutlined className="text-blue-500" />}
              onClick={() => showExtensionModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Permanently">
            <Popconfirm
              title="Delete Expired Record"
              description="Are you sure you want to permanently delete this record? This action cannot be undone."
              onConfirm={() => deleteRecord(record?.record_id)}
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

  const drawerContent = () =>
    selectedRecord && (
      <div className="space-y-6">
        <Collapse defaultActiveKey={["1", "2", "3"]}>
          <Panel header="Apartment Information" key="1">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Name" span={2}>
                {selectedRecord.owner?.apartment?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Area">
                {selectedRecord.owner?.apartment?.area}m²
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={getStatusColor(
                    selectedRecord.owner?.apartment?.status
                  )}
                >
                  {selectedRecord.owner?.apartment?.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Bedrooms">
                {selectedRecord.owner?.apartment?.number_of_bedroom}
              </Descriptions.Item>
              <Descriptions.Item label="Bathrooms">
                {selectedRecord.owner?.apartment?.number_of_bathroom}
              </Descriptions.Item>
            </Descriptions>
          </Panel>

          <Panel header="Record Timeline" key="2">
            <Timeline>
              <Timeline.Item>
                Created: {formatDateTime(selectedRecord.create_date)}
              </Timeline.Item>
              <Timeline.Item>
                Updated: {formatDateTime(selectedRecord.update_date)}
              </Timeline.Item>
              <Timeline.Item>
                Start Date: {formatDateTime(selectedRecord.start_date)}
              </Timeline.Item>
              <Timeline.Item color="red">
                Expired: {formatDateTime(selectedRecord.end_date)}
              </Timeline.Item>
              <Timeline.Item color="red">
                Expired for: {dayjs().diff(dayjs(selectedRecord.end_date), 'day')} days
              </Timeline.Item>
            </Timeline>
          </Panel>

          <Panel header="Renters Information" key="3">
            <List
              dataSource={selectedRecord.renters}
              renderItem={(renter) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={`${renter.last_name} ${renter.middle_name} ${renter.first_name}`}
                    description={
                      <Space direction="vertical">
                        <Text type="secondary">{renter.phone_number}</Text>
                        <Text type="secondary">{renter.email}</Text>
                        {getGenderTag(renter.gender)}
                      </Space>
                    }
                  />
                </List.Item>
              )}
              locale={{ emptyText: "No renters found" }}
            />
          </Panel>
        </Collapse>
      </div>
    );

  if (error) {
    return (
      <div className="p-8 text-center">
        <Title level={4} className="text-red-500">
          Error: {error}
        </Title>
        <Button onClick={fetchRecords} type="primary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center gap-2 !mb-0">
          <ClockCircleOutlined className="text-red-500" /> Expired Records Management
        </Title>
        <Space>
          <Input.Search
            placeholder="Search by apartment, owner, or renter..."
            allowClear
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64"
          />
        </Space>
      </div>

      <Card className="shadow-sm rounded-lg">
        <Table
          dataSource={filteredRecords}
          columns={columns}
          loading={loading}
          rowKey="record_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} expired records`,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Drawer
        title={
          <Space>
            <HomeOutlined />
            Expired Record Details
          </Space>
        }
        placement="right"
        width={800}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {drawerContent()}
      </Drawer>

      <Modal
        title={
          <Space>
            <CalendarOutlined />
            Reactivate Record
          </Space>
        }
        open={extensionModalVisible}
        onCancel={() => {
          setExtensionModalVisible(false);
          extensionForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={extensionForm}
          layout="vertical"
          onFinish={handleExtensionSubmit}
        >
          <Form.Item label="Expiration Date">
            <Input
              disabled
              value={selectedRecord ? formatDate(selectedRecord.end_date) : ""}
            />
          </Form.Item>
          <Form.Item
            label="New End Date"
            name="end_date"
            rules={[
              { required: true, message: "Please select a new end date" },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  if (value.isBefore(dayjs())) {
                    return Promise.reject(
                      "New end date must be in the future"
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker
              className="w-full"
              format="YYYY-MM-DD"
              disabledDate={(current) => current && current.isBefore(dayjs(), 'day')}
            />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setExtensionModalVisible(false);
                extensionForm.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Reactivate
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default InactiveRecordList;