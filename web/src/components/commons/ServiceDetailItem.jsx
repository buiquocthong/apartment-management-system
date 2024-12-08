import React from 'react';
import {
  Form,
  InputNumber,
  Checkbox,
  Space,
} from 'antd';

const ServiceDetailItem = ({ service, name }) => {
    console.log(service);
    console.log(name);
  return (
    <div className="border rounded-lg p-4 mb-4 bg-white">
      <Space direction="vertical" className="w-full">
        <div className="flex items-center gap-2">
          <Form.Item
            name={[name, 'selected']}
            valuePropName="checked"
            className="mb-0"
            initialValue={true}
          >
            <Checkbox />
          </Form.Item>
          <div className="flex-1">
            <span className="font-medium">{service.name}</span>
            <div className="text-gray-500">
              Price: {service.price?.toLocaleString()} đ
              {service.unit ? ` / ${service.unit}` : ''}
            </div>
          </div>
        </div>

        {service.metered_service ? (
          <>
            <div className="pl-6 grid grid-cols-2 gap-4">
              <div>
                <Form.Item
                  name={[name, 'old_value']}
                  className="mb-1"
                  rules={[{ required: true, message: 'Please enter old value' }]}
                >
                  <InputNumber
                    className="w-full"
                    placeholder="0"
                    disabled
                    min={0}
                    addonAfter={
                      <div className="bg-gray-100 px-2 text-gray-600">
                        Old value
                      </div>
                    }
                  />
                </Form.Item>
              </div>

              <div>
                <Form.Item
                  name={[name, 'new_value']}
                  className="mb-1"
                  rules={[{ required: true, message: 'Please enter new value' }]}
                >
                  <InputNumber
                    className="w-full"
                    placeholder="0"
                    disabled
                    min={0}
                    addonAfter={
                      <div className="bg-gray-100 px-2 text-gray-600">
                        New value
                      </div>
                    }
                  />
                </Form.Item>
              </div>
            </div>
          </>
        ) : (
          <div className="pl-6">
            <Form.Item
              name={[name, 'amount_of_using']}
              className="mb-1"
              rules={[{ required: true, message: 'Please enter amount of using' }]}
            >
              <InputNumber
                className="w-full"
                placeholder="Amount of using"
                min={1}
                disabled
                addonAfter={
                  <div className="bg-gray-100 px-2 text-gray-600">
                    {service.unit}
                  </div>
                }
              />
            </Form.Item>
          </div>
        )}

        {/* Add subtotal display */}
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => {
            const prev = prevValues.service_details?.[name];
            const curr = currentValues.service_details?.[name];
            return prev?.old_value !== curr?.old_value ||
              prev?.new_value !== curr?.new_value ||
              prev?.amount_of_using !== curr?.amount_of_using ||
              prev?.selected !== curr?.selected;
          }}
        >
          {({ getFieldValue }) => {
            const detail = getFieldValue(['service_details', name]);
            const isSelected = detail?.selected;
            let subtotal = 0;
            let usageDisplay = '';

            if (service.metered_service) {
              const oldValue = detail?.old_value || 0;
              const newValue = detail?.new_value || 0;
              const usage = newValue - oldValue;
              subtotal = usage * (service.price || 0);
              usageDisplay = `${usage} ${service.unit}`;
            } else {
              const amountOfUsing = detail?.amount_of_using || 1;
              subtotal = amountOfUsing * (service.price || 0);
              usageDisplay = `${amountOfUsing} ${service.unit}`;
            }

            return isSelected ? (
              <div className="pl-6 text-right text-gray-500">
                {`${usageDisplay} × ${service.price?.toLocaleString()} đ = ${subtotal.toLocaleString()} đ`}
              </div>
            ) : null;
          }}
        </Form.Item>
      </Space>
    </div>
  );
};

export default ServiceDetailItem;