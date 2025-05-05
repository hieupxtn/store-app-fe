import React, { useState, useEffect } from "react";
import { Card, Button, message } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { cartService } from "../services/cartService";
import { wishlistService } from "../services/wishlistService";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    setIsInWishlist(wishlistService.isInWishlist(product.id));
  }, [product.id]);

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    };
    cartService.addToCart(cartItem);
    message.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      wishlistService.removeFromWishlist(product.id);
      message.success("Removed from wishlist!");
    } else {
      const wishlistItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        rating: product.rating,
      };
      wishlistService.addToWishlist(wishlistItem);
      message.success("Added to wishlist!");
    }
    setIsInWishlist(!isInWishlist);
  };

  return (
    <Card
      hoverable
      className="w-full sm:w-64 border rounded-lg shadow-md"
      cover={
        <img
          alt={product.name}
          src={product.image}
          className="h-48 object-cover rounded-t-lg"
        />
      }
    >
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-500">${product.price.toFixed(2)}</p>
      <div className="flex gap-2 mt-2">
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          className="flex-1 bg-blue-500 hover:bg-blue-600"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
        <Button
          type={isInWishlist ? "primary" : "default"}
          danger={isInWishlist}
          icon={isInWishlist ? <HeartFilled /> : <HeartOutlined />}
          onClick={handleWishlistToggle}
        />
      </div>
    </Card>
  );
};

export default ProductCard;
