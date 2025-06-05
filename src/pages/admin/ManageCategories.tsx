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
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
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

  const checkAdminAccess = useCallback(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        const role =
          parsedUser.role || parsedUser.typeRole || parsedUser.keyRole;
        if (role !== "admin") {
          message.error("Bạn không có quyền truy cập vào trang này");
          navigate("/");
        }
      } catch (err) {
        console.error("Lỗi khi phân tích dữ liệu người dùng:", err);
        message.error("Lỗi khi tải dữ liệu người dùng");
        navigate("/login");
      }
    } else {
      message.error("Vui lòng đăng nhập trước");
      navigate("/login");
    }
  }, [navigate]);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getAllProductTypes();
      setCategories(response.types);
    } catch (err) {
      console.error("Lỗi khi tải danh mục:", err);
      message.error("Lỗi khi tải danh mục");
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
        message.success("Danh mục đã được tạo thành công");
        setModalVisible(false);
        form.resetFields();
        fetchCategories();
      } catch (err) {
        console.error("Lỗi khi tạo danh mục:", err);
        message.error("Lỗi khi tạo danh mục");
      }
    },
    [form, fetchCategories]
  );

  const handleUpdate = useCallback(
    async (values: { name: string; description?: string }) => {
      if (!editingCategory) return;
      try {
        await api.updateProductType(editingCategory.id, values);
        message.success("Danh mục đã được cập nhật thành công");
        setModalVisible(false);
        setEditingCategory(null);
        form.resetFields();
        fetchCategories();
      } catch (err) {
        console.error("Lỗi khi cập nhật danh mục:", err);
        message.error("Lỗi khi cập nhật danh mục");
      }
    },
    [editingCategory, form, fetchCategories]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await api.deleteProductType(id);
        message.success("Danh mục đã được xóa thành công");
        fetchCategories();
      } catch (err) {
        console.error("Lỗi khi xóa danh mục:", err);
        message.error("Lỗi khi xóa danh mục");
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
      title: "Tên",
      dataIndex: "name",
      key: "name",
      sorter: (a: ProductType, b: ProductType) => a.name.localeCompare(b.name),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
      sorter: (a: ProductType, b: ProductType) =>
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
      sorter: (a: ProductType, b: ProductType) =>
        dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: unknown, record: ProductType) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
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
            <Title level={2}>Quản lý danh mục</Title>
            <Space>
              <Button type="primary" onClick={() => showModal()}>
                Thêm danh mục
              </Button>
              <Button type="default" onClick={() => navigate("/admin")}>
                Quay lại trang quản trị
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
            title={editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
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
                label="Tên"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên danh mục!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Mô tả">
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
