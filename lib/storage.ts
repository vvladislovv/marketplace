import { Product, CartItem, Order, Category } from '@/types';

const STORAGE_KEYS = {
  CART: 'marketplace_cart',
  ORDERS: 'marketplace_orders',
  PRODUCTS: 'marketplace_products',
  CATEGORIES: 'marketplace_categories',
} as const;

export const storage = {
  // Cart
  getCart: (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    return data ? JSON.parse(data) : [];
  },

  setCart: (cart: CartItem[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  },

  addToCart: (product: Product, quantity: number = 1): void => {
    const cart = storage.getCart();
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }
    
    storage.setCart(cart);
  },

  removeFromCart: (productId: string): void => {
    const cart = storage.getCart().filter(item => item.product.id !== productId);
    storage.setCart(cart);
  },

  updateCartItemQuantity: (productId: string, quantity: number): void => {
    const cart = storage.getCart();
    const item = cart.find(item => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        storage.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        storage.setCart(cart);
      }
    }
  },

  clearCart: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.CART);
  },

  // Orders
  getOrders: (): Order[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  },

  addOrder: (order: Order): void => {
    const orders = storage.getOrders();
    orders.unshift(order);
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  // Products
  getProducts: (): Product[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },

  setProducts: (products: Product[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  // Categories
  getCategories: (): Category[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  },

  setCategories: (categories: Category[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },
};

