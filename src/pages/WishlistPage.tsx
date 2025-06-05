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
  const [isAddingToCart, setIsAddingToCart] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    const savedWishlist = wishlistService.getWishlist();
    setWishlist(savedWishlist);
  }, []);

  const handleRemoveFromWishlist = (id: number) => {
    const updatedWishlist = wishlistService.removeFromWishlist(id);
    setWishlist(updatedWishlist);
    message.success("Đã xóa khỏi danh sách yêu thích!");
  };

  const handleAddToCart = async (item: WishlistItem) => {
    if (isAddingToCart[item.id]) return;

    setIsAddingToCart((prev) => ({ ...prev, [item.id]: true }));
    try {
      const cartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
      };
      await cartService.addToCart(cartItem);
      message.success(`${item.name} đã được thêm vào giỏ hàng!`);
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Lỗi thêm vào giỏ hàng:", error);
      message.error("Không thể thêm sản phẩm vào giỏ hàng");
    } finally {
      setIsAddingToCart((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  return (
    <Layout className="min-h-screen flex flex-col">
      <AppHeader />
      <Content className="flex-grow p-6 bg-gray-100 h-full">
        <div className="max-w-6xl mx-auto bg-white p-6 shadow-md rounded-lg min-h-[675px]">
          <Title level={2} className="mb-6">
            Danh sách yêu thích
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
                        {item.price.toLocaleString()} VND
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
                      <div className="flex justify-between mt-auto pt-4 gap-2">
                        <Button
                          type="primary"
                          icon={<ShoppingCartOutlined />}
                          onClick={() => handleAddToCart(item)}
                          className="w-[150px]"
                        >
                          Thêm vào giỏ
                        </Button>
                        <Button
                          danger
                          icon={<HeartOutlined className="text-red-500" />}
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="w-[100px]"
                        >
                          Xóa
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
                Danh sách yêu thích của bạn đang trống
              </Title>
              <Text type="secondary">
                Thêm sản phẩm vào danh sách yêu thích để xem chúng ở đây
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
