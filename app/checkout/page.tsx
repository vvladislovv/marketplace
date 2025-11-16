'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/components/providers/CartProvider';
import { storage } from '@/lib/storage';
import { formatPrice } from '@/lib/utils';
import { Order } from '@/types';
import { CreditCard, MapPin, Phone, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'card' as 'card' | 'cash',
  });
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (cart.length === 0 && typeof window !== 'undefined') {
      setIsRedirecting(true);
      router.push('/cart');
    }
  }, [cart.length, router]);

  if (cart.length === 0 || isRedirecting) {
    return (
      <div className="min-h-screen pb-20" suppressHydrationWarning>
        <Header />
        <main className="container mx-auto px-4 py-6" suppressHydrationWarning>
          <div className="glass-card rounded-2xl p-8 text-center" suppressHydrationWarning>
            <p className="text-gray-600">Перенаправление...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Создание заказа
    const subtotal = getTotalPrice();
    const commission = subtotal * 0.05; // 5% комиссия платформы
    const total = subtotal + commission;
    
    const order: Order = {
      id: Date.now().toString(),
      items: cart,
      total: total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      deliveryAddress: formData.address,
    };

    // Сохранение заказа
    storage.addOrder(order);
    
    // Очистка корзины
    clearCart();

    // Переход на страницу заказов
    setTimeout(() => {
      router.push('/orders');
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen pb-20" suppressHydrationWarning>
      <Header />
      
      <main className="container mx-auto px-4 py-6" suppressHydrationWarning>
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Оформление заказа</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Контактные данные</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Имя
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    placeholder="Введите ваше имя"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Телефон
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Адрес доставки
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
                    placeholder="Введите адрес доставки"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    Способ оплаты
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  >
                    <option value="card">Банковская карта</option>
                    <option value="cash">Наличными при получении</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Оформление...' : 'Оформить заказ'}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Ваш заказ</h2>
              
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Товары:</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Комиссия платформы (5%):</span>
                  <span>{formatPrice(getTotalPrice() * 0.05)}</span>
                </div>
                <div className="flex justify-between items-center text-lg pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-800">Итого:</span>
                  <span className="text-2xl font-bold text-primary-500">
                    {formatPrice(getTotalPrice() * 1.05)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Комиссия платформы включена в итоговую сумму
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

