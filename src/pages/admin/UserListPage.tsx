import React, { useEffect, useState } from "react";
import { Layout, Table, Card, message, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { api, NormalUser } from "../../services/api";
import AppHeader from "../../common/AppHeader";
import AppFooter from "../../common/AppFooter";

const { Content } = Layout;

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<NormalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.getNormalUsers();
        if (response.errCode === 0) {
          setUsers(response.data);
        } else {
          message.error(response.message || "Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Role",
      dataIndex: "typeRole",
      key: "typeRole",
      render: (typeRole: string) => (
        <span className="capitalize">{typeRole}</span>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: NormalUser) => (
        <Space>
          <Button type="link" onClick={() => handleViewUser(record.id)}>
            View
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteUser(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewUser = (userId: number) => {
    // TODO: Implement view user details
    console.log("View user:", userId);
  };

  const handleDeleteUser = (userId: number) => {
    // TODO: Implement delete user
    console.log("Delete user:", userId);
  };

  return (
    <Layout className="flex flex-col min-h-screen w-full">
      <AppHeader />
      <Content className="flex-grow bg-gray-100">
        <div className="w-full px-4 py-8 min-h-[751px]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">User Management</h1>
            <Button type="primary" onClick={() => navigate("/admin")}>
              Back to Dashboard
            </Button>
          </div>

          <Card>
            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              loading={loading}
              scroll={{ x: 1200 }}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default UserListPage;
