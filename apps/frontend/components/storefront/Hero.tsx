import type { Shop, Product } from '@busi/types';
import ProductCard from './ProductCard';

interface HeroProps {
  shop: Shop;
  featuredProducts: Product[];
}

export default function Hero({ shop, featuredProducts }: HeroProps) {
  const { heroStyle } = shop;

  if (heroStyle === 'small-hero') {
    return (
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">{shop.name}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of quality clothing
          </p>
        </div>
      </section>
    );
  }

  if (heroStyle === 'carousel' && featuredProducts.length > 0) {
    return (
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} shop={shop} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default: big-banner
  return (
    <section
      className="relative h-[500px] flex items-center justify-center bg-gradient-to-r from-primary/20 to-secondary/20"
    >
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">{shop.name}</h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
          Discover our exclusive collection of handpicked clothing for every occasion
        </p>
        {featuredProducts.length > 0 && (
          <a
            href="#products"
            className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition"
          >
            Shop Now
          </a>
        )}
      </div>
    </section>
  );
}
