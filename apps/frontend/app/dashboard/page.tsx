import { getAuthToken, getUserShopId } from '@/lib/auth-server';
import { getProductsByShop, getOrdersByShop, getCategoriesByShop, getShopById } from '@/lib/strapi';
import StatsCard from '@/components/dashboard/StatsCard';
import QuickActionCard from '@/components/dashboard/QuickActionCard';
import RecentOrders from '@/components/dashboard/RecentOrders';
import StorefrontCard from '@/components/dashboard/StorefrontCard';
import Link from 'next/link';

export default async function DashboardHome() {
  const token = await getAuthToken();

  console.log('[Dashboard] Token retrieved:', token ? 'Token exists' : 'No token');

  if (!token) {
    return <div>Unauthorized</div>;
  }

  const shopId = await getUserShopId(token);
  console.log('[Dashboard] Shop ID:', shopId);

  if (!shopId) {
    return (
      <div className="text-center py-24 max-w-lg mx-auto">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          🏪
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Shop Found</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Your account is not associated with any shop yet. Please contact the platform administrator to set up your store.
        </p>
        <button className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition">
          Contact Support
        </button>
      </div>
    );
  }

  // Use Promise.allSettled to prevent one failure from breaking the entire dashboard
  const results = await Promise.allSettled([
    getShopById(shopId, token),
    getProductsByShop(shopId, { token }),
    getOrdersByShop(shopId, token),
    getCategoriesByShop(shopId, token),
  ]);

  const shop = results[0].status === 'fulfilled' ? results[0].value : null;
  const products = results[1].status === 'fulfilled' ? results[1].value : [];
  const orders = results[2].status === 'fulfilled' ? results[2].value : [];
  const categories = results[3].status === 'fulfilled' ? results[3].value : [];

  if (!shop) {
    return (
      <div className="p-8 bg-red-50 text-red-800 rounded-xl border border-red-200">
        <h3 className="font-bold text-lg mb-2">Error Loading Shop Data</h3>
        <p>We couldn't retrieve your shop details. Please try refreshing the page.</p>
      </div>
    );
  }

  const activeProducts = products.filter((p) => p.isActive);
  const pendingOrders = orders.filter((o) => o.status === 'pending');

  // Calculate total revenue from completed orders
  const totalRevenue = orders
    .filter(o => ['confirmed', 'shipped', 'delivered'].includes(o.status))
    .reduce((acc, curr) => acc + (curr.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back! 👋</h1>
          <p className="text-gray-600">
            Here's what's happening with <span className="font-semibold text-gray-900">{shop.name}</span> today.
          </p>
        </div>
        <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TND' }).format(totalRevenue)}
          icon="💰"
          color="green"
        />
        <StatsCard
          title="Total Orders"
          value={orders.length}
          icon="🛍️"
          color="blue"
        />
        <StatsCard
          title="Active Products"
          value={activeProducts.length}
          icon="📦"
          color="purple"
        />
        <StatsCard
          title="Pending Orders"
          value={pendingOrders.length}
          icon="⏳"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <RecentOrders orders={orders} />

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <QuickActionCard
                href="/dashboard/products/create"
                title="Add Product"
                description="Create a new product listing"
                icon="➕"
                color="blue"
              />
              <QuickActionCard
                href="/dashboard/categories"
                title="Manage Categories"
                description="Organize your shop structure"
                icon="🏷️"
                color="purple"
              />
              <QuickActionCard
                href="/dashboard/settings"
                title="Shop Settings"
                description="Update store details & preferences"
                icon="⚙️"
                color="default"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          <StorefrontCard shop={shop} />

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Shop Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Total Products</span>
                <span className="font-medium">{products.length}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${products.length > 0 ? (activeProducts.length / products.length) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{activeProducts.length} Active</span>
                <span>{products.length - activeProducts.length} Draft</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
