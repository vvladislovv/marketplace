'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Store, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { storage } from '@/lib/storage';

export default function SellerLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sellers = storage.getSellers();
    const seller = sellers.find(
      s => s.email === formData.email && s.password === formData.password
    );

    if (seller) {
      // Убираем пароль перед сохранением в сессию
      const { password, ...sellerWithoutPassword } = seller;
      storage.setCurrentSeller(sellerWithoutPassword);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: {
            message: 'Вход выполнен успешно!',
            type: 'success'
          }
        }));
      }
      
      router.push('/seller/dashboard');
    } else {
      setError('Неверный email или пароль');
    }
  };

  return (
    <div className="min-h-screen pb-20" suppressHydrationWarning>
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-md" suppressHydrationWarning>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
          suppressHydrationWarning
        >
          <div className="text-center mb-6">
            <Store className="w-12 h-12 mx-auto mb-3 text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Вход в панель продавца</h1>
            <p className="text-gray-600 text-sm">
              Войдите в свой аккаунт для управления товарами
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Пароль
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                placeholder="Введите пароль"
              />
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
            >
              Войти
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Нет аккаунта?{' '}
              <Link href="/seller/register" className="text-primary-500 hover:text-primary-600 font-medium">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

