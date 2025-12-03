import { notFound } from 'next/navigation';
import { getShopBySubdomain } from '@/lib/strapi';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import StorefrontHeader from '@/components/storefront/StorefrontHeader';
import StorefrontFooter from '@/components/storefront/StorefrontFooter';

interface StorefrontLayoutProps {
  children: React.ReactNode;
  params: Record<string, string>;
  searchParams: { subdomain?: string };
}

export default async function StorefrontLayout({
  children,
  searchParams,
}: StorefrontLayoutProps) {
  const subdomain = searchParams.subdomain;

  if (!subdomain) {
    notFound();
  }

  const shop = await getShopBySubdomain(subdomain);

  if (!shop || !shop.isActive) {
    notFound();
  }

  return (
    <ThemeProvider shop={shop}>
      <div className="min-h-screen flex flex-col">
        <StorefrontHeader shop={shop} />
        <main className="flex-grow">
          {children}
        </main>
        <StorefrontFooter shop={shop} />
      </div>
    </ThemeProvider>
  );
}
