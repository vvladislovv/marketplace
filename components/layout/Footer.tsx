'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Search, ShoppingBag, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Главная' },
    { href: '/search', icon: Search, label: 'Поиск' },
    { href: '/cart', icon: ShoppingBag, label: 'Корзина' },
    { href: '/profile', icon: User, label: 'Профиль' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-gray-200 shadow-lg" suppressHydrationWarning>
      <nav className="container mx-auto px-4 py-2" suppressHydrationWarning>
        <div className="flex items-center justify-around" suppressHydrationWarning>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-primary-500 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-500 hover:bg-gray-50'
                }`}
                suppressHydrationWarning
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </footer>
  );
}

