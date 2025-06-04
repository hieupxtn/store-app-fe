import React, { useEffect, useState } from "react";
import {
  Layout,
  Table,
  Card,
  message,
  Button,
  Space,
  Image,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  api,
  Product,
  UpdateProductRequest,
  CreateProductRequest,
} from "../../services/api";
import AppHeader from "../../common/AppHeader";
import AppFooter from "../../common/AppFooter";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadChangeParam } from "antd/es/upload";

const { Content } = Layout;
const { TextArea } = Input;

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.getAllProducts();
        setProducts(response.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        message.error("Failed to fetch products. Please try again later.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getProductTypeName = (type: number) => {
    switch (type) {
      case 1:
        return "Điện thoại";
      case 2:
        return "Laptop";
      case 3:
        return "Phụ kiện";
      case 4:
        return "Máy tính bảng";
      default:
        return "Không xác định";
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <Image
          src={image}
          alt="Product"
          width={50}
          height={50}
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Tên",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Loại",
      dataIndex: "productType",
      key: "productType",
      render: (type: number) => (
        <Tag color="blue">{getProductTypeName(type)}</Tag>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price ? price.toLocaleString() : 0} VND`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number) => (
        <span className={quantity <= 0 ? "text-red-500" : ""}>{quantity}</span>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => (
        <span className="text-yellow-500">{rating} ★</span>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string | null) =>
        date ? new Date(date).toLocaleString() : "Chưa cập nhật",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: unknown, record: Product) => (
        <Space>
          <Button type="link" onClick={() => handleViewProduct(record.id)}>
            Xem
          </Button>
          <Button type="link" onClick={() => handleEditProduct(record.id)}>
            Sửa
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteProduct(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewProduct = async (productId: number) => {
    try {
      setLoading(true);
      const product = products.find((p) => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        setIsViewModalVisible(true);
      } else {
        message.error("Product not found");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      message.error("Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (productId: number) => {
    try {
      setLoading(true);
      const product = products.find((p) => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        form.setFieldsValue({
          productName: product.productName,
          productType: product.productType,
          price: product.price,
          quantity: product.quantity,
          quantityLimit: product.quantityLimit,
          description: product.description,
          image: product.image,
        });
        setIsEditModalVisible(true);
      } else {
        message.error("Product not found");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      message.error("Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = (productId: number) => {
    setProductToDelete(productId);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setLoading(true);
      await api.deleteProduct(productToDelete);
      message.success("Product deleted successfully");
      const response = await api.getAllProducts();
      setProducts(response.products);
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Failed to delete product. Please try again later.");
    } finally {
      setLoading(false);
      setIsDeleteModalVisible(false);
      setProductToDelete(null);
    }
  };

  const handleUpdateProduct = async (values: UpdateProductRequest) => {
    if (!selectedProduct) return;

    try {
      setLoading(true);
      await api.updateProduct(selectedProduct.id, values);
      message.success("Product updated successfully");
      setIsEditModalVisible(false);
      const productsResponse = await api.getAllProducts();
      setProducts(productsResponse.products);
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("Failed to update product. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (values: CreateProductRequest) => {
    try {
      setLoading(true);
      await api.createProduct(values);
      message.success("Product created successfully");
      setIsCreateModalVisible(false);
      createForm.resetFields();
      const productsResponse = await api.getAllProducts();
      setProducts(productsResponse.products);
    } catch (error) {
      console.error("Error creating product:", error);
      message.error("Failed to create product. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (info: UploadChangeParam) => {
    console.log("info", info);
    if (info.file.name) {
      const fileName = info.file.name;
      const fullPath = `/public/products/${fileName}`;
      form.setFieldValue("image", fullPath);
      createForm.setFieldValue("image", fullPath);
    }
  };

  const uploadProps = {
    onChange: handleImageUpload,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Bạn chỉ có thể tải lên file ảnh!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Ảnh phải nhỏ hơn 2MB!");
      }
      return isImage && isLt2M;
    },
  };

  const ImageUploadFormItem = () => (
    <Form.Item
      name="image"
      label="Hình ảnh"
      rules={[{ required: true, message: "Vui lòng tải lên hình ảnh!" }]}
    >
      <div className="flex flex-col gap-2">
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
      </div>
    </Form.Item>
  );

  return (
    <Layout className="flex flex-col min-h-screen w-full">
      <AppHeader />
      <Content className="flex-grow bg-gray-100">
        <div className="w-full px-4 py-8 min-h-[751px]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
            <Space>
              <Button
                type="primary"
                onClick={() => setIsCreateModalVisible(true)}
              >
                Thêm sản phẩm mới
              </Button>
              <Button onClick={() => navigate("/admin")}>
                Quay lại Dashboard
              </Button>
            </Space>
          </div>

          <Card>
            <Table
              columns={columns}
              dataSource={products}
              rowKey="id"
              loading={loading}
              scroll={{ x: 1500 }}
              pagination={{
                current: 1,
                pageSize: 10,
                total: products.length,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} items`,
              }}
            />
          </Card>

          {/* View Product Modal */}
          <Modal
            title="Chi tiết sản phẩm"
            open={isViewModalVisible}
            onCancel={() => setIsViewModalVisible(false)}
            footer={[
              <Button key="close" onClick={() => setIsViewModalVisible(false)}>
                Đóng
              </Button>,
            ]}
          >
            {selectedProduct && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.productName}
                    width={200}
                    height={200}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div>
                  <h3 className="font-bold">Tên sản phẩm:</h3>
                  <p>{selectedProduct.productName}</p>
                </div>
                <div>
                  <h3 className="font-bold">Loại:</h3>
                  <p>{getProductTypeName(selectedProduct.productType)}</p>
                </div>
                <div>
                  <h3 className="font-bold">Giá:</h3>
                  <p>{selectedProduct.price.toLocaleString()} VND</p>
                </div>
                <div>
                  <h3 className="font-bold">Số lượng:</h3>
                  <p>{selectedProduct.quantity}</p>
                </div>
                <div>
                  <h3 className="font-bold">Giới hạn số lượng:</h3>
                  <p>{selectedProduct.quantityLimit}</p>
                </div>
                <div>
                  <h3 className="font-bold">Đánh giá:</h3>
                  <p>{selectedProduct.rating} ★</p>
                </div>
                <div>
                  <h3 className="font-bold">Mô tả:</h3>
                  <p>{selectedProduct.description}</p>
                </div>
              </div>
            )}
          </Modal>

          {/* Edit Product Modal */}
          <Modal
            title="Chỉnh sửa sản phẩm"
            open={isEditModalVisible}
            onCancel={() => setIsEditModalVisible(false)}
            footer={null}
          >
            <Form form={form} layout="vertical" onFinish={handleUpdateProduct}>
              <Form.Item
                name="productName"
                label="Tên sản phẩm"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="productType"
                label="Loại sản phẩm"
                rules={[
                  { required: true, message: "Vui lòng chọn loại sản phẩm!" },
                ]}
              >
                <Select>
                  <Select.Option value={1}>Điện thoại</Select.Option>
                  <Select.Option value={2}>Laptop</Select.Option>
                  <Select.Option value={3}>Phụ kiện</Select.Option>
                  <Select.Option value={4}>Máy tính bảng</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="price"
                label="Giá"
                rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value} VND`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>

              <Form.Item
                name="quantity"
                label="Số lượng"
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>

              <Form.Item
                name="quantityLimit"
                label="Giới hạn số lượng"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giới hạn số lượng!",
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>

              <Form.Item
                name="description"
                label="Mô tả"
                rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Cập nhật sản phẩm
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          {/* Create Product Modal */}
          <Modal
            title="Thêm sản phẩm mới"
            open={isCreateModalVisible}
            onCancel={() => setIsCreateModalVisible(false)}
            footer={null}
          >
            <Form
              form={createForm}
              layout="vertical"
              onFinish={handleCreateProduct}
            >
              <Form.Item
                name="productName"
                label="Tên sản phẩm"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="productType"
                label="Loại sản phẩm"
                rules={[
                  { required: true, message: "Vui lòng chọn loại sản phẩm!" },
                ]}
              >
                <Select>
                  <Select.Option value={1}>Điện thoại</Select.Option>
                  <Select.Option value={2}>Laptop</Select.Option>
                  <Select.Option value={3}>Phụ kiện</Select.Option>
                  <Select.Option value={4}>Máy tính bảng</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="price"
                label="Giá"
                rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value} VND`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>

              <Form.Item
                name="quantity"
                label="Số lượng"
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>

              <Form.Item
                name="quantityLimit"
                label="Giới hạn số lượng"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giới hạn số lượng!",
                  },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>

              <Form.Item
                name="description"
                label="Mô tả"
                rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
              >
                <TextArea rows={4} />
              </Form.Item>

              <ImageUploadFormItem />

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Thêm sản phẩm
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            title="Xóa sản phẩm"
            open={isDeleteModalVisible}
            onOk={handleConfirmDelete}
            onCancel={() => {
              setIsDeleteModalVisible(false);
              setProductToDelete(null);
            }}
            okText="Delete"
            okType="danger"
            cancelText="Cancel"
            confirmLoading={loading}
          >
            <p>
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể
              hoàn tác.
            </p>
          </Modal>
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default ProductListPage;
