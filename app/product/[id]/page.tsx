'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { Product } from '@/types';
import { storage } from '@/lib/storage';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCart } from '@/components/providers/CartProvider';
import { Star, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const products = storage.getProducts();
    const foundProduct = products.find(p => p.id === params.id);
    setProduct(foundProduct || null);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen pb-20">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-700">Загрузка...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pb-20">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="glass-card rounded-xl p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">Товар не найден</p>
            <Button onClick={() => router.push('/')}>Вернуться на главную</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    router.push('/cart');
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="relative w-full aspect-square">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {product.oldPrice && (
                <div className="absolute top-4 right-4 bg-accent-400 text-white px-3 py-2 rounded-lg font-bold">
                  -{calculateDiscount(product.oldPrice, product.price)}%
                </div>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Seller */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                <ImageWithFallback
                  src={product.seller.avatar}
                  alt={product.seller.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{product.seller.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">
                    {product.seller.rating} ({product.seller.reviewsCount} отзывов)
                  </span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.reviewsCount} отзывов)
              </span>
            </div>

            {/* Description */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-semibold mb-2 text-gray-800">Описание</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Price */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-primary-500">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>
              {product.inStock ? (
                <p className="text-green-600 font-medium">В наличии</p>
              ) : (
                <p className="text-red-600 font-medium">Нет в наличии</p>
              )}
            </div>

            {/* Quantity */}
            <div className="glass-card rounded-xl p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Количество
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              fullWidth
              size="lg"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Добавить в корзину
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

