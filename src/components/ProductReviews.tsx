import React, { useEffect, useState } from "react";
import { List, Rate, Typography, Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { reviewService } from "../services/reviewService";
import { Review } from "../services/api";

const { Text, Title } = Typography;

interface ProductReviewsProps {
  productId: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getProductReviews(productId);
      setReviews(response.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Title level={3}>Đánh giá sản phẩm</Title>
      <List
        loading={loading}
        itemLayout="vertical"
        dataSource={reviews}
        renderItem={(review) => (
          <List.Item>
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <Space>
                <Avatar icon={<UserOutlined />} />
                <Text strong>Người dùng #{review.userId}</Text>
                <Rate disabled defaultValue={review.rating} />
              </Space>
              <Text>{review.comment}</Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {new Date(review.createdAt).toLocaleDateString("vi-VN")}
              </Text>
            </Space>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ProductReviews;
