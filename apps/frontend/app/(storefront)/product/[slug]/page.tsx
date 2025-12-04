import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getShopBySubdomain, getProductBySlug } from '@/lib/strapi';
import { sanitizeHtml } from '@/lib/sanitize';
import WhatsAppButton from '@/components/storefront/WhatsAppButton';
import ProductImageGallery from '@/components/storefront/ProductImageGallery';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Container from '@/components/ui/Container';
import Badge from '@/components/ui/Badge';
import { ShieldCheck, Truck, RotateCcw, MessageCircle } from 'lucide-react';

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

  const breadcrumbItems = [{ label: 'Shop', href: '/' }];

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
    <div className="min-h-screen bg-white pb-24 lg:pb-0">
      <Container>
        <div className="py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="grid grid-cols-1 gap-12 py-6 lg:grid-cols-[1.2fr,1fr] lg:gap-16">
          {/* Left Column: Sticky Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start h-fit">
            <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
              <ProductImageGallery images={product.images} productName={product.name} />
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col gap-8">
            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {product.isFeatured && <Badge variant="warning" className="rounded-full px-3">Featured</Badge>}
                {discountPercentage > 0 && <Badge variant="error" className="rounded-full px-3">Save {discountPercentage}%</Badge>}
                <Badge className="bg-gray-100 text-gray-700 border-gray-200 rounded-full px-3">Authentic</Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">{product.name}</h1>

              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-primary tracking-tight">{product.price} <span className="text-2xl font-medium text-gray-500">TND</span></span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-xl text-gray-400 line-through decoration-2">{product.oldPrice} TND</span>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Fast Delivery</p>
                  <p className="text-xs text-gray-500">24-48h Shipping</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 text-green-600 rounded-full">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Secure Order</p>
                  <p className="text-xs text-gray-500">Cash on Delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-full">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Free Returns</p>
                  <p className="text-xs text-gray-500">30-Day Policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-full">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Support</p>
                  <p className="text-xs text-gray-500">Always here to help</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Description</h3>
                <div
                  className="prose-enhanced text-gray-600 leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                />
              </div>
            )}

            {/* Desktop CTA */}
            <div className="hidden lg:block p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <WhatsAppButton product={product} shop={shop} />
              <p className="text-center text-sm text-gray-500 mt-3">
                No payment required now. Pay when you receive it.
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Mobile Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] lg:hidden z-50">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Total Price</p>
            <p className="text-xl font-bold text-primary">{product.price} TND</p>
          </div>
          <div className="flex-1">
            {/* Placeholder for size selector if needed in future */}
          </div>
        </div>
        <WhatsAppButton product={product} shop={shop} />
      </div>
    </div>
  );
}
