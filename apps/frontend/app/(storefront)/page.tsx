import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getShopBySubdomain, getProductsByShop, getCategoriesByShop } from '@/lib/strapi';
import Hero from '@/components/storefront/Hero';
import CategoryNav from '@/components/storefront/CategoryNav';
import ProductGrid from '@/components/storefront/ProductGrid';
import FeaturesSection from '@/components/storefront/FeaturesSection';
import ValueProposition from '@/components/storefront/ValueProposition';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';

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
      {/* Hero Section */}
      <Hero shop={shop} featuredProducts={featuredProducts} />

      {/* Category Navigation */}
      {categories.length > 0 && (
        <CategoryNav categories={categories} />
      )}

      {/* Features Section */}
      <FeaturesSection />

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <Section background="white" spacing="lg">
          <Container>
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Collection</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Handpicked favorites from our latest arrivals
              </p>
            </div>
            <ProductGrid products={featuredProducts.slice(0, 4)} shop={shop} />
          </Container>
        </Section>
      )}

      {/* All Products Section */}
      <Section background="gray" spacing="lg">
        <Container>
          <div className="mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">All Products</h2>
            <p className="text-gray-600">
              Browse our complete collection of {products.length} products
            </p>
          </div>
          <ProductGrid products={products} shop={shop} />
        </Container>
      </Section>

      {/* Value Proposition Section */}
      <ValueProposition />
    </div>
  );
}
