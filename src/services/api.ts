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

interface UpdateUserResponse {
  user: {
    id: number;
    email: string;
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
  recentOrders: DashboardOrder[];
}

export interface DashboardResponse {
  errCode: number;
  message: string;
  data: DashboardData;
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

  updateUser: async (userId: number, data: {
    firstName: string;
    lastName: string;
  }) => {
    const response = await axiosInstance.put<UpdateUserResponse>(`/api/users/${userId}`, data);
    return response.data;
  },
  
  // Product endpoints
  getProducts: () => 
    axiosInstance.get('/products')
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

  getDashboardData: async (): Promise<DashboardResponse> => {
    try {
      const response = await axiosInstance.get('/api/admin/dashboard-statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  getAllProducts: async () => {
    const response = await axiosInstance.get('/api/products');
    return response.data;
  },

  // Best sellers endpoint
  getBestSellers: () =>
    axiosInstance.get('/api/best-sellers')
      .then(response => response.data)
      .catch(error => {
        console.error('Get best sellers error:', error);
        throw error;
      }),
}; 