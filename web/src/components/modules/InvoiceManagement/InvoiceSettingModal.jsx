import React, { useEffect, useState } from 'react';
import { Modal, Form, InputNumber, message } from 'antd';
import invoiceSettingApi from '../../../services/invoiceSettingApi';

const InvoiceSettingModal = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [maxExpiredTime, setMaxExpiredTime] = useState();
  const [penaltyFeePercentage, setPenaltyFeePercentage] = useState();
  const [loading, setLoading] = useState(false);

  const fetchInvoiceSetting = async () => {
    setLoading(true);
    try {
      const data = await invoiceSettingApi().getInvoiceSetting();
      setMaxExpiredTime(data.max_expired_time);
      setPenaltyFeePercentage(data.penalty_fee_percentage);
      form.setFieldsValue({
        max_expired_time: data.max_expired_time,
        penalty_fee_percentage: data.penalty_fee_percentage,
      });
    } catch (error) {
      console.error('Error fetching invoice settings:', error);
      message.error('Failed to fetch invoice settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchInvoiceSetting();
    } else {
      form.resetFields();
    }
  }, [visible]); // Fetch data only when the modal becomes visible

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      await invoiceSettingApi().updateInvoice(values);

      message.success('Updated successfully');
      onSuccess();
      onClose();
      form.resetFields();
    } catch (error) {
      console.error('Validation or update failed:', error);
      message.error('Failed to update invoice settings.');
    }
  };

  return (
    <Modal
      title="Invoice Settings"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleSubmit}
      okText="Update"
      cancelText="Cancel"
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          max_expired_time: maxExpiredTime,
          penalty_fee_percentage: penaltyFeePercentage,
        }}
      >
        <Form.Item
          name="max_expired_time"
          label="Maximum Expiration Time (days)"
          rules={[
            { required: true, message: 'Please enter the maximum expiration time!' },
            { type: 'number', min: 1, message: 'Time must be greater than 0!' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Enter maximum days"
            min={1}
          />
        </Form.Item>

        <Form.Item
          name="penalty_fee_percentage"
          label="Penalty Fee Percentage (%)"
          rules={[
            { required: true, message: 'Please enter the penalty fee percentage!' },
            { type: 'number', min: 0, max: 100, message: 'Penalty percentage must be between 0-100%!' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Enter penalty percentage"
            min={0}
            max={100}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InvoiceSettingModal;
