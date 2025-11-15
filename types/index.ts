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

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveryAddress?: string;
}

export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  inStock?: boolean;
  minRating?: number;
}

