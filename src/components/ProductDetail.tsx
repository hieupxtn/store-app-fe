import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Typography,
  Button,
  InputNumber,
  Rate,
  Divider,
  Tabs,
  Spin,
  message,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface ProductDetailProps {
  product?: {
    id: number;
    productCode: string;
    productName: string;
    productType: number;
    price: number;
    quantity: number;
    quantityLimit: number;
    rating: number;
    description: string;
    image: string;
    createdAt: string;
    updatedAt: string;
  };
}

const ProductDetail: React.FC<ProductDetailProps> = () => {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<ProductDetailProps["product"]>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await api.getProductById(Number(id));
        setProduct(response.data);
      } catch (error) {
        message.error("Failed to fetch product details");
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <Text>Product not found</Text>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Row gutter={[32, 32]}>
        {/* Product Image */}
        <Col xs={24} md={12}>
          <div className="sticky top-8">
            <div className="mb-4 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.productName}
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </Col>

        {/* Product Information */}
        <Col xs={24} md={12}>
          <div className="space-y-6">
            <div>
              <Title level={2}>{product.productName}</Title>
              <div className="flex items-center gap-2 mb-4">
                <Rate
                  disabled
                  defaultValue={product.rating}
                  className="text-yellow-500"
                />
                <Text type="secondary">({product.rating} rating)</Text>
              </div>
              <Title level={3} className="text-blue-600 mb-4">
                {product.price.toLocaleString("vi-VN")} VND
              </Title>
              <Paragraph className="text-gray-600">
                {product.description}
              </Paragraph>
            </div>

            <Divider />

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Text strong>Quantity:</Text>
                <InputNumber
                  min={1}
                  max={Math.min(product.quantity, product.quantityLimit)}
                  value={quantity}
                  onChange={(value) => setQuantity(value || 1)}
                  className="w-24"
                />
                <Text type="secondary">{product.quantity} available</Text>
              </div>

              <div className="flex gap-4">
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  className="flex-1"
                >
                  Add to Cart
                </Button>
                <Button
                  size="large"
                  icon={<HeartOutlined />}
                  className="flex-1"
                >
                  Wishlist
                </Button>
                <Button
                  size="large"
                  icon={<ShareAltOutlined />}
                  className="flex-1"
                >
                  Share
                </Button>
              </div>
            </div>

            <Divider />

            <Tabs defaultActiveKey="1">
              <TabPane tab="Product Information" key="1">
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <Text strong>Product Code:</Text>
                    <Text>{product.productCode}</Text>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <Text strong>Product Type:</Text>
                    <Text>{product.productType}</Text>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <Text strong>Created At:</Text>
                    <Text>
                      {new Date(product.createdAt).toLocaleDateString()}
                    </Text>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <Text strong>Updated At:</Text>
                    <Text>
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </Text>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetail;
