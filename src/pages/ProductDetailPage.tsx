import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Row, Col, Rate, Button, message, Spin } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { api } from "../services/api";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";
import { cartService } from "../services/cartService";
import { wishlistService } from "../services/wishlistService";

interface ProductDetail {
  id: number;
  productCode: string;
  productName: string;
  price: number;
  quantity: number;
  rating: number;
  description: string;
  image: string;
  createdAt: string;
  type: string | null;
  averageRating: number;
  totalReviews: number;
}

interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
  User: {
    firstName: string;
    lastName: string;
  };
}

interface RelatedProduct {
  id: number;
  productName: string;
  price: number;
  rating: number;
  image: string;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await api.getProductById(Number(id));
        if (response.errCode === 0 && response.data) {
          setProduct(response.data.product);
          setReviews(response.data.reviews || []);
          setRelatedProducts(response.data.relatedProducts || []);
          setIsInWishlist(
            wishlistService.isInWishlist(response.data.product.id)
          );
        } else {
          message.error(response.message || "Failed to fetch product details");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        message.error(
          "Failed to fetch product details. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    }
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
    message.success(`${product.productName} added to cart!`);
    // Dispatch storage event to update cart count in AppHeader
    window.dispatchEvent(new Event("storage"));
  };

  const handleWishlistToggle = () => {
    if (!product) return;
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
    // Dispatch storage event to update wishlist count in AppHeader
    window.dispatchEvent(new Event("storage"));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1>Product not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Row gutter={[24, 24]}>
          {/* Product Image */}
          <Col xs={24} md={12}>
            <Card className="h-full">
              <img
                src={product.image}
                alt={product.productName}
                className="w-full h-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/400x400?text=No+Image";
                }}
              />
            </Card>
          </Col>

          {/* Product Info */}
          <Col xs={24} md={12}>
            <Card className="h-full">
              <h1 className="text-2xl font-bold mb-4">{product.productName}</h1>
              <div className="mb-4">
                <span className="text-3xl font-bold text-red-600">
                  ${product.price.toLocaleString()}
                </span>
              </div>
              <div className="mb-4">
                <Rate disabled defaultValue={product.rating} />
                <span className="ml-2 text-gray-500">
                  ({product.totalReviews} reviews)
                </span>
              </div>
              <div className="mb-4">
                <p className="text-gray-600">{product.description}</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-600">
                  <span className="font-semibold">Product Code:</span>{" "}
                  {product.productCode}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Availability:</span>{" "}
                  {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                </p>
              </div>
              <div className="mb-4">
                <span className="font-semibold mr-2">Quantity:</span>
                <input
                  type="number"
                  min={1}
                  max={product.quantity}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(
                        1,
                        Math.min(
                          product.quantity,
                          parseInt(e.target.value) || 1
                        )
                      )
                    )
                  }
                  className="w-20 p-2 border rounded"
                />
              </div>
              <div className="flex gap-4">
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  size="large"
                  disabled={product.quantity <= 0}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button
                  icon={isInWishlist ? <HeartFilled /> : <HeartOutlined />}
                  size="large"
                  onClick={handleWishlistToggle}
                >
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Reviews Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Card key={review.id} className="mb-4">
                <div className="flex items-center mb-2">
                  <Rate disabled defaultValue={review.rating} />
                  <span className="ml-2 font-semibold">
                    {review.User.firstName} {review.User.lastName}
                  </span>
                  <span className="ml-2 text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p>{review.comment}</p>
              </Card>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Related Products</h2>
          <Row gutter={[16, 16]}>
            {relatedProducts.map((relatedProduct) => (
              <Col xs={12} sm={8} md={6} key={relatedProduct.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={relatedProduct.productName}
                      src={relatedProduct.image}
                      className="h-48 object-contain"
                    />
                  }
                >
                  <Card.Meta
                    title={relatedProduct.productName}
                    description={
                      <div>
                        <div className="text-red-600 font-bold">
                          ${relatedProduct.price.toLocaleString()}
                        </div>
                        <Rate disabled defaultValue={relatedProduct.rating} />
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </main>
      <AppFooter />
    </div>
  );
};

export default ProductDetailPage;
