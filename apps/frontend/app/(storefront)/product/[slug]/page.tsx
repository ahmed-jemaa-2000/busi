import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getShopBySubdomain, getProductBySlug, getStrapiMediaUrl } from '@/lib/strapi';
import { sanitizeHtml } from '@/lib/sanitize';
import WhatsAppButton from '@/components/storefront/WhatsAppButton';
import ProductImageGallery from '@/components/storefront/ProductImageGallery';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Container from '@/components/ui/Container';
import Badge from '@/components/ui/Badge';
import { ShieldCheck, Truck, RotateCcw, MessageCircle } from 'lucide-react';
import { Metadata } from 'next';
import * as motion from 'framer-motion/client';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const headersList = await headers();
  const subdomain = headersList.get('x-subdomain');

  if (!subdomain) return {};

  const shop = await getShopBySubdomain(subdomain);
  if (!shop) return {};

  const product = await getProductBySlug(params.slug, shop.id);
  if (!product) return {};

  const imageUrl = product.images && product.images.length > 0
    ? getStrapiMediaUrl(product.images[0].url)
    : null;

  return {
    title: `${product.name} | ${shop.name}`,
    description: product.description ? product.description.substring(0, 160).replace(/<[^>]*>?/gm, '') : `Buy ${product.name} at ${shop.name}`,
    openGraph: {
      title: product.name,
      description: product.description ? product.description.substring(0, 160).replace(/<[^>]*>?/gm, '') : undefined,
      images: imageUrl ? [imageUrl] : [],
      type: 'website',
    },
  };
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

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map(img => getStrapiMediaUrl(img.url)) || [],
    description: product.description ? product.description.replace(/<[^>]*>?/gm, '') : undefined,
    sku: product.id.toString(),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'TND',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: shop.name,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container>
        <div className="py-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="grid grid-cols-1 gap-12 pb-12 lg:grid-cols-[1.2fr,1fr] lg:gap-16">
          {/* Left Column: Sticky Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start h-fit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50"
            >
              <ProductImageGallery images={product.images} productName={product.name} />
            </motion.div>
          </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col gap-8">
            {/* Header Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                {product.isFeatured && <Badge variant="warning" className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider">Featured</Badge>}
                {discountPercentage > 0 && <Badge variant="error" className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider">Save {discountPercentage}%</Badge>}
                <Badge className="bg-gray-100 text-gray-700 border-gray-200 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider">Authentic</Badge>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">{product.name}</h1>

              <div className="flex items-baseline gap-4">
                <span className="text-5xl md:text-6xl font-bold text-primary tracking-tight">{product.price} <span className="text-2xl md:text-3xl font-medium text-gray-500">TND</span></span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-xl md:text-2xl text-gray-400 line-through decoration-2 decoration-gray-300">{product.oldPrice} TND</span>
                )}
              </div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-2 gap-4 py-8 border-y border-gray-100"
            >
              {[
                { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Fast Delivery', subtitle: '24-48h Shipping' },
                { icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50', title: 'Secure Order', subtitle: 'Cash on Delivery' },
                { icon: RotateCcw, color: 'text-purple-600', bg: 'bg-purple-50', title: 'Free Returns', subtitle: '30-Day Policy' },
                { icon: MessageCircle, color: 'text-amber-600', bg: 'bg-amber-50', title: 'Support', subtitle: 'Always here to help' }
              ].map((item, index) => (
                <div key={index} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-300">
                  <div className={`p-3 ${item.bg} ${item.color} rounded-full group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500 font-medium">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Description */}
            {product.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-bold text-gray-900">Description</h3>
                <div
                  className="prose-enhanced text-gray-600 leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                />
              </motion.div>
            )}

            {/* Desktop CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="hidden lg:block p-8 bg-gray-50 rounded-3xl border border-gray-100"
            >
              <WhatsAppButton product={product} shop={shop} />
              <p className="text-center text-sm text-gray-500 mt-4 font-medium">
                No payment required now. Pay when you receive it.
              </p>
            </motion.div>
          </div>
        </div>
      </Container>

      {/* Mobile Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] lg:hidden z-50">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Total Price</p>
            <p className="text-2xl font-bold text-primary leading-none">{product.price} <span className="text-sm text-gray-500 font-medium">TND</span></p>
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
