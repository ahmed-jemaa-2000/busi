import Link from 'next/link';
import Image from 'next/image';
import type { Product, Shop } from '@busi/types';
import { getStrapiMediaUrl } from '@/lib/strapi';
import Badge from '@/components/ui/Badge';

interface ProductCardProps {
  product: Product;
  shop: Shop;
}

export default function ProductCard({ product, shop }: ProductCardProps) {
  const { cardStyle } = shop;
  const mainImage = product.images && product.images[0];

  const cardClasses = `group bg-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
    cardStyle === 'rounded' ? 'rounded-xl' :
    cardStyle === 'square' ? 'rounded-none' :
    'rounded-lg'
  } shadow-md`;

  const discountPercentage = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <Link href={`/product/${product.slug}`} className="block">
      <div className={cardClasses}>
        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {mainImage ? (
            <>
              <Image
                src={getStrapiMediaUrl(mainImage.url)}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Badges Container */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <Badge variant="error" size="md">
                -{discountPercentage}%
              </Badge>
            )}

            <div className="ml-auto">
              {/* Featured Badge */}
              {product.isFeatured && (
                <Badge variant="warning" size="md">
                  <svg className="w-3 h-3 mr-1 inline" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Featured
                </Badge>
              )}
            </div>
          </div>

          {/* Stock Indicator */}
          {product.stock !== undefined && product.stock !== null && product.stock <= 5 && product.stock > 0 && (
            <div className="absolute bottom-3 left-3 z-10">
              <Badge variant="warning" size="sm">
                Only {product.stock} left
              </Badge>
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute bottom-3 left-3 z-10">
              <Badge variant="error" size="sm">
                Out of Stock
              </Badge>
            </div>
          )}

          {/* Quick View Button - Shows on Hover */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 text-center text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors">
              Quick View
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Product Name */}
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-primary">
              {product.price} TND
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {product.oldPrice} TND
              </span>
            )}
          </div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.slice(0, 5).map((size) => (
                <span
                  key={size}
                  className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 5 && (
                <span className="text-xs px-2.5 py-1 text-gray-500">
                  +{product.sizes.length - 5} more
                </span>
              )}
            </div>
          )}

          {/* Colors Preview */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500 mr-1">Colors:</span>
              {product.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-500">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
