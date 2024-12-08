import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Button, Card, Checkbox, Divider, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import apartmentApi from '../../../services/apartmentApi.ts';
import serviceApi from '../../../services/servicesApi.ts';
import serviceDetailApi from '../../../services/serviceDetailApi.js';

const ServiceDetailForm = ({ loading, onFinish, visible, onClose, apartmentId }) => {
  const [form] = Form.useForm();
  const [apartment, setApartment] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceDetails, setServiceDetails] = useState([]); 

  useEffect(() => {
    if (apartmentId) {
      const fetchApartmentData = async () => {
        try {
          const api = apartmentApi();
          const apartmentData = await api.getApartmentById(apartmentId);
          setApartment(apartmentData);
          
          if (apartmentData?.service_details) {
            const selectedServiceIds = new Set(
              apartmentData.service_details.map(detail => detail.service.service_id)
            );
            setSelectedServices(selectedServiceIds);
  
            const initialServiceDetails = apartmentData.service_details.map(detail => ({
              service_id: detail.service.service_id,
              service: detail.service,
              old_value: detail.old_value,
              new_value: detail.new_value,
              service_detail_id: detail.service_detail_id,
              amount_of_using: detail.amount_of_using
            }));
            setServiceDetails(initialServiceDetails);
          }
        } catch (error) {
          console.error('Failed to fetch apartment data:', error);
          message.error('Failed to load apartment data');
        }
      };
  
      const fetchAllServices = async () => {
        try {
          const api = serviceApi();
          const allServices = await api.getAllServices();
          setServices(allServices);
        } catch (error) {
          console.error('Failed to fetch services:', error);
          message.error('Failed to load services');
        }
      };
  
      fetchApartmentData();
      fetchAllServices();
    }
  }, [apartmentId]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const api = serviceDetailApi();

      const currentServiceDetailIds = new Set(
        apartment?.service_details?.map(detail => detail.service_detail_id) || []
      );

      const newServiceIds = new Set(serviceDetails.map(detail => detail.service_id));

      const operations = [];

      if (apartment?.service_details) {
        for (const currentDetail of apartment.service_details) {
          if (!newServiceIds.has(currentDetail.service.service_id)) {
            operations.push(
              api.deleteServiceDetail(currentDetail.service_detail_id)
            );
          }
        }
      }

      for (const newDetail of serviceDetails) {
        const currentDetail = apartment?.service_details?.find(
          d => d.service.service_id === newDetail.service_id
        );

        const service = services.find(s => s.service_id === newDetail.service_id);
        const updateData = service?.metered_service 
          ? {
              service_detail_id: currentDetail?.service_detail_id,
              new_value: newDetail.new_value,
              old_value: newDetail.old_value,
              amount_of_using: newDetail.new_value - newDetail.old_value
            }
          : {
              service_detail_id: currentDetail?.service_detail_id,
              new_value: 0,
              old_value: 0,
              amount_of_using: newDetail.amount_of_using || 1
            };

        if (currentDetail) {
          operations.push(
            api.updateServiceDetail(currentDetail.service_detail_id, updateData)
          );
        } else {
          operations.push(
            api.createServiceDetail({
              ...updateData,
              apartment_id: apartmentId,
              service_id: newDetail.service_id,
            })
          );
        }
      }

      await Promise.all(operations);
      message.success('Service details updated successfully');
      onClose();
      if (onFinish) {
        onFinish({ service_details: serviceDetails });
      }
    } catch (error) {
      console.error('Error updating service details:', error);
      message.error('Failed to update service details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = (serviceDetails = []) => {
    if (!Array.isArray(serviceDetails)) return 0;

    return serviceDetails.reduce((total, detail) => {
      if (!detail) return total;

      const service = services.find(s => s.service_id === detail.service_id);
      if (!service) return total;

      if (service.metered_service) {
        const amountOfUsing = detail.new_value - detail.old_value;
        return total + (amountOfUsing * service.price);
      } else {
        return total + (service.price * (detail.amount_of_using || 1));
      }
    }, 0);
  };

  const onCheckboxChange = (checked, service) => {
    const newSelectedServices = new Set(selectedServices);
    let newServiceDetails = [...serviceDetails];
    
    if (checked) {
      newSelectedServices.add(service.service_id);
      const existingDetail = newServiceDetails.find(
        detail => detail.service_id === service.service_id
      );
      
      if (!existingDetail) {
        newServiceDetails.push({
          service_id: service.service_id,
          service: service,
          old_value: 0,
          new_value: 0
        });
      }
    } else {
      newSelectedServices.delete(service.service_id);
      newServiceDetails = newServiceDetails.filter(
        detail => detail.service_id !== service.service_id
      );
    }
  
    setSelectedServices(newSelectedServices);
    setServiceDetails(newServiceDetails);
  };

  const handleValueChange = (serviceId, field, value) => {
    const newServiceDetails = serviceDetails.map(detail => 
      detail.service_id === serviceId 
        ? { ...detail, [field]: value }
        : detail
    );
    setServiceDetails(newServiceDetails);
  };

  return (
    <Modal
      title="Service Details"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 shadow-sm">
          {services.map((service) => {
            const isSelected = selectedServices.has(service.service_id);
            const serviceDetail = serviceDetails.find(
              detail => detail.service_id === service.service_id
            );

            return (
              <div key={service.service_id} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <Checkbox
                    checked={isSelected}
                    onChange={(e) => onCheckboxChange(e.target.checked, service)}
                  >
                    <span className="font-medium">{service.name}</span>
                  </Checkbox>
                  <span className="text-gray-600">
                    {service.price.toLocaleString()} đ / {service.unit}
                  </span>
                </div>

                {isSelected && service.metered_service && (
                  <div className="ml-6 grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block mb-1">Old Value</label>
                      <InputNumber
                        value={serviceDetail?.old_value}
                        disabled={true}
                        placeholder="Old value"
                        className="w-full"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </div>

                    <div>
                      <label className="block mb-1">New Value</label>
                      <InputNumber
                        value={serviceDetail?.new_value}
                        onChange={(value) => handleValueChange(service.service_id, 'new_value', value)}
                        placeholder="New value"
                        min={0}
                        className="w-full"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </div>
                  </div>
                )}

                {isSelected && !service.metered_service && (
                  <div className="ml-6 grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block mb-1">Amount of using</label>
                      <InputNumber
                        value={serviceDetail?.amount_of_using || 1}
                        onChange={(value) => handleValueChange(service.service_id, 'amount_of_using', value)}
                        placeholder="Amount of using"
                        min={1}
                        className="w-full"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </div>
                  </div>
                )}

                <Divider className="my-4" />
              </div>
            );
          })}
        </Card>

        <div className="flex justify-between items-center">
          <div className="text-lg font-medium">
            Total: {calculateTotal(serviceDetails).toLocaleString()} đ
          </div>
          <div className="flex gap-4">
            <Button size="large" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              size="large" 
              onClick={handleSubmit}
              loading={isSubmitting}
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ServiceDetailForm;