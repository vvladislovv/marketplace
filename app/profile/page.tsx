'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { storage } from '@/lib/storage';
import { Seller } from '@/types';
import { Store, LogOut, Package, ShoppingBag, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const router = useRouter();
  const [seller, setSeller] = useState<Seller | null>(null);

  useEffect(() => {
    const currentSeller = storage.getCurrentSeller();
    setSeller(currentSeller);
  }, []);

  const handleLogout = () => {
    storage.setCurrentSeller(null);
    setSeller(null);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: {
          message: 'Вы вышли из панели продавца',
          type: 'info'
        }
      }));
    }
  };

  return (
    <div className="min-h-screen pb-20" suppressHydrationWarning>
      <Header />
      
      <main className="container mx-auto px-4 py-6" suppressHydrationWarning>
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Профиль</h1>

        {/* Seller Panel Section */}
        {seller ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 mb-6"
            suppressHydrationWarning
          >
            <div className="flex items-center gap-4 mb-4" suppressHydrationWarning>
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                <Store className="w-8 h-8 text-primary-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{seller.name}</h2>
                <p className="text-sm text-gray-600">Продавец</p>
              </div>
            </div>

            <div className="space-y-3" suppressHydrationWarning>
              <Link href="/seller/dashboard" className="block">
                <Button fullWidth className="justify-start">
                  <Package className="w-5 h-5 mr-2" />
                  Панель продавца
                </Button>
              </Link>
              
              <Button
                variant="outline"
                fullWidth
                onClick={handleLogout}
                className="justify-start"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Выйти из панели продавца
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 mb-6"
            suppressHydrationWarning
          >
            <div className="text-center">
              <Store className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Вы не зарегистрированы как продавец</h2>
              <p className="text-gray-600 mb-6">
                Зарегистрируйтесь как продавец, чтобы управлять своими товарами
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/seller/register">
                  <Button>
                    <Store className="w-4 h-4 mr-2" />
                    Стать продавцом
                  </Button>
                </Link>
                <Link href="/seller/login">
                  <Button variant="outline">
                    Войти в панель
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
          suppressHydrationWarning
        >
          <h2 className="text-xl font-bold mb-4 text-gray-900">Быстрые ссылки</h2>
          <div className="space-y-3" suppressHydrationWarning>
            <Link href="/orders" className="block">
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <ShoppingBag className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Мои заказы</span>
              </div>
            </Link>
            <Link href="/sellers" className="block">
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <Store className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Все продавцы</span>
              </div>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

