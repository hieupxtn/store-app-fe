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
  Dropdown,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  api,
  Order,
  CustomerInfo,
  UpdateOrderStatusRequest,
} from "../../services/api";
import AppHeader from "../../common/AppHeader";
import AppFooter from "../../common/AppFooter";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";

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
          order.customerInfo.name
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          order.customerInfo.email
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          order.customerInfo.phone
            .toLowerCase()
            .includes(searchText.toLowerCase())
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

  const handleUpdateStatus = useCallback(
    async (orderId: number, newStatus: UpdateOrderStatusRequest["status"]) => {
      try {
        setLoading(true);
        await api.updateOrderStatus(orderId, { status: newStatus });
        message.success("Order status updated successfully");
        fetchOrders(); // Refresh the orders list
      } catch (error) {
        console.error("Error updating order status:", error);
        message.error("Failed to update order status");
      } finally {
        setLoading(false);
      }
    },
    [fetchOrders]
  );

  const getStatusMenuItems = (): MenuProps["items"] => [
    {
      key: "pending",
      label: "Pending",
    },
    {
      key: "processing",
      label: "Processing",
    },
    {
      key: "shipped",
      label: "Shipped",
    },
    {
      key: "delivered",
      label: "Delivered",
    },
    {
      key: "cancelled",
      label: "Cancelled",
    },
  ];

  const columns: ColumnsType<Order> = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Customer",
      dataIndex: "customerInfo",
      key: "customerInfo",
      render: (customerInfo: CustomerInfo) => customerInfo.name,
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => `$${amount.toFixed(2)}`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: Order) => (
        <Dropdown
          menu={{
            items: getStatusMenuItems(),
            onClick: ({ key }) =>
              handleUpdateStatus(
                record.id,
                key as UpdateOrderStatusRequest["status"]
              ),
          }}
          trigger={["click"]}
        >
          <Button type="link" className="p-0">
            <Tag color={getStatusColor(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <DownOutlined className="ml-1" />
            </Tag>
          </Button>
        </Dropdown>
      ),
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Processing", value: "processing" },
        { text: "Shipped", value: "shipped" },
        { text: "Delivered", value: "delivered" },
        { text: "Cancelled", value: "cancelled" },
      ],
      onFilter: (value, record) =>
        record.status.toLowerCase() === String(value).toLowerCase(),
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
                  placeholder="Search by Order ID, Customer Name, or Customer Email"
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
            width={1200}
            style={{ top: 20 }}
            bodyStyle={{ maxHeight: "calc(100vh - 200px)", overflow: "auto" }}
          >
            {orderLoading ? (
              <Spin tip="Loading order details..." />
            ) : selectedOrder ? (
              <div className="space-y-6">
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="Order ID" span={1}>
                    {selectedOrder.id}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status" span={1}>
                    <Tag color={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Customer Name" span={1}>
                    {selectedOrder.customerInfo.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Customer Email" span={1}>
                    {selectedOrder.customerInfo.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Customer Phone" span={1}>
                    {selectedOrder.customerInfo.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Shipping Address" span={1}>
                    {selectedOrder.shippingAddress.replace(/"/g, "")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Payment Method" span={1}>
                    {selectedOrder.paymentMethod.toUpperCase()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Created At" span={1}>
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Updated At" span={1}>
                    {new Date(selectedOrder.updatedAt).toLocaleString()}
                  </Descriptions.Item>
                  {selectedOrder.trackingNumber && (
                    <Descriptions.Item label="Tracking Number" span={1}>
                      {selectedOrder.trackingNumber}
                    </Descriptions.Item>
                  )}
                  {selectedOrder.estimatedDeliveryDate && (
                    <Descriptions.Item label="Estimated Delivery" span={1}>
                      {new Date(
                        selectedOrder.estimatedDeliveryDate
                      ).toLocaleString()}
                    </Descriptions.Item>
                  )}
                  {selectedOrder.actualDeliveryDate && (
                    <Descriptions.Item label="Actual Delivery" span={1}>
                      {new Date(
                        selectedOrder.actualDeliveryDate
                      ).toLocaleString()}
                    </Descriptions.Item>
                  )}
                </Descriptions>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                  <Table
                    dataSource={selectedOrder.items}
                    rowKey="productId"
                    pagination={false}
                    columns={[
                      {
                        title: "Product Name",
                        dataIndex: "productName",
                        key: "productName",
                        width: "25%",
                      },
                      {
                        title: "Product Type",
                        dataIndex: "productType",
                        key: "productType",
                        width: "15%",
                      },
                      {
                        title: "Quantity",
                        dataIndex: "quantity",
                        key: "quantity",
                        width: "10%",
                        align: "center" as const,
                      },
                      {
                        title: "Price",
                        dataIndex: "price",
                        key: "price",
                        width: "15%",
                        align: "right" as const,
                        render: (price: number) => `$${price.toFixed(2)}`,
                      },
                      {
                        title: "Total",
                        dataIndex: "total",
                        key: "total",
                        width: "15%",
                        align: "right" as const,
                        render: (total: number) => `$${total.toFixed(2)}`,
                      },
                    ]}
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                    {selectedOrder.discount && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-${selectedOrder.discount.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedOrder.shippingFee && (
                      <div className="flex justify-between">
                        <span>Shipping Fee:</span>
                        <span>${selectedOrder.shippingFee.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedOrder.tax && (
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>${selectedOrder.tax.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                      <span>Final Amount:</span>
                      <span>
                        $
                        {(
                          selectedOrder.finalAmount || selectedOrder.totalAmount
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedOrder.note && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Note</h3>
                    <p className="text-gray-600">{selectedOrder.note}</p>
                  </div>
                )}
              </div>
            ) : null}
          </Modal>
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default ManageOrders;
