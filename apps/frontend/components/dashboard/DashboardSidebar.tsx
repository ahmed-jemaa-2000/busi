'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { User } from '@busi/types';

interface DashboardSidebarProps {
  user: User;
  shopId: number | null;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: '🏠',
  },
  {
    name: 'Products',
    href: '/dashboard/products',
    icon: '📦',
  },
  {
    name: 'Categories',
    href: '/dashboard/categories',
    icon: '🏷️',
  },
  {
    name: 'Orders',
    href: '/dashboard/orders',
    icon: '🛒',
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: '⚙️',
  },
];

export default function DashboardSidebar({ user, shopId }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
                          (item.href !== '/dashboard' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {shopId && (
        <div className="p-4 border-t border-gray-200 mt-4">
          <p className="text-xs text-gray-500 mb-2">Shop ID: {shopId}</p>
        </div>
      )}
    </aside>
  );
}
