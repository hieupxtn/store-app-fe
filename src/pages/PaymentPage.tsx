/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Layout, Form, Input, Button, Card, message } from "antd";
import { Content } from "antd/es/layout/layout";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";
import { useLocation, useNavigate } from "react-router-dom";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface PaymentFormValues {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  name: string;
}

const PaymentPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Get selected items from location state
  const selectedItems: CartItem[] = location.state?.selectedItems || [];

  const totalPrice = selectedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const onFinish = async (values: PaymentFormValues) => {
    setLoading(true);
    try {
      // Here you would typically integrate with a payment gateway
      // For now, we'll just simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 1500));
      message.success("Payment successful!");
      navigate("/"); // Redirect to home page after successful payment
    } catch {
      message.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="min-h-screen flex flex-col">
      <AppHeader />
      <Content className="flex-grow p-6 bg-gray-100">
        <div className="max-w-4xl mx-auto min-h-[703px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Payment Information" className="h-fit">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-4"
              >
                <Form.Item
                  name="cardNumber"
                  label="Card Number"
                  rules={[
                    {
                      required: true,
                      message: "Please input your card number!",
                    },
                    { len: 16, message: "Card number must be 16 digits!" },
                  ]}
                >
                  <Input placeholder="1234 5678 9012 3456" maxLength={16} />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    name="expiryDate"
                    label="Expiry Date"
                    rules={[
                      { required: true, message: "Please input expiry date!" },
                    ]}
                  >
                    <Input placeholder="MM/YY" />
                  </Form.Item>

                  <Form.Item
                    name="cvv"
                    label="CVV"
                    rules={[
                      { required: true, message: "Please input CVV!" },
                      { len: 3, message: "CVV must be 3 digits!" },
                    ]}
                  >
                    <Input placeholder="123" maxLength={3} />
                  </Form.Item>
                </div>

                <Form.Item
                  name="name"
                  label="Cardholder Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input cardholder name!",
                    },
                  ]}
                >
                  <Input placeholder="John Doe" />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full"
                  loading={loading}
                >
                  Pay Now
                </Button>
              </Form>
            </Card>

            <Card title="Order Summary" className="h-fit">
              <div className="space-y-4">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-500">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total ({selectedItems.length} items)</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default PaymentPage;
