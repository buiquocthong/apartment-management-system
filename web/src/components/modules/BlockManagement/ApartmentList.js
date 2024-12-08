import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Button,
  Tag,
  Spin,
  Typography,
  message,
  Row,
  Col,
  Popconfirm,
  Empty,
  Input,
  Menu,
  Dropdown,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  PlusOutlined,
  EyeOutlined,
  FileAddOutlined,
  DeleteOutlined,
  FileTextOutlined,
  ContainerOutlined,
  HomeOutlined,
  MoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import ServiceDetailForm from '../ServiceManagement/ServiceDetailForm';
import renterRecordApi from "../../../services/renterRecordApi";
import { API } from '../../../constant/constant';
const { Title, Text } = Typography;
const API_URL = `${API}/master/api`;

const ApartmentList = () => {
  const [apartments, setApartments] = useState([]);
  const [renterRecord, setRenterRecord] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const navigate = useNavigate();
  const { blockId, floorId } = useParams();

  const fetchApartments = useCallback(async () => {
    if (!floorId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }

      const response = await axios.get(`${API_URL}/floors/${floorId}/apartments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApartments(response.data || []);
    } catch (error) {
      console.error("Error fetching apartments:", error);
      message.error("Failed to fetch apartments", 2);
      setApartments([]);
    } finally {
      setLoading(false);
    }
  }, [floorId]);

  const fetchRenterRecords = useCallback(async () => {
    try {
      const response = await renterRecordApi().getAllRecords();
      setRenterRecord(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching renter records:", error);
      message.error("Failed to fetch renter records", 2);
    }
  }, []);

  useEffect(() => {
    fetchApartments();
    fetchRenterRecords();
  }, [fetchApartments, fetchRenterRecords]);

  const deleteApartment = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }

      await axios.delete(`${API_URL}/apartments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Apartment deleted successfully", 2);
      fetchApartments();
    } catch (error) {
      console.error("Error deleting apartment:", error);
      message.error("Failed to delete apartment", 2);
    }
  };

  const getStatusStyle = (status) =>
    status === "AVAILABLE" ? { color: "#52c41a" } : { color: "#fa8c16" };

  const renderPrice = (status, saleInfo) => {
    return saleInfo?.purchase_price
      ? new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 0,
        }).format(saleInfo.purchase_price)
      : "0";
  };

  const ApartmentCard = ({ apartment }) => {
    const isAvailable = apartment?.status?.toUpperCase() === "AVAILABLE";

    const menu = (
      <Menu>
        <Menu.Item
          icon={<EyeOutlined />}
          onClick={() =>
            navigate(
              `/blocks/${blockId}/floors/${floorId}/apartments/${apartment.apartment_id}/edit`
            )
          }
        >
          View details
        </Menu.Item>

        {isAvailable ? (
          <>
            <Menu.Item
              icon={<FileAddOutlined />}
              onClick={() => {
                localStorage.setItem('apartment_id', apartment.apartment_id);
                navigate('/contracts/new_on_apartment');
              }}
            >
              Create contract
            </Menu.Item>
            <Menu.Item danger icon={<DeleteOutlined />}>
              <Popconfirm
                title="Are you sure you want to delete this apartment?"
                onConfirm={() => deleteApartment(apartment?.apartment_id)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                Delete
              </Popconfirm>
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item
              icon={<FileTextOutlined />}
              onClick={() => navigate('/invoices/new_on_apartment', { 
                state: { selectedApartment: apartment }
              })}
            >
              Create new invoice
            </Menu.Item>

            <Menu.Item
              icon={<SettingOutlined />}
              onClick={() => {
                setSelectedApartment(apartment);
                setIsModalVisible(true);
              }}
            >
              Setup service details
            </Menu.Item>
            
            {Array.isArray(renterRecord) && !renterRecord.some(record => record.owner?.owner_id === apartment.owner?.owner_id) && (
              <Menu.Item
                icon={<ContainerOutlined />}
                onClick={() => {
                  localStorage.setItem('apartment_id', apartment.apartment_id);
                  navigate(`/records/new_on_apartment`);
                }}
              >
                Create rental record
              </Menu.Item>
            )}
          </>
        )}
      </Menu>
    );

    return (
      <Card
        className="transform transition-all duration-300 hover:shadow-lg rounded-lg overflow-hidden"
        bodyStyle={{ padding: 0 }}
      >
        <div className="p-4 flex justify-between items-start">
          <Text strong className="text-lg">
            {apartment?.name}
          </Text>
          <Tag style={getStatusStyle(apartment?.status)}>
            {apartment?.status}
          </Tag>
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </div>

        <div className="px-4 pb-4">
          <Title level={5} className="mb-3 text-gray-600">
            Detail info:
          </Title>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-gray-600">
              <Text>Purchase price:</Text>
              <Text strong>
                {renderPrice(apartment?.status, apartment?.sale_info)}
              </Text>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <Text>Area:</Text>
              <Text strong>{apartment?.area || "0"} sqm</Text>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <Text>Furniture:</Text>
              <Text strong>{apartment?.furnished ? "Yes" : "No"}</Text>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <Text>Bedrooms:</Text>
              <Text strong>{apartment?.number_of_bedroom ?? "0"}</Text>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <Text>Bathrooms:</Text>
              <Text strong>{apartment?.number_of_bathroom ?? "0"}</Text>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 sm:px-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Title level={2} className="flex items-center gap-2">
            <HomeOutlined className="text-blue-500" />
            Apartment Management
          </Title>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search apartments..."
              prefix={<PlusOutlined />}
              className="w-full sm:w-64"
              size="large"
            />
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() =>
                navigate(`/blocks/${blockId}/floors/${floorId}/apartments/new`)
              }
            >
              Add New Apartment
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" tip="Loading apartments..." />
          </div>
        ) : !apartments.length ? (
          <Empty description="No apartments found" className="my-16" />
        ) : (
          <Row gutter={[24, 24]}>
            {apartments.map((apartment) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={apartment?.apartment_id}>
                <ApartmentCard apartment={apartment} />
              </Col>
            ))}
          </Row>
        )}
      </div>

      <ServiceDetailForm
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedApartment(null);
        }}
        apartmentId={selectedApartment?.apartment_id}
        onFinish={(values) => {
          console.log("Received values:", values);
          setIsModalVisible(false);
          setSelectedApartment(null);
        }}
      />
    </div>
  );
};

export default ApartmentList;