'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { CategoryCard } from '@/components/product/CategoryCard';
import { mockProducts, mockCategories } from '@/lib/constants';
import { storage } from '@/lib/storage';
import { Product, Category } from '@/types';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Инициализация данных в localStorage
    const storedProducts = storage.getProducts();
    const storedCategories = storage.getCategories();

    if (storedProducts.length === 0) {
      storage.setProducts(mockProducts);
      setProducts(mockProducts);
    } else {
      setProducts(storedProducts);
    }

    if (storedCategories.length === 0) {
      storage.setCategories(mockCategories);
      setCategories(mockCategories);
    } else {
      setCategories(storedCategories);
    }
  }, []);

  const featuredProducts = products.slice(0, 6);
  const popularCategories = categories.slice(0, 8);

  return (
    <div className="min-h-screen pb-20" suppressHydrationWarning>
      <Header />
      
      <main className="container mx-auto px-4 py-6" suppressHydrationWarning>
        {/* Categories */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
          suppressHydrationWarning
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-900" suppressHydrationWarning>Категории</h2>
          <div className="grid grid-cols-4 gap-3 md:grid-cols-8" suppressHydrationWarning>
            {popularCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                suppressHydrationWarning
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Featured Products */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
          suppressHydrationWarning
        >
          <div className="flex items-center justify-between mb-4" suppressHydrationWarning>
            <h2 className="text-2xl font-bold text-gray-900" suppressHydrationWarning>Популярные товары</h2>
            <a href="/search" className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1 whitespace-nowrap">
              <span>Смотреть все</span>
              <span>→</span>
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" suppressHydrationWarning>
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                suppressHydrationWarning
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Promo Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
          suppressHydrationWarning
        >
          <div className="glass-card rounded-3xl p-6 md:p-8 bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-100" suppressHydrationWarning>
            <div suppressHydrationWarning>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Специальные предложения</h2>
              <p className="text-gray-700 mb-4">
                Получите скидку до 50% на выбранные товары
              </p>
              <a
                href="/search?promo=true"
                className="inline-block bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg"
              >
                Смотреть акции
              </a>
            </div>
          </div>
        </motion.section>

        {/* Seller Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
          suppressHydrationWarning
        >
          <div className="glass-card rounded-3xl p-6 md:p-8 bg-gradient-to-r from-accent-50 to-primary-50 border-2 border-accent-100" suppressHydrationWarning>
            <div suppressHydrationWarning>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Станьте продавцом</h2>
              <p className="text-gray-700 mb-4">
                Низкие барьеры входа, автоматизация заказов, встроенные платежи. 
                Монетизация через комиссию (5%) или подписку (2990₽/месяц).
              </p>
              <div className="flex gap-3" suppressHydrationWarning>
                <a
                  href="/seller/register"
                  className="inline-block bg-accent-400 text-white px-6 py-3 rounded-xl font-semibold hover:bg-accent-500 transition-colors shadow-md hover:shadow-lg"
                >
                  Стать продавцом
                </a>
                <a
                  href="/sellers"
                  className="inline-block bg-white text-accent-400 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors border-2 border-accent-400"
                >
                  Все продавцы
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

