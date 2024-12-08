import React from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import invoiceApi from '../../../services/invoiceApi';

const CollectPaymentModal = ({ visible = false, invoice, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (visible && invoice) {
      form.setFieldsValue({
        invoice_id: invoice.invoice_id,
        apartment_name: invoice.apartment.name,
        total: `$ ${invoice.total.toLocaleString('en-US')}`,
        amount: invoice.total,
        payment_method: 'cash'
      });
    }
  }, [visible, invoice, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (parseFloat(values.amount) > (invoice?.total || 0)) {
        message.error('Payment amount cannot exceed invoice total');
        return;
      }
      await invoiceApi().approvedInvoice(invoice.invoice_id);
      message.success('Payment collected successfully');
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error collecting payment:', error);
      message.error(error.response?.data?.message || 'Failed to collect payment');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    // Remove existing formatting
    const numericValue = value.toString().replace(/[^0-9.]/g, '');
    // Format with $ and commas
    return `$ ${parseFloat(numericValue).toLocaleString('en-US', {
      maximumFractionDigits: 0
    })}`;
  };

  return (
    <Modal
      title="Collect Payment"
      open={visible}
      onCancel={handleClose}
      footer={null}
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          payment_method: 'cash'
        }}
      >
        <Form.Item
          label="Invoice Number"
          name="invoice_id"
        >
          <Input 
            disabled 
            className="bg-gray-100" 
          />
        </Form.Item>

        <Form.Item
          label="Apartment"
          name="apartment_name"
        >
          <Input 
            disabled 
            className="bg-gray-100" 
          />
        </Form.Item>

        <Form.Item
          label="Total Amount"
          name="total"
        >
          <Input
            disabled
            className="bg-gray-100"
            value={formatCurrency(form.getFieldValue('total'))}
          />
        </Form.Item>

        <Form.Item className="mb-0 flex justify-end gap-2">
          <Button onClick={handleClose} className="m-5">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Confirm Payment
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CollectPaymentModal;