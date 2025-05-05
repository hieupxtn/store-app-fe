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
      console.log("=== START LOGIN ATTEMPT ===");
      console.log("Login values:", values);

      // Log API configuration
      console.log("API URL:", import.meta.env.VITE_API_URL);
      console.log("Full API config:", {
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      try {
        console.log("Making API call...");
        console.log(
          "Request URL:",
          `${import.meta.env.VITE_API_URL}/api/login`
        );
        console.log("Request data:", values);

        const response = await api.login(values);
        console.log("=== LOGIN RESPONSE ===");
        console.log("Full response:", response);
        if (response && response.user && response.token) {
          console.log("=== LOGIN SUCCESS ===");
          message.success("Login successful");

          console.log("Storing token:", response.token);
          localStorage.setItem("token", response.token);

          if (response.user) {
            console.log("Storing user data:", response.user);
            localStorage.setItem("user", JSON.stringify(response.user));

            // Check if user is admin and redirect accordingly
            if (response.user.role === "admin") {
              console.log("User is admin, redirecting to admin dashboard");
              navigate("/admin");
            } else {
              console.log("User is not admin, redirecting to home");
              navigate("/");
            }
          }

          console.log("=== LOGIN COMPLETE ===");
        } else {
          console.log("=== LOGIN FAILED ===");
          console.log("Error response:", response);
          message.error("Login failed. Please check your credentials.");
        }
      } catch (apiError: any) {
        console.log("=== API CALL ERROR ===");
        console.error("API Error:", apiError);
        console.error("API Error Response:", apiError.response);
        console.error("API Error Status:", apiError.response?.status);
        console.error("API Error Data:", apiError.response?.data);
        console.error("API Error Config:", apiError.config);
        console.error("API Error Request:", apiError.request);
        console.error("API Error Message:", apiError.message);
        console.error("API Error Stack:", apiError.stack);

        // Check if it's a network error
        if (!apiError.response) {
          console.error("Network Error - No response received");
          console.error("Check if the server is running and accessible");
          console.error(
            "Check if the URL is correct:",
            `${import.meta.env.VITE_API_URL}/api/login`
          );
        }

        throw apiError;
      }
    } catch (error: any) {
      console.log("=== LOGIN ERROR ===");
      console.error("Full error:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        message.error(
          error.response.data?.message ||
            error.response.data?.errMessage ||
            "Login failed. Please check your credentials."
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        console.error("Request config:", error.config);
        message.error("Cannot connect to server. Please try again later.");
      } else {
        console.error("Error setting up request:", error.message);
        console.error("Error stack:", error.stack);
        message.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
      console.log("=== LOGIN PROCESS COMPLETE ===");
    }
  };

  return (
    <Layout className="flex flex-col min-h-screen w-full">
      <AppHeader />
      <Content className="flex-grow bg-gray-100">
        <div className="flex justify-center items-center min-h-[calc(100vh-128px)]">
          <Card className="w-full max-w-md p-6 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
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
                  Login
                </Button>
              </Form.Item>

              <Divider>Or</Divider>

              <div className="text-center">
                <p className="mb-4">Don't have an account?</p>
                <Link to="/register">
                  <Button
                    type="default"
                    className="w-full border-blue-500 text-blue-500 hover:bg-blue-50"
                  >
                    Register
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
