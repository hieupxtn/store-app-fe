import { api } from './api';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ApiCartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  Product: {
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
    };
    Brand: {
      id: number;
      name: string;
    };
  };
}

const CART_STORAGE_KEY = 'cart_items';
const AUTH_CART_STORAGE_KEY = 'auth_cart_items';

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const convertApiCartToLocalCart = (apiCart: ApiCartItem[]): CartItem[] => {
  return apiCart.map(item => ({
    id: item.Product.id,
    name: item.Product.productName,
    price: item.Product.price,
    quantity: item.quantity,
    image: item.Product.image
  }));
};

const getLocalCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const storageKey = isAuthenticated() ? AUTH_CART_STORAGE_KEY : CART_STORAGE_KEY;
  const cartJson = localStorage.getItem(storageKey);
  return cartJson ? JSON.parse(cartJson) : [];
};

const saveLocalCart = (cart: CartItem[]) => {
  const storageKey = isAuthenticated() ? AUTH_CART_STORAGE_KEY : CART_STORAGE_KEY;
  localStorage.setItem(storageKey, JSON.stringify(cart));
};

export const cartService = {
  getCart: async (): Promise<CartItem[]> => {
    if (typeof window === 'undefined') return [];
    
    if (isAuthenticated()) {
      try {
        const response = await api.getCart();
        const apiCart = response?.cart || [];
        const localCart = convertApiCartToLocalCart(apiCart);
        saveLocalCart(localCart);
        return localCart;
      } catch (error) {
        console.error('Error fetching cart from API:', error);
        return getLocalCart();
      }
    }
    return getLocalCart();
  },

  addToCart: async (item: CartItem): Promise<CartItem[]> => {
    if (isAuthenticated()) {
      try {
        await api.addToCart(item.id, item.quantity);
        const response = await api.getCart();
        const apiCart = response?.cart || [];
        const localCart = convertApiCartToLocalCart(apiCart);
        saveLocalCart(localCart);
        return localCart;
      } catch (error) {
        console.error('Error adding to cart via API:', error);
        return cartService.addToCartLocal(item);
      }
    }
    return cartService.addToCartLocal(item);
  },

  addToCartLocal: (item: CartItem): CartItem[] => {
    const cart = getLocalCart();
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }
    
    saveLocalCart(cart);
    return cart;
  },

  updateCartItem: async (id: number, quantity: number): Promise<CartItem[]> => {
    if (isAuthenticated()) {
      try {
        await api.updateCartItem(id, quantity);
        const response = await api.getCart();
        const apiCart = response?.cart || [];
        const localCart = convertApiCartToLocalCart(apiCart);
        saveLocalCart(localCart);
        return localCart;
      } catch (error) {
        console.error('Error updating cart via API:', error);
        return cartService.updateCartItemLocal(id, quantity);
      }
    }
    return cartService.updateCartItemLocal(id, quantity);
  },

  updateCartItemLocal: (id: number, quantity: number): CartItem[] => {
    const cart = getLocalCart();
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex >= 0) {
      cart[itemIndex].quantity = quantity;
      saveLocalCart(cart);
    }
    
    return cart;
  },

  removeFromCart: async (id: number): Promise<CartItem[]> => {
    if (isAuthenticated()) {
      try {
        const response = await api.getCart();
        const apiCart = response?.cart || [];
        const cartItem = apiCart.find((item: ApiCartItem) => item.Product.id === id);
        
        if (cartItem) {
          await api.removeFromCart(cartItem.id);
          const updatedResponse = await api.getCart();
          const updatedApiCart = updatedResponse?.cart || [];
          const localCart = convertApiCartToLocalCart(updatedApiCart);
          saveLocalCart(localCart);
          return localCart;
        }
      } catch (error) {
        console.error('Error removing from cart via API:', error);
        return cartService.removeFromCartLocal(id);
      }
    }
    return cartService.removeFromCartLocal(id);
  },

  removeFromCartLocal: (id: number): CartItem[] => {
    const cart = getLocalCart();
    const updatedCart = cart.filter(item => item.id !== id);
    saveLocalCart(updatedCart);
    return updatedCart;
  },

  clearCart: async (): Promise<CartItem[]> => {
    if (isAuthenticated()) {
      try {
        const response = await api.getCart();
        const apiCart = response?.cart || [];
        
        for (const item of apiCart) {
          try {
            await api.removeFromCart(item.id);
          } catch (error) {
            console.error(`Error removing item ${item.id} from cart:`, error);
          }
        }
      } catch (error) {
        console.error('Error clearing cart via API:', error);
      }
    }
    
    const storageKey = isAuthenticated() ? AUTH_CART_STORAGE_KEY : CART_STORAGE_KEY;
    localStorage.removeItem(storageKey);
    
    window.dispatchEvent(new Event('storage'));
    
    return [];
  }
}; 