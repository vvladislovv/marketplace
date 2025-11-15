'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { useCart } from '@/components/providers/CartProvider';
import { formatPrice } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  // Группировка по продавцам
  const groupedBySeller = cart.reduce((acc, item) => {
    const sellerId = item.product.seller.id;
    if (!acc[sellerId]) {
      acc[sellerId] = {
        seller: item.product.seller,
        items: [],
      };
    }
    acc[sellerId].items.push(item);
    return acc;
  }, {} as Record<string, { seller: any; items: typeof cart }>);

  const sellerGroups = Object.values(groupedBySeller);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pb-20">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-8 text-center"
          >
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Корзина пуста</h2>
            <p className="text-gray-600 mb-6">Добавьте товары, чтобы продолжить покупки</p>
            <Link href="/">
              <Button>Перейти к покупкам</Button>
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Корзина</h1>

        <div className="space-y-6 mb-6">
          <AnimatePresence>
            {sellerGroups.map((group, groupIndex) => (
              <motion.div
                key={group.seller.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: groupIndex * 0.1 }}
                className="glass-card rounded-2xl p-4"
              >
                {/* Seller Header */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    <ImageWithFallback
                      src={group.seller.avatar}
                      alt={group.seller.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{group.seller.name}</p>
                    <p className="text-sm text-gray-600">
                      {group.items.length} {group.items.length === 1 ? 'товар' : 'товаров'}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {group.items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4"
                    >
                      <Link href={`/product/${item.product.id}`}>
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <ImageWithFallback
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.product.id}`}>
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-lg font-bold text-primary-500 mb-2">
                          {formatPrice(item.product.price)}
                        </p>

                        <div className="flex items-center gap-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Seller Total */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Итого от {group.seller.name}:</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(
                        group.items.reduce(
                          (sum, item) => sum + item.product.price * item.quantity,
                          0
                        )
                      )}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Total Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 sticky bottom-24"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-700">Итого:</span>
              <span className="text-2xl font-bold text-primary-500">
                {formatPrice(getTotalPrice())}
              </span>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={clearCart}
                className="flex-1"
              >
                Очистить корзину
              </Button>
              <Link href="/checkout" className="flex-1">
                <Button fullWidth>
                  Оформить заказ
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

