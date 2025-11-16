'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { useCart } from '@/components/providers/CartProvider';
import { motion } from 'framer-motion';
import { storage } from '@/lib/storage';

interface ProductCardProps {
  product: Product;
}

// Маппинг категорий на эмодзи
const categoryEmojiMap: Record<string, string> = {
  electronics: '📱',
  clothing: '👕',
  home: '🏠',
  sports: '⚽',
  beauty: '💄',
  books: '📚',
  toys: '🧸',
  food: '🍔',
};

const getCategoryEmoji = (categoryId: string): string => {
  // Сначала проверяем маппинг
  if (categoryEmojiMap[categoryId]) {
    return categoryEmojiMap[categoryId];
  }
  
  // Если нет в маппинге, пытаемся получить из категорий
  const categories = storage.getCategories();
  const category = categories.find(c => c.id === categoryId);
  return category?.icon || '📦';
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <Card hover className="h-full flex flex-col">
        {/* Image/Emoji */}
        <div className="relative w-full aspect-square mb-3 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
          <div className="text-6xl md:text-7xl">
            {getCategoryEmoji(product.category)}
          </div>
          {product.oldPrice && (
            <div className="absolute top-2 right-2 bg-accent-400 text-white px-2 py-1 rounded-lg text-xs font-bold">
              -{calculateDiscount(product.oldPrice, product.price)}%
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold">Нет в наличии</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Seller */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
              <ImageWithFallback
                src={product.seller.avatar}
                alt={product.seller.name}
                width={24}
                height={24}
                className="object-cover"
              />
            </div>
            <span className="text-xs text-gray-600 truncate">{product.seller.name}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-gray-900">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-600">
              {product.rating} ({product.reviewsCount})
            </span>
          </div>

          {/* Price */}
          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-primary-500">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            {/* Add to cart button */}
            <Button
              size="sm"
              fullWidth
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="text-sm"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              В корзину
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}

