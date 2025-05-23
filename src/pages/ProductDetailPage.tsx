import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Rate,
  Button,
  message,
  Spin,
  List,
  Avatar,
  Typography,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  UserOutlined,
} from "@ant-design/icons";
import { api } from "../services/api";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";
import { cartService } from "../services/cartService";
import { wishlistService } from "../services/wishlistService";

interface ProductDetail {
  id: number;
  productName: string;
  price: number;
  image: string;
  description: string;
  specifications: string;
  rating: number;
  quantity: number;
  ProductType: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  Brand: {
    id: number;
    name: string;
    description: string;
    logo: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface RelatedProduct {
  id: number;
  productCode: string;
  productName: string;
  productTypeId: number;
  brandId: number;
  price: number;
  quantity: number;
  rating: number;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  ProductType: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  Brand: {
    id: number;
    name: string;
    description: string;
    logo: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const [productResponse, relatedResponse, reviewsResponse] =
          await Promise.all([
            api.getProductById(Number(id)),
            api.getRelatedProducts(Number(id)),
            api.getProductReviews(Number(id)),
          ]);

        if (productResponse.product) {
          setProduct(productResponse.product);
          if (relatedResponse.relatedProducts) {
            setRelatedProducts(relatedResponse.relatedProducts);
          }
          if (reviewsResponse.reviews) {
            setReviews(reviewsResponse.reviews);
          }
          setIsInWishlist(
            wishlistService.isInWishlist(productResponse.product.id)
          );
        } else {
          message.error("Failed to fetch product details");
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

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      const cartItem = {
        id: product.id,
        name: product.productName,
        price: product.price,
        quantity: quantity,
        image: product.image,
      };
      await cartService.addToCart(cartItem);
      message.success(`${product.productName} added to cart!`);
      // Dispatch storage event to update cart count in AppHeader
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Failed to add item to cart");
    }
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

  const handleRelatedProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
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
                  ({reviews.length} reviews)
                </span>
              </div>
              <div className="mb-4">
                <p className="text-gray-600">{product.description}</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-600">
                  <span className="font-semibold">Brand:</span>{" "}
                  {product.Brand.name}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Category:</span>{" "}
                  {product.ProductType.name}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Availability:</span>{" "}
                  {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                </p>
              </div>
              <div className="mb-4 mt-10">
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
              <div className="flex gap-6 mt-10">
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
                  icon={
                    isInWishlist ? (
                      <HeartFilled className="!text-red-500" />
                    ) : (
                      <HeartOutlined className="text-red-500" />
                    )
                  }
                  size="large"
                  onClick={handleWishlistToggle}
                >
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Specifications Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Specifications</h2>
          <Card>
            <Row gutter={[16, 16]}>
              {Object.entries(JSON.parse(product.specifications)).map(
                ([key, value]) => (
                  <Col xs={24} sm={12} key={key}>
                    <div className="mb-2">
                      <span className="font-semibold">{key}:</span>{" "}
                      <span className="text-gray-600">{value as string}</span>
                    </div>
                  </Col>
                )
              )}
            </Row>
          </Card>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
          <List
            itemLayout="horizontal"
            dataSource={reviews}
            renderItem={(review) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    <div className="flex items-center">
                      <Rate disabled defaultValue={review.rating} />
                      <span className="ml-2 text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  }
                  description={
                    <Typography.Paragraph>
                      {review.comment}
                    </Typography.Paragraph>
                  }
                />
              </List.Item>
            )}
          />
        </div>

        {/* Related Products Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Related Products</h2>
          <Row gutter={[16, 16]}>
            {relatedProducts.map((relatedProduct) => (
              <Col xs={12} sm={8} md={6} key={relatedProduct.id}>
                <Card
                  hoverable
                  onClick={() => handleRelatedProductClick(relatedProduct.id)}
                  className="cursor-pointer"
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
                        <div className="flex items-center gap-2">
                          <Rate disabled defaultValue={relatedProduct.rating} />
                          <span className="text-gray-500">
                            ({relatedProduct.ProductType.name})
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className="text-gray-500">
                            {relatedProduct.Brand.name}
                          </span>
                        </div>
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
