'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '@/types';
import { storage } from '@/lib/storage';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(storage.getCart());
  }, []);

  const addToCart = (product: Product, quantity: number = 1) => {
    storage.addToCart(product, quantity);
    setCart(storage.getCart());
    
    // Показываем уведомление через событие
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: {
          message: `Товар "${product.name}" добавлен в корзину`,
          type: 'success'
        }
      }));
    }
  };

  const removeFromCart = (productId: string) => {
    storage.removeFromCart(productId);
    setCart(storage.getCart());
  };

  const updateQuantity = (productId: string, quantity: number) => {
    storage.updateCartItemQuantity(productId, quantity);
    setCart(storage.getCart());
  };

  const clearCart = () => {
    storage.clearCart();
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

