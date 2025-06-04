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

dayjs.extend(isBetween);

const { Content } = Layout;
const { RangePicker } = DatePicker;

const statusMap: { [key: string]: string } = {
  pending: "Đang chờ",
  processing: "Đang xử lý",
  shipped: "Đang giao hàng",
  delivered: "Đã giao hàng",
  cancelled: "Đã hủy",
  completed: "Hoàn thành",
};

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

  const checkAdminAccess = useCallback(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        const role =
          parsedUser.role || parsedUser.typeRole || parsedUser.keyRole;
        if (role !== "admin") {
          message.error("Bạn không có quyền truy cập vào trang này");
          navigate("/");
        }
      } catch (err) {
        console.error("Lỗi khi phân tích dữ liệu người dùng:", err);
        message.error("Lỗi khi tải dữ liệu người dùng");
        navigate("/login");
      }
    } else {
      message.error("Vui lòng đăng nhập trước");
      navigate("/login");
    }
  }, [navigate]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getAllOrders();
      setOrders(response.orders);
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
      setError("Lỗi khi tải đơn hàng. Vui lòng thử lại sau.");
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
        message.success("Trạng thái đơn hàng đã được cập nhật thành công");
        fetchOrders();
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        message.error("Lỗi khi cập nhật trạng thái đơn hàng");
      } finally {
        setLoading(false);
      }
    },
    [fetchOrders]
  );

  const getStatusMenuItems = (): MenuProps["items"] => [
    {
      key: "pending",
      label: "Đang chờ",
    },
    {
      key: "processing",
      label: "Đang xử lý",
    },
    {
      key: "shipped",
      label: "Đang giao hàng",
    },
    {
      key: "delivered",
      label: "Đã giao hàng",
    },
    {
      key: "cancelled",
      label: "Đã hủy",
    },
  ];

  const columns: ColumnsType<Order> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerInfo",
      key: "customerInfo",
      render: (customerInfo: CustomerInfo) => customerInfo.name,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => `${amount.toLocaleString()} VND`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Trạng thái",
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
              {statusMap[status.toLowerCase()] ||
                status.charAt(0).toUpperCase() + status.slice(1)}
              <DownOutlined className="ml-1" />
            </Tag>
          </Button>
        </Dropdown>
      ),
      filters: [
        { text: "Đang chờ", value: "pending" },
        { text: "Đang xử lý", value: "processing" },
        { text: "Đang giao hàng", value: "shipped" },
        { text: "Đã giao hàng", value: "delivered" },
        { text: "Đã hủy", value: "cancelled" },
      ],
      onFilter: (value, record) =>
        record.status.toLowerCase() === String(value).toLowerCase(),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method: string) => method.toUpperCase(),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
            <Button type="default" onClick={() => navigate("/admin")}>
              Quay lại trang quản trị
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Input
                  placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng hoặc email"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  prefix={<SearchOutlined />}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder="Lọc theo trạng thái"
                  style={{ width: "100%" }}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  allowClear
                >
                  <Select.Option value="pending">Đang chờ</Select.Option>
                  <Select.Option value="processing">Đang xử lý</Select.Option>
                  <Select.Option value="shipped">Đang giao hàng</Select.Option>
                  <Select.Option value="delivered">Đã giao hàng</Select.Option>
                  <Select.Option value="cancelled">Đã hủy</Select.Option>
                  <Select.Option value="completed">Hoàn thành</Select.Option>
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
                    Áp dụng bộ lọc
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleReset}>
                    Đặt lại
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
            title="Chi tiết đơn hàng"
            open={orderModalVisible}
            onCancel={handleCloseOrderModal}
            footer={null}
            width={1200}
            style={{ top: 20 }}
            bodyStyle={{ maxHeight: "calc(100vh - 200px)", overflow: "auto" }}
          >
            {orderLoading ? (
              <Spin tip="Đang tải thông tin chi tiết đơn hàng..." />
            ) : selectedOrder ? (
              <div className="space-y-6">
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="Mã đơn hàng" span={1}>
                    {selectedOrder.id}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái" span={1}>
                    <Tag color={getStatusColor(selectedOrder.status)}>
                      {statusMap[selectedOrder.status.toLowerCase()] ||
                        selectedOrder.status.charAt(0).toUpperCase() +
                          selectedOrder.status.slice(1)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên khách hàng" span={1}>
                    {selectedOrder.customerInfo.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email khách hàng" span={1}>
                    {selectedOrder.customerInfo.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại khách hàng" span={1}>
                    {selectedOrder.customerInfo.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ giao hàng" span={1}>
                    {selectedOrder.shippingAddress.replace(/"/g, "")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phương thức thanh toán" span={1}>
                    {selectedOrder.paymentMethod.toUpperCase()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày tạo" span={1}>
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày cập nhật" span={1}>
                    {new Date(selectedOrder.updatedAt).toLocaleString()}
                  </Descriptions.Item>
                  {selectedOrder.trackingNumber && (
                    <Descriptions.Item label="Mã vận đơn" span={1}>
                      {selectedOrder.trackingNumber}
                    </Descriptions.Item>
                  )}
                  {selectedOrder.estimatedDeliveryDate && (
                    <Descriptions.Item label="Ngày dự kiến giao hàng" span={1}>
                      {new Date(
                        selectedOrder.estimatedDeliveryDate
                      ).toLocaleString()}
                    </Descriptions.Item>
                  )}
                  {selectedOrder.actualDeliveryDate && (
                    <Descriptions.Item label="Ngày thực tế giao hàng" span={1}>
                      {new Date(
                        selectedOrder.actualDeliveryDate
                      ).toLocaleString()}
                    </Descriptions.Item>
                  )}
                </Descriptions>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Sản phẩm đơn hàng
                  </h3>
                  <Table
                    dataSource={selectedOrder.items}
                    rowKey="productId"
                    pagination={false}
                    columns={[
                      {
                        title: "Tên sản phẩm",
                        dataIndex: "productName",
                        key: "productName",
                        width: "25%",
                      },
                      {
                        title: "Loại sản phẩm",
                        dataIndex: "productType",
                        key: "productType",
                        width: "15%",
                      },
                      {
                        title: "Số lượng",
                        dataIndex: "quantity",
                        key: "quantity",
                        width: "10%",
                        align: "center" as const,
                      },
                      {
                        title: "Giá",
                        dataIndex: "price",
                        key: "price",
                        width: "15%",
                        align: "right" as const,
                        render: (price: number) =>
                          `${price.toLocaleString()} VND`,
                      },
                      {
                        title: "Tổng",
                        dataIndex: "total",
                        key: "total",
                        width: "15%",
                        align: "right" as const,
                        render: (total: number) =>
                          `${total.toLocaleString()} VND`,
                      },
                    ]}
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    {selectedOrder.discount && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá:</span>
                        <span>
                          - {selectedOrder.discount.toLocaleString()} VND
                        </span>
                      </div>
                    )}
                    {selectedOrder.shippingFee && (
                      <div className="flex justify-between">
                        <span>Phí vận chuyển:</span>
                        <span>
                          {selectedOrder.shippingFee.toLocaleString()} VND
                        </span>
                      </div>
                    )}
                    {selectedOrder.tax && (
                      <div className="flex justify-between">
                        <span>Thuế:</span>
                        <span>{selectedOrder.tax.toLocaleString()} VND</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                      <span>Tổng tiền:</span>
                      <span>
                        {(
                          selectedOrder.finalAmount || selectedOrder.totalAmount
                        ).toLocaleString()}{" "}
                        VND
                      </span>
                    </div>
                  </div>
                </div>

                {selectedOrder.note && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Ghi chú</h3>
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
