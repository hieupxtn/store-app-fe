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

interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
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
  // Customer information
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  // Shipping address
  shippingAddress: string;
  // Optional coupon
  couponCode?: string;
}

const PaymentPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  // Get user info from localStorage
  const userInfo = localStorage.getItem("user");
  const currentUser = userInfo
    ? JSON.parse(userInfo)
    : {
        name: "",
        phone: "",
        email: "",
        shippingAddress: "",
      };

  // Get selected items from location state
  const selectedItems: CartItem[] = location.state?.selectedItems || [];

  const totalPrice = selectedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Format card number with spaces after every 4 digits
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

  // Validate expiry date
  const validateExpiryDate = (value: string) => {
    if (!value) return false;

    // Check format MM/YY
    if (!/^\d{2}\/\d{2}$/.test(value)) return false;

    const [month, year] = value.split("/");
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    // Get current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;

    // Check if month is valid (1-12)
    if (monthNum < 1 || monthNum > 12) {
      return false;
    }

    // For 2-digit years, we need to handle the case where current year is greater than input year
    // For example: current year is 25, input year is 22
    // In this case, we should consider 22 as 2022 and 25 as 2025
    const fullCurrentYear =
      Math.floor(currentDate.getFullYear() / 100) * 100 + currentYear;
    const fullInputYear =
      Math.floor(currentDate.getFullYear() / 100) * 100 + yearNum;

    // If input year is less than current year, it's invalid
    if (fullInputYear < fullCurrentYear) {
      console.log("Year in past");
      return false;
    }

    console.log("Valid date");
    return true;
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    // Remove all non-digit characters
    const v = value.replace(/\D/g, "");

    // If empty, return empty string
    if (!v) return "";

    // If length is 1, return as is
    if (v.length === 1) {
      return v;
    }

    // If length is 2, check if first digit is > 1
    if (v.length === 2) {
      const firstDigit = parseInt(v[0]);
      if (firstDigit > 1) {
        return `0${v[0]}/${v[1]}`;
      }
      return `${v[0]}${v[1]}`;
    }

    // If length is 3 or more, format as MM/YY
    return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
  };

  const onFinish = async (values: PaymentFormValues) => {
    setLoading(true);
    try {
      const orderData: OrderRequest = {
        // Add userId if user is logged in
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

      // Add coupon code if provided
      if (values.couponCode) {
        orderData.couponCode = values.couponCode;
      }

      const response = await axios.post(
        "http://localhost:8080/api/orders",
        orderData
      );

      // Remove purchased items from cart
      if (userInfo) {
        // If user is logged in, remove from both localStorage and database
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

      // Navigate to success page with order details
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
      message.error("Failed to place order. Please try again.");
      console.error("Order error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="min-h-screen flex flex-col">
      <AppHeader />
      <Content className="flex-grow p-6 bg-gray-100">
        <div className="max-w-4xl mx-auto min-h-[703px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Payment Information" className="h-fit">
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
                  label="Payment Method"
                  rules={[
                    {
                      required: true,
                      message: "Please select payment method!",
                    },
                  ]}
                >
                  <Radio.Group
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <Radio value="card">Credit Card</Radio>
                    <Radio value="cod">Cash on Delivery</Radio>
                  </Radio.Group>
                </Form.Item>

                {paymentMethod === "card" && (
                  <>
                    <Form.Item
                      name="cardNumber"
                      label="Card Number"
                      rules={[
                        {
                          required: true,
                          message: "Please input your card number!",
                        },
                        {
                          pattern: /^(\d{4}\s){3}\d{4}$/,
                          message: "Please enter a valid 16-digit card number!",
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
                        label="Expiry Date"
                        rules={[
                          {
                            required: true,
                            message: "Please input expiry date!",
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
                                  "Please enter a valid expiry date (MM/YY)!"
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
                          { required: true, message: "Please input CVV!" },
                          { len: 3, message: "CVV must be 3 digits!" },
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
                      label="Cardholder Name"
                      rules={[
                        {
                          required: true,
                          message: "Please input cardholder name!",
                        },
                      ]}
                    >
                      <Input placeholder="John Doe" />
                    </Form.Item>
                  </>
                )}

                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">
                    Customer Information
                  </h3>
                  <Form.Item
                    name="customerName"
                    label="Full Name"
                    rules={[
                      { required: true, message: "Please input your name!" },
                    ]}
                  >
                    <Input placeholder="Enter your full name" />
                  </Form.Item>

                  <Form.Item
                    name="customerPhone"
                    label="Phone Number"
                    rules={[
                      { required: true, message: "Please input phone number!" },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit phone number!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter phone number" maxLength={10} />
                  </Form.Item>

                  <Form.Item
                    name="customerEmail"
                    label="Email"
                    rules={[
                      { required: true, message: "Please input email!" },
                      { type: "email", message: "Please enter a valid email!" },
                    ]}
                  >
                    <Input placeholder="Enter email address" />
                  </Form.Item>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
                  <Form.Item
                    name="shippingAddress"
                    label="Address"
                    rules={[
                      {
                        required: true,
                        message: "Please input shipping address!",
                      },
                    ]}
                  >
                    <Input.TextArea
                      placeholder="Enter your full shipping address"
                      rows={3}
                    />
                  </Form.Item>
                </div>

                <Form.Item
                  name="couponCode"
                  label="Coupon Code (Optional)"
                  rules={[
                    {
                      pattern: /^[A-Z0-9]+$/,
                      message:
                        "Coupon code must contain only uppercase letters and numbers!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter coupon code if you have one"
                    maxLength={10}
                    onChange={(e) => {
                      // Convert to uppercase
                      const upperValue = e.target.value.toUpperCase();
                      form.setFieldValue("couponCode", upperValue);
                    }}
                  />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full"
                  loading={loading}
                >
                  {paymentMethod === "cod" ? "Place Order" : "Pay Now"}
                </Button>
              </Form>
            </Card>

            <Card title="Order Summary" className="h-fit">
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
                          {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total ({selectedItems.length} items)</span>
                    <span>${totalPrice.toFixed(2)}</span>
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
