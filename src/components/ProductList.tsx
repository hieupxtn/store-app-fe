import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Rate, Spin, message } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { cartService } from "../services/cartService";
import { wishlistService } from "../services/wishlistService";

const { Meta } = Card;
const { Title, Text } = Typography;

interface Product {
  id: number;
  productName: string;
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
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<{ [key: number]: number }>({});
  const [isAddingToCart, setIsAddingToCart] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    const updateWishlist = () => {
      const wishlist = wishlistService.getWishlist();
      setWishlistItems(wishlist.map((item) => item.id));
    };

    updateWishlist();

    const handleStorageChange = () => {
      updateWishlist();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const updateCart = async () => {
      try {
        const cart = await cartService.getCart();
        const items: { [key: number]: number } = {};
        cart.forEach((item) => {
          items[item.id] = item.quantity;
        });
        setCartItems(items);
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    };

    updateCart();
    const handleStorageChange = () => {
      updateCart();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (isAddingToCart[product.id]) return;

    setIsAddingToCart((prev) => ({ ...prev, [product.id]: true }));
    try {
      const cartItem = {
        id: product.id,
        name: product.productName,
        price: product.price,
        image: product.image,
        quantity: 1,
      };
      const updatedCart = await cartService.addToCart(cartItem);
      message.success("Đã thêm vào giỏ hàng!");
      const items: { [key: number]: number } = {};
      updatedCart.forEach((item) => {
        items[item.id] = item.quantity;
      });
      setCartItems(items);
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Lỗi thêm vào giỏ hàng:", error);
      message.error("Không thể thêm sản phẩm vào giỏ hàng");
    } finally {
      setIsAddingToCart((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (wishlistService.isInWishlist(product.id)) {
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
    const updatedWishlist = wishlistService.getWishlist();
    setWishlistItems(updatedWishlist.map((item) => item.id));
    window.dispatchEvent(new Event("storage"));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spin size="large" />
      </div>
    );
  }
  console.log("products", products);
  return (
    <Row gutter={[24, 24]} className="px-14 py-6">
      {products.map((product) => (
        <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
          <Card
            hoverable
            className="product-card cursor-pointer h-full flex flex-col"
            onClick={() => handleProductClick(product.id)}
            cover={
              <div className="relative overflow-hidden" style={{ height: 250 }}>
                <img
                  alt={product.productName}
                  src={product.image}
                  className="w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <div
                    className="bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-blue-50"
                    onClick={(e) => handleWishlistToggle(e, product)}
                  >
                    {wishlistItems.includes(product.id) ? (
                      <HeartFilled className="text-xl !text-red-500" />
                    ) : (
                      <HeartOutlined className="text-xl text-red-500" />
                    )}
                  </div>
                  <div
                    className="bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-blue-50"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    <ShoppingCartOutlined className="text-xl text-blue-500" />
                    {cartItems[product.id] > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {cartItems[product.id]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            }
          >
            <Meta
              title={
                <Title level={4} className="mb-2 line-clamp-2 min-h-[48px]">
                  {product.productName}
                </Title>
              }
              description={
                <div className="space-y-3 flex flex-col h-full">
                  <Text type="secondary" className="line-clamp-2 min-h-[40px]">
                    {product.description}
                  </Text>
                  {product.rating && (
                    <Rate
                      disabled
                      defaultValue={product.rating}
                      className="text-yellow-500"
                    />
                  )}
                  <div className="flex justify-between items-center mt-auto pt-2">
                    <Text strong className="text-xl text-blue-600">
                      {product.price.toLocaleString()} VND
                    </Text>
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      Thêm vào giỏ hàng
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
