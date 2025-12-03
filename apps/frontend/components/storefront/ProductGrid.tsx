import type { Shop, Product } from '@busi/types';
import ProductCard from './ProductCard';
import EmptyState from '@/components/ui/EmptyState';

interface ProductGridProps {
  products: Product[];
  shop: Shop;
}

export default function ProductGrid({ products, shop }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No products available"
        description="Check back soon for new arrivals and exciting products."
        icon={
          <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        }
      />
    );
  }

  const gridClass = `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8`;

  return (
    <div id="products" className={`${gridClass} animate-fade-in`}>
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <ProductCard product={product} shop={shop} />
        </div>
      ))}
    </div>
  );
}
