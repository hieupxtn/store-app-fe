import React, { useState, useEffect } from "react";
import { Typography, Button, Tag, Rate, Spin, message } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  HeartOutlined,
  HeartFilled,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import styles from "./NewProductsCarousel.module.css";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { wishlistService } from "../services/wishlistService";
import { cartService } from "../services/cartService";

const PRODUCTS_PER_PAGE = 6;

// Định nghĩa lại interface Product
interface Product {
  id: number;
  name: string | null;
  image: string | null;
  price: number | null;
  oldPrice?: number;
  badge?: string;
  discount?: string;
  play?: boolean;
  rating: number | null;
  reviews?: number;
  productCode: string | null;
  productType: number | null;
  quantity: number | null;
  quantityLimit: number;
  description: string | null;
}

const BestSeller: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<{ [key: number]: number }>({});
  const canPrev = startIndex > 0;
  const canNext = startIndex + PRODUCTS_PER_PAGE < products.length;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.getBestSellers();
        const mappedProducts = (response.products || []).map(
          (product: {
            id: number;
            productCode: string | null;
            productName: string | null;
            productTypeId: number | null;
            price: number | null;
            quantity: number | null;
            quantityLimit?: number | null;
            rating: number | null;
            description: string | null;
            image: string | null;
            createdAt: string;
            updatedAt: string;
            ProductType?: { name: string } | null;
          }) => ({
            id: product.id,
            name: product.productName,
            image: product.image,
            price: product.price,
            rating: product.rating,
            badge:
              product.ProductType?.name ||
              (product.productTypeId === 1
                ? "Smartphone"
                : product.productTypeId === 2
                ? "Laptop"
                : product.productTypeId === 3
                ? "Accessories"
                : "Tablet"),
            reviews: Math.floor(Math.random() * 100) + 1,
            productCode: product.productCode,
            productType: product.productTypeId,
            quantity: product.quantity,
            quantityLimit: product.quantityLimit ?? 0,
            description: product.description,
          })
        );
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to fetch popular products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Listen for wishlist changes
  useEffect(() => {
    const updateWishlist = () => {
      const wishlist = wishlistService.getWishlist();
      setWishlistItems(wishlist.map((item) => item.id));
    };

    updateWishlist();
    window.addEventListener("storage", updateWishlist);
    return () => window.removeEventListener("storage", updateWishlist);
  }, []);

  // Listen for cart changes
  useEffect(() => {
    const updateCart = () => {
      const cart = cartService.getCart();
      const items: { [key: number]: number } = {};
      cart.forEach((item) => {
        items[item.id] = item.quantity;
      });
      setCartItems(items);
    };

    updateCart();
    window.addEventListener("storage", updateCart);
    return () => window.removeEventListener("storage", updateCart);
  }, []);

  const handlePrev = () => {
    if (canPrev) setStartIndex(startIndex - 1);
  };

  const handleNext = () => {
    if (canNext) setStartIndex(startIndex + 1);
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleWishlistToggle = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (wishlistService.isInWishlist(product.id)) {
      wishlistService.removeFromWishlist(product.id);
      message.success("Removed from wishlist!");
    } else {
      const wishlistItem = {
        id: product.id,
        name: product.name || "",
        price: product.price || 0,
        image: product.image || "",
        rating: product.rating || 0,
      };
      wishlistService.addToWishlist(wishlistItem);
      message.success("Added to wishlist!");
    }
    const updatedWishlist = wishlistService.getWishlist();
    setWishlistItems(updatedWishlist.map((item) => item.id));
    window.dispatchEvent(new Event("storage"));
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const cartItem = {
      id: product.id,
      name: product.name || "",
      price: product.price || 0,
      image: product.image || "",
      quantity: 1,
    };
    cartService.addToCart(cartItem);
    message.success("Added to cart!");
    // Update cart items state
    const updatedCart = cartService.getCart();
    const items: { [key: number]: number } = {};
    updatedCart.forEach((item) => {
      items[item.id] = item.quantity;
    });
    setCartItems(items);
    // Trigger storage event to update other components
    window.dispatchEvent(new Event("storage"));
  };

  const visibleProducts =
    loading || !Array.isArray(products)
      ? []
      : products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  if (loading) {
    return (
      <div className="w-full mt-10 flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full mt-10">
      <div className="flex items-center mb-4 px-14">
        <Typography.Title
          level={2}
          className="!mb-0 !mr-2 !text-[#0a174e] font-bold"
        >
          Best Seller
        </Typography.Title>
        <Button
          type="link"
          className="!text-gray-500 flex items-center"
          onClick={() => navigate("/products?sort=best-seller")}
        >
          See More <span>&rarr;</span>
        </Button>
      </div>
      <div className="w-full px-14 relative">
        {canPrev && (
          <button
            className={`${styles["slick-arrow"]} ${styles["slick-prev"]}`}
            onClick={handlePrev}
            disabled={!canPrev}
            style={{
              position: "absolute",
              left: 2,
              top: "40%",
              transform: "translateY(-50%)",
              opacity: canPrev ? 1 : 0.3,
              pointerEvents: canPrev ? "auto" : "none",
            }}
          >
            <LeftOutlined className="text-2xl text-[#0a174e]" />
          </button>
        )}
        <div className="flex justify-between items-stretch">
          {visibleProducts.map((p) => (
            <div
              key={p.id}
              className="px-2 flex-1 min-w-0 max-w-[260px] cursor-pointer"
              onClick={() => handleProductClick(p.id)}
            >
              <div className="flex flex-col items-start">
                <div
                  style={{ minHeight: 32 }}
                  className="w-full flex items-center"
                >
                  {p.badge ? (
                    <Tag
                      color="#2563eb"
                      className="mb-2 text-xs font-semibold px-2 py-1 rounded"
                    >
                      {p.badge}
                    </Tag>
                  ) : (
                    <div className="mb-2" style={{ height: 24 }}></div>
                  )}
                </div>
                <div className="relative w-full flex justify-center">
                  <img
                    src={p.image || ""}
                    alt={p.name || ""}
                    className="rounded-lg object-contain w-full h-[150px] bg-white"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <div
                      className="bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-blue-50"
                      onClick={(e) => handleWishlistToggle(e, p)}
                    >
                      {wishlistItems.includes(p.id) ? (
                        <HeartFilled className="text-xl !text-red-500" />
                      ) : (
                        <HeartOutlined className="text-xl text-red-500" />
                      )}
                    </div>
                    <div
                      className="bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-blue-50"
                      onClick={(e) => handleAddToCart(e, p)}
                    >
                      <ShoppingCartOutlined className="text-xl text-blue-500" />
                      {cartItems[p.id] > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {cartItems[p.id]}
                        </span>
                      )}
                    </div>
                  </div>
                  {p.play && (
                    <span className="absolute bottom-2 right-2 bg-white rounded-full shadow p-1 cursor-pointer">
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="12" fill="#2563eb" />
                        <polygon points="10,8 16,12 10,16" fill="#fff" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="mt-2 font-semibold text-base line-clamp-2 min-h-[50px]">
                  {p.name}
                </div>
                {p.rating && (
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <Rate
                      disabled
                      defaultValue={p.rating}
                      count={5}
                      style={{ fontSize: 12 }}
                    />
                    <span>({p.reviews})</span>
                  </div>
                )}
                {p.discount && (
                  <Tag color="#e53e3e" className="mt-1">
                    {p.discount}
                  </Tag>
                )}
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-2xl font-bold text-[#222]">
                    ${p.price ? p.price.toLocaleString() : 0}
                  </span>
                  {p.oldPrice && (
                    <span className="text-sm line-through text-gray-400">
                      ${p.oldPrice ? p.oldPrice.toLocaleString() : 0}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {canNext && (
          <button
            className={`${styles["slick-arrow"]} ${styles["slick-next"]}`}
            onClick={handleNext}
            disabled={!canNext}
            style={{
              position: "absolute",
              right: 2,
              top: "40%",
              transform: "translateY(-50%)",
              opacity: canNext ? 1 : 0.3,
              pointerEvents: canNext ? "auto" : "none",
            }}
          >
            <RightOutlined className="text-2xl text-[#0a174e]" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BestSeller;
