'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { Product, Category } from '@/types';
import { storage } from '@/lib/storage';
import { motion } from 'framer-motion';

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const allProducts = storage.getProducts();
    const allCategories = storage.getCategories();
    
    const foundCategory = allCategories.find(c => c.id === params.id);
    setCategory(foundCategory || null);
    
    const categoryProducts = allProducts.filter(p => p.category === params.id);
    setProducts(categoryProducts);
  }, [params.id]);

  if (!category) {
    return (
      <div className="min-h-screen pb-20">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="glass-card rounded-xl p-8 text-center">
            <p className="text-gray-600 text-lg">Категория не найдена</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{category.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-gray-600">{products.length} товаров</p>
            </div>
          </div>
        </motion.div>

        {products.length === 0 ? (
          <div className="glass-card rounded-xl p-8 text-center">
            <p className="text-gray-600 text-lg">В этой категории пока нет товаров</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

