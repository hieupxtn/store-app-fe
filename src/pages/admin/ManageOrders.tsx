import React, { useEffect, useState, useCallback } from "react";
import {
  Layout,
  Table,
  Button,
  message,
  Tag,
  Spin,
  Modal,
  Descriptions,
  Input,
  Select,
  Space,
  DatePicker,
  Card,
  Row,
  Col,
  Alert,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { api, Order, OrderItem } from "../../services/api";
import AppHeader from "../../common/AppHeader";
import AppFooter from "../../common/AppFooter";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import type { ColumnsType } from "antd/es/table";

// Extend dayjs with isBetween plugin
dayjs.extend(isBetween);

const { Content } = Layout;
const { RangePicker } = DatePicker;

interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  typeRole: string;
  keyRole: string;
}

const ManageOrders: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );
  const navigate = useNavigate();

  // Check admin access
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
      } catch (err) {
        console.error("Error parsing user data:", err);
        message.error("Error loading user data");
        navigate("/login");
      }
    } else {
      message.error("Please login first");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getAllOrders();
      setOrders(response.orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAdminAccess();
    fetchOrders();
  }, [checkAdminAccess, fetchOrders]);

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
      setSelectedOrder(response.order);
      setOrderModalVisible(true);
    } catch (err) {
      console.error("Error fetching order details:", err);
      message.error("Failed to fetch order details");
    } finally {
      setOrderLoading(false);
    }
  }, []);

  const handleCloseOrderModal = useCallback(() => {
    setOrderModalVisible(false);
    setSelectedOrder(null);
  }, []);

  const handleSearch = useCallback(() => {
    // Filter orders based on search criteria
    const filteredOrders = orders.filter((order) => {
      const matchesSearch = searchText
        ? order.id.toString().includes(searchText) ||
          order.userId.toString().includes(searchText)
        : true;

      const matchesStatus = statusFilter
        ? order.status.toLowerCase() === statusFilter.toLowerCase()
        : true;

      const matchesDateRange = dateRange
        ? dayjs(order.createdAt).isBetween(
            dateRange[0],
            dateRange[1],
            "day",
            "[]"
          )
        : true;

      return matchesSearch && matchesStatus && matchesDateRange;
    });

    setOrders(filteredOrders);
  }, [orders, searchText, statusFilter, dateRange]);

  const handleReset = useCallback(() => {
    setSearchText("");
    setStatusFilter(null);
    setDateRange(null);
    fetchOrders();
  }, [fetchOrders]);

  const columns: ColumnsType<Order> = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      sorter: (a, b) => a.userId - b.userId,
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: number) => `$${price.toFixed(2)}`,
      sorter: (a, b) => a.totalPrice - b.totalPrice,
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
      filters: [
        { text: "Completed", value: "completed" },
        { text: "Pending", value: "pending" },
        { text: "Processing", value: "processing" },
        { text: "Cancelled", value: "cancelled" },
      ],
      onFilter: (value, record) =>
        record.status.toLowerCase() === String(value).toLowerCase(),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Manage Orders</h1>
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/admin")}
            >
              Back to Dashboard
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Input
                  placeholder="Search by Order ID or User ID"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  prefix={<SearchOutlined />}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder="Filter by Status"
                  style={{ width: "100%" }}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  allowClear
                >
                  <Select.Option value="completed">Completed</Select.Option>
                  <Select.Option value="pending">Pending</Select.Option>
                  <Select.Option value="processing">Processing</Select.Option>
                  <Select.Option value="cancelled">Cancelled</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <RangePicker
                  style={{ width: "100%" }}
                  value={dateRange}
                  onChange={(dates) =>
                    setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])
                  }
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Space>
                  <Button
                    type="primary"
                    icon={<FilterOutlined />}
                    onClick={handleSearch}
                  >
                    Apply Filters
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleReset}>
                    Reset
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Loading Spinner */}
          {loading && (
            <Spin size="large" tip="Loading orders...">
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

          {/* Orders Table */}
          {!loading && !error && (
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1000 }}
            />
          )}

          {/* Order Details Modal */}
          <Modal
            title="Order Details"
            open={orderModalVisible}
            onCancel={handleCloseOrderModal}
            footer={null}
            width={800}
          >
            {orderLoading ? (
              <Spin tip="Loading order details..." />
            ) : selectedOrder ? (
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Order ID">
                  {selectedOrder.id}
                </Descriptions.Item>
                <Descriptions.Item label="User ID">
                  {selectedOrder.userId}
                </Descriptions.Item>
                <Descriptions.Item label="Total Price">
                  ${selectedOrder.totalPrice.toFixed(2)}
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
                    dataSource={selectedOrder.OrderItems}
                    rowKey="id"
                    pagination={false}
                    columns={[
                      {
                        title: "Product ID",
                        dataIndex: "productId",
                        key: "productId",
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
                        key: "total",
                        render: (_, record: OrderItem) =>
                          `$${(record.quantity * record.price).toFixed(2)}`,
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

export default ManageOrders;
