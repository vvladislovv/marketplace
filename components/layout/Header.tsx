'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { motion } from 'framer-motion';

export function Header() {
  const { getTotalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-gray-200" suppressHydrationWarning>
      <div className="container mx-auto px-4 py-3" suppressHydrationWarning>
        <div className="flex items-center justify-between gap-4" suppressHydrationWarning>
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md" suppressHydrationWarning>
            <div className="relative" suppressHydrationWarning>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск товаров..."
                className="w-full px-4 py-2 pl-10 pr-4 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 shadow-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </form>

          {/* Cart */}
          <Link href="/cart">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {getTotalItems() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-accent-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                >
                  {getTotalItems()}
                </motion.span>
              )}
            </motion.button>
          </Link>
        </div>
      </div>
    </header>
  );
}

