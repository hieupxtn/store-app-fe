import { api } from "./api";
import { ReviewData } from "./api";

export const reviewService = {
  createReview: (reviewData: ReviewData) => {
    return api.createReview(reviewData);
  },

  getProductReviews: (productId: number) => {
    return api.getProductReviews(productId);
  },

}; 
 