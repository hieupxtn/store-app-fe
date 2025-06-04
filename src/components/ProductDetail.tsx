import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  InputNumber,
  Rate,
  Divider,
  Tabs,
  Spin,
  message,
  Layout,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { cartService } from "../services/cartService";
import { wishlistService } from "../services/wishlistService";

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

const PRODUCT_TYPE_MAP: Record<number, string> = {
  1: "Phone",
  2: "Laptop",
  3: "Tablet",
  4: "Smartwatch",
  5: "Headphone",
  6: "Camera",
};

const ProductDetail: React.FC<ProductDetailProps> = () => {
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetailProps["product"]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.getProductById(Number(id));
        setProduct(response.product);
        setIsInWishlist(wishlistService.isInWishlist(response.product.id));
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const cartItem = {
      id: product.id,
      name: product.productName,
      price: product.price,
      quantity: quantity,
      image: product.image,
    };
    cartService.addToCart(cartItem);
    message.success(`${product.productName} đã được thêm vào giỏ hàng!`);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isInWishlist) {
      wishlistService.removeFromWishlist(product.id);
      message.success("Đã xóa khỏi danh sách yêu thích!");
    } else {
      const wishlistItem = {
        id: product.id,
        name: product.productName,
        price: product.price,
        image: product.image,
        rating: product.rating,
      };
      wishlistService.addToWishlist(wishlistItem);
      message.success("Đã thêm vào danh sách yêu thích!");
    }
    setIsInWishlist(!isInWishlist);
  };

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
        <Text>Không tìm thấy sản phẩm</Text>
      </div>
    );
  }

  return (
    <Layout className="min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <img
              src={product.image}
              alt={product.productName}
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="space-y-6">
            <div>
              <Title level={2}>{product.productName}</Title>
              <div className="flex items-center gap-2 mb-4">
                <Rate
                  disabled
                  defaultValue={product.rating}
                  className="text-yellow-500"
                />
                <Text type="secondary">({product.rating} Đánh giá)</Text>
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
                <Text strong>Số lượng:</Text>
                <InputNumber
                  min={1}
                  max={Math.min(product.quantity, product.quantityLimit)}
                  value={quantity}
                  onChange={(value) => setQuantity(value || 1)}
                  className="w-24"
                />
                <Text type="secondary">{product.quantity} sản phẩm có sẵn</Text>
              </div>

              <div className="flex gap-4">
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ
                </Button>
                <Button
                  size="large"
                  icon={
                    isInWishlist ? (
                      <HeartFilled className="!text-red-500" />
                    ) : (
                      <HeartOutlined className="text-red-500" />
                    )
                  }
                  className="flex-1"
                  onClick={handleWishlistToggle}
                >
                  Yêu thích
                </Button>
                <Button
                  size="large"
                  icon={<ShareAltOutlined />}
                  className="flex-1"
                >
                  Chia sẻ
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
                    <Text>
                      {PRODUCT_TYPE_MAP[product.productType] || "Unknown"}
                    </Text>
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
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
