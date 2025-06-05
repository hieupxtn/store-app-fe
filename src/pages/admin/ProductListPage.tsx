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
  Row,
  Col,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { api, Product, ProductType, Brand } from "../../services/api";
import AppHeader from "../../common/AppHeader";
import AppFooter from "../../common/AppFooter";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadChangeParam } from "antd/es/upload";

const { Content } = Layout;
const { TextArea } = Input;

interface ExtendedProduct extends Omit<Product, "ProductType" | "Brand"> {
  specifications: string;
  ProductType: ProductType;
  Brand: Brand | null;
}

interface SpecificationItem {
  key: string;
  value: string;
}

interface FormValues {
  productName: string;
  productTypeId: number;
  brandId: number | undefined;
  price: number;
  quantity: number;
  description: string;
  specifications: SpecificationItem[];
  image: string;
}

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] =
    useState<ExtendedProduct | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, typesResponse, brandsResponse] =
          await Promise.all([
            api.getAllProducts(),
            api.getAllProductTypes(),
            api.getBrands(),
          ]);
        setProducts(productsResponse.products as ExtendedProduct[]);
        setProductTypes(typesResponse.types);
        setBrands(brandsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      fixed: "left" as const,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 100,
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
      width: 200,
      ellipsis: true,
    },
    {
      title: "Loại",
      dataIndex: ["ProductType", "name"],
      key: "productType",
      width: 120,
      render: (_: unknown, record: ExtendedProduct) => (
        <Tag color="blue">{record.ProductType.name}</Tag>
      ),
    },
    {
      title: "Thương hiệu",
      dataIndex: ["Brand", "name"],
      key: "brand",
      width: 120,
      render: (_: unknown, record: ExtendedProduct) =>
        record.Brand ? (
          <Tag color="green">{record.Brand.name}</Tag>
        ) : (
          <Tag color="default">Không có thương hiệu</Tag>
        ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (price: number) => `${price ? price.toLocaleString() : 0} VND`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (quantity: number) => (
        <span className={quantity <= 0 ? "text-red-500" : ""}>{quantity}</span>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      width: 100,
      render: (rating: number) => (
        <span className="text-yellow-500">{rating} ★</span>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Hành động",
      key: "actions",
      width: 200,
      fixed: "right" as const,
      render: (_: unknown, record: ExtendedProduct) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={() => handleViewProduct(record.id)}
          >
            Xem
          </Button>
          <Button
            type="default"
            size="small"
            onClick={() => handleEditProduct(record.id)}
          >
            Sửa
          </Button>
          <Button
            type="primary"
            danger
            size="small"
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
        message.error("Không tìm thấy sản phẩm");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      message.error("Không thể tải thông tin sản phẩm");
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
        // Convert specifications JSON string to array
        const specifications = Object.entries(
          JSON.parse(product.specifications)
        ).map(([key, value]) => ({
          key,
          value: value as string,
        }));

        form.setFieldsValue({
          productName: product.productName,
          productTypeId: product.ProductType.id,
          brandId: product.Brand?.id,
          price: product.price,
          quantity: product.quantity,
          description: product.description,
          specifications,
          image: product.image,
        });
        setIsEditModalVisible(true);
      } else {
        message.error("Không tìm thấy sản phẩm");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      message.error("Không thể tải thông tin sản phẩm");
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
      message.success("Xóa sản phẩm thành công");
      const response = await api.getAllProducts();
      setProducts(response.products as ExtendedProduct[]);
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
      setIsDeleteModalVisible(false);
      setProductToDelete(null);
    }
  };

  const handleUpdateProduct = async (values: FormValues) => {
    if (!selectedProduct) return;

    try {
      setLoading(true);
      // Convert specifications array to JSON string
      const specifications = values.specifications.reduce(
        (acc: Record<string, string>, curr) => {
          acc[curr.key] = curr.value;
          return acc;
        },
        {}
      );

      await api.updateProduct(selectedProduct.id, {
        ...values,
        specifications: JSON.stringify(specifications),
      });
      message.success("Cập nhật sản phẩm thành công");
      setIsEditModalVisible(false);
      const productsResponse = await api.getAllProducts();
      setProducts(productsResponse.products as ExtendedProduct[]);
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("Không thể cập nhật sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (values: FormValues) => {
    try {
      setLoading(true);
      // Convert specifications array to JSON string
      const specifications = values.specifications.reduce(
        (acc: Record<string, string>, curr) => {
          acc[curr.key] = curr.value;
          return acc;
        },
        {}
      );

      await api.createProduct({
        ...values,
        specifications: JSON.stringify(specifications),
      });
      message.success("Thêm sản phẩm thành công");
      setIsCreateModalVisible(false);
      createForm.resetFields();
      const productsResponse = await api.getAllProducts();
      setProducts(productsResponse.products as ExtendedProduct[]);
    } catch (error) {
      console.error("Error creating product:", error);
      message.error("Không thể thêm sản phẩm. Vui lòng thử lại sau.");
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

  const SpecificationsFormItem = () => (
    <Form.List
      name="specifications"
      rules={[
        {
          validator: async (_, specifications) => {
            if (!specifications || specifications.length < 1) {
              return Promise.reject(
                new Error("Vui lòng thêm ít nhất một thông số kỹ thuật!")
              );
            }
          },
        },
      ]}
    >
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Row
              key={key}
              gutter={8}
              align="middle"
              className="mb-2"
              style={{ height: 40 }}
            >
              <Col
                span={10}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Form.Item
                  {...restField}
                  name={[name, "key"]}
                  rules={[
                    { required: true, message: "Vui lòng nhập tên thông số!" },
                  ]}
                  style={{ width: "100%", marginBottom: 0, height: "100%" }}
                >
                  <Input
                    placeholder="Tên thông số"
                    style={{ height: "32px" }}
                  />
                </Form.Item>
              </Col>
              <Col
                span={10}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Form.Item
                  {...restField}
                  name={[name, "value"]}
                  rules={[
                    { required: true, message: "Vui lòng nhập giá trị!" },
                  ]}
                  style={{ width: "100%", marginBottom: 0, height: "100%" }}
                >
                  <Input placeholder="Giá trị" style={{ height: "32px" }} />
                </Form.Item>
              </Col>
              <Col
                span={4}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <MinusCircleOutlined
                  onClick={() => remove(name)}
                  style={{ fontSize: 20, color: "#ff4d4f", cursor: "pointer" }}
                />
              </Col>
            </Row>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
            >
              Thêm thông số
            </Button>
            <Form.ErrorList errors={errors} />
          </Form.Item>
        </>
      )}
    </Form.List>
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
                current: currentPage,
                pageSize: pageSize,
                total: products.length,
                onChange: (page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                },
                onShowSizeChange: (current, size) => {
                  setCurrentPage(current);
                  setPageSize(size);
                },
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
                  <p>{selectedProduct.ProductType.name}</p>
                </div>
                <div>
                  <h3 className="font-bold">Thương hiệu:</h3>
                  <p>
                    {selectedProduct.Brand
                      ? selectedProduct.Brand.name
                      : "Không có thương hiệu"}
                  </p>
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
                  <h3 className="font-bold">Đánh giá:</h3>
                  <p>{selectedProduct.rating} ★</p>
                </div>
                <div>
                  <h3 className="font-bold">Mô tả:</h3>
                  <p>{selectedProduct.description}</p>
                </div>
                <div>
                  <h3 className="font-bold">Thông số kỹ thuật:</h3>
                  <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
                    {JSON.stringify(
                      JSON.parse(selectedProduct.specifications),
                      null,
                      2
                    )}
                  </pre>
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
                name="productTypeId"
                label="Loại sản phẩm"
                rules={[
                  { required: true, message: "Vui lòng chọn loại sản phẩm!" },
                ]}
              >
                <Select>
                  {productTypes.map((type) => (
                    <Select.Option key={type.id} value={type.id}>
                      {type.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="brandId" label="Thương hiệu">
                <Select allowClear>
                  <Select.Option value={null}>
                    Không có thương hiệu
                  </Select.Option>
                  {brands.map((brand) => (
                    <Select.Option key={brand.id} value={brand.id}>
                      {brand.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="price"
                label="Giá"
                rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} step={1000} />
              </Form.Item>

              <Form.Item
                name="quantity"
                label="Số lượng"
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
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

              <Form.Item
                label="Thông số kỹ thuật"
                required
                tooltip="Thêm các thông số kỹ thuật của sản phẩm"
              >
                <SpecificationsFormItem />
              </Form.Item>

              <ImageUploadFormItem />

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
                name="productTypeId"
                label="Loại sản phẩm"
                rules={[
                  { required: true, message: "Vui lòng chọn loại sản phẩm!" },
                ]}
              >
                <Select>
                  {productTypes.map((type) => (
                    <Select.Option key={type.id} value={type.id}>
                      {type.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="brandId" label="Thương hiệu">
                <Select allowClear>
                  <Select.Option value={null}>
                    Không có thương hiệu
                  </Select.Option>
                  {brands.map((brand) => (
                    <Select.Option key={brand.id} value={brand.id}>
                      {brand.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="price"
                label="Giá"
                rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} step={1000} />
              </Form.Item>

              <Form.Item
                name="quantity"
                label="Số lượng"
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
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

              <Form.Item
                label="Thông số kỹ thuật"
                required
                tooltip="Thêm các thông số kỹ thuật của sản phẩm"
              >
                <SpecificationsFormItem />
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
            okText="Xóa"
            okType="danger"
            cancelText="Hủy"
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
