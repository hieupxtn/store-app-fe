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
        return "Smartphone";
      case 2:
        return "Laptop";
      case 3:
        return "Accessories";
      case 4:
        return "Tablet";
      default:
        return "Unknown";
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
      title: "Image",
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
      title: "Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Type",
      dataIndex: "productType",
      key: "productType",
      render: (type: number) => (
        <Tag color="blue">{getProductTypeName(type)}</Tag>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price ? price.toLocaleString() : 0}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number) => (
        <span className={quantity <= 0 ? "text-red-500" : ""}>{quantity}</span>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => (
        <span className="text-yellow-500">{rating} ★</span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string | null) =>
        date ? new Date(date).toLocaleString() : "Not specified",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Product) => (
        <Space>
          <Button type="link" onClick={() => handleViewProduct(record.id)}>
            View
          </Button>
          <Button type="link" onClick={() => handleEditProduct(record.id)}>
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteProduct(record.id)}
          >
            Delete
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
      // Refresh the product list
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
      // Refresh the product list
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
      // Refresh the product list
      const productsResponse = await api.getAllProducts();
      setProducts(productsResponse.products);
    } catch (error) {
      console.error("Error creating product:", error);
      message.error("Failed to create product. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="flex flex-col min-h-screen w-full">
      <AppHeader />
      <Content className="flex-grow bg-gray-100">
        <div className="w-full px-4 py-8 min-h-[751px]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Product Management</h1>
            <Space>
              <Button
                type="primary"
                onClick={() => setIsCreateModalVisible(true)}
              >
                Add New Product
              </Button>
              <Button onClick={() => navigate("/admin")}>
                Back to Dashboard
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
            title="Product Details"
            open={isViewModalVisible}
            onCancel={() => setIsViewModalVisible(false)}
            footer={[
              <Button key="close" onClick={() => setIsViewModalVisible(false)}>
                Close
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
                  <h3 className="font-bold">Product Name:</h3>
                  <p>{selectedProduct.productName}</p>
                </div>
                <div>
                  <h3 className="font-bold">Type:</h3>
                  <p>{getProductTypeName(selectedProduct.productType)}</p>
                </div>
                <div>
                  <h3 className="font-bold">Price:</h3>
                  <p>${selectedProduct.price.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-bold">Quantity:</h3>
                  <p>{selectedProduct.quantity}</p>
                </div>
                <div>
                  <h3 className="font-bold">Quantity Limit:</h3>
                  <p>{selectedProduct.quantityLimit}</p>
                </div>
                <div>
                  <h3 className="font-bold">Rating:</h3>
                  <p>{selectedProduct.rating} ★</p>
                </div>
                <div>
                  <h3 className="font-bold">Description:</h3>
                  <p>{selectedProduct.description}</p>
                </div>
              </div>
            )}
          </Modal>

          {/* Edit Product Modal */}
          <Modal
            title="Edit Product"
            open={isEditModalVisible}
            onCancel={() => setIsEditModalVisible(false)}
            footer={null}
          >
            <Form form={form} layout="vertical" onFinish={handleUpdateProduct}>
              <Form.Item
                name="productName"
                label="Product Name"
                rules={[
                  { required: true, message: "Please input product name!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="productType"
                label="Product Type"
                rules={[
                  { required: true, message: "Please select product type!" },
                ]}
              >
                <Select>
                  <Select.Option value={1}>Smartphone</Select.Option>
                  <Select.Option value={2}>Laptop</Select.Option>
                  <Select.Option value={3}>Accessories</Select.Option>
                  <Select.Option value={4}>Tablet</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: "Please input price!" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>

              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: "Please input quantity!" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>

              <Form.Item
                name="quantityLimit"
                label="Quantity Limit"
                rules={[
                  { required: true, message: "Please input quantity limit!" },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please input description!" },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>

              <Form.Item
                name="image"
                label="Image URL"
                rules={[{ required: true, message: "Please input image URL!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Product
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          {/* Create Product Modal */}
          <Modal
            title="Create New Product"
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
                label="Product Name"
                rules={[
                  { required: true, message: "Please input product name!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="productType"
                label="Product Type"
                rules={[
                  { required: true, message: "Please select product type!" },
                ]}
              >
                <Select>
                  <Select.Option value={1}>Smartphone</Select.Option>
                  <Select.Option value={2}>Laptop</Select.Option>
                  <Select.Option value={3}>Accessories</Select.Option>
                  <Select.Option value={4}>Tablet</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: "Please input price!" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>

              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: "Please input quantity!" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>

              <Form.Item
                name="quantityLimit"
                label="Quantity Limit"
                rules={[
                  { required: true, message: "Please input quantity limit!" },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please input description!" },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>

              <Form.Item
                name="image"
                label="Image URL"
                rules={[{ required: true, message: "Please input image URL!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Create Product
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            title="Delete Product"
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
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
          </Modal>
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default ProductListPage;
