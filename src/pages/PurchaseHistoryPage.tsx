import React, { useEffect, useState } from "react";
import {
  Layout,
  Table,
  Tag,
  Button,
  Modal,
  Descriptions,
  Spin,
  message,
  Rate,
  Form,
  Input,
} from "antd";
import { useNavigate } from "react-router-dom";
import { api, Order } from "../services/api";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";

const { Content } = Layout;
const { TextArea } = Input;

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

const PurchaseHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [ratingForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      message.error("Vui lòng đăng nhập để xem lịch sử mua hàng");
      navigate("/login");
      return;
    }

    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem("user");
      if (!userData) {
        message.error("Vui lòng đăng nhập để xem lịch sử mua hàng");
        navigate("/login");
        return;
      }
      const user = JSON.parse(userData);
      const response = await api.getUserOrders(user.id);
      setOrders(response.orders);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
      message.error("Lỗi khi tải lịch sử mua hàng");
    } finally {
      setLoading(false);
    }
  };

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

  const handleViewOrder = async (orderId: number) => {
    try {
      setOrderLoading(true);
      const response = await api.getOrderById(orderId);
      setSelectedOrder(response.order);
      setOrderModalVisible(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("Lỗi khi tải chi tiết đơn hàng");
    } finally {
      setOrderLoading(false);
    }
  };

  const handleCloseOrderModal = () => {
    setOrderModalVisible(false);
    setSelectedOrder(null);
  };

  const handleRateProduct = (productId: number, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setRatingModalVisible(true);
  };

  const handleSubmitRating = async (values: {
    rating: number;
    comment: string;
  }) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      if (!userData || !userData.id) {
        message.error("Vui lòng đăng nhập để đánh giá sản phẩm");
        return;
      }

      await api.createReview({
        userId: userData.id,
        productId: selectedProduct!.id,
        rating: values.rating,
        comment: values.comment,
      });

      message.success("Cảm ơn bạn đã đánh giá sản phẩm!");
      setRatingModalVisible(false);
      ratingForm.resetFields();
    } catch (error) {
      console.error("Error submitting review:", error);
      message.error("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!");
    }
  };

  const handleConfirmReceived = async (orderId: number) => {
    try {
      await api.confirmOrderReceived(orderId);
      message.success("Xác nhận đã nhận hàng thành công!");
      // Refresh orders list
      fetchOrders();
    } catch (error) {
      console.error("Error confirming order received:", error);
      message.error(
        "Có lỗi xảy ra khi xác nhận đã nhận hàng. Vui lòng thử lại!"
      );
    }
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
      sorter: (a: Order, b: Order) => a.id - b.id,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => `${amount.toLocaleString()} VND`,
      sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
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
      title: "Ngày đặt hàng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
      sorter: (a: Order, b: Order) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: unknown, record: Order) => (
        <div className="space-x-2">
          <Button type="link" onClick={() => handleViewOrder(record.id)}>
            Xem chi tiết
          </Button>
          {record.status.toLowerCase() === "delivered" && (
            <Button
              type="primary"
              onClick={() => handleConfirmReceived(record.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              Xác nhận đã nhận hàng
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout className="flex flex-col min-h-screen">
      <AppHeader />
      <Content className="flex-grow bg-gray-100">
        <div className="w-full px-4 py-8 max-w-7xl mx-auto min-h-[751px]">
          <h1 className="text-2xl font-bold mb-6">Lịch sử mua hàng</h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" tip="Đang tải lịch sử mua hàng..." />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1000 }}
            />
          )}

          <Modal
            title="Chi tiết đơn hàng"
            open={orderModalVisible}
            onCancel={handleCloseOrderModal}
            footer={null}
            width={800}
          >
            {orderLoading ? (
              <div className="flex justify-center items-center h-64">
                <Spin size="large" tip="Đang tải chi tiết đơn hàng..." />
              </div>
            ) : selectedOrder ? (
              <div className="space-y-6">
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="Mã đơn hàng" span={1}>
                    {selectedOrder.id}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái" span={1}>
                    <Tag color={getStatusColor(selectedOrder.status)}>
                      {statusMap[selectedOrder.status.toLowerCase()] ||
                        selectedOrder.status}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên khách hàng" span={1}>
                    {selectedOrder.customerInfo.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email" span={1}>
                    {selectedOrder.customerInfo.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại" span={1}>
                    {selectedOrder.customerInfo.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
                    {selectedOrder.shippingAddress}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phương thức thanh toán" span={1}>
                    {paymentMethodMap[selectedOrder.paymentMethod] ||
                      selectedOrder.paymentMethod}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày đặt hàng" span={1}>
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </Descriptions.Item>
                </Descriptions>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Sản phẩm đã đặt
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
                      },
                      {
                        title: "Số lượng",
                        dataIndex: "quantity",
                        key: "quantity",
                        align: "center" as const,
                      },
                      {
                        title: "Đơn giá",
                        dataIndex: "price",
                        key: "price",
                        render: (price: number) =>
                          `${price.toLocaleString()} VND`,
                        align: "right" as const,
                      },
                      {
                        title: "Thành tiền",
                        dataIndex: "total",
                        key: "total",
                        render: (total: number) =>
                          `${total.toLocaleString()} VND`,
                        align: "right" as const,
                      },
                      {
                        title: "Đánh giá",
                        key: "rating",
                        render: (_, record) =>
                          selectedOrder.status.toLowerCase() === "completed" ? (
                            <Button
                              type="link"
                              onClick={() =>
                                handleRateProduct(
                                  record.productId,
                                  record.productName
                                )
                              }
                            >
                              Đánh giá
                            </Button>
                          ) : null,
                      },
                    ]}
                  />
                </div>

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

                {selectedOrder.note && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Ghi chú</h3>
                    <p className="text-gray-600">{selectedOrder.note}</p>
                  </div>
                )}
              </div>
            ) : null}
          </Modal>

          <Modal
            title={`Đánh giá sản phẩm: ${selectedProduct?.name}`}
            open={ratingModalVisible}
            onCancel={() => {
              setRatingModalVisible(false);
              ratingForm.resetFields();
            }}
            footer={null}
          >
            <Form
              form={ratingForm}
              onFinish={handleSubmitRating}
              layout="vertical"
            >
              <Form.Item
                name="rating"
                label="Đánh giá của bạn"
                rules={[
                  { required: true, message: "Vui lòng chọn số sao đánh giá!" },
                ]}
              >
                <Rate allowHalf />
              </Form.Item>

              <Form.Item
                name="comment"
                label="Nhận xét của bạn"
                rules={[{ required: true, message: "Vui lòng nhập nhận xét!" }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Gửi đánh giá
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default PurchaseHistoryPage;
