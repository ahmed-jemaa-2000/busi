import type { Shop } from '@busi/types';

interface StorefrontFooterProps {
  shop: Shop;
}

export default function StorefrontFooter({ shop }: StorefrontFooterProps) {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            © {new Date().getFullYear()} {shop.name}. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Powered by <span className="font-semibold">Busi</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
