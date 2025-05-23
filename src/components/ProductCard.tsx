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
  productName: string;
  price: number;
  image: string;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    setIsInWishlist(wishlistService.isInWishlist(product.id));
  }, [product.id]);

  const handleAddToCart = async () => {
    if (isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      const cartItem = {
        id: product.id,
        name: product.productName,
        price: product.price,
        quantity: 1,
        image: product.image,
      };
      await cartService.addToCart(cartItem);
      message.success(`${product.productName} added to cart!`);
      // Trigger storage event to update cart count in AppHeader
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Failed to add item to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      wishlistService.removeFromWishlist(product.id);
      message.success("Removed from wishlist!");
    } else {
      const wishlistItem = {
        id: product.id,
        name: product.productName,
        price: product.price,
        image: product.image,
        rating: product.rating,
      };
      wishlistService.addToWishlist(wishlistItem);
      message.success("Added to wishlist!");
    }
    setIsInWishlist(!isInWishlist);
    // Trigger storage event to update wishlist count in AppHeader
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <Card
      hoverable
      className="w-full sm:w-64 border rounded-lg shadow-md"
      cover={
        <img
          alt={product.productName}
          src={product.image}
          className="h-48 object-cover rounded-t-lg"
        />
      }
    >
      <h3 className="text-lg font-semibold">{product.productName}</h3>
      <p className="text-gray-500">${product.price.toFixed(2)}</p>
      <div className="flex gap-2 mt-2">
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          className="flex-1 bg-blue-500 hover:bg-blue-600"
          onClick={handleAddToCart}
          loading={isAddingToCart}
        >
          Add to Cart
        </Button>
        <Button
          type={isInWishlist ? "primary" : "default"}
          danger={isInWishlist}
          icon={
            isInWishlist ? (
              <HeartFilled className="!text-red-500" />
            ) : (
              <HeartOutlined className="text-red-500" />
            )
          }
          onClick={handleWishlistToggle}
        >
          {isInWishlist ? "Remove" : "Wishlist"}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
