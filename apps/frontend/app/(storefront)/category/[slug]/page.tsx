import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getShopBySubdomain, getProductsByShop, getCategoriesByShop } from '@/lib/strapi';
import CategoryNav from '@/components/storefront/CategoryNav';
import ProductGrid from '@/components/storefront/ProductGrid';

interface CategoryPageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const headersList = await headers();
  const subdomain = headersList.get('x-subdomain');

  if (!subdomain) {
    notFound();
  }

  const shop = await getShopBySubdomain(subdomain);

  if (!shop || !shop.isActive) {
    notFound();
  }

  const categories = await getCategoriesByShop(shop.id);
  const category = categories.find((c) => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByShop(shop.id, {
    active: true,
    categoryId: category.id,
  });

  return (
    <div className="category-page">
      <CategoryNav categories={categories} />

      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
          <p className="text-gray-600">{products.length} products</p>
        </div>

        <ProductGrid products={products} shop={shop} />
      </section>
    </div>
  );
}
