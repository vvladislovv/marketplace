'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Store, CreditCard, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { storage } from '@/lib/storage';

export default function SellerRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    storeName: '',
    email: '',
    phone: '',
    password: '',
    description: '',
    category: '',
    commissionType: 'percentage' as 'percentage' | 'subscription',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Создаем нового продавца
    const sellerId = Date.now().toString();
    const newSeller = {
      id: sellerId,
      name: formData.storeName,
      email: formData.email,
      password: formData.password,
      avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(formData.storeName) + '&background=random',
      rating: 5.0,
      reviewsCount: 0,
      positiveReviewsPercent: 100,
      description: formData.description,
      category: formData.category,
      commissionType: formData.commissionType,
      createdAt: new Date().toISOString(),
    };

    // Сохраняем продавца
    storage.addSeller(newSeller);

    // Автоматически входим
    const { password, ...sellerWithoutPassword } = newSeller;
    storage.setCurrentSeller(sellerWithoutPassword);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: {
          message: 'Регистрация успешна! Добро пожаловать в панель продавца.',
          type: 'success'
        }
      }));
    }
    
    setTimeout(() => {
      router.push('/seller/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen pb-20" suppressHydrationWarning>
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-2xl" suppressHydrationWarning>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>

        <h1 className="text-2xl font-bold mb-6 text-gray-900">Стать продавцом</h1>

        {/* Преимущества */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 mb-6"
          suppressHydrationWarning
        >
          <h2 className="text-xl font-bold mb-4 text-gray-900">Преимущества для продавцов</h2>
          <div className="space-y-3" suppressHydrationWarning>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Низкие барьеры входа</p>
                <p className="text-sm text-gray-600">Быстрая регистрация без сложных процедур</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Автоматизация обработки заказов</p>
                <p className="text-sm text-gray-600">Система автоматически обрабатывает и отслеживает заказы</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Встроенные платежи</p>
                <p className="text-sm text-gray-600">Единая система оплаты для всех покупателей</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Гибкая монетизация</p>
                <p className="text-sm text-gray-600">Комиссия с продаж или подписка - выбирайте удобный вариант</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Масштабирование</p>
                <p className="text-sm text-gray-600">Растите вместе с платформой без ограничений</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Форма регистрации */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
          suppressHydrationWarning
        >
          <h2 className="text-xl font-bold mb-4 text-gray-900">Заявка на регистрацию</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Store className="w-4 h-4 inline mr-2" />
                Название магазина
              </label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                placeholder="Введите название вашего магазина"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                Пароль
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                placeholder="Придумайте пароль"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Основная категория товаров
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              >
                <option value="">Выберите категорию</option>
                <option value="electronics">Электроника</option>
                <option value="clothing">Одежда</option>
                <option value="home">Дом и сад</option>
                <option value="sports">Спорт</option>
                <option value="beauty">Красота</option>
                <option value="books">Книги</option>
                <option value="toys">Игрушки</option>
                <option value="food">Еда</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание магазина
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
                placeholder="Расскажите о вашем магазине..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 inline mr-2" />
                Тип монетизации
              </label>
              <select
                name="commissionType"
                value={formData.commissionType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              >
                <option value="percentage">Комиссия с продаж (5%)</option>
                <option value="subscription">Подписка (2990₽/месяц)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.commissionType === 'percentage' 
                  ? 'Платите только с каждой продажи - идеально для начинающих'
                  : 'Фиксированная плата - выгодно при больших объемах продаж'}
              </p>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
            >
              Зарегистрироваться
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <Link href="/seller/login" className="text-primary-500 hover:text-primary-600 font-medium">
                Войти
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

