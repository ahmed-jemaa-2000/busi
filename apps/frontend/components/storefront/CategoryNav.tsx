'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { Category } from '@busi/types';

interface CategoryNavProps {
  categories: Category[];
}

export default function CategoryNav({ categories }: CategoryNavProps) {
  const pathname = usePathname();

  if (categories.length === 0) return null;

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-40 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center gap-6 md:gap-8 overflow-x-auto py-4 scrollbar-hide">
          <Link
            href="/"
            className={`text-sm font-medium whitespace-nowrap transition-all pb-1 border-b-2 ${
              isActive('/')
                ? 'text-primary border-primary'
                : 'text-gray-700 border-transparent hover:text-primary hover:border-gray-300'
            }`}
          >
            All Products
          </Link>
          {categories.map((category) => {
            const categoryPath = `/category/${category.slug}`;
            return (
              <Link
                key={category.id}
                href={categoryPath}
                className={`text-sm font-medium whitespace-nowrap transition-all pb-1 border-b-2 ${
                  isActive(categoryPath)
                    ? 'text-primary border-primary'
                    : 'text-gray-700 border-transparent hover:text-primary hover:border-gray-300'
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Gradient fade for horizontal scroll */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden"></div>
    </nav>
  );
}
