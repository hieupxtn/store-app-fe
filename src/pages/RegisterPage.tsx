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
        message.success("Registration successful! Please login.");
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
            "Registration failed. Please try again."
        );
      } else if (registerError.request) {
        message.error("Cannot connect to server. Please try again later.");
      } else {
        message.error("An error occurred. Please try again.");
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
            <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  { required: true, message: "Please input your first name!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your first name"
                />
              </Form.Item>

              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  { required: true, message: "Please input your last name!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your last name"
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  type="email"
                  placeholder="Enter your email"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  loading={loading}
                >
                  Register
                </Button>
              </Form.Item>

              <div className="text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:text-blue-600">
                  Login
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
