'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.id}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center gap-2 p-4 glass-card rounded-2xl cursor-pointer"
      >
        <div className="text-4xl mb-1">{category.icon}</div>
        <span className="text-sm font-medium text-gray-800 text-center">
          {category.name}
        </span>
      </motion.div>
    </Link>
  );
}

