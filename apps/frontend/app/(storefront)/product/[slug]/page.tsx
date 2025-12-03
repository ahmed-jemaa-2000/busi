import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Image from 'next/image';
import { getShopBySubdomain, getProductBySlug, getStrapiMediaUrl } from '@/lib/strapi';
import { sanitizeHtml } from '@/lib/sanitize';
import WhatsAppButton from '@/components/storefront/WhatsAppButton';
import ProductImageGallery from '@/components/storefront/ProductImageGallery';

interface ProductPageProps {
  params: { slug: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const headersList = await headers();
  const subdomain = headersList.get('x-subdomain');

  if (!subdomain) {
    notFound();
  }

  const shop = await getShopBySubdomain(subdomain);

  if (!shop || !shop.isActive) {
    notFound();
  }

  const product = await getProductBySlug(params.slug, shop.id);

  if (!product || !product.isActive) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <ProductImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          {/* Price */}
          <div className="mb-6">
            {product.oldPrice && (
              <span className="text-gray-500 line-through mr-3 text-lg">
                {product.oldPrice} TND
              </span>
            )}
            <span className="text-3xl font-bold text-primary">
              {product.price} TND
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <div
              className="prose max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
            />
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Available Sizes:</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    className="px-4 py-2 border border-gray-300 rounded hover:border-primary transition"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Available Colors:</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="px-4 py-2 border border-gray-300 rounded hover:border-primary transition"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stock Info */}
          {product.stock !== undefined && product.stock !== null && (
            <div className="mb-6">
              {product.stock > 0 ? (
                <p className="text-green-600">In Stock ({product.stock} available)</p>
              ) : (
                <p className="text-red-600">Out of Stock</p>
              )}
            </div>
          )}

          {/* WhatsApp Order Button */}
          <WhatsAppButton product={product} shop={shop} />
        </div>
      </div>
    </div>
  );
}
