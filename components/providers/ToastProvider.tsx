'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Toast, ToastContainer } from '@/components/ui/Toast';

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success', duration: number = 3000) => {
      // Показываем только одно уведомление - заменяем предыдущее
      const id = Math.random().toString(36).substring(7);
      setToasts([{ id, message, type, duration }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Слушаем события для показа уведомлений из других компонентов
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleToastEvent = (event: CustomEvent) => {
      showToast(event.detail.message, event.detail.type, event.detail.duration);
    };

    window.addEventListener('show-toast', handleToastEvent as EventListener);
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('show-toast', handleToastEvent as EventListener);
      }
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

