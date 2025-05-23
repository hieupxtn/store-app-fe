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

  // Check admin access
  const checkAdminAccess = useCallback(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Chuẩn hóa: kiểm tra quyền dựa trên role, typeRole hoặc keyRole
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

  // Fetch dashboard data and orders
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
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer",
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
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method: string) => method.toUpperCase(),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Items",
      key: "items",
      render: (record: Order) => (
        <div>
          {record.items.map((item: OrderItem) => (
            <div key={item.productId}>
              {item.productName} - Qty: {item.quantity} - ${item.price}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Order) => (
        <Button type="link" onClick={() => handleViewOrder(record.id)}>
          View Details
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
                      title="Total Users"
                      value={dashboardData?.totalUsers || 0}
                      prefix={<UserOutlined />}
                      valueStyle={{ color: "#1890ff" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic
                      title="Total Orders"
                      value={dashboardData?.totalOrders || 0}
                      prefix={<ShoppingCartOutlined />}
                      valueStyle={{ color: "#52c41a" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic
                      title="Total Revenue"
                      value={dashboardData?.totalRevenue || 0}
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: "#722ed1" }}
                      formatter={(value) => `$${Number(value).toFixed(2)}`}
                    />
                  </Card>
                </Col>
              </Row>
              <Row gutter={[24, 24]} className="mb-8">
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic
                      title="Total Products"
                      value={dashboardData?.totalProducts || 0}
                      prefix={<ProductOutlined />}
                      valueStyle={{ color: "#faad14" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic
                      title="Total Reviews"
                      value={dashboardData?.totalReviews || 0}
                      valueStyle={{ color: "#eb2f96" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic
                      title="Total Product Types"
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
            <Card title="All Orders" className="mb-8">
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
                  Manage Users
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button
                  type="primary"
                  block
                  onClick={() => navigate("/admin/products")}
                >
                  Manage Products
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button
                  type="primary"
                  block
                  onClick={() => navigate("/admin/orders")}
                >
                  Manage Orders
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button
                  type="primary"
                  block
                  onClick={() => navigate("/admin/categories")}
                >
                  Manage Categories
                </Button>
              </Col>
            </Row>
          )}

          {/* Order Details Modal */}
          <Modal
            title="Order Details"
            open={orderModalVisible}
            onCancel={handleCloseOrderModal}
            footer={null}
            width={1200}
          >
            {orderLoading ? (
              <Spin tip="Loading order details..." />
            ) : selectedOrder ? (
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Order ID">
                  {selectedOrder.id}
                </Descriptions.Item>
                <Descriptions.Item label="Customer Information">
                  <div>
                    <div>Name: {selectedOrder.customerInfo.name}</div>
                    <div>Email: {selectedOrder.customerInfo.email}</div>
                    <div>Phone: {selectedOrder.customerInfo.phone}</div>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Shipping Address">
                  {selectedOrder.shippingAddress.replace(/"/g, "")}
                </Descriptions.Item>
                <Descriptions.Item label="Payment Method">
                  {selectedOrder.paymentMethod.toUpperCase()}
                </Descriptions.Item>
                <Descriptions.Item label="Total Amount">
                  ${selectedOrder.totalAmount.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status.charAt(0).toUpperCase() +
                      selectedOrder.status.slice(1)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At">
                  {new Date(selectedOrder.updatedAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Order Items">
                  <Table
                    dataSource={selectedOrder.items}
                    rowKey="productId"
                    pagination={false}
                    columns={[
                      {
                        title: "Product Name",
                        dataIndex: "productName",
                        key: "productName",
                      },
                      {
                        title: "Product Type",
                        dataIndex: "productType",
                        key: "productType",
                      },
                      {
                        title: "Quantity",
                        dataIndex: "quantity",
                        key: "quantity",
                      },
                      {
                        title: "Price",
                        dataIndex: "price",
                        key: "price",
                        render: (price: number) => `$${price.toFixed(2)}`,
                      },
                      {
                        title: "Total",
                        dataIndex: "total",
                        key: "total",
                        render: (total: number) => `$${total.toFixed(2)}`,
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
