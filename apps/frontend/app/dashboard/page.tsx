import { getAuthToken, getUserShopId } from '@/lib/auth-server';
import { getProductsByShop, getOrdersByShop, getCategoriesByShop, getShopById } from '@/lib/strapi';
import StatsCard from '@/components/dashboard/StatsCard';
import Link from 'next/link';

export default async function DashboardHome() {
  const token = getAuthToken();

  if (!token) {
    return <div>Unauthorized</div>;
  }

  const shopId = await getUserShopId(token);

  if (!shopId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">No Shop Found</h2>
        <p className="text-gray-600 mb-6">
          Your account is not associated with any shop yet.
        </p>
        <p className="text-sm text-gray-500">
          Please contact the platform administrator.
        </p>
      </div>
    );
  }

  const [shop, products, orders, categories] = await Promise.all([
    getShopById(shopId, token),
    getProductsByShop(shopId),
    getOrdersByShop(shopId, token),
    getCategoriesByShop(shopId, token),
  ]);

  if (!shop) {
    return <div>Shop not found</div>;
  }

  const activeProducts = products.filter((p) => p.isActive);
  const pendingOrders = orders.filter((o) => o.status === 'pending');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back! 👋</h1>
        <p className="text-gray-600">
          Here's an overview of {shop.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value={products.length}
          icon="📦"
          color="blue"
        />
        <StatsCard
          title="Active Products"
          value={activeProducts.length}
          icon="✅"
          color="green"
        />
        <StatsCard
          title="Categories"
          value={categories.length}
          icon="🏷️"
          color="purple"
        />
        <StatsCard
          title="Pending Orders"
          value={pendingOrders.length}
          icon="🛒"
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/products/create"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition text-center"
          >
            <div className="text-3xl mb-2">➕</div>
            <div className="font-semibold">Add Product</div>
          </Link>
          <Link
            href="/dashboard/products"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition text-center"
          >
            <div className="text-3xl mb-2">📦</div>
            <div className="font-semibold">Manage Products</div>
          </Link>
          <Link
            href="/dashboard/settings"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition text-center"
          >
            <div className="text-3xl mb-2">⚙️</div>
            <div className="font-semibold">Shop Settings</div>
          </Link>
        </div>
      </div>

      {/* Storefront Link */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
        <h3 className="font-semibold mb-2">Your Storefront</h3>
        <p className="text-gray-600 mb-4">
          Visit your online boutique to see how customers see your shop
        </p>
        <a
          href={`https://${shop.subdomain}.brandini.tn`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <span>Visit {shop.name}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
