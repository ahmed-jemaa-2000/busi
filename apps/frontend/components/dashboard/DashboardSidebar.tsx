'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@busi/types';

interface DashboardSidebarProps {
  user: User;
  shopId: number | null;
}

export default function DashboardSidebar({ user, shopId }: DashboardSidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: '📊' },
    { name: 'Products', href: '/dashboard/products', icon: '📦' },
    { name: 'Orders', href: '/dashboard/orders', icon: '🛍️' },
    { name: 'Categories', href: '/dashboard/categories', icon: '🏷️' },
    // TODO: Implement customers page
    // { name: 'Customers', href: '/dashboard/customers', icon: '👥' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-[calc(100vh-64px)] flex flex-col sticky top-16 shadow-[2px_0_20px_-10px_rgba(0,0,0,0.05)]">
      <div className="p-4 flex-1">
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 group ${isActive(item.href) && item.href !== '/dashboard' || (item.href === '/dashboard' && pathname === '/dashboard')
                ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-1'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
                }`}
            >
              <span className={`mr-3 text-lg transition-transform duration-300 ${isActive(item.href) ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center p-3.5 rounded-xl bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform duration-300">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">{user.username}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
