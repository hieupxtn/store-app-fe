interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  rating?: number;
}

const WISHLIST_STORAGE_KEY = 'wishlist_items';

export const wishlistService = {
  getWishlist: (): WishlistItem[] => {
    if (typeof window === 'undefined') return [];
    const wishlistJson = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return wishlistJson ? JSON.parse(wishlistJson) : [];
  },

  addToWishlist: (item: WishlistItem) => {
    const wishlist = wishlistService.getWishlist();
    const existingItemIndex = wishlist.findIndex(wishlistItem => wishlistItem.id === item.id);
    
    if (existingItemIndex >= 0) {
      return wishlist;
    }
    
    wishlist.push(item);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    return wishlist;
  },

  removeFromWishlist: (id: number) => {
    const wishlist = wishlistService.getWishlist();
    const updatedWishlist = wishlist.filter(item => item.id !== id);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updatedWishlist));
    return updatedWishlist;
  },

  isInWishlist: (id: number): boolean => {
    const wishlist = wishlistService.getWishlist();
    return wishlist.some(item => item.id === id);
  },

  clearWishlist: () => {
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
    return [];
  }
}; 