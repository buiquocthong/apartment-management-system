import React, { useEffect, useState } from "react";
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
  Popconfirm,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MoneyCollectOutlined,
  PlusOutlined,
  DeleteOutlined,
  FileTextOutlined,
  EyeOutlined,
  SettingOutlined,
  WarningOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import CollectPaymentModal from "./CollectPaymentModal";
import InvoiceSettingModal from "./InvoiceSettingModal";
import { API } from '../../../constant/constant';
const { Title } = Typography;

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [serviceDetails, setServiceDetails] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [allServiceDetails, setAllServiceDetails] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
  });
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);
  const navigate = useNavigate();
  const API_URL = `${API}/master/api`;

  const fetchServiceDetails = async (apartmentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/apartments/${apartmentId}/service_details`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching service details:", error);
      return [];
    }
  };

  const fetchAllServiceDetails = async (invoicesList) => {
    const details = {};
    for (const invoice of invoicesList) {
      const serviceDetails = await fetchServiceDetails(invoice.apartment.apartment_id);
      details[invoice.invoice_id] = serviceDetails;
    }
    setAllServiceDetails(details);
  };

  const fetchInvoices = async (page = 1, pageSize = 50) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const offset = (page - 1) * pageSize;
      const response = await axios.get(`${API_URL}/invoices`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          offset: offset,
          limit: pageSize,
          direction: "ASC",
          query: searchText || "",
        },
      });

      setInvoices(response.data.items || []);
      setTotalInvoices(response.data.total_count || 0);
      
      if (response.data.items?.length > 0) {
        await fetchAllServiceDetails(response.data.items);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      message.error(
        error.response?.data?.message || "Failed to fetch invoices"
      );
    } finally {
      setLoading(false);
    }
  };

  const showInvoiceDetails = async (invoice) => {
    setSelectedInvoice(invoice);
    const details = await fetchServiceDetails(invoice.apartment.apartment_id);
    setServiceDetails(details);
    setDrawerVisible(true);
  };

  useEffect(() => {
    fetchInvoices();
  }, [searchText]);

  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    fetchInvoices(1, pagination.pageSize);
  };

  const handleTableChange = (pagination) => {
    const newPage = pagination.current || 1;
    const newPageSize = pagination.pageSize || pagination.pageSize;

    setPagination({
      current: newPage,
      pageSize: newPageSize,
    });

    fetchInvoices(newPage, newPageSize);
  };

  const deleteInvoice = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Invoice deleted successfully", 2);
      fetchInvoices(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error("Error deleting invoice:", error);
      message.error("Failed to delete invoice", 2);
    }
  };

  const formatDate = (date) => dayjs(date).format("DD/MM/YYYY HH:mm");

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "green";
      case "unpaid":
        return "red";
      case "expired":
        return "orange";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateServiceTotal = (invoice) => {
    const serviceDetails = allServiceDetails[invoice.invoice_id] || [];
    return serviceDetails.reduce((total, detail) => {
      const money = detail && typeof detail.money === 'number' ? detail.money : 0;
      return total + money;
    }, 0);
  };

  const columns = [
    {
      title: "Apartment",
      dataIndex: ["apartment", "name"],
      key: "apartment_name",
    },
    {
      title: "Service Total",
      key: "service_total",
      render: (_, record) => formatCurrency(calculateServiceTotal(record)),
    },
    {
      title: "Penalty Fee",
      key: "penalty_fee",
      render: (_, record) => 
        record.status === "EXPIRED" && record.penalty_fee > 0 ? (
          <span className="text-red-500 flex items-center gap-1">
            <WarningOutlined />
            {formatCurrency(record.penalty_fee)}
          </span>
        ) : "-",
    },
    {
      title: "Total Amount",
      dataIndex: "total",
      key: "total",
      render: (total) => formatCurrency(total),
    },
    {
      title: "Payment Deadline",
      dataIndex: "payment_deadline",
      key: "payment_deadline",
      render: (date) => formatDate(date),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, invoice) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined className="text-green-500" />}
              onClick={() => showInvoiceDetails(invoice)}
            />
          </Tooltip>
          {(invoice.status === "UNPAID" || invoice.status === "EXPIRED") && (
            <Tooltip title="Collect Payment">
              <Button
                type="text"
                icon={<MoneyCollectOutlined className="text-blue-500" />}
                onClick={() => {
                  setSelectedInvoice(invoice);
                  setIsModalVisible(true);
                }}
              />
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this invoice?"
              onConfirm={() => deleteInvoice(invoice?.invoice_id)}
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
    <div
      className="p-8 max-w-7xl mx-auto"
      style={{ height: "100vh", overflow: "auto" }}
    >
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center gap-2 !mb-0">
          <FileTextOutlined /> Invoice Management
        </Title>
        <Space>
          <Input.Search
            placeholder="Search invoice..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            className="w-64"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/invoices/new")}
          >
            Add New Invoice
          </Button>
          <Button
            type="primary"
            icon={<SettingOutlined />}
            onClick={() => {
              setIsSettingModalVisible(true);
            }}
          >
            Invoice Setting
          </Button>
        </Space>
      </div>

      <Card
        className="shadow-sm rounded-lg"
        style={{ overflow: "auto", maxHeight: "70vh" }}
      >
        <Table
          dataSource={invoices}
          columns={columns}
          loading={loading}
          rowKey="invoice_id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: totalInvoices,
            showSizeChanger: true,
            onChange: (page, pageSize) =>
              handleTableChange({ current: page, pageSize }),
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          }}
        />
      </Card>

      <Drawer
        title="Invoice Details"
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedInvoice && (
          <div className="space-y-6">
            <Descriptions title="Invoice Information" bordered>
              <Descriptions.Item label="Service Total" span={3}>
                {formatCurrency(calculateServiceTotal(selectedInvoice))}
              </Descriptions.Item>
              {selectedInvoice.status === "EXPIRED" && 
               selectedInvoice.penalty_fee > 0 && (
                <Descriptions.Item label="Penalty Fee" span={3}>
                  <span className="text-red-500">
                    {formatCurrency(selectedInvoice.penalty_fee)}
                  </span>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Total Amount" span={3}>
                {formatCurrency(selectedInvoice.total)}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Deadline" span={3}>
                {formatDate(selectedInvoice.payment_deadline)}
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={3}>
                <Tag color={getStatusColor(selectedInvoice.status)}>
                  {selectedInvoice.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Apartment Information" bordered>
              <Descriptions.Item label="Apartment Name" span={3}>
                {selectedInvoice.apartment?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Area" span={3}>
                {selectedInvoice.apartment?.area}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Service Details" bordered>
              {serviceDetails.length > 0 ? (
                serviceDetails.map((service, index) => (
                  <Descriptions.Item
                    label={service.service.name}
                    key={index}
                    span={3}
                  >
                    {service.service.is_metered_service ? (
                      <>
                        Old Value: {service.old_value} <br />
                        New Value: {service.new_value} <br />
                        Amount Used: {service.amount_of_using} <br />
                        Total: {formatCurrency(service.money)}
                      </>
                    ) : (
                      <>
                        Price: {formatCurrency(service.service.price)} <br />
                        Total: {formatCurrency(service.money)}
                      </>
                    )}
                  </Descriptions.Item>
                ))
              ) : (
                <Descriptions.Item span={3}>
                  No service details available
                </Descriptions.Item>
              )}
            </Descriptions>

            <Descriptions title="Timeline" bordered>
              <Descriptions.Item label="Created At" span={3}>
                {formatDate(selectedInvoice.create_date)}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated" span={3}>
                {formatDate(selectedInvoice.update_date)}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>

      <CollectPaymentModal 
        visible={isModalVisible} 
        invoice={selectedInvoice}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedInvoice(null);
        }}
        onSuccess={() => {
          fetchInvoices(pagination.current, pagination.pageSize);
        }}
      />

      <InvoiceSettingModal 
        visible={isSettingModalVisible} 
        onClose={() => {
          setIsSettingModalVisible(false);
        }}
        onSuccess={() => {
          fetchInvoices(pagination.current, pagination.pageSize);
        }}
      />
    </div>
  );
};

export default InvoiceList;