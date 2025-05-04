import React from "react";
import { Card, Row, Col, Typography, Spin, Rate } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;
const { Title, Text } = Typography;

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rating?: number;
}

interface ProductListProps {
  products: Product[];
  loading?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  loading = false,
}) => {
  const navigate = useNavigate();

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Row gutter={[24, 24]} className="px-14 py-6">
      {products.map((product) => (
        <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
          <Card
            hoverable
            className="product-card cursor-pointer"
            onClick={() => handleProductClick(product.id)}
            cover={
              <div className="relative overflow-hidden" style={{ height: 250 }}>
                <img
                  alt={product.name}
                  src={product.image}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-blue-50">
                  <ShoppingCartOutlined className="text-xl text-blue-500" />
                </div>
              </div>
            }
          >
            <Meta
              title={
                <Title level={4} className="mb-2">
                  {product.name}
                </Title>
              }
              description={
                <div className="space-y-3">
                  <Text type="secondary" className="line-clamp-2">
                    {product.description}
                  </Text>
                  {product.rating && (
                    <Rate
                      disabled
                      defaultValue={product.rating}
                      className="text-yellow-500"
                    />
                  )}
                  <div className="flex justify-between items-center mt-4">
                    <Text strong className="text-xl text-blue-600">
                      ${product.price}
                    </Text>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle add to cart here
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              }
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProductList;
