'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Product, Seller, Category } from '@/types';
import { storage } from '@/lib/storage';
import { formatPrice, getCategoryEmoji } from '@/lib/utils';
import { Plus, Edit, Trash2, LogOut, Package, TrendingUp, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SellerDashboardPage() {
  const router = useRouter();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    category: '',
    inStock: true,
  });

  useEffect(() => {
    const currentSeller = storage.getCurrentSeller();
    if (!currentSeller) {
      router.push('/seller/login');
      return;
    }

    setSeller(currentSeller);
    const sellerProducts = storage.getSellerProducts(currentSeller.id);
    setProducts(sellerProducts);
    setCategories(storage.getCategories());
  }, [router]);

  const handleLogout = () => {
    storage.setCurrentSeller(null);
    router.push('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seller) return;

    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
      image: '', // Используем эмодзи категории
      category: formData.category,
      seller: seller,
      inStock: formData.inStock,
      rating: editingProduct?.rating || 4.5,
      reviewsCount: editingProduct?.reviewsCount || 0,
    };

    if (editingProduct) {
      storage.updateSellerProduct(seller.id, editingProduct.id, productData);
    } else {
      storage.addSellerProduct(seller.id, productData);
    }

    // Обновляем список товаров
    const updatedProducts = storage.getSellerProducts(seller.id);
    setProducts(updatedProducts);
    
    // Обновляем статистику продавца
    const updatedSeller = storage.getSellerById(seller.id);
    if (updatedSeller) {
      setSeller(updatedSeller);
    }

    // Сброс формы
    setFormData({
      name: '',
      description: '',
      price: '',
      oldPrice: '',
      category: '',
      inStock: true,
    });
    setShowProductForm(false);
    setEditingProduct(null);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: {
          message: editingProduct ? 'Товар обновлен' : 'Товар добавлен',
          type: 'success'
        }
      }));
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      oldPrice: product.oldPrice?.toString() || '',
      category: product.category,
      inStock: product.inStock,
    });
    setShowProductForm(true);
  };

  const handleDelete = (productId: string) => {
    if (!seller) return;
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      storage.deleteSellerProduct(seller.id, productId);
      const updatedProducts = storage.getSellerProducts(seller.id);
      setProducts(updatedProducts);
      
      // Обновляем статистику продавца
      const updatedSeller = storage.getSellerById(seller.id);
      if (updatedSeller) {
        setSeller(updatedSeller);
      }
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: {
            message: 'Товар удален',
            type: 'success'
          }
        }));
      }
    }
  };

  const handleCancel = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      oldPrice: '',
      category: '',
      inStock: true,
    });
  };

  if (!seller) {
    return null;
  }

  const totalRevenue = products.reduce((sum, p) => sum + p.price, 0);
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;

  return (
    <div className="min-h-screen pb-20" suppressHydrationWarning>
      <Header />
      
      <main className="container mx-auto px-4 py-6" suppressHydrationWarning>
        {/* Header */}
        <div className="flex items-center justify-between mb-6" suppressHydrationWarning>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Панель продавца</h1>
            <p className="text-gray-600">{seller.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" suppressHydrationWarning>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6"
            suppressHydrationWarning
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Товаров</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-primary-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6"
            suppressHydrationWarning
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">В наличии</p>
                <p className="text-2xl font-bold text-gray-900">{inStockProducts}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
            suppressHydrationWarning
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Общая стоимость</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-accent-400" />
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="mb-6" suppressHydrationWarning>
          <Button
            onClick={() => {
              setShowProductForm(true);
              setEditingProduct(null);
            }}
            className="mb-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить товар
          </Button>
        </div>

        {/* Product Form */}
        <AnimatePresence>
          {showProductForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card rounded-2xl p-6 mb-6"
              suppressHydrationWarning
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                {editingProduct ? 'Редактировать товар' : 'Новый товар'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название товара
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    placeholder="Введите название"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
                    placeholder="Описание товара"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Цена (₽)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Старая цена (₽)
                    </label>
                    <input
                      type="number"
                      name="oldPrice"
                      value={formData.oldPrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                      placeholder="Необязательно"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категория
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Товар в наличии
                  </label>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    {editingProduct ? 'Сохранить изменения' : 'Добавить товар'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                    Отмена
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products List */}
        <div className="space-y-4" suppressHydrationWarning>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Мои товары</h2>
          
          {products.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">У вас пока нет товаров</p>
              <Button onClick={() => setShowProductForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить первый товар
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-2xl p-4"
                  suppressHydrationWarning
                >
                  <div className="flex items-center justify-center w-full aspect-square mb-3 rounded-xl bg-gray-100">
                    <span className="text-6xl">
                      {getCategoryEmoji(product.category)}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-primary-500">
                      {formatPrice(product.price)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      product.inStock 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {product.inStock ? 'В наличии' : 'Нет в наличии'}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Редактировать
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 text-red-500 hover:text-red-600 hover:border-red-500"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Удалить
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

