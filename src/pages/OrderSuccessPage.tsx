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

              <Title level={2}>Đặt hàng thành công!</Title>
              <Text type="secondary">Cảm ơn bạn đã mua hàng</Text>

              <Divider />

              <div className="text-left">
                <Title level={4}>Chi tiết đơn hàng</Title>
                <div className="space-y-2">
                  <Text>
                    <strong>Mã đơn hàng:</strong> #{orderId}
                  </Text>
                  <br />
                  <Text>
                    <strong>Tên khách hàng:</strong>{" "}
                    {orderDetails.customerInfo.name}
                  </Text>
                  <br />
                  <Text>
                    <strong>Số điện thoại:</strong>{" "}
                    {orderDetails.customerInfo.phone}
                  </Text>
                  <br />
                  <Text>
                    <strong>Email:</strong> {orderDetails.customerInfo.email}
                  </Text>
                  <br />
                  <Text>
                    <strong>Địa chỉ giao hàng:</strong>{" "}
                    {orderDetails.shippingAddress}
                  </Text>
                  <br />
                  <Text>
                    <strong>Phương thức thanh toán:</strong>{" "}
                    {orderDetails.paymentMethod}
                  </Text>
                </div>

                <Divider />

                <Title level={4}>Sản phẩm đã đặt</Title>
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
                            Số lượng: {item.quantity}
                          </Text>
                        </div>
                      </div>
                      <Text strong>
                        {(item.price * item.quantity).toLocaleString()} VND
                      </Text>
                    </div>
                  ))}
                </div>

                <Divider />

                <div className="flex justify-between items-center">
                  <Text strong>Tổng tiền:</Text>
                  <Text strong className="text-lg">
                    {orderDetails.totalAmount.toLocaleString()} VND
                  </Text>
                </div>
              </div>

              <Space size="middle" className="w-full justify-center">
                <Button
                  type="primary"
                  icon={<HomeOutlined />}
                  onClick={() => navigate("/")}
                >
                  Về trang chủ
                </Button>
                <Button
                  icon={<ShoppingOutlined />}
                  onClick={() => navigate("/products")}
                >
                  Tiếp tục mua sắm
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
