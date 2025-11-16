'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { Order, Review } from '@/types';
import { storage } from '@/lib/storage';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, Package, CheckCircle, Clock, Truck, XCircle, Star, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const statusConfig = {
  pending: { label: 'Ожидает обработки', icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  processing: { label: 'В обработке', icon: Package, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  shipped: { label: 'Отправлен', icon: Truck, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  delivered: { label: 'Доставлен', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  cancelled: { label: 'Отменен', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
};

const statusSteps = [
  { key: 'pending', label: 'Заказ создан', description: 'Ваш заказ принят и ожидает обработки' },
  { key: 'processing', label: 'В обработке', description: 'Заказ обрабатывается продавцом' },
  { key: 'shipped', label: 'Отправлен', description: 'Заказ отправлен в службу доставки' },
  { key: 'delivered', label: 'Доставлен', description: 'Заказ успешно доставлен' },
];

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRatings, setReviewRatings] = useState<Record<string, number>>({});
  const [reviewComments, setReviewComments] = useState<Record<string, string>>({});

  const generateStatusHistory = (order: Order) => {
    const history = [];
    const createdAt = new Date(order.createdAt);
    
    // Заказ создан
    history.push({
      status: 'pending',
      timestamp: createdAt.toISOString(),
      description: 'Заказ создан',
    });

    // В зависимости от текущего статуса добавляем историю
    // Этапы проходят быстрее - каждую минуту
    if (['processing', 'shipped', 'delivered'].includes(order.status)) {
      const processingDate = new Date(createdAt.getTime() + 1 * 60 * 1000); // +1 минута
      history.push({
        status: 'processing',
        timestamp: processingDate.toISOString(),
        description: 'Заказ принят в обработку',
      });
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      const shippedDate = new Date(createdAt.getTime() + 2 * 60 * 1000); // +2 минуты
      history.push({
        status: 'shipped',
        timestamp: shippedDate.toISOString(),
        description: 'Заказ отправлен',
      });
    }

    if (order.status === 'delivered') {
      const deliveredDate = new Date(createdAt.getTime() + 3 * 60 * 1000); // +3 минуты
      history.push({
        status: 'delivered',
        timestamp: deliveredDate.toISOString(),
        description: 'Заказ доставлен',
      });
    }

    return history;
  };

  useEffect(() => {
    const updateOrderStatus = () => {
      const orders = storage.getOrders();
      const foundOrder = orders.find(o => o.id === params.id);
      
      if (foundOrder) {
        const now = new Date();
        const createdAt = new Date(foundOrder.createdAt);
        const minutesSinceCreation = (now.getTime() - createdAt.getTime()) / (60 * 1000);
        
        // Автоматически обновляем статус в зависимости от времени
        let updatedOrder = { ...foundOrder };
        let statusChanged = false;
        
        if (minutesSinceCreation >= 3 && foundOrder.status !== 'delivered' && foundOrder.status !== 'cancelled') {
          updatedOrder.status = 'delivered';
          statusChanged = true;
        } else if (minutesSinceCreation >= 2 && (foundOrder.status === 'pending' || foundOrder.status === 'processing') && foundOrder.status !== 'delivered' && foundOrder.status !== 'cancelled') {
          updatedOrder.status = 'shipped';
          statusChanged = true;
        } else if (minutesSinceCreation >= 1 && foundOrder.status === 'pending' && foundOrder.status !== 'cancelled') {
          updatedOrder.status = 'processing';
          statusChanged = true;
        }
        
        // Генерируем историю статусов если её нет или статус изменился
        if (!updatedOrder.statusHistory || statusChanged) {
          const history = generateStatusHistory(updatedOrder);
          updatedOrder.statusHistory = history;
          
          // Обновляем заказ в хранилище
          const allOrders = storage.getOrders();
          const orderIndex = allOrders.findIndex(o => o.id === updatedOrder.id);
          if (orderIndex !== -1) {
            allOrders[orderIndex] = updatedOrder;
            storage.setOrders(allOrders);
          }
        }
        
        setOrder(updatedOrder);
        
        // Загружаем отзывы для этого заказа
        const allReviews = storage.getReviews();
        const orderReviews = allReviews.filter(r => r.orderId === updatedOrder.id);
        setReviews(orderReviews);
      }
    };

    updateOrderStatus();
    
    // Обновляем статус каждую минуту
    const interval = setInterval(updateOrderStatus, 60 * 1000);
    
    return () => clearInterval(interval);
  }, [params.id]);

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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    return statusSteps.findIndex(step => step.key === order.status);
  };

  const handleReviewSubmit = (productId: string) => {
    const rating = reviewRatings[productId];
    const comment = reviewComments[productId] || '';

    if (!rating) {
      alert('Пожалуйста, выберите оценку');
      return;
    }

    const review: Review = {
      id: Math.random().toString(36).substring(7),
      productId,
      orderId: order!.id,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    // Сохраняем отзыв
    storage.addReview(review);

    setReviews([...reviews, review]);
    setReviewRatings({ ...reviewRatings, [productId]: 0 });
    setReviewComments({ ...reviewComments, [productId]: '' });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: {
          message: 'Отзыв успешно добавлен',
          type: 'success'
        }
      }));
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen pb-20">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="glass-card rounded-xl p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">Заказ не найден</p>
            <Button onClick={() => router.push('/orders')}>Вернуться к заказам</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;
  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen pb-20" suppressHydrationWarning>
      <Header />
      
      <main className="container mx-auto px-4 py-6" suppressHydrationWarning>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>

        <h1 className="text-2xl font-bold mb-6 text-gray-900">Заказ №{order.id}</h1>

        {/* Статус заказа */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${status.bgColor}`}>
                <StatusIcon className={`w-6 h-6 ${status.color}`} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{status.label}</p>
                <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Пошаговое отслеживание */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Отслеживание заказа</h3>
            <div className="space-y-4">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const stepHistory = order.statusHistory?.find(h => h.status === step.key);

                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-current" />
                        )}
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`w-0.5 h-12 ${
                            isCompleted ? 'bg-primary-500' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p
                            className={`font-medium ${
                              isCompleted ? 'text-gray-900' : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                          {stepHistory && (
                            <p className="text-xs text-gray-400 mt-1">
                              {formatTime(stepHistory.timestamp)}
                            </p>
                          )}
                        </div>
                        {isCurrent && (
                          <span className="px-2 py-1 bg-primary-100 text-primary-600 text-xs font-medium rounded">
                            Текущий этап
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Товары */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 mb-6"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-900">Товары в заказе</h2>
          <div className="space-y-4">
            {order.items.map((item) => {
              const hasReview = reviews.some(r => r.productId === item.product.id);
              const canReview = order.status === 'delivered' && !hasReview;

              return (
                <div key={item.product.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <ImageWithFallback
                        src={item.product.image}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Количество: {item.quantity} × {formatPrice(item.product.price)}
                      </p>
                      <p className="font-semibold text-primary-500">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>

                      {/* Отзыв */}
                      {canReview && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Оставить отзыв
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Оценка:</p>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() =>
                                      setReviewRatings({
                                        ...reviewRatings,
                                        [item.product.id]: star,
                                      })
                                    }
                                    className="focus:outline-none"
                                  >
                                    <Star
                                      className={`w-6 h-6 ${
                                        (reviewRatings[item.product.id] || 0) >= star
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <textarea
                                value={reviewComments[item.product.id] || ''}
                                onChange={(e) =>
                                  setReviewComments({
                                    ...reviewComments,
                                    [item.product.id]: e.target.value,
                                  })
                                }
                                placeholder="Напишите отзыв..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                rows={3}
                              />
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleReviewSubmit(item.product.id)}
                            >
                              Отправить отзыв
                            </Button>
                          </div>
                        </div>
                      )}

                      {hasReview && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-700 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Отзыв оставлен
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Информация о доставке */}
        {order.deliveryAddress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6 mb-6"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900">Адрес доставки</h2>
            <p className="text-gray-700">{order.deliveryAddress}</p>
          </motion.div>
        )}

        {/* Итого */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">Итого:</span>
            <span className="text-2xl font-bold text-primary-500">
              {formatPrice(order.total)}
            </span>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

