import React, { useEffect, useState } from "react";
import {
  Layout,
  Table,
  Card,
  message,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import { api, User } from "../../services/api";
import AppHeader from "../../common/AppHeader";
import AppFooter from "../../common/AppFooter";

const { Content } = Layout;
const { Option } = Select;

interface UpdateUserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  gender: boolean | null;
  address: string | null;
}

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.getAllUsers();
        setUsers(response.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getRoleTag = (role: string) => {
    switch (role) {
      case "admin":
        return <Tag color="red">Admin</Tag>;
      case "customer":
        return <Tag color="blue">Customer</Tag>;
      default:
        return <Tag>{role}</Tag>;
    }
  };

  const getGenderText = (gender: boolean | null) => {
    if (gender === null) return "Not specified";
    return gender ? "Male" : "Female";
  };

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
      title: "Name",
      key: "name",
      render: (_: unknown, record: User) => (
        <span>{`${record.firstName} ${record.lastName}`}</span>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => getRoleTag(role),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender: boolean | null) => getGenderText(gender),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address: string | null) => address || "Not specified",
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
      render: (_: unknown, record: User) => (
        <Space>
          <Button type="link" onClick={() => handleViewUser(record.id)}>
            View
          </Button>
          <Button type="link" onClick={() => handleEditUser(record.id)}>
            Edit
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
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsViewModalVisible(true);
    }
  };

  const handleEditUser = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        gender: user.gender,
        address: user.address,
      });
      setIsEditModalVisible(true);
    }
  };

  const handleDeleteUser = (userId: number) => {
    setUserToDelete(userId);
    setIsDeleteModalVisible(true);
  };

  const handleUpdateUser = async (values: UpdateUserFormValues) => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      const response = await api.updateUser(selectedUser.id, values);
      message.success("User updated successfully");
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? response.user : user
        )
      );
      setIsEditModalVisible(false);
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Failed to update user. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setLoading(true);
      await api.deleteUser(userToDelete);
      message.success("User deleted successfully");
      setUsers(users.filter((user) => user.id !== userToDelete));
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user. Please try again later.");
    } finally {
      setLoading(false);
      setIsDeleteModalVisible(false);
      setUserToDelete(null);
    }
  };

  return (
    <Layout className="flex flex-col min-h-screen w-full">
      <AppHeader />
      <Content className="flex-grow bg-gray-100">
        <div className="w-full px-4 py-8 min-h-[751px]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">User Management</h1>
            <Button onClick={() => navigate("/admin")}>
              Back to Dashboard
            </Button>
          </div>

          <Card>
            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              loading={loading}
              scroll={{ x: 1500 }}
            />
          </Card>

          {/* View User Modal */}
          <Modal
            title="User Details"
            open={isViewModalVisible}
            onCancel={() => setIsViewModalVisible(false)}
            footer={[
              <Button key="close" onClick={() => setIsViewModalVisible(false)}>
                Close
              </Button>,
            ]}
          >
            {selectedUser && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold">Name:</h3>
                  <p>{`${selectedUser.firstName} ${selectedUser.lastName}`}</p>
                </div>
                <div>
                  <h3 className="font-bold">Email:</h3>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <h3 className="font-bold">Role:</h3>
                  <p>{getRoleTag(selectedUser.role)}</p>
                </div>
                <div>
                  <h3 className="font-bold">Gender:</h3>
                  <p>{getGenderText(selectedUser.gender)}</p>
                </div>
                <div>
                  <h3 className="font-bold">Address:</h3>
                  <p>{selectedUser.address || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="font-bold">Created At:</h3>
                  <p>{new Date(selectedUser.createdAt).toLocaleString()}</p>
                </div>
              </div>
            )}
          </Modal>

          {/* Edit User Modal */}
          <Modal
            title="Edit User"
            open={isEditModalVisible}
            onCancel={() => setIsEditModalVisible(false)}
            footer={null}
          >
            <Form form={form} layout="vertical" onFinish={handleUpdateUser}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[
                  { required: true, message: "Please input first name!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: "Please input last name!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please input email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: "Please select role!" }]}
              >
                <Select>
                  <Option value="admin">Admin</Option>
                  <Option value="customer">Customer</Option>
                </Select>
              </Form.Item>

              <Form.Item name="gender" label="Gender">
                <Select>
                  <Option value={true}>Male</Option>
                  <Option value={false}>Female</Option>
                  <Option value={null}>Not specified</Option>
                </Select>
              </Form.Item>

              <Form.Item name="address" label="Address">
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update User
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            title="Delete User"
            open={isDeleteModalVisible}
            onOk={handleConfirmDelete}
            onCancel={() => {
              setIsDeleteModalVisible(false);
              setUserToDelete(null);
            }}
            okText="Delete"
            okType="danger"
            cancelText="Cancel"
            confirmLoading={loading}
          >
            <p>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
          </Modal>
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default UserListPage;
