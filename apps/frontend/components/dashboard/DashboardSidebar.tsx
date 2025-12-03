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
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] flex flex-col sticky top-16">
      <div className="p-4 flex-1">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${isActive(item.href) && item.href !== '/dashboard' || (item.href === '/dashboard' && pathname === '/dashboard')
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <span className="mr-3 text-lg group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
