/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '../config/axios';

interface LoginResponse {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    gender: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    // ... các field khác nếu cần
  };
  token: string;
}

interface RegisterResponse {
  user: {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    gender: boolean;
    role: string;
    updatedAt: string;
    createdAt: string;
  };
}

interface LogoutResponse {
  errCode: number;
  message: string;
}

export interface NormalUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  typeRole: string;
  keyRole: string;
  createdAt: string;
  updatedAt: string;
}

export interface NormalUsersResponse {
  errCode: number;
  message: string;
  data: NormalUser[];
}

export interface AdminProduct {
  id: number;
  productCode: string;
  productName: string;
  productType: number;
  price: number;
  quantity: number;
  quantityLimit: number;
  rating: number;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminProductsResponse {
  errCode: number;
  message: string;
  data: {
    products: AdminProduct[];
    pagination: Pagination;
  };
}

export interface AdminProductDetailResponse {
  errCode: number;
  message: string;
  data: AdminProduct;
}

export interface UpdateProductRequest {
  productName: string;
  productType: number;
  price: number;
  quantity: number;
  quantityLimit: number;
  description: string;
  image: string;
}

export interface UpdateProductResponse {
  errCode: number;
  message: string;
  data: AdminProduct;
}

export interface DeleteProductResponse {
  errCode: number;
  message: string;
}

export interface CreateProductRequest {
  productName: string;
  productType: number;
  price: number;
  quantity: number;
  quantityLimit: number;
  description: string;
  image: string;
}

export interface CreateProductResponse {
  errCode: number;
  message: string;
  data: AdminProduct;
}

export interface DashboardOrder {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  User: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface DashboardData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalReviews: number;
  totalProductTypes: number;
  recentOrders: DashboardOrder[];
}

export interface DashboardResponse {
  errCode: number;
  message: string;
  data: DashboardData;
}

export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string | null;
  gender: boolean | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  users: User[];
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  gender: boolean | null;
  address: string | null;
}

export interface DeleteUserResponse {
  message: string;
}

export interface Product {
  id: number;
  productCode: string;
  productName: string;
  productType: number;
  price: number;
  quantity: number;
  quantityLimit: number;
  rating: number;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
}

export interface ProductResponse {
  product: Product;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  OrderItems: OrderItem[];
}

export interface OrdersResponse {
  orders: Order[];
}

export interface OrderResponse {
  order: Order;
}

export interface ProductType {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductTypeResponse {
  types: ProductType[];
}

export interface SingleProductTypeResponse {
  type: ProductType;
}

export interface Brand {
  id: number;
  name: string;
  description: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
  products: any[];
}

export type BrandsResponse = Brand[];

export interface RelatedProductsResponse {
  relatedProducts: RelatedProduct[];
}

export interface RelatedProduct {
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

export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
}

// Example API endpoints
export const api = {
  // Auth endpoints
  login: async (data: { email: string; password: string }) => {
    const response = await axiosInstance.post<LoginResponse>('/api/login', data);
    return response.data;
  },

  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    const response = await axiosInstance.post<RegisterResponse>('/api/register', data);
    return response.data;
  },
  
  logout: async () => {
    const response = await axiosInstance.post<LogoutResponse>('/api/logout');
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosInstance.post<LoginResponse>('/auth/refresh-token');
    return response.data;
  },

  updateUser: async (userId: number, data: UpdateUserRequest): Promise<{ user: User }> => {
    try {
      const response = await axiosInstance.put(`/api/users/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
  
  // Product endpoints
  getProducts: (params?: URLSearchParams) => 
    axiosInstance.get(`/api/products${params ? `?${params.toString()}` : ''}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Get products error:', error);
        throw error;
      }),
  
  getProductById: (id: number) => 
    axiosInstance.get(`/api/products/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Get product by id error:', error);
        throw error;
      }),
  
  // Cart endpoints
  getCart: () =>
    axiosInstance.get('/api/cart')
      .then(response => response.data)
      .catch(error => {
        console.error('Get cart error:', error);
        throw error;
      }),
  
  addToCart: (productId: number, quantity: number) => 
    axiosInstance.post('/api/cart', { productId, quantity })
      .then(response => response.data)
      .catch(error => {
        console.error('Add to cart error:', error);
        throw error;
      }),
  
  updateCartItem: (itemId: number, quantity: number) =>
    axiosInstance.put(`/api/cart/${itemId}`, { quantity })
      .then(response => response.data)
      .catch(error => {
        console.error('Update cart item error:', error);
        throw error;
      }),
  
  removeFromCart: (productId: number) => 
    axiosInstance.delete(`/api/cart/${productId}`)
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
    axiosInstance.get('/api/new-products')
      .then(response => response.data)
      .catch(error => {
        console.error('Get new products error:', error);
        throw error;
      }),

  // Featured products endpoint
  getFeaturedProducts: () =>
    axiosInstance.get('/api/featured-products')
      .then(response => response.data.products)
      .catch(error => {
        console.error('Get featured products error:', error);
        throw error;
      }),

  getNormalUsers: async (): Promise<NormalUsersResponse> => {
    try {
      const response = await axiosInstance.get('/api/get-normal-users');
      return response.data;
    } catch (error) {
      console.error('Error fetching normal users:', error);
      throw error;
    }
  },

  getAdminProducts: async (): Promise<AdminProductsResponse> => {
    try {
      const response = await axiosInstance.get('/api/admin/get-all-products');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin products:', error);
      throw error;
    }
  },

  getAdminProductById: async (id: number): Promise<AdminProductDetailResponse> => {
    try {
      const response = await axiosInstance.get(`/api/admin/get-product/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  updateAdminProduct: async (id: number, data: UpdateProductRequest): Promise<UpdateProductResponse> => {
    try {
      const response = await axiosInstance.put(`/api/admin/update-product/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteAdminProduct: async (id: number): Promise<DeleteProductResponse> => {
    try {
      const response = await axiosInstance.delete(`/api/admin/delete-product/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  createAdminProduct: async (data: CreateProductRequest): Promise<CreateProductResponse> => {
    try {
      const response = await axiosInstance.post('/api/admin/create-product', data);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  getDashboardData: async (): Promise<DashboardData> => {
    try {
      const response = await axiosInstance.get('/api/admin/dashboard-statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  getAllProducts: async (): Promise<ProductsResponse> => {
    try {
      const response = await axiosInstance.get('/api/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Best sellers endpoint
  getBestSellers: () =>
    axiosInstance.get('/api/best-sellers')
      .then(response => response.data)
      .catch(error => {
        console.error('Get best sellers error:', error);
        throw error;
      }),

  getAllUsers: async (): Promise<UsersResponse> => {
    try {
      const response = await axiosInstance.get('/api/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  deleteUser: async (userId: number): Promise<DeleteUserResponse> => {
    try {
      const response = await axiosInstance.delete(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  updateProduct: async (productId: number, data: UpdateProductRequest): Promise<ProductResponse> => {
    try {
      const response = await axiosInstance.put(`/api/products/${productId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (productId: number): Promise<DeleteProductResponse> => {
    try {
      const response = await axiosInstance.delete(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  createProduct: async (data: CreateProductRequest): Promise<ProductResponse> => {
    try {
      const response = await axiosInstance.post('/api/products', data);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  getAllOrders: async (): Promise<OrdersResponse> => {
    try {
      const response = await axiosInstance.get('/api/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  getOrderById: async (id: number): Promise<OrderResponse> => {
    try {
      const response = await axiosInstance.get(`/api/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Product Type APIs
  getAllProductTypes: async (): Promise<ProductTypeResponse> => {
    try {
      const response = await axiosInstance.get('/api/product-types');
      return response.data;
    } catch (error) {
      console.error('Error fetching product types:', error);
      throw error;
    }
  },

  createProductType: async (data: { name: string; description?: string }): Promise<SingleProductTypeResponse> => {
    try {
      const response = await axiosInstance.post('/api/product-types', data);
      return response.data;
    } catch (error) {
      console.error('Error creating product type:', error);
      throw error;
    }
  },

  updateProductType: async (id: number, data: { name: string; description?: string }): Promise<SingleProductTypeResponse> => {
    try {
      const response = await axiosInstance.put(`/api/product-types/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating product type:', error);
      throw error;
    }
  },

  deleteProductType: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/product-types/${id}`);
    } catch (error) {
      console.error('Error deleting product type:', error);
      throw error;
    }
  },

  // Brands endpoint
  getBrands: async (): Promise<BrandsResponse> => {
    try {
      const response = await axiosInstance.get('/api/brands');
      return response.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  },

  getRelatedProducts: async (productId: number): Promise<RelatedProductsResponse> => {
    try {
      const response = await axiosInstance.get(`/api/products/${productId}/related`);
      return response.data;
    } catch (error) {
      console.error('Error fetching related products:', error);
      throw error;
    }
  },

  getProductReviews: async (productId: number): Promise<ReviewsResponse> => {
    try {
      const response = await axiosInstance.get(`/api/reviews/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      throw error;
    }
  },
}; 