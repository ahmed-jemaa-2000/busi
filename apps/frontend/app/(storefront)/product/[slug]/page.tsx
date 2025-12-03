import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getShopBySubdomain, getProductBySlug } from '@/lib/strapi';
import { sanitizeHtml } from '@/lib/sanitize';
import WhatsAppButton from '@/components/storefront/WhatsAppButton';
import ProductImageGallery from '@/components/storefront/ProductImageGallery';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Container from '@/components/ui/Container';
import Badge from '@/components/ui/Badge';

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

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Shop', href: '/' }
  ];

  if (product.category) {
    const categoryName = typeof product.category === 'object' ? product.category.name : '';
    const categorySlug = typeof product.category === 'object' ? product.category.slug : '';
    if (categoryName && categorySlug) {
      breadcrumbItems.push({ label: categoryName, href: `/category/${categorySlug}` });
    }
  }

  breadcrumbItems.push({ label: product.name });

  const discountPercentage = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="bg-white min-h-screen">
      <Container>
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-8">
          {/* Product Images */}
          <div className="animate-fade-in">
            <ProductImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6 animate-slide-up">
            {/* Title & Badges */}
            <div>
              <div className="flex items-start gap-3 mb-3">
                {product.isFeatured && (
                  <Badge variant="warning">Featured</Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge variant="error">-{discountPercentage}% OFF</Badge>
                )}
                {product.stock !== undefined && product.stock !== null && product.stock <= 5 && product.stock > 0 && (
                  <Badge variant="warning">Only {product.stock} left</Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3 py-4 border-y border-gray-200">
              <span className="text-4xl font-bold text-primary">
                {product.price} TND
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  {product.oldPrice} TND
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <div
                  className="prose-enhanced text-gray-700"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                />
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Available Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className="px-5 py-3 border-2 border-gray-300 rounded-lg font-medium hover:border-primary hover:text-primary transition-all"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Available Colors</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className="group relative px-5 py-3 border-2 border-gray-300 rounded-lg font-medium hover:border-primary transition-all"
                    >
                      <div
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                      <span className="ml-6">{color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Info */}
            {product.stock !== undefined && product.stock !== null && (
              <div className="bg-gray-50 rounded-lg p-4">
                {product.stock > 0 ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">In Stock ({product.stock} available)</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Out of Stock</span>
                  </div>
                )}
              </div>
            )}

            {/* WhatsApp Order Button */}
            <div className="pt-4">
              <WhatsAppButton product={product} shop={shop} />
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-6 space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span>Free shipping on orders over 100 TND</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
