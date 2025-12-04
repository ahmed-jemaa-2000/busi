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
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <Container>
        <Breadcrumbs items={breadcrumbItems} />

        <div className="grid grid-cols-1 gap-8 py-6 lg:grid-cols-[1.1fr,0.9fr] lg:gap-10">
          <div className="animate-fade-in rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <ProductImageGallery images={product.images} productName={product.name} />
          </div>

          <div className="flex flex-col gap-6 lg:sticky lg:top-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 pb-4">
                {product.isFeatured && <Badge variant="warning">Featured</Badge>}
                {discountPercentage > 0 && <Badge variant="error">-{discountPercentage}%</Badge>}
                {product.stock !== undefined && product.stock !== null && product.stock <= 5 && product.stock > 0 && (
                  <Badge variant="warning">Only {product.stock} left</Badge>
                )}
                <Badge>Authentic brand</Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>

              <div className="mt-4 flex flex-wrap items-end gap-3 rounded-xl bg-gradient-to-r from-primary/5 via-white to-primary/10 p-4">
                <div>
                  <span className="text-4xl font-bold text-primary">{product.price} TND</span>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-gray-500 line-through">{product.oldPrice} TND</span>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        Save {product.oldPrice - product.price} TND
                      </span>
                    </div>
                  )}
                </div>
                {product.stock !== undefined && product.stock !== null && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock'}
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <WhatsAppButton product={product} shop={shop} />
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <span className="rounded-full bg-gray-100 px-3 py-1">Secure chat order</span>
                  <span className="rounded-full bg-gray-100 px-3 py-1">Response under 10 min</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Category</div>
                  <div className="font-semibold text-gray-900">
                    {product.category && typeof product.category === 'object'
                      ? product.category.name
                      : 'Uncategorized'}
                  </div>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-500">SKU</div>
                  <div className="font-semibold text-gray-900">{product.slug}</div>
                </div>
              </div>
            </div>

            {product.description && (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Product details</h3>
                <p className="mt-1 text-sm text-gray-500">Materials, sizing, and care crafted for everyday wear.</p>
                <div
                  className="prose-enhanced mt-4 text-gray-700"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 10.5 8.5 14 15 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Free returns for 30 days</p>
                  <p className="text-sm text-gray-600">Quick exchanges and easy support.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12h18M3 12l2.5-5H9l2 5-2 5H5.5L3 12Zm18 0-2.5 5H15l-2-5 2-5h3.5L21 12Z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Fast delivery</p>
                  <p className="text-sm text-gray-600">Same-day handoff on local orders.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
