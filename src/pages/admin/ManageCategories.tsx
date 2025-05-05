import React, { useEffect, useState, useCallback } from "react";
import {
  Layout,
  Table,
  Button,
  message,
  Modal,
  Form,
  Input,
  Space,
  Card,
  Popconfirm,
  Typography,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { api, ProductType } from "../../services/api";
import AppHeader from "../../common/AppHeader";
import AppFooter from "../../common/AppFooter";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title } = Typography;

interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  typeRole: string;
  keyRole: string;
}

const ManageCategories: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [categories, setCategories] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductType | null>(
    null
  );
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Check admin access
  const checkAdminAccess = useCallback(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        const role =
          parsedUser.role || parsedUser.typeRole || parsedUser.keyRole;
        if (role !== "admin") {
          message.error("You don't have permission to access this page");
          navigate("/");
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
        message.error("Error loading user data");
        navigate("/login");
      }
    } else {
      message.error("Please login first");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getAllProductTypes();
      setCategories(response.types);
    } catch (err) {
      console.error("Error fetching categories:", err);
      message.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAdminAccess();
    fetchCategories();
  }, [checkAdminAccess, fetchCategories]);

  const handleCreate = useCallback(
    async (values: { name: string; description?: string }) => {
      try {
        await api.createProductType(values);
        message.success("Category created successfully");
        setModalVisible(false);
        form.resetFields();
        fetchCategories();
      } catch (err) {
        console.error("Error creating category:", err);
        message.error("Failed to create category");
      }
    },
    [form, fetchCategories]
  );

  const handleUpdate = useCallback(
    async (values: { name: string; description?: string }) => {
      if (!editingCategory) return;
      try {
        await api.updateProductType(editingCategory.id, values);
        message.success("Category updated successfully");
        setModalVisible(false);
        setEditingCategory(null);
        form.resetFields();
        fetchCategories();
      } catch (err) {
        console.error("Error updating category:", err);
        message.error("Failed to update category");
      }
    },
    [editingCategory, form, fetchCategories]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await api.deleteProductType(id);
        message.success("Category deleted successfully");
        fetchCategories();
      } catch (err) {
        console.error("Error deleting category:", err);
        message.error("Failed to delete category");
      }
    },
    [fetchCategories]
  );

  const showModal = useCallback(
    (category?: ProductType) => {
      if (category) {
        setEditingCategory(category);
        form.setFieldsValue({
          name: category.name,
          description: category.description,
        });
      } else {
        setEditingCategory(null);
        form.resetFields();
      }
      setModalVisible(true);
    },
    [form]
  );

  const handleModalOk = useCallback(() => {
    form.submit();
  }, [form]);

  const handleModalCancel = useCallback(() => {
    setModalVisible(false);
    setEditingCategory(null);
    form.resetFields();
  }, [form]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: ProductType, b: ProductType) => a.id - b.id,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: ProductType, b: ProductType) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
      sorter: (a: ProductType, b: ProductType) =>
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
      sorter: (a: ProductType, b: ProductType) =>
        dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: ProductType) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <Layout className="flex flex-col min-h-screen w-full">
      <AppHeader />
      <Content className="flex-grow bg-gray-100">
        <div className="w-full px-4 py-8 min-h-[751px] max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Title level={2}>Manage Categories</Title>
            <Space>
              <Button
                type="default"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/admin")}
              >
                Back to Dashboard
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModal()}
              >
                Add Category
              </Button>
            </Space>
          </div>

          <Card>
            <Table
              columns={columns}
              dataSource={categories}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>

          <Modal
            title={editingCategory ? "Edit Category" : "Add Category"}
            open={modalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            confirmLoading={loading}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={editingCategory ? handleUpdate : handleCreate}
            >
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: "Please input the category name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default ManageCategories;
