import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  InputNumber, 
  Button, 
  Card, 
  Checkbox,
  Space,
  message 
} from 'antd';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';
import apartmentApi from '../../../services/apartmentApi.ts';
import invoiceApi from '../../../services/invoiceApi';
import { API } from '../../../constant/constant';
import axios from "axios";
import ServiceDetailItem from '../../commons/ServiceDetailItem.jsx';


const { Option } = Select;

const API_URL = API + '/master/api';

// Separate API call function for reusability
const fetchWithAuth = async (url) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authorization token is missing");
  }

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const InvoiceForm = ({ 
  initialValues,
  onFinish,
  loading = false,
  form,
  apartmentIdProp,
}) => {
  // State management
  const [locationData, setLocationData] = useState({
    blocks: [],
    floors: [],
    apartments: [],
  });
  const [loadingStates, setLoadingStates] = useState({
    blocks: false,
    floors: false,
    apartments: false,
  });
  const [serviceDetails, setServiceDetails] = useState([]);
  const location = useLocation();
  const selectedApartment = location.state?.selectedApartment || null;

  // Fetch blocks on component mount
  useEffect(() => {
    const loadBlocks = async () => {
      setLoadingStates(prev => ({ ...prev, blocks: true }));
      try {
        const data = await fetchWithAuth(`${API_URL}/blocks`);
        setLocationData(prev => ({ ...prev, blocks: data || [] }));
      } catch (error) {
        message.error("Failed to fetch blocks");
      } finally {
        setLoadingStates(prev => ({ ...prev, blocks: false }));
      }
    };
    loadBlocks();
  }, []);

  // Memoized handlers for better performance
  const handleBlockChange = useCallback(async (blockId) => {
    form.setFieldsValue({
      floor: null,
      apartment_id: null,
      apartment_name: null,
    });
    setLocationData(prev => ({
      ...prev,
      floors: [],
      apartments: [],
    }));

    if (!blockId) return;

    setLoadingStates(prev => ({ ...prev, floors: true }));
    try {
      const data = await fetchWithAuth(`${API_URL}/blocks/${blockId}/floors`);
      setLocationData(prev => ({ ...prev, floors: data || [] }));
    } catch (error) {
      message.error("Failed to fetch floors");
    } finally {
      setLoadingStates(prev => ({ ...prev, floors: false }));
    }
  }, [form]);

  const handleFloorChange = useCallback(async (floorId) => {
    form.setFieldsValue({
      apartment_id: null,
      apartment_name: null,
    });
    setLocationData(prev => ({ ...prev, apartments: [] }));

    if (!floorId) return;

    setLoadingStates(prev => ({ ...prev, apartments: true }));
    try {
      const data = await fetchWithAuth(`${API_URL}/floors/${floorId}/apartments`);
      const availableApartments = data
        ?.filter(apartment => apartment.status === "SOLD")
        .map(apartment => ({
          apartment_id: apartment.apartment_id,
          name: apartment.name,
        })) || [];
      setLocationData(prev => ({ ...prev, apartments: availableApartments }));
    } catch (error) {
      message.error("Failed to fetch apartments");
    } finally {
      setLoadingStates(prev => ({ ...prev, apartments: false }));
    }
  }, [form]);

  // Service details handling
  const fetchServiceDetails = useCallback(async (apartmentId) => {
    try {
      const api = apartmentApi();
      const response = await api.getApartmentById(apartmentId);
      
      const formattedServiceDetails = response.service_details.map(detail => ({
        service_id: detail.service.service_id,
        service: detail.service,  
        old_value: detail.old_value || 0,
        new_value: detail.new_value || 0,
        amount_of_using: detail.amount_of_using || 1, // Thêm amount_of_using
        selected: true
      }));

      setServiceDetails(formattedServiceDetails);
      form.setFieldValue('service_details', formattedServiceDetails);
    } catch (error) {
      console.error('Error fetching service details:', error);
      message.error('Failed to fetch service details');
    }
  }, [form]);

  const handleApartmentChange = useCallback((apartmentId) => {
    const selectedApt = locationData.apartments.find(
      apt => apt.apartment_id === apartmentId
    );
    if (selectedApt) {
      form.setFieldsValue({
        apartment_id: selectedApt.apartment_id,
        apartment_name: selectedApt.name,
      });
      fetchServiceDetails(selectedApt.apartment_id);
    }
  }, [locationData.apartments, form, fetchServiceDetails]);

  // const calculateTotal = (serviceDetails = []) => {
  //   if (!Array.isArray(serviceDetails)) return 0;
    
  //   return serviceDetails.reduce((total, detail) => {
  //     // // Skip if service is not selected or values are invalid
  //     // if (!detail?.selected || !detail?.service) {
  //     //   return total;
  //     // }
  
  //     const service = detail.service;
  //     // if (!service?.price) return total;
  
  //     // For metered services (like electricity, water)
  //     if (service.metered_service) {
  //       // Ensure we have valid numbers for calculation
  //       const oldValue = Number(detail.old_value) || 0;
  //       const newValue = Number(detail.new_value) || 0;
        
  //       // Calculate usage amount (difference between new and old values)
  //       const usage = Math.max(0, newValue - oldValue);
        
  //       return total + (usage * service.price);
  //     } 
  //     // For non-metered services (like parking, maintenance)
  //     else {
  //       // Use amount_of_using if provided, default to 1
  //       const amount = Number(detail.amount_of_using) || 1;
  //       return total + (amount * service.price);
  //     }
  //   }, 0);
  // };

  // Handle form submission
  const calculateTotal = (serviceDetails = []) => {
    if (!Array.isArray(serviceDetails)) return 0;
    
    return serviceDetails.reduce((total, detail) => {
      if (!detail?.selected || typeof detail.old_value !== 'number' || typeof detail.new_value !== 'number') {
        return total;
      }

      const service = detail.service;
      if (!service?.price) return total;

      const amountOfUsing = detail.new_value - detail.old_value;

      if (service.metered_service) {
        return total + (amountOfUsing * service.price);
      } else {
        const amount = detail.amount_of_using || 1;
        return total + (amount * service.price);
      }
    }, 0);
  };
  const handleCreateInvoice = async (values) => {
    const serviceDetails = form.getFieldValue('service_details') || [];
    const hasSelectedService = serviceDetails.some(detail => detail.selected);

    if (!hasSelectedService) {
      message.error('Please select at least one service');
      return;
    }

    try {
      const newInvoice = {
        apartment_id: values.apartment_id,
        payment_deadline: values.payment_deadline.toISOString(),
        status: values.status,
        service_details: serviceDetails
          .filter(detail => detail.selected)
          .map(detail => ({
            service_id: detail.service.service_id,
            old_value: detail.old_value,
            new_value: detail.new_value
          }))
      };

      const api = invoiceApi();
      await api.createInvoice(newInvoice);
      message.success("Invoice created successfully!");
      window.history.back();
    } catch (error) {
      console.error('Error creating invoice:', error);
      message.error('Failed to create invoice');
    }
  };

  // Normalize initial values
  const normalizedInitialValues = useMemo(() => ({
    ...initialValues,
    service_details: serviceDetails,
    total: calculateTotal(serviceDetails),
    status: initialValues?.status || 'UNPAID',
    payment_deadline: initialValues?.payment_deadline ? dayjs(initialValues.payment_deadline) : undefined,
  }), [initialValues, serviceDetails, calculateTotal]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleCreateInvoice}
      initialValues={normalizedInitialValues}
      onValuesChange={(_, allValues) => {
        if (allValues.service_details) {
          const total = calculateTotal(allValues.service_details);
          form.setFieldValue('total', total);
        }
      }}
      className="max-w-4xl mx-auto"
    >
      <Card className="mb-6 shadow-sm">
        <div className="grid grid-cols-2 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Block"
              name="block"
              rules={[{ required: true, message: "Please select block!" }]}
            >
              <Select
                placeholder="Select block"
                onChange={handleBlockChange}
                loading={loadingStates.blocks}
              >
                {locationData.blocks.map((block) => (
                  <Option key={block.block_id} value={block.block_id}>
                    {block.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Floor"
              name="floor"
              rules={[{ required: true, message: "Please select floor!" }]}
            >
              <Select
                placeholder="Select floor"
                onChange={handleFloorChange}
                loading={loadingStates.floors}
                disabled={!form.getFieldValue('block')}
              >
                {locationData.floors.map((floor) => (
                  <Option key={floor.floor_id} value={floor.floor_id}>
                    {floor.name || `Floor ${floor.floor_number}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Apartment"
              name="apartment_id"
              rules={[{ required: true, message: "Please select apartment!" }]}
            >
              <Select
                placeholder="Select apartment"
                onChange={handleApartmentChange}
                loading={loadingStates.apartments}
                disabled={!form.getFieldValue('floor')}
              >
                {locationData.apartments.map((apartment) => (
                  <Option key={apartment.apartment_id} value={apartment.apartment_id}>
                    {apartment.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="apartment_name" hidden>
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            name="payment_deadline"
            label="Payment Deadline"
            rules={[{ required: true, message: 'Please select payment deadline' }]}
          >
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Option value="UNPAID">Unpaid</Option>
              <Option value="PAID">Paid</Option>
            </Select>
          </Form.Item>

          <Form.Item name="total" label="Total Amount">
            <InputNumber
              className="w-full"
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              disabled
              addonAfter="đ"
            />
          </Form.Item>
        </div>
      </Card>

      {/* Service Details Card */}
      <Card title="Service Details" className="mb-6 shadow-sm">
        <Form.List name="service_details">
          {(fields) => (
            <div>
              {fields.length === 0 ? (
                <div className="text-center p-4 text-gray-500">
                  <div className="mb-2">This apartment has no service details.</div>
                  <div>Please set up service details before creating an invoice.</div>
                </div>
              ) : (
                fields.map(({ key, name }) => {
                  const service = form.getFieldValue(['service_details', name, 'service']) || {};
                  return (
                    <ServiceDetailItem 
                      key={key}
                      name={name}
                      service={service}
                    />
                  );
                })
              )}
            </div>
          )}
        </Form.List>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button size="large" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button 
          type="primary" 
          size="large" 
          htmlType="submit" 
          loading={loading}
          disabled={!serviceDetails.length}
          title={!serviceDetails.length ? "Please set up service details before creating an invoice" : ""}
        >
          Create Invoice
        </Button>
      </div>
    </Form>
  );
};
export default InvoiceForm;