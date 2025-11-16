import { Product, CartItem, Order, Category, Review, Seller } from '@/types';

const STORAGE_KEYS = {
  CART: 'marketplace_cart',
  ORDERS: 'marketplace_orders',
  PRODUCTS: 'marketplace_products',
  CATEGORIES: 'marketplace_categories',
  REVIEWS: 'marketplace_reviews',
  SELLERS: 'marketplace_sellers',
  CURRENT_SELLER: 'marketplace_current_seller',
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

  setOrders: (orders: Order[]): void => {
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

  // Reviews
  getReviews: (): Review[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return data ? JSON.parse(data) : [];
  },

  setReviews: (reviews: Review[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  },

  addReview: (review: Review): void => {
    const reviews = storage.getReviews();
    reviews.unshift(review);
    storage.setReviews(reviews);
  },

  // Sellers
  getSellers: (): Seller[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.SELLERS);
    return data ? JSON.parse(data) : [];
  },

  setSellers: (sellers: Seller[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(sellers));
  },

  addSeller: (seller: Seller): void => {
    const sellers = storage.getSellers();
    sellers.push(seller);
    storage.setSellers(sellers);
  },

  updateSeller: (sellerId: string, updates: Partial<Seller>): void => {
    const sellers = storage.getSellers();
    const index = sellers.findIndex(s => s.id === sellerId);
    if (index !== -1) {
      sellers[index] = { ...sellers[index], ...updates };
      storage.setSellers(sellers);
    }
  },

  getSellerById: (sellerId: string): Seller | undefined => {
    const sellers = storage.getSellers();
    return sellers.find(s => s.id === sellerId);
  },

  // Current Seller (Auth)
  getCurrentSeller: (): Seller | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SELLER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentSeller: (seller: Seller | null): void => {
    if (typeof window === 'undefined') return;
    if (seller) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_SELLER, JSON.stringify(seller));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_SELLER);
    }
  },

  // Seller Products
  getSellerProducts: (sellerId: string): Product[] => {
    const products = storage.getProducts();
    return products.filter(p => p.seller.id === sellerId);
  },

  addSellerProduct: (sellerId: string, product: Product): void => {
    const products = storage.getProducts();
    products.push(product);
    storage.setProducts(products);
  },

  updateSellerProduct: (sellerId: string, productId: string, updates: Partial<Product>): void => {
    const products = storage.getProducts();
    const index = products.findIndex(p => p.id === productId && p.seller.id === sellerId);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      storage.setProducts(products);
    }
  },

  deleteSellerProduct: (sellerId: string, productId: string): void => {
    const products = storage.getProducts();
    const filtered = products.filter(p => !(p.id === productId && p.seller.id === sellerId));
    storage.setProducts(filtered);
  },
};

