import Link from 'next/link';
import Image from 'next/image';
import type { Product, Shop } from '@busi/types';
import { getStrapiMediaUrl } from '@/lib/strapi';

interface ProductCardProps {
  product: Product;
  shop: Shop;
}

export default function ProductCard({ product, shop }: ProductCardProps) {
  const { cardStyle } = shop;
  const mainImage = product.images && product.images[0];

  const cardClasses = `group bg-white overflow-hidden transition-all duration-300 hover:shadow-lg ${
    cardStyle === 'rounded' ? 'rounded-xl' :
    cardStyle === 'square' ? 'rounded-none' :
    'rounded-lg shadow-md'
  }`;

  return (
    <Link href={`/product/${product.slug}`}>
      <div className={cardClasses}>
        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {mainImage ? (
            <Image
              src={getStrapiMediaUrl(mainImage.url)}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}

          {/* Featured Badge */}
          {product.isFeatured && (
            <div className="absolute top-3 right-3 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
              Featured
            </div>
          )}

          {/* Discount Badge */}
          {product.oldPrice && product.oldPrice > product.price && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition">
            {product.name}
          </h3>

          <div className="flex items-center space-x-2">
            {product.oldPrice && (
              <span className="text-sm text-gray-500 line-through">
                {product.oldPrice} TND
              </span>
            )}
            <span className="text-lg font-bold text-primary">
              {product.price} TND
            </span>
          </div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {product.sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="text-xs px-2 py-1 bg-gray-100 rounded"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-xs px-2 py-1 text-gray-500">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
