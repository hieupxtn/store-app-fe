interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const CART_STORAGE_KEY = 'cart_items';

export const cartService = {
  getCart: (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const cartJson = localStorage.getItem(CART_STORAGE_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
  },

  addToCart: (item: CartItem) => {
    const cart = cartService.getCart();
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }
    
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return cart;
  },

  updateCartItem: (id: number, quantity: number) => {
    const cart = cartService.getCart();
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex >= 0) {
      cart[itemIndex].quantity = quantity;
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
    
    return cart;
  },

  removeFromCart: (id: number) => {
    const cart = cartService.getCart();
    const updatedCart = cart.filter(item => item.id !== id);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
    return updatedCart;
  },

  clearCart: () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    return [];
  }
}; 