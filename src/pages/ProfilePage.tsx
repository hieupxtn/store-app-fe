import React, { useEffect, useState } from "react";
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  message,
  Avatar,
  Row,
  Col,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";
import { api } from "../services/api";

const { Content } = Layout;

interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  typeRole: string;
  keyRole: string;
}

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
}

interface UpdateError {
  response?: {
    data?: {
      message?: string;
      errMessage?: string;
    };
  };
  request?: unknown;
  message?: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const onFinish = async (values: ProfileFormValues) => {
    if (!user) return;

    setLoading(true);
    try {
      console.log("=== START UPDATE PROFILE ===");
      console.log("Update values:", values);

      const response = await api.updateUser(user.id, {
        firstName: values.firstName,
        lastName: values.lastName,
      });

      console.log("=== UPDATE PROFILE RESPONSE ===");
      console.log("Full response:", response);

      if (response.errCode === 0) {
        message.success("Profile updated successfully!");
        // Update local storage with new user data
        const updatedUser = { ...user, ...values };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        message.error(response.message || "Failed to update profile");
      }
    } catch (error: unknown) {
      console.error("=== UPDATE PROFILE ERROR ===");
      console.error("Full error:", error);
      const updateError = error as UpdateError;
      if (updateError.response) {
        console.error("Response data:", updateError.response.data);
        message.error(
          updateError.response.data?.message ||
            updateError.response.data?.errMessage ||
            "Failed to update profile. Please try again."
        );
      } else if (updateError.request) {
        console.error("No response received:", updateError.request);
        message.error("Cannot connect to server. Please try again later.");
      } else {
        console.error("Error setting up request:", updateError.message);
        message.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout className="flex flex-col min-h-screen w-full">
      <AppHeader />
      <Content className="flex-grow bg-gray-100">
        <div className="container mx-auto px-4 py-8 min-h-[751px]">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="text-center">
                <Avatar size={100} icon={<UserOutlined />} className="mb-4" />
                <h2 className="text-xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-500 capitalize">
                  {user.typeRole} - {user.keyRole}
                </p>
              </Card>
            </Col>
            <Col xs={24} md={16}>
              <Card title="Edit Profile">
                <Form<ProfileFormValues>
                  layout="vertical"
                  initialValues={{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                  }}
                  onFinish={onFinish}
                >
                  <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[
                      {
                        required: true,
                        message: "Please input your first name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[
                      {
                        required: true,
                        message: "Please input your last name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please input your email!" },
                      { type: "email", message: "Please enter a valid email!" },
                    ]}
                  >
                    <Input disabled />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      className="w-full"
                    >
                      Update Profile
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default ProfilePage;
