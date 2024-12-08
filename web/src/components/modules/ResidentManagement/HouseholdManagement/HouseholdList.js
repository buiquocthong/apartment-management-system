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
  Divider,
} from "antd";
import axios from "axios";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { API } from '../../../../constant/constant';
const { Title } = Typography;

const HouseholdList = () => {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
  });
  const [totalHouseholds, setTotalHouseholds] = useState(0);
  const navigate = useNavigate();

  const API_URL = `${API}/master/api/households`;

  const fetchHouseholds = useCallback(async (page = 1, pageSize = 50) => {
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
      setHouseholds(response.data.items || []);
      setTotalHouseholds(response.data.total_count || 0);
      // message.success("Households fetched successfully");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        message.error("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("token");
      } else {
        message.error("Failed to fetch households");
      }
    } finally {
      setLoading(false);
    }
  }, [API_URL, searchText]);

  const handleTableChange = (pagination) => {
    const newPage = pagination.current || 1;
    const newPageSize = pagination.pageSize || pagination.pageSize;

    setPagination({
      current: newPage,
      pageSize: newPageSize,
    });

    fetchHouseholds(newPage, newPageSize);
  };

  useEffect(() => {
    fetchHouseholds();
  }, [fetchHouseholds]);

  const handleSearch = () => {
    if (searchText) {
      const filteredHouseholds = households.filter((household) =>
        household.household_id.toLowerCase().includes(searchText.toLowerCase())
      );
      setHouseholds(filteredHouseholds);
    } else {
      fetchHouseholds();
    }
  };

  const formatDate = (date) => {
    return dayjs(date).format("DD/MM/YYYY");
  };

  const showHouseholdDetails = (household) => {
    setSelectedHousehold(household);
    setDrawerVisible(true);
  };

  const columns = [
    {
      title: "Total Members",
      dataIndex: "total_member",
      key: "total_member",
    },
    {
      title: "Owners",
      dataIndex: "owners",
      key: "owners",
      render: (owners) => (
        <div>
          {owners
            .filter((owner) => owner.household_head)
            .map((owner) => (
              <div key={owner.owner_id}>
                <p className="font-medium">{`${owner.first_name} ${owner.middle_name} ${owner.last_name}`}</p>
                <p>Phone: {owner.phone_number}</p>
                <p>Email: {owner.email}</p>
                <p>Career: {owner.career}</p>
                <p>ID Card: {owner.id_card_number}</p>
                <p>Head: {owner.household_head ? "Yes" : "No"}</p>
                <p>Address: {`${owner.street}, ${owner.ward}, ${owner.district}, ${owner.city}`}</p>
              </div>
            ))}
        </div>
      ),
    },
    {
      title: "Create Date",
      dataIndex: "create_date",
      key: "create_date",
      render: (date) => formatDate(date),
    },
    {
      title: "Update Date",
      dataIndex: "update_date",
      key: "update_date",
      render: (date) => formatDate(date),
    },
    {
      title: "Action",
      key: "action",
      render: (_, household) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined className="text-green-500" />}
              onClick={() => showHouseholdDetails(household)}
            />
          </Tooltip>
          <Tooltip title="Add Owner">
            <Button
              type="text"
              icon={<PlusOutlined className="text-blue-500" />}
              onClick={() => {
                localStorage.setItem('householdId', household.household_id);
                navigate('/residents/owners/new');
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center gap-2 !mb-0">
          Household Management
        </Title>
        <Space>
          <Input.Search
            placeholder="Search household..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            className="w-64"
          />
        </Space>
      </div>

      <Card className="shadow-sm">
        <Table
          dataSource={households}
          columns={columns}
          loading={loading}
          rowKey="household_id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: totalHouseholds,
            showSizeChanger: true,
            onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
            onShowSizeChange: (current, size) => {
              setPagination({ ...pagination, pageSize: size });
              fetchHouseholds(current, size);
            },
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          }}
        />
      </Card>

      <Drawer
        title="Household Details"
        placement="right"
        width={800}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedHousehold && (
          <>
            <Descriptions
              title="Household Information"
              bordered
              column={1}
              labelStyle={{ fontWeight: "bold", width: "30%" }}
              contentStyle={{ width: "70%" }}
            >
              <Descriptions.Item label="Household ID">
                {selectedHousehold.household_id}
              </Descriptions.Item>
              <Descriptions.Item label="Total Members">
                {selectedHousehold.total_member}
              </Descriptions.Item>
              <Descriptions.Item label="Creation Date">
                {formatDate(selectedHousehold.create_date)}
              </Descriptions.Item>
              <Descriptions.Item label="Update Date">
                {formatDate(selectedHousehold.update_date)}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions
              title="Owners Information"
              bordered
              column={1}
              labelStyle={{ fontWeight: "bold", width: "30%" }}
              contentStyle={{ width: "70%" }}
            >
              {selectedHousehold.owners.map((owner, index) => (
                <React.Fragment key={owner.owner_id}>
                  <Descriptions.Item label="Full Name">
                    {`${owner.first_name} ${owner.middle_name || ""} ${owner.last_name}`}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone Number">
                    {owner.phone_number}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {owner.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Career">
                    {owner.career}
                  </Descriptions.Item>
                  <Descriptions.Item label="ID Card Number">
                    {owner.id_card_number}
                  </Descriptions.Item>
                  <Descriptions.Item label="Birth Date">
                    {formatDate(owner.birth_day)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Household Head">
                    <Tag color={owner.household_head ? "green" : "red"}>
                      {owner.household_head ? "Yes" : "No"}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Address">
                    {`${owner.street}, ${owner.ward}, ${owner.district}, ${owner.city}`}
                  </Descriptions.Item>
                  {index < selectedHousehold.owners.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Descriptions>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default HouseholdList;