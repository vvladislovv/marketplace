export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  seller: Seller;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
}

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  positiveReviewsPercent: number;
  email?: string;
  password?: string; // В реальном приложении должен быть хеш
  description?: string;
  category?: string;
  commissionType?: 'percentage' | 'subscription';
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderStatusHistory {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  timestamp: string;
  description?: string;
}

export interface Review {
  id: string;
  productId: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveryAddress?: string;
  statusHistory?: OrderStatusHistory[];
  trackingNumber?: string;
}

export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  inStock?: boolean;
  minRating?: number;
}

