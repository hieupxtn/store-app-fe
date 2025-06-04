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
      const response = await api.updateUser(user.id, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: user.keyRole,
        gender: null,
        address: "",
      });
      if (response && response.user) {
        message.success("Hồ sơ đã được cập nhật thành công!");
        const updatedUser = { ...user, ...response.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        message.error("Không thể cập nhật hồ sơ");
      }
    } catch (error: unknown) {
      const updateError = error as UpdateError;
      if (updateError.response) {
        message.error(
          updateError.response.data?.message ||
            updateError.response.data?.errMessage ||
            "Không thể cập nhật hồ sơ. Vui lòng thử lại."
        );
      } else if (updateError.request) {
        message.error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      } else {
        message.error("Đã xảy ra lỗi. Vui lòng thử lại.");
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
              <Card title="Chỉnh sửa hồ sơ">
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
                    label="Họ"
                    name="firstName"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập họ!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Tên"
                    name="lastName"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                      {
                        type: "email",
                        message: "Vui lòng nhập email hợp lệ!",
                      },
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
                      Cập nhật hồ sơ
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
