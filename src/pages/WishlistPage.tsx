import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Button,
  Row,
  Col,
  Typography,
  message,
  Rate,
} from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";
import { wishlistService } from "../services/wishlistService";
import { cartService } from "../services/cartService";

const { Title, Text } = Typography;

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  rating?: number;
}

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const savedWishlist = wishlistService.getWishlist();
    setWishlist(savedWishlist);
  }, []);

  const handleRemoveFromWishlist = (id: number) => {
    const updatedWishlist = wishlistService.removeFromWishlist(id);
    setWishlist(updatedWishlist);
    message.success("Removed from wishlist!");
  };

  const handleAddToCart = (item: WishlistItem) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    };
    cartService.addToCart(cartItem);
    message.success(`${item.name} added to cart!`);
  };

  return (
    <Layout className="min-h-screen flex flex-col">
      <AppHeader />
      <Content className="flex-grow p-6 bg-gray-100 h-full">
        <div className="max-w-6xl mx-auto bg-white p-6 shadow-md rounded-lg min-h-[703px]">
          <Title level={2} className="mb-6">
            My Wishlist
          </Title>

          {wishlist.length > 0 ? (
            <Row gutter={[24, 24]}>
              {wishlist.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                  <Card
                    hoverable
                    className="h-full"
                    cover={
                      <img
                        alt={item.name}
                        src={item.image}
                        className="h-48 object-cover"
                      />
                    }
                  >
                    <div className="flex flex-col h-full">
                      <Title
                        level={4}
                        className="mb-2 line-clamp-2 min-h-[60px]"
                      >
                        {item.name}
                      </Title>
                      <Text strong className="text-xl text-blue-600 mb-4">
                        ${item.price.toFixed(2)}
                      </Text>
                      {item.rating && (
                        <div className="mb-4">
                          <Rate
                            disabled
                            defaultValue={item.rating}
                            className="text-sm"
                          />
                        </div>
                      )}
                      <div className="flex justify-between mt-auto pt-4">
                        <Button
                          type="primary"
                          icon={<ShoppingCartOutlined />}
                          onClick={() => handleAddToCart(item)}
                          className="w-[100px]"
                        >
                          Add to Cart
                        </Button>
                        <Button
                          danger
                          icon={<HeartOutlined className="text-red-500" />}
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="w-[100px]"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-12">
              <HeartOutlined className="text-6xl text-red-500 mb-4" />
              <Title level={3} className="text-gray-500">
                Your wishlist is empty
              </Title>
              <Text type="secondary">
                Add some products to your wishlist to see them here
              </Text>
            </div>
          )}
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default WishlistPage;
