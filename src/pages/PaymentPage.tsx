/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Layout, Form, Input, Button, Card, message, Radio } from "antd";
import { Content } from "antd/es/layout/layout";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { cartService } from "../services/cartService";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

interface OrderRequest {
  userId?: number;
  customerInfo: CustomerInfo;
  shippingAddress: string;
  paymentMethod: string;
  cartItems: Array<{
    productId: number;
    quantity: number;
  }>;
  couponCode?: string;
}

interface PaymentFormValues {
  paymentMethod: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  name?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  couponCode?: string;
}

const PaymentPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  const userInfo = localStorage.getItem("user");
  const currentUser = userInfo
    ? JSON.parse(userInfo)
    : {
        name: "",
        phone: "",
        email: "",
        shippingAddress: "",
      };

  const selectedItems: CartItem[] = location.state?.selectedItems || [];

  const totalPrice = selectedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const validateExpiryDate = (value: string) => {
    if (!value) return false;

    if (!/^\d{2}\/\d{2}$/.test(value)) return false;

    const [month, year] = value.split("/");
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;

    if (monthNum < 1 || monthNum > 12) {
      return false;
    }

    const fullCurrentYear =
      Math.floor(currentDate.getFullYear() / 100) * 100 + currentYear;
    const fullInputYear =
      Math.floor(currentDate.getFullYear() / 100) * 100 + yearNum;

    if (fullInputYear < fullCurrentYear) {
      console.log("Year in past");
      return false;
    }

    console.log("Valid date");
    return true;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, "");

    if (!v) return "";

    if (v.length === 1) {
      return v;
    }

    if (v.length === 2) {
      const firstDigit = parseInt(v[0]);
      if (firstDigit > 1) {
        return `0${v[0]}/${v[1]}`;
      }
      return `${v[0]}${v[1]}`;
    }

    return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
  };

  const onFinish = async (values: PaymentFormValues) => {
    setLoading(true);
    try {
      const orderData: OrderRequest = {
        ...(userInfo && { userId: JSON.parse(userInfo).id }),
        customerInfo: {
          name: values.customerName,
          phone: values.customerPhone,
          email: values.customerEmail,
        },
        shippingAddress: values.shippingAddress,
        paymentMethod: values.paymentMethod === "card" ? "CREDIT_CARD" : "COD",
        cartItems: selectedItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      if (values.couponCode) {
        orderData.couponCode = values.couponCode;
      }

      const response = await axios.post(
        "http://localhost:8080/api/orders",
        orderData
      );

      if (userInfo) {
        for (const item of selectedItems) {
          await cartService.removeFromCart(item.id);
        }
      } else {
        const cartItems = JSON.parse(
          localStorage.getItem("cart_items") || "[]"
        );
        console.log(cartItems);
        const remainingItems = cartItems.filter(
          (item: CartItem) =>
            !selectedItems.some((selected) => selected.id === item.id)
        );
        localStorage.setItem("cart_items", JSON.stringify(remainingItems));
      }

      navigate("/order-success", {
        state: {
          orderId: response.data.id,
          orderDetails: {
            customerInfo: orderData.customerInfo,
            shippingAddress: orderData.shippingAddress,
            paymentMethod: orderData.paymentMethod,
            items: selectedItems,
            totalAmount: totalPrice,
          },
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Không đặt hàng được. Vui lòng thử lại.");
      }
      console.error("Order error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="min-h-screen flex flex-col">
      <AppHeader />
      <Content className="flex-grow p-6 bg-gray-100">
        <div className="max-w-4xl mx-auto min-h-[675px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Thông tin thanh toán" className="h-fit">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-4"
                initialValues={{
                  paymentMethod: "card",
                  customerName: currentUser.name,
                  customerPhone: currentUser.phone,
                  customerEmail: currentUser.email,
                  shippingAddress: currentUser.shippingAddress,
                }}
              >
                <Form.Item
                  name="paymentMethod"
                  label="Phương thức thanh toán"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn phương thức thanh toán!",
                    },
                  ]}
                >
                  <Radio.Group
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <Radio value="card">Thẻ tín dụng</Radio>
                    <Radio value="cod">Thanh toán khi nhận hàng</Radio>
                  </Radio.Group>
                </Form.Item>

                {paymentMethod === "card" && (
                  <>
                    <Form.Item
                      name="cardNumber"
                      label="Số thẻ"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số thẻ của bạn!",
                        },
                        {
                          pattern: /^(\d{4}\s){3}\d{4}$/,
                          message: "Vui lòng nhập số thẻ hợp lệ!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          form.setFieldValue("cardNumber", formatted);
                        }}
                      />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                      <Form.Item
                        name="expiryDate"
                        label="Ngày hạn"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập ngày hạn!",
                          },
                          {
                            validator: (_, value) => {
                              if (!value) return Promise.reject();
                              const isValid = validateExpiryDate(value);
                              console.log("Validation result:", {
                                value,
                                isValid,
                              });
                              if (isValid) {
                                return Promise.reject(
                                  "Vui lòng nhập ngày hạn hợp lệ (MM/YY)!"
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Input
                          placeholder="MM/YY"
                          maxLength={5}
                          onChange={(e) => {
                            const formatted = formatExpiryDate(e.target.value);
                            console.log("Formatting:", {
                              input: e.target.value,
                              formatted,
                            });
                            form.setFieldValue("expiryDate", formatted);
                          }}
                        />
                      </Form.Item>

                      <Form.Item
                        name="cvv"
                        label="CVV"
                        rules={[
                          { required: true, message: "Vui lòng nhập CVV!" },
                          { len: 3, message: "CVV phải là 3 chữ số!" },
                        ]}
                      >
                        <Input.Password
                          placeholder="123"
                          maxLength={3}
                          visibilityToggle={false}
                        />
                      </Form.Item>
                    </div>

                    <Form.Item
                      name="name"
                      label="Tên chủ thẻ"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên chủ thẻ!",
                        },
                      ]}
                    >
                      <Input placeholder="Be Trong Hieu" />
                    </Form.Item>
                  </>
                )}

                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">
                    Thông tin khách hàng
                  </h3>
                  <Form.Item
                    name="customerName"
                    label="Họ và tên"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ và tên!" },
                    ]}
                  >
                    <Input placeholder="Bế Trọng Hiếu" />
                  </Form.Item>

                  <Form.Item
                    name="customerPhone"
                    label="Số điện thoại"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại!",
                      },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Vui lòng nhập số điện thoại hợp lệ!",
                      },
                    ]}
                  >
                    <Input placeholder="0328058287" maxLength={10} />
                  </Form.Item>

                  <Form.Item
                    name="customerEmail"
                    label="Email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                      {
                        type: "email",
                        message: "Vui lòng nhập email hợp lệ!",
                      },
                    ]}
                  >
                    <Input placeholder="tronghieu@gmail.com" />
                  </Form.Item>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">
                    Địa chỉ giao hàng
                  </h3>
                  <Form.Item
                    name="shippingAddress"
                    label="Địa chỉ"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập địa chỉ giao hàng!",
                      },
                    ]}
                  >
                    <Input.TextArea
                      placeholder="05 134/54 Cầu Diễn, Bắc Từ Liêm, Hà Nội"
                      rows={3}
                    />
                  </Form.Item>
                </div>

                {userInfo && (
                  <Form.Item
                    name="couponCode"
                    label="Mã giảm giá (Tùy chọn)"
                    rules={[
                      {
                        pattern: /^[A-Z0-9]+$/,
                        message: "Mã giảm giá phải chứa chữ cái và số!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập mã giảm giá nếu có"
                      maxLength={10}
                      onChange={(e) => {
                        const upperValue = e.target.value.toUpperCase();
                        form.setFieldValue("couponCode", upperValue);
                      }}
                    />
                  </Form.Item>
                )}

                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full"
                  loading={loading}
                >
                  {paymentMethod === "cod" ? "Đặt hàng" : "Thanh toán"}
                </Button>
              </Form>
            </Card>

            <Card title="Tóm tắt đơn hàng" className="h-fit">
              <div className="space-y-4">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-500">
                          {item.quantity} x {item.price.toLocaleString()} VND
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">
                      {(item.price * item.quantity).toLocaleString()} VND
                    </p>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Tổng cộng ({selectedItems.length} sản phẩm)</span>
                    <span>{totalPrice.toLocaleString()} VND</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default PaymentPage;
