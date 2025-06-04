import React, { useState } from "react";
import { Form, Input, Rate, Button, message } from "antd";
import { reviewService } from "../services/reviewService";

const { TextArea } = Input;

interface ReviewFormProps {
  productId: number;
  onReviewSubmitted?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  onReviewSubmitted,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: { rating: number; comment: string }) => {
    try {
      setSubmitting(true);
      const userData = JSON.parse(localStorage.getItem("user") || "{}");

      await reviewService.createReview({
        userId: userData.id,
        productId,
        rating: values.rating,
        comment: values.comment,
      });

      message.success("Đánh giá của bạn đã được gửi thành công!");
      form.resetFields();
      onReviewSubmitted?.();
    } catch (error) {
      console.error("Error submitting review:", error);
      message.error("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      className="max-w-2xl mx-auto p-4"
    >
      <Form.Item
        name="rating"
        label="Đánh giá của bạn"
        rules={[{ required: true, message: "Vui lòng chọn số sao đánh giá!" }]}
      >
        <Rate allowHalf />
      </Form.Item>

      <Form.Item
        name="comment"
        label="Nhận xét của bạn"
        rules={[{ required: true, message: "Vui lòng nhập nhận xét!" }]}
      >
        <TextArea
          rows={4}
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={submitting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Gửi đánh giá
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ReviewForm;
