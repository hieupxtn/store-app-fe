/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Form, Input, Button, Card, message, Layout, Divider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";

const { Content } = Layout;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      try {
        const response = await api.login(values);
        if (response && response.user && response.token) {
          message.success("Đăng nhập thành công");

          localStorage.setItem("token", response.token);

          if (response.user) {
            localStorage.setItem("user", JSON.stringify(response.user));

            if (response.user.role === "admin") {
              navigate("/admin");
            } else {
              navigate("/");
            }
          }
        } else {
          message.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        }
      } catch (apiError: any) {
        if (!apiError.response) {
          message.error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
        }

        throw apiError;
      }
    } catch (error: any) {
      if (error.response) {
        message.error(
          error.response.data?.message ||
            error.response.data?.errMessage ||
            "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
        );
      } else if (error.request) {
        message.error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      } else {
        message.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="flex flex-col min-h-screen w-full">
      <AppHeader />
      <Content className="flex-grow bg-gray-100">
        <div className="flex justify-center items-center min-h-[calc(100vh-128px)]">
          <Card className="w-full max-w-md p-6 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Đăng nhập</h2>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Vui lòng nhập email hợp lệ!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  type="email"
                  placeholder="Nhập email của bạn"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  {
                    min: 6,
                    message: "Mật khẩu phải có ít nhất 6 ký tự!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Nhập mật khẩu của bạn"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  loading={loading}
                >
                  Đăng nhập
                </Button>
              </Form.Item>

              <Divider>Hoặc</Divider>

              <div className="text-center">
                <p className="mb-4">Bạn chưa có tài khoản?</p>
                <Link to="/register">
                  <Button
                    type="default"
                    className="w-full border-blue-500 text-blue-500 hover:bg-blue-50"
                  >
                    Đăng ký
                  </Button>
                </Link>
              </div>
            </Form>
          </Card>
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default LoginPage;
