'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Order } from '@/types';
import { storage } from '@/lib/storage';
import { formatPrice } from '@/lib/utils';
import { Package, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const statusConfig = {
  pending: { label: 'Ожидает обработки', icon: Clock, color: 'text-yellow-600' },
  processing: { label: 'В обработке', icon: Package, color: 'text-blue-600' },
  shipped: { label: 'Отправлен', icon: Truck, color: 'text-purple-600' },
  delivered: { label: 'Доставлен', icon: CheckCircle, color: 'text-green-600' },
  cancelled: { label: 'Отменен', icon: XCircle, color: 'text-red-600' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(storage.getOrders());
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen pb-20">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-8 text-center"
          >
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Нет заказов</h2>
            <p className="text-gray-600 mb-6">Вы еще не сделали ни одного заказа</p>
            <Link href="/">
              <Button>Начать покупки</Button>
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" suppressHydrationWarning>
      <Header />
      
      <main className="container mx-auto px-4 py-6" suppressHydrationWarning>
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Мои заказы</h1>

        <div className="space-y-4">
          {orders.map((order, index) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6"
                suppressHydrationWarning
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Заказ №{order.id}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`w-5 h-5 ${status.color}`} />
                    <span className={`font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-gray-800">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {order.deliveryAddress && (
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Адрес:</strong> {order.deliveryAddress}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-gray-600">Итого:</span>
                  <span className="text-xl font-bold text-primary-500">
                    {formatPrice(order.total)}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm" fullWidth>
                      Подробнее о заказе
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

