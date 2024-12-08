import React, { useEffect, useCallback } from "react";
import { Form, Input, DatePicker, Select, Button, Card, message } from "antd";
import PropTypes from "prop-types";
import dayjs from "dayjs";

const { Option } = Select;

const RenterAddForm = ({ initialValues, onFinish, loading, form, record_id }) => {
  // Format giá trị ban đầu nếu có
  useEffect(() => {
    if (initialValues) {
      const formattedValues = {
        ...initialValues,
        birth_day: initialValues.birth_day ? dayjs(initialValues.birth_day) : null,
      };
      form.setFieldsValue(formattedValues);
    }
  }, [initialValues, form]);

  const handleSubmit = useCallback(
    async (values) => {
      try {
        const payload = { ...values, record_id };
        await onFinish(payload);
      } catch (error) {
        message.error("Failed to submit form. Please try again.");
      }
    },
    [onFinish, record_id]
  );

  return (
    <div className="max-h-[600px] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="max-w-4xl mx-auto p-6"
        requiredMark
        scrollToFirstError
      >
        <Card title="Renter Information" className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="First Name"
              name="first_name"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Middle Name" name="middle_name">
              <Input />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="last_name"
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Birth Day"
              name="birth_day"
              rules={[{ required: true, message: "Please select birth day" }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Please select gender" }]}
            >
              <Select>
                <Option value="MALE">Male</Option>
                <Option value="FEMALE">Female</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Career" name="career">
              <Input />
            </Form.Item>
          </div>
        </Card>

        <Card title="Contact Information" className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Phone Number"
              name="phone_number"
              rules={[
                { required: true, message: "Please enter phone number" },
                { pattern: /^\d+$/, message: "Please enter valid phone number" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter valid email" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="ID Card Number"
              name="id_card_number"
              rules={[{ required: true, message: "Please enter ID card number" }]}
            >
              <Input />
            </Form.Item>
          </div>
        </Card>

        <Card title="Address" className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Street"
              name="street"
              rules={[{ required: true, message: "Please enter street" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Ward"
              name="ward"
              rules={[{ required: true, message: "Please enter ward" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="District"
              name="district"
              rules={[{ required: true, message: "Please enter district" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: "Please enter city" }]}
            >
              <Input />
            </Form.Item>
          </div>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button className="min-w-[100px]" onClick={() => form.resetFields()} disabled={loading}>
            Reset
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="min-w-[100px]"
          >
            Add Renter
          </Button>
        </div>
      </Form>
    </div>
  );
};

RenterAddForm.propTypes = {
  initialValues: PropTypes.object,
  onFinish: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  form: PropTypes.object.isRequired,
  record_id: PropTypes.string.isRequired,
};

export default RenterAddForm;
