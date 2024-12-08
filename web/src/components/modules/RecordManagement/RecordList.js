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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
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

const RecordList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedRenter, setSelectedRenter] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailType, setDetailType] = useState(null);
  const [extensionModalVisible, setExtensionModalVisible] = useState(false);
  const [extensionForm] = Form.useForm();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/records");
      setRecords(response.data?.items || []);
      message.success("Records fetched successfully");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch records";
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
      message.success("Record deleted successfully");
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
      message.success("Record extended successfully");
      setExtensionModalVisible(false);
      fetchRecords();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to extend record";
      message.error(errorMsg);
    }
  };

  const showExtensionModal = (record) => {
    setSelectedRecord(record);
    extensionForm.setFieldsValue({
      end_date: dayjs(record.end_date),
    });
    setExtensionModalVisible(true);
  };

  const showRecordDetails = (record) => {
    setSelectedRecord(record);
    setDetailType("record");
    setDrawerVisible(true);
  };

  const showRenterDetails = (record, renter) => {
    setSelectedRecord(record);
    setSelectedRenter(renter);
    setDetailType("renter");
    setDrawerVisible(true);
  };

  const renderAddress = (person) => (
    <Text type="secondary">
      {[person.street, person.ward, person.district, person.city]
        .filter(Boolean)
        .join(", ")}
    </Text>
  );

  const renderPersonDetails = (person, title) => (
    <Descriptions title={title} bordered column={2}>
      <Descriptions.Item label="Full Name" span={2}>
        {`${person.last_name || ""} ${person.middle_name || ""} ${
          person.first_name || ""
        }`}
      </Descriptions.Item>
      <Descriptions.Item label="Gender">
        {getGenderTag(person.gender)}
      </Descriptions.Item>
      <Descriptions.Item label="Birth Day">
        {formatDate(person.birth_day)}
      </Descriptions.Item>
      <Descriptions.Item label="Phone">{person.phone_number}</Descriptions.Item>
      <Descriptions.Item label="Email">{person.email}</Descriptions.Item>
      <Descriptions.Item label="ID Card" span={2}>
        {person.id_card_number}
      </Descriptions.Item>
      <Descriptions.Item label="Career">{person.career}</Descriptions.Item>
      <Descriptions.Item label="Address" span={2}>
        {renderAddress(person)}
      </Descriptions.Item>
      {person.household_head !== undefined && (
        <Descriptions.Item label="Household Head">
          <Tag color={person.household_head ? "green" : "default"}>
            {person.household_head ? "Yes" : "No"}
          </Tag>
        </Descriptions.Item>
      )}
      {person.occupancy !== undefined && (
        <Descriptions.Item label="Occupancy">
          <Tag color={person.occupancy ? "green" : "default"}>
            {person.occupancy ? "Yes" : "No"}
          </Tag>
        </Descriptions.Item>
      )}
      <Descriptions.Item label="Created">
        {formatDateTime(person.create_date)}
      </Descriptions.Item>
      <Descriptions.Item label="Updated">
        {formatDateTime(person.update_date)}
      </Descriptions.Item>
    </Descriptions>
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
      title: "Number of Renters",
      key: "rentersCount",
      render: (_, record) => (
        <Tag color="blue">{record.renters?.length || 0} Renters</Tag>
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
            <CalendarOutlined /> End: {formatDate(record.end_date)}
          </Space>
        </Space>
      ),
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
          <Tooltip title="Add Sub Renter">
            <Button
              type="text"
              icon={<PlusOutlined className="text-blue-500" />}
              onClick={() =>
                navigate("/records/add_new_sub_renter", {
                  state: { record_id: record.record_id },
                })
              }
            />
          </Tooltip>
          <Tooltip title="Extend Record">
            <Button
              type="text"
              icon={<EditOutlined className="text-blue-500" />}
              onClick={() => showExtensionModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Record"
              description="Are you sure you want to delete this record? This action cannot be undone."
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
              <Descriptions.Item label="Furnished" span={2}>
                <Tag
                  color={
                    selectedRecord.owner?.apartment?.furnished ? "green" : "red"
                  }
                >
                  {selectedRecord.owner?.apartment?.furnished ? "Yes" : "No"}
                </Tag>
              </Descriptions.Item>
              {selectedRecord.owner?.apartment?.sale_info && (
                <>
                  <Descriptions.Item label="Purchase Price">
                    $
                    {selectedRecord.owner?.apartment?.sale_info.purchase_price.toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Sale Date">
                    {formatDate(
                      selectedRecord.owner?.apartment?.sale_info.sale_date
                    )}
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
          </Panel>

          <Panel header="Owner Information" key="2">
            {selectedRecord.owner &&
              renderPersonDetails(selectedRecord.owner, "")}
            {selectedRecord.owner?.household && (
              <Descriptions title="Household Information" bordered>
                <Descriptions.Item label="Household ID">
                  {selectedRecord.owner.household.household_id}
                </Descriptions.Item>
                <Descriptions.Item label="Total Members">
                  {selectedRecord.owner.household.total_member}
                </Descriptions.Item>
              </Descriptions>
            )}
          </Panel>

          <Panel header="Renters Information" key="3">
            {selectedRecord?.renters?.length > 0 ? (
              selectedRecord.renters.map((renter, index) => (
                <Descriptions
                  title={`Renter ${index + 1}`}
                  bordered
                  column={2}
                  key={renter.renter_id}
                >
                  <Descriptions.Item label="Full Name" span={2}>
                    {`${renter.last_name || ""} ${renter.middle_name || ""} ${
                      renter.first_name || ""
                    }`}
                  </Descriptions.Item>
                  <Descriptions.Item label="Gender">
                    {getGenderTag(renter.gender)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Birth Day">
                    {formatDate(renter.birth_day)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    {renter.phone_number}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {renter.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="ID Card" span={2}>
                    {renter.id_card_number}
                  </Descriptions.Item>
                  <Descriptions.Item label="Career">
                    {renter.career}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address" span={2}>
                    {renderAddress(renter)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Created">
                    {formatDateTime(renter.create_date)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Updated">
                    {formatDateTime(renter.update_date)}
                  </Descriptions.Item>
                </Descriptions>
              ))
            ) : (
              <Text type="secondary">No renters found</Text>
            )}
          </Panel>

          <Panel header="Record Timeline" key="4">
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
              <Timeline.Item>
                End Date: {formatDateTime(selectedRecord.end_date)}
              </Timeline.Item>
            </Timeline>
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
          <HomeOutlined /> Record Management
        </Title>
        <Space>
          <Input.Search
            placeholder="Search by apartment, owner, or renter..."
            allowClear
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/records/new")}
          >
            Add Record
          </Button>
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
            showTotal: (total) => `Total ${total} records`,
            showQuickJumper: true,
          }}
          scroll={{ x: true }}
          expandable={{
            expandedRowRender: (record) => (
              <div className="p-4">
                <Title level={5}>Renters</Title>
                <List
                  dataSource={record.renters}
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
              </div>
            ),
          }}
        />
      </Card>

      <Drawer
        title={
          <Space>
            {detailType === "record" ? <HomeOutlined /> : <UserOutlined />}
            {detailType === "record" ? "Record Details" : "Renter Details"}
          </Space>
        }
        placement="right"
        width={800}
        onClose={() => {
          setDrawerVisible(false);
          setDetailType(null);
          setSelectedRenter(null);
        }}
        open={drawerVisible}
      >
        {detailType === "record" && selectedRecord && drawerContent()}
        {detailType === "renter" &&
          selectedRecord &&
          selectedRenter &&
          renderPersonDetails(selectedRenter, "Renter Details")}
      </Drawer>

      <Modal
        title={
          <Space>
            <CalendarOutlined />
            Extend Record
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
          <Form.Item label="Current End Date">
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
                  if (!value || !selectedRecord) return Promise.resolve();
                  if (value.isBefore(dayjs(selectedRecord.end_date))) {
                    return Promise.reject(
                      "New end date must be after current end date"
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
              disabledDate={(current) => {
                if (!selectedRecord) return false;
                return (
                  current && current.isBefore(dayjs(selectedRecord.end_date))
                );
              }}
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
              Update
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default RecordList;
