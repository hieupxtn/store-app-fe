import axiosInstance from '../config/axios';

// Example API endpoints
export const api = {
  // Auth endpoints
  login: (data: { email: string; password: string }) => 
    axiosInstance.post('/api/login', data)
      .then(response => response.data)
      .catch(error => {
        console.error('Login error:', error);
        throw error;
      }),
  
  // Product endpoints
  getProducts: () => 
    axiosInstance.get('/products')
      .then(response => response.data)
      .catch(error => {
        console.error('Get products error:', error);
        throw error;
      }),
  
  getProductById: (id: number) => 
    axiosInstance.get(`/api/get-product-detail/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Get product by id error:', error);
        throw error;
      }),
  
  // Cart endpoints
  getCart: () => 
    axiosInstance.get('/cart')
      .then(response => response.data)
      .catch(error => {
        console.error('Get cart error:', error);
        throw error;
      }),
  
  addToCart: (productId: number, quantity: number) => 
    axiosInstance.post('/cart', { productId, quantity })
      .then(response => response.data)
      .catch(error => {
        console.error('Add to cart error:', error);
        throw error;
      }),
  
  removeFromCart: (productId: number) => 
    axiosInstance.delete(`/cart/${productId}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Remove from cart error:', error);
        throw error;
      }),

  // Popular products endpoint
  getPopularProducts: () =>
    axiosInstance.get('/api/get-popular-products')
      .then(response => response.data)
      .catch(error => {
        console.error('Get popular products error:', error);
        throw error;
      }),

  // New products endpoint
  getNewProducts: () =>
    axiosInstance.get('/api/get-new-products')
      .then(response => response.data)
      .catch(error => {
        console.error('Get new products error:', error);
        throw error;
      }),

  // Featured products endpoint
  getFeaturedProducts: () =>
    axiosInstance.get('/api/get-featured-products')
      .then(response => response.data)
      .catch(error => {
        console.error('Get featured products error:', error);
        throw error;
      }),
}; 