import React, { useEffect, useState } from 'react';
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
import invoiceApi from '../../../services/invoiceApi.js';
import ServiceDetailItem from '../../commons/ServiceDetailItem.jsx';

const { Option } = Select;

const InvoiceApartmentForm = ({ 
  onFinish, 
  initialValues = null, 
  loading = false,
  apartments = [],
}) => {
  const [form] = Form.useForm();
  const location = useLocation();
  const [serviceDetails, setServiceDetails] = useState([]);
  const selectedApartment = location.state?.selectedApartment || null;

  // Fetch apartment data if selectedApartment exists
  useEffect(() => {
    if(selectedApartment) {
      const api = apartmentApi();
      apartments.push(api.getApartmentById(selectedApartment.apartment_id));
    }
  }, [location.state]);

  // Fetch service details for the selected apartment
  const fetchServiceDetails = async (apartmentId) => {
    try {
      const api = apartmentApi();
      const response = await api.getApartmentById(apartmentId);
      
      const formattedServiceDetails = response.service_details.map(detail => ({
        service_id: detail.service.service_id,
        service: detail.service,  
        old_value: detail.old_value || 0,
        new_value: detail.new_value || 0,
        amount_of_using: detail.amount_of_using,
        selected: true
      }));

      form.setFieldValue('service_details', formattedServiceDetails);
      setServiceDetails(formattedServiceDetails);
    } catch (error) {
      console.error('Error fetching service details:', error);
      message.error('Failed to fetch service details');
    }
  };

  // Fetch service details when selectedApartment changes
  useEffect(() => {
    if (selectedApartment?.apartment_id) {
      fetchServiceDetails(selectedApartment.apartment_id);
    }
  }, [selectedApartment]);

  // Handle initial values normalization
  const normalizeInitialValues = (values) => {
    if (!values) return {
      service_details: serviceDetails,
      total: 0,
      status: 'UNPAID'
    };
    
    return {
      apartment_id: values.apartment?.apartment_id || selectedApartment?.apartment_id,
      payment_deadline: values.payment_deadline ? dayjs(values.payment_deadline) : undefined,
      status: values.status || 'UNPAID',
      total: values.total || 0,
      service_details: serviceDetails.length > 0 ? serviceDetails : (values.service_details || [])
    };
  };

  // Reset form when service details change
  useEffect(() => {
    if (serviceDetails.length > 0) {
      form.setFieldsValue({
        service_details: serviceDetails,
        apartment_id: selectedApartment?.apartment_id
      });
      handleServiceDetailsChange();
    }
  }, [serviceDetails]);

  // Update apartment_id when selectedApartment changes
  useEffect(() => {
    if (selectedApartment) {
      form.setFieldValue('apartment_id', selectedApartment.apartment_id);
    }
  }, [selectedApartment]);

  // Calculate total amount based on service details
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


  // Handle service details changes
  const handleServiceDetailsChange = () => {
    try {
      const serviceDetails = form.getFieldValue('service_details');
      const total = calculateTotal(serviceDetails);
      form.setFieldValue('total', total);
    } catch (error) {
      console.error('Error calculating total:', error);
    }
  };

  // Calculate total when initialValues change
  useEffect(() => {
    if (initialValues?.service_details) {
      handleServiceDetailsChange();
    }
  }, [initialValues]);


  // Adjust the handleCreateInvoice function
  const handleCreateInvoice = async (values) => {
    // Check if service details are available and at least one service is selected
    const serviceDetails = form.getFieldValue('service_details') || [];
    const hasSelectedService = serviceDetails.some((detail) => detail.selected);

    if (serviceDetails.length === 0 || !hasSelectedService) {
      message.error('Apartment has no service details. Please set up service details in advance.');
      return;
    }

    const newInvoice = {
      apartment_id: values.apartment_id,
      payment_deadline: values.payment_deadline.toISOString(),
      status: values.status
    };

    try {
      const api = await invoiceApi().createInvoice(newInvoice);
      message.success("Invoice created successfully!");
      window.history.back();
      return api.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      message.error('Failed to create invoice');
    }
  };

  // Main form render
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleCreateInvoice} // Gọi handleCreateInvoice khi form submit thành công
      initialValues={normalizeInitialValues(initialValues)}
      onValuesChange={(_, allValues) => {
        if (allValues.service_details) {
          handleServiceDetailsChange();
        }
      }}
      className="max-w-4xl mx-auto"
    >

      {/* General Information Card */}
      <Card className="mb-6 shadow-sm">
        <div className="grid grid-cols-2 gap-6">
          <Form.Item
            name="apartment_id"
            label="Apartment"
            rules={[{ required: true, message: 'Please select an apartment' }]}
            initialValue={selectedApartment ? selectedApartment.apartment_id : null}
          >
            <Select
              showSearch
              placeholder="Select apartment"
              disabled={!!selectedApartment}
            >
              {selectedApartment ? (
                <Option value={selectedApartment.apartment_id}>
                  {selectedApartment.name}
                </Option>
              ) : (
                apartments.map(apt => (
                  <Option key={apt.apartment_id} value={apt.apartment_id}>
                    {apt.name}
                  </Option>
                ))
              )}
            </Select>
          </Form.Item>    

          <Form.Item
            name="payment_deadline"
            label="Payment Deadline"
            rules={[{ required: true, message: 'Please select payment deadline' }]}
          >
            <DatePicker 
              className="w-full" 
              format="DD/MM/YYYY"
            />
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

export default InvoiceApartmentForm;