import type { Shop, Product } from '@busi/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  shop: Shop;
}

export default function ProductGrid({ products, shop }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products available at the moment.</p>
      </div>
    );
  }

  const { cardStyle } = shop;

  const gridClass = `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`;

  return (
    <div id="products" className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} shop={shop} />
      ))}
    </div>
  );
}
