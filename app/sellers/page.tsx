'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { storage } from '@/lib/storage';
import { Seller } from '@/types';
import { Star, TrendingUp, Users, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);

  useEffect(() => {
    // Получаем уникальных продавцов из товаров
    const products = storage.getProducts();
    const uniqueSellers = new Map<string, Seller>();
    
    products.forEach(product => {
      if (!uniqueSellers.has(product.seller.id)) {
        uniqueSellers.set(product.seller.id, product.seller);
      }
    });
    
    setSellers(Array.from(uniqueSellers.values()));
  }, []);

  return (
    <div className="min-h-screen pb-20" suppressHydrationWarning>
      <Header />
      
      <main className="container mx-auto px-4 py-6" suppressHydrationWarning>
        <div className="flex items-center justify-between mb-6" suppressHydrationWarning>
          <h1 className="text-2xl font-bold text-gray-900">Продавцы</h1>
          <div className="flex gap-2">
            <Link href="/seller/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white text-primary-500 border-2 border-primary-500 rounded-xl font-medium hover:bg-primary-50 transition-colors"
              >
                Вход для продавцов
              </motion.button>
            </Link>
            <Link href="/seller/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
              >
                Стать продавцом
              </motion.button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" suppressHydrationWarning>
          {sellers.map((seller, index) => (
            <motion.div
              key={seller.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6"
              suppressHydrationWarning
            >
              <div className="flex items-start gap-4 mb-4" suppressHydrationWarning>
                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0" suppressHydrationWarning>
                  <ImageWithFallback
                    src={seller.avatar}
                    alt={seller.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1" suppressHydrationWarning>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{seller.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {seller.rating}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({seller.reviewsCount} отзывов)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>{seller.positiveReviewsPercent}% положительных</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200" suppressHydrationWarning>
                <div className="text-center" suppressHydrationWarning>
                  <Package className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                  <p className="text-xs text-gray-600">Товары</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {storage.getProducts().filter(p => p.seller.id === seller.id).length}
                  </p>
                </div>
                <div className="text-center" suppressHydrationWarning>
                  <Users className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                  <p className="text-xs text-gray-600">Отзывы</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {seller.reviewsCount}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

