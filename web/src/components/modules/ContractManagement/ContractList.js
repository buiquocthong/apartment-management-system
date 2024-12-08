import React, { useEffect, useState, useCallback } from "react";
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
  Popconfirm,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PlusOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { API } from '../../../constant/constant';

const { Title } = Typography;

const ContractList = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedContract, setSelectedContract] = useState(null);
  const [totalContracts, setTotalContracts] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
  });
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();
  const API_URL = `${API}/master/api`;

  const fetchContracts = useCallback(
    async (page = 1, pageSize = 50) => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const offset = (page - 1) * pageSize;
        const response = await axios.get(`${API_URL}/contracts`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            offset: offset,
            limit: pageSize,
            direction: "ASC",
            query: searchText || "",
          },
        });

        setContracts(response.data.items || []);
        setTotalContracts(response.data.total_count || 0);
        setPagination({
          current: page,
          pageSize: pageSize,
        });
      } catch (error) {
        console.error("Error fetching contracts:", error);
        message.error(
          error.response?.data?.message || "Failed to fetch contracts"
        );
      } finally {
        setLoading(false);
      }
    },
    [API_URL, searchText]
  );

  useEffect(() => {
    fetchContracts(pagination.current, pagination.pageSize);
  }, [fetchContracts, pagination.current, pagination.pageSize]);

  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    fetchContracts(1, pagination.pageSize);
  };

  const handleTableChange = (newPagination) => {
    const newPage = newPagination.current || 1;
    const newPageSize = newPagination.pageSize || pagination.pageSize;

    setPagination({
      current: newPage,
      pageSize: newPageSize,
    });

    fetchContracts(newPage, newPageSize);
  };

  const deleteContract = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/contracts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Contract deleted successfully", 2);
      fetchContracts(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error("Error deleting contract:", error);
      message.error("Failed to delete contract", 2);
    }
  };

  const formatDate = (date) => dayjs(date).format("DD/MM/YYYY HH:mm");

  const showContractDetails = (contract) => {
    setSelectedContract(contract);
    setDrawerVisible(true);
  };

  const columns = [
    {
      title: "Apartment",
      dataIndex: "apartment",
      key: "name",
      render: (apartment) => apartment?.name || "N/A",
    },
    {
      title: "Owner",
      key: "owner_name",
      render: (_, contract) => (
        <span>
          {contract.owner.first_name} {contract.owner.middle_name}{" "}
          {contract.owner.last_name}
        </span>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (date) => formatDate(date),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, contract) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined className="text-green-500" />}
              onClick={() => showContractDetails(contract)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this contract?"
              onConfirm={() => deleteContract(contract?.contract_id)}
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
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center gap-2 !mb-0">
          Contract Management
        </Title>
        <Space>
          <Input.Search
            placeholder="Search contract..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            className="w-64"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/contracts/new")}
          >
            Add New Contract
          </Button>
        </Space>
      </div>

      <Card className="shadow-sm">
        <Table
          dataSource={contracts}
          columns={columns}
          loading={loading}
          rowKey="contract_id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: totalContracts,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, pageSize) => {
              handleTableChange({ current: page, pageSize });
            },
            onShowSizeChange: (current, size) => {
              setPagination({ ...pagination, pageSize: size });
              fetchContracts(current, size);
            },
          }}
        />
      </Card>

      <Drawer
        title="Contract Details"
        placement="right"
        width={800}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedContract && (
          <div className="space-y-6">
            <Descriptions title="Contract Information" bordered>
              <Descriptions.Item label="Start Date" span={3}>
                {formatDate(selectedContract.start_date)}
              </Descriptions.Item>
              <Descriptions.Item label="End Date" span={3}>
                {formatDate(selectedContract.end_date)}
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={3}>
                {selectedContract.status}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Apartment Information" bordered>
              <Descriptions.Item label="Apartment Name" span={3}>
                {selectedContract.apartment.name}
              </Descriptions.Item>
              <Descriptions.Item label="Area" span={3}>
                {selectedContract.apartment.area} m²
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Owner Information" bordered>
              <Descriptions.Item label="Owner Name" span={3}>
                {selectedContract.owner.first_name}{" "}
                {selectedContract.owner.middle_name}{" "}
                {selectedContract.owner.last_name}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={3}>
                {selectedContract.owner.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone Number" span={3}>
                {selectedContract.owner.phone_number}
              </Descriptions.Item>
              <Descriptions.Item label="Birthday" span={3}>
                {formatDate(selectedContract.owner.birthday)}
              </Descriptions.Item>
              <Descriptions.Item label="Address" span={3}>
                {selectedContract.owner.street}, {selectedContract.owner.ward},{" "}
                {selectedContract.owner.district}, {selectedContract.owner.city}
              </Descriptions.Item>
              <Descriptions.Item label="Occupation" span={3}>
                {selectedContract.owner.occupancy ? "Occupied" : "Rented"}
              </Descriptions.Item>
            </Descriptions>

            <Timeline mode="left">
              <Timeline.Item label="Created At">
                {formatDate(selectedContract.create_date)}
              </Timeline.Item>
              <Timeline.Item label="Last Updated">
                {formatDate(selectedContract.update_date)}
              </Timeline.Item>
            </Timeline>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ContractList;