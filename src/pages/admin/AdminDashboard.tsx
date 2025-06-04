/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  message,
  Tag,
  Spin,
  Alert,
  Modal,
  Descriptions,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { api, DashboardData } from "../../services/api";
import AppHeader from "../../common/AppHeader";
import AppFooter from "../../common/AppFooter";

const { Content } = Layout;

const statusMap: { [key: string]: string } = {
  pending: "Đang chờ",
  processing: "Đang xử lý",
  shipped: "Đang giao hàng",
  delivered: "Đã giao hàng",
  cancelled: "Đã hủy",
  completed: "Hoàn thành",
};

const paymentMethodMap: { [key: string]: string } = {
  CREDIT_CARD: "Thẻ tín dụng",
  COD: "Thanh toán khi nhận hàng",
};

interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  typeRole: string;
  keyRole: string;
}

interface OrderItem {
  productId: number;
  productName: string;
  productType: string;
  quantity: number;
  price: number;
  total: number;
}

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const navigate = useNavigate();

  const checkAdminAccess = useCallback(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        const role =
          parsedUser.role || parsedUser.typeRole || parsedUser.keyRole;
        if (role !== "admin") {
          message.error("You don't have permission to access this page");
          navigate("/");
        }
      } catch (error) {
        message.error("Error loading user data");
        navigate("/login");
      }
    } else {
      message.error("Please login first");
      navigate("/login");
    }
  }, [navigate]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [dashboardResponse, ordersResponse] = await Promise.all([
        api.getDashboardData(),
        api.getAllOrders(),
      ]);
      setDashboardData(dashboardResponse);
      setOrders(ordersResponse.orders as unknown as Order[]);
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAdminAccess();
    fetchData();
  }, [checkAdminAccess, fetchData]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "green";
      case "pending":
        return "orange";
      case "processing":
        return "blue";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const handleViewOrder = useCallback(async (orderId: number) => {
    try {
      setOrderLoading(true);
      const response = await api.getOrderById(orderId);
      setSelectedOrder(response.order as unknown as Order);
      setOrderModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch order details");
    } finally {
      setOrderLoading(false);
    }
  }, []);

  const handleCloseOrderModal = useCallback(() => {
    setOrderModalVisible(false);
    setSelectedOrder(null);
  }, []);

  const orderColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Khách hàng",
      dataIndex: "customerInfo",
      key: "customerInfo",
      render: (customerInfo: CustomerInfo) => (
        <div>
          <div>{customerInfo.name}</div>
          <div>{customerInfo.email}</div>
          <div>{customerInfo.phone}</div>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => `${amount.toLocaleString()} VND`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {statusMap[status.toLowerCase()] || status}
        </Tag>
      ),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method: string) => paymentMethodMap[method] || method,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Sản phẩm",
      key: "items",
      render: (record: Order) => (
        <div>
          {record.items.map((item: OrderItem) => (
            <div key={item.productId}>
              {item.productName} - Qty: {item.quantity} -{" "}
              {item.price.toLocaleString()} VND
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: unknown, record: Order) => (
        <Button type="link" onClick={() => handleViewOrder(record.id)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <Layout className="flex flex-col min-h-screen w-full">
      <AppHeader />
      <Content className="flex-grow bg-gray-100">
        <div className="w-full px-4 py-8 min-h-[751px] max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

          {/* Loading Spinner */}
          {loading && (
            <Spin size="large" tip="Loading dashboard...">
              <div style={{ minHeight: 400 }} />
            </Spin>
          )}

          {/* Error Alert */}
          {!loading && error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              className="mb-6"
            />
          )}

          {/* Statistics Cards */}
          {!loading && !error && (
            <>
              <Row gutter={[24, 24]} className="mb-4">
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic
                      title="Tổng số người dùng"
                      value={dashboardData?.totalUsers || 0}
                      prefix={<UserOutlined />}
                      valueStyle={{ color: "#1890ff" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic
                      title="Tổng đơn hàng"
                      value={dashboardData?.totalOrders || 0}
                      prefix={<ShoppingCartOutlined />}
                      valueStyle={{ color: "#52c41a" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic
                      title="Tổng doanh thu"
                      value={dashboardData?.totalRevenue || 0}
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: "#722ed1" }}
                      formatter={(value) =>
                        `${Number(value).toLocaleString()} VND`
                      }
                    />
                  </Card>
                </Col>
              </Row>
              <Row gutter={[24, 24]} className="mb-8">
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic
                      title="Tổng sản phẩm"
                      value={dashboardData?.totalProducts || 0}
                      prefix={<ProductOutlined />}
                      valueStyle={{ color: "#faad14" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic
                      title="Tổng đánh giá"
                      value={dashboardData?.totalReviews || 0}
                      valueStyle={{ color: "#eb2f96" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic
                      title="Tổng loại sản phẩm"
                      value={dashboardData?.totalProductTypes || 0}
                      valueStyle={{ color: "#13c2c2" }}
                    />
                  </Card>
                </Col>
              </Row>
            </>
          )}

          {/* Orders Table */}
          {!loading && !error && (
            <Card title="Tất cả đơn hàng" className="mb-8">
              <Table
                columns={orderColumns}
                dataSource={orders}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                scroll={{ x: 1000 }}
              />
            </Card>
          )}

          {/* Quick Actions */}
          {!loading && !error && (
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Button
                  type="primary"
                  block
                  onClick={() => navigate("/admin/users")}
                >
                  Quản lý người dùng
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button
                  type="primary"
                  block
                  onClick={() => navigate("/admin/products")}
                >
                  Quản lý sản phẩm
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button
                  type="primary"
                  block
                  onClick={() => navigate("/admin/orders")}
                >
                  Quản lý đơn hàng
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button
                  type="primary"
                  block
                  onClick={() => navigate("/admin/categories")}
                >
                  Quản lý danh mục
                </Button>
              </Col>
            </Row>
          )}

          {/* Order Details Modal */}
          <Modal
            title="Chi tiết đơn hàng"
            open={orderModalVisible}
            onCancel={handleCloseOrderModal}
            footer={null}
            width={1200}
          >
            {orderLoading ? (
              <Spin tip="Đang tải thông tin chi tiết đơn hàng." />
            ) : selectedOrder ? (
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Mã đơn hàng">
                  {selectedOrder.id}
                </Descriptions.Item>
                <Descriptions.Item label="Thông tin khách hàng">
                  <div>
                    <div>Tên: {selectedOrder.customerInfo.name}</div>
                    <div>Email: {selectedOrder.customerInfo.email}</div>
                    <div>SĐT: {selectedOrder.customerInfo.phone}</div>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ giao hàng">
                  {selectedOrder.shippingAddress.replace(/"/g, "")}
                </Descriptions.Item>
                <Descriptions.Item label="Phương thức thanh toán">
                  {paymentMethodMap[selectedOrder.paymentMethod] ||
                    selectedOrder.paymentMethod}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">
                  {selectedOrder.totalAmount.toLocaleString()} VND
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái" span={1}>
                  <Tag color={getStatusColor(selectedOrder.status)}>
                    {statusMap[selectedOrder.status.toLowerCase()] ||
                      selectedOrder.status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày cập nhật">
                  {new Date(selectedOrder.updatedAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Sản phẩm">
                  <Table
                    dataSource={selectedOrder.items}
                    rowKey="productId"
                    pagination={false}
                    columns={[
                      {
                        title: "Tên sản phẩm",
                        dataIndex: "productName",
                        key: "productName",
                      },
                      {
                        title: "Loại sản phẩm",
                        dataIndex: "productType",
                        key: "productType",
                      },
                      {
                        title: "Số lượng",
                        dataIndex: "quantity",
                        key: "quantity",
                      },
                      {
                        title: "Giá",
                        dataIndex: "price",
                        key: "price",
                        render: (price: number) =>
                          `${price.toLocaleString()} VND`,
                      },
                      {
                        title: "Tổng tiền",
                        dataIndex: "total",
                        key: "total",
                        render: (total: number) =>
                          `${total.toLocaleString()} VND`,
                      },
                    ]}
                  />
                </Descriptions.Item>
              </Descriptions>
            ) : null}
          </Modal>
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default AdminDashboard;
