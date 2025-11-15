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
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Categories */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Категории</h2>
          <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
            {popularCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
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
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Популярные товары</h2>
            <a href="/search" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
              Смотреть все →
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
        >
          <div className="glass-card rounded-3xl p-6 md:p-8 bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-100">
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
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

