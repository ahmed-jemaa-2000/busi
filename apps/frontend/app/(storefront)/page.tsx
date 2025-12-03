import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getShopBySubdomain, getProductsByShop, getCategoriesByShop } from '@/lib/strapi';
import Hero from '@/components/storefront/Hero';
import CategoryNav from '@/components/storefront/CategoryNav';
import ProductGrid from '@/components/storefront/ProductGrid';

export default async function StorefrontPage() {
  const headersList = await headers();
  const subdomain = headersList.get('x-subdomain');

  if (!subdomain) {
    notFound();
  }

  const shop = await getShopBySubdomain(subdomain);

  if (!shop || !shop.isActive) {
    notFound();
  }

  const [products, categories] = await Promise.all([
    getProductsByShop(shop.id, { active: true }),
    getCategoriesByShop(shop.id),
  ]);

  const featuredProducts = products.filter((p) => p.isFeatured);

  return (
    <div className="storefront-home">
      <Hero shop={shop} featuredProducts={featuredProducts} />

      {categories.length > 0 && (
        <CategoryNav categories={categories} />
      )}

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">All Products</h2>
        <ProductGrid products={products} shop={shop} />
      </section>
    </div>
  );
}
