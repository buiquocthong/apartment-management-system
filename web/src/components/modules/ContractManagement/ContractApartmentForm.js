import React from "react";
import { Form, Input, DatePicker, Select, Button, Card, Space } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import PropTypes from "prop-types";

const { Option } = Select;

const ContractApartmentForm = ({
  initialValues,
  onFinish,
  loading = false,
  form,
}) => {
  const navigate = useNavigate();

  // Hàm xử lý hoàn thành form
  const handleFormFinish = (values) => {
    const formattedValues = {
      ...values,
      start_date: values.start_date ? values.start_date.toISOString() : null,
      end_date: values.end_date ? values.end_date.toISOString() : null,
      owner: {
        ...values.owner,
        birth_day: values.owner?.birth_day
          ? values.owner.birth_day.toISOString()
          : null,
      },
    };
    onFinish(formattedValues);
  };

  // Hàm xử lý quay lại trang trước
  const handleCancel = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  return (
    <div className="max-h-[600px] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormFinish}
        className="max-w-4xl mx-auto p-6"
        requiredMark
        scrollToFirstError
        initialValues={{
          ...initialValues,
          apartment_id: localStorage.getItem("apartmentId"),
        }}
      >
        {/* Thông tin hợp đồng */}
        <Card title="Contract Information" className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Start Date"
              name="start_date"
              rules={[
                { required: true, message: "Please select start date!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value && value.isBefore(dayjs(), "day")) {
                      return Promise.reject("Start date cannot be in the past");
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker
                className="w-full"
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="Select start date and time"
              />
            </Form.Item>

            <Form.Item label="End Date" name="end_date">
              <DatePicker
                className="w-full"
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="Select end date and time"
                disabled={true}
              />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select status!" }]}
              initialValue="ACTIVE"
            >
              <Select placeholder="Select status">
                <Option value="ACTIVE">ACTIVE</Option>
                <Option value="INACTIVE">INACTIVE</Option>
              </Select>
            </Form.Item>
          </div>
        </Card>

        {/* Thông tin chủ sở hữu */}
        <Card title="Owner Information" className="mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              label="First Name"
              name={["owner", "first_name"]}
              rules={[{ required: true, message: "Please input first name!" }]}
            >
              <Input placeholder="Enter first name" />
            </Form.Item>

            <Form.Item label="Middle Name" name={["owner", "middle_name"]}>
              <Input placeholder="Enter middle name" />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name={["owner", "last_name"]}
              rules={[{ required: true, message: "Please input last name!" }]}
            >
              <Input placeholder="Enter last name" />
            </Form.Item>

            <Form.Item
              label="Birth Date"
              name={["owner", "birth_day"]}
              rules={[{ required: true, message: "Please select birth date!" }]}
            >
              <DatePicker
                className="w-full"
                format="YYYY-MM-DD"
                placeholder="Select birth date"
              />
            </Form.Item>

            <Form.Item
              label="Gender"
              name={["owner", "gender"]}
              rules={[{ required: true, message: "Please select gender!" }]}
            >
              <Select placeholder="Select gender">
                <Option value="MALE">Male</Option>
                <Option value="FEMALE">Female</Option>
                <Option value="OTHER">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="ID Card Number"
              name={["owner", "id_card_number"]}
              rules={[
                { required: true, message: "Please input ID card number!" },
              ]}
            >
              <Input placeholder="Enter ID card number" />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name={["owner", "phone_number"]}
              rules={[
                { required: true, message: "Please input phone number!" },
              ]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item
              label="Email"
              name={["owner", "email"]}
              rules={[
                { type: "email", message: "Please input a valid email!" },
                { required: true, message: "Please input email!" },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>

            <Form.Item
              label="Street"
              name={["owner", "street"]}
              rules={[{ required: true, message: "Please input street!" }]}
            >
              <Input placeholder="Enter street" />
            </Form.Item>

            <Form.Item
              label="City"
              name={["owner", "city"]}
              rules={[{ required: true, message: "Please input city!" }]}
            >
              <Input placeholder="Enter city" />
            </Form.Item>

            <Form.Item
              label="District"
              name={["owner", "district"]}
              rules={[{ required: true, message: "Please input district!" }]}
            >
              <Input placeholder="Enter district" />
            </Form.Item>

            <Form.Item
              label="Ward"
              name={["owner", "ward"]}
              rules={[{ required: true, message: "Please input ward!" }]}
            >
              <Input placeholder="Enter ward" />
            </Form.Item>

            <Form.Item label="Career" name={["owner", "career"]}>
              <Input placeholder="Enter career" />
            </Form.Item>
          </div>
        </Card>

        {/* Buttons */}
        <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 mt-6">
          <Form.Item className="mb-0">
            <div className="flex gap-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Submit
              </Button>
              <Button
                onClick={() => navigate(-1)}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

ContractApartmentForm.propTypes = {
  initialValues: PropTypes.object,
  onFinish: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  form: PropTypes.object.isRequired,
};

export default ContractApartmentForm;
