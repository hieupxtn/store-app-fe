import React, { useEffect, useState } from "react";
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
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = () => {
      console.log("Checking admin access...");
      const userData = localStorage.getItem("user");
      console.log("User data from localStorage:", userData);

      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log("Parsed user data:", parsedUser);
          setUser(parsedUser);

          if (parsedUser.typeRole !== "admin") {
            console.log("User is not admin. Redirecting to home...");
            message.error("You don't have permission to access this page");
            navigate("/");
          } else {
            console.log("User is admin. Access granted.");
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          message.error("Error loading user data");
          navigate("/login");
        }
      } else {
        console.log("No user data found. Redirecting to login...");
        message.error("Please login first");
        navigate("/login");
      }
    };

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.getDashboardData();
        if (response.errCode === 0) {
          setDashboardData(response.data);
        } else {
          message.error(response.message || "Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        message.error(
          "Failed to fetch dashboard data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
    fetchDashboardData();
  }, [navigate]);

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

  const handleViewOrder = (orderId: number) => {
    // TODO: Implement view order details
    console.log("View order:", orderId);
  };

  if (!user) {
    return null;
  }

  return (
    <Layout className="flex flex-col min-h-screen w-full">
      <AppHeader />
      <Content className="flex-grow bg-gray-100">
        <div className="w-full px-4 py-8 min-h-[751px]">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

          {/* Statistics Cards */}
          <Row gutter={[24, 24]} className="mb-8">
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={dashboardData?.totalUsers || 0}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                  loading={loading}
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
                  loading={loading}
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
                  loading={loading}
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
                  loading={loading}
                />
              </Card>
            </Col>
          </Row>

          {/* Recent Orders Table */}
          <Card title="Recent Orders" className="mb-8">
            <Table
              columns={columns}
              dataSource={dashboardData?.recentOrders || []}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              scroll={{ x: 1000 }}
              loading={loading}
            />
          </Card>

          {/* Quick Actions */}
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
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default AdminDashboard;
