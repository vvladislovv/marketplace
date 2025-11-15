import { Product, FilterOptions } from '@/types';

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
}

export function calculateDiscount(oldPrice: number, newPrice: number): number {
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
}

export function filterProducts(products: Product[], filters: FilterOptions): Product[] {
  return products.filter(product => {
    if (filters.minPrice && product.price < filters.minPrice) return false;
    if (filters.maxPrice && product.price > filters.maxPrice) return false;
    if (filters.category && product.category !== filters.category) return false;
    if (filters.inStock !== undefined && product.inStock !== filters.inStock) return false;
    if (filters.minRating && product.rating < filters.minRating) return false;
    return true;
  });
}

export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;
  const lowerQuery = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery)
  );
}

export function sortProducts(products: Product[], sortBy: 'price' | 'rating' | 'popularity'): Product[] {
  const sorted = [...products];
  switch (sortBy) {
    case 'price':
      return sorted.sort((a, b) => a.price - b.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'popularity':
      return sorted.sort((a, b) => b.reviewsCount - a.reviewsCount);
    default:
      return sorted;
  }
}

