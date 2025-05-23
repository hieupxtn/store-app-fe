import React from "react";
import { Layout, Card, Typography, Button, Space, Divider } from "antd";
import { Content } from "antd/es/layout/layout";
import {
  CheckCircleFilled,
  HomeOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";

const { Title, Text } = Typography;

interface OrderDetails {
  customerInfo: {
    name: string;
    phone: string;
    email: string;
  };
  shippingAddress: string;
  paymentMethod: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  totalAmount: number;
}

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, orderDetails } = location.state as {
    orderId: number;
    orderDetails: OrderDetails;
  };

  return (
    <Layout className="min-h-screen flex flex-col">
      <AppHeader />
      <Content className="flex-grow p-6 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center">
            <Space direction="vertical" size="large" className="w-full">
              <CheckCircleFilled style={{ fontSize: 64, color: "#52c41a" }} />

              <Title level={2}>Order Placed Successfully!</Title>
              <Text type="secondary">Thank you for your purchase</Text>

              <Divider />

              <div className="text-left">
                <Title level={4}>Order Details</Title>
                <div className="space-y-2">
                  <Text>
                    <strong>Order ID:</strong> #{orderId}
                  </Text>
                  <br />
                  <Text>
                    <strong>Customer Name:</strong>{" "}
                    {orderDetails.customerInfo.name}
                  </Text>
                  <br />
                  <Text>
                    <strong>Phone:</strong> {orderDetails.customerInfo.phone}
                  </Text>
                  <br />
                  <Text>
                    <strong>Email:</strong> {orderDetails.customerInfo.email}
                  </Text>
                  <br />
                  <Text>
                    <strong>Shipping Address:</strong>{" "}
                    {orderDetails.shippingAddress}
                  </Text>
                  <br />
                  <Text>
                    <strong>Payment Method:</strong>{" "}
                    {orderDetails.paymentMethod}
                  </Text>
                </div>

                <Divider />

                <Title level={4}>Order Items</Title>
                <div className="space-y-4">
                  {orderDetails.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <Text strong>{item.name}</Text>
                          <br />
                          <Text type="secondary">
                            Quantity: {item.quantity}
                          </Text>
                        </div>
                      </div>
                      <Text strong>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </div>
                  ))}
                </div>

                <Divider />

                <div className="flex justify-between items-center">
                  <Text strong>Total Amount:</Text>
                  <Text strong className="text-lg">
                    ${orderDetails.totalAmount.toFixed(2)}
                  </Text>
                </div>
              </div>

              <Space size="middle" className="w-full justify-center">
                <Button
                  type="primary"
                  icon={<HomeOutlined />}
                  onClick={() => navigate("/")}
                >
                  Back to Home
                </Button>
                <Button
                  icon={<ShoppingOutlined />}
                  onClick={() => navigate("/products")}
                >
                  Continue Shopping
                </Button>
              </Space>
            </Space>
          </Card>
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default OrderSuccessPage;
