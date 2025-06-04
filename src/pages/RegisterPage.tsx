import React, { useState } from "react";
import { Form, Input, Button, Card, message, Layout } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";

const { Content } = Layout;

interface RegisterError {
  response?: {
    data?: {
      message?: string;
      errMessage?: string;
    };
  };
  request?: unknown;
  message?: string;
}

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    setLoading(true);
    try {
      const response = await api.register(values);
      if (response && response.user) {
        message.success("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        message.error("Registration failed");
      }
    } catch (error: unknown) {
      const registerError = error as RegisterError;
      if (registerError.response) {
        message.error(
          registerError.response.data?.message ||
            registerError.response.data?.errMessage ||
            "Đăng ký thất bại. Vui lòng thử lại."
        );
      } else if (registerError.request) {
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
            <h2 className="text-2xl font-bold text-center mb-4">Đăng ký</h2>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Họ"
                name="firstName"
                rules={[
                  { required: true, message: "Vui lòng nhập họ của bạn!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Nhập họ của bạn"
                />
              </Form.Item>

              <Form.Item
                label="Tên"
                name="lastName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên của bạn!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Nhập tên của bạn"
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email của bạn!" },
                  { type: "email", message: "Vui lòng nhập email hợp lệ!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  type="email"
                  placeholder="Nhập email của bạn"
                />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu của bạn!",
                  },
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
                  Đăng ký
                </Button>
              </Form.Item>

              <div className="text-center">
                Đã có tài khoản?{" "}
                <Link to="/login" className="text-blue-500 hover:text-blue-600">
                  Đăng nhập
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

export default RegisterPage;
