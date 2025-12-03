import Link from 'next/link';
import Image from 'next/image';
import { getAuthToken, getUserShopId } from '@/lib/auth-server';
import { getProductsByShop, getCategoriesByShop, getStrapiMediaUrl } from '@/lib/strapi';
import ProductListActions from '@/components/dashboard/ProductListActions';

export default async function ProductsPage() {
  const token = await getAuthToken();

  if (!token) {
    return <div>Unauthorized</div>;
  }

  const shopId = await getUserShopId(token);

  if (!shopId) {
    return <div>No shop found</div>;
  }

  const [products, categories] = await Promise.all([
    getProductsByShop(shopId, { token }),
    getCategoriesByShop(shopId, token),
  ]);

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {} as Record<number, string>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        <Link
          href="/dashboard/products/create"
          className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition"
        >
          + Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {products.filter((p) => p.isActive).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Inactive</p>
          <p className="text-2xl font-bold text-gray-400">
            {products.filter((p) => !p.isActive).length}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No products yet</p>
            <Link
              href="/dashboard/products/create"
              className="text-primary hover:underline"
            >
              Create your first product →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => {
                  const categoryId = typeof product.category === 'object' ? product.category.id : product.category;
                  const categoryName = categoryId ? categoryMap[categoryId] : 'Uncategorized';
                  const mainImage = product.images?.[0];

                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded overflow-hidden">
                            {mainImage ? (
                              <Image
                                src={getStrapiMediaUrl(mainImage.url)}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No img
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            {product.isFeatured && (
                              <span className="text-xs text-yellow-600">⭐ Featured</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {categoryName}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{product.price} TND</p>
                          {product.oldPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              {product.oldPrice} TND
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ProductListActions productId={product.id} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
