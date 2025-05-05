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
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { api, DashboardData, DashboardOrder } from "../../services/api";
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

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check admin access
  const checkAdminAccess = useCallback(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        if (parsedUser.typeRole !== "admin") {
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

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getDashboardData();
      if (response.errCode === 0) {
        setDashboardData(response.data);
      } else {
        setError(response.message || "Failed to fetch dashboard data");
      }
    } catch (error) {
      setError("Failed to fetch dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAdminAccess();
    fetchDashboardData();
  }, [checkAdminAccess, fetchDashboardData]);

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

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer",
      key: "customer",
      render: (record: DashboardOrder) => (
        <div>
          <div>{`${record.User.firstName} ${record.User.lastName}`}</div>
          <div className="text-gray-500 text-sm">{record.User.email}</div>
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
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: DashboardOrder) => (
        <Button type="link" onClick={() => handleViewOrder(record.id)}>
          View Details
        </Button>
      ),
    },
  ];

  const handleViewOrder = useCallback((orderId: number) => {
    // Có thể mở modal hoặc chuyển trang chi tiết đơn hàng ở đây
    message.info(`View order: ${orderId}`);
  }, []);

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
            <div className="flex justify-center items-center min-h-[400px]">
              <Spin size="large" tip="Loading dashboard..." />
            </div>
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
            <Row gutter={[24, 24]} className="mb-8">
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Total Users"
                    value={dashboardData?.totalUsers || 0}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Total Orders"
                    value={dashboardData?.totalOrders || 0}
                    prefix={<ShoppingCartOutlined />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
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
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Total Products"
                    value={dashboardData?.totalProducts || 0}
                    prefix={<ProductOutlined />}
                    valueStyle={{ color: "#faad14" }}
                  />
                </Card>
              </Col>
            </Row>
          )}

          {/* Recent Orders Table */}
          {!loading && !error && (
            <Card title="Recent Orders" className="mb-8">
              <Table
                columns={columns}
                dataSource={dashboardData?.recentOrders || []}
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
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default AdminDashboard;
