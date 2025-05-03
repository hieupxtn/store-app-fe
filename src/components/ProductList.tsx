import React from "react";
import { Card, Row, Col, Typography } from "antd";

const { Meta } = Card;
const { Title, Text } = Typography;

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <Row gutter={[16, 16]} style={{ padding: "24px" }}>
      {products.map((product) => (
        <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
          <Card
            hoverable
            cover={
              <img
                alt={product.name}
                src={product.image}
                style={{ height: 200, objectFit: "cover" }}
              />
            }
          >
            <Meta
              title={<Title level={5}>{product.name}</Title>}
              description={
                <>
                  <Text type="secondary">{product.description}</Text>
                  <div style={{ marginTop: 16 }}>
                    <Text strong style={{ fontSize: "18px", color: "#1890ff" }}>
                      ${product.price}
                    </Text>
                  </div>
                </>
              }
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProductList;
