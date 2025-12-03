import { Shop } from '@busi/types';

interface StorefrontCardProps {
    shop: Shop;
}

export default function StorefrontCard({ shop }: StorefrontCardProps) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const baseDomain = isDevelopment ? 'brandini.test:3000' : 'brandini.tn';
    const shopUrl = `https://${shop.subdomain}.${baseDomain}`;

    return (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-1 shadow-lg text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 h-full flex flex-col relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-lg mb-1">Your Storefront</h3>
                        <p className="text-indigo-100 text-sm">
                            {shop.name} is live
                        </p>
                    </div>
                    <div className="bg-green-400/20 text-green-100 text-xs px-2 py-1 rounded-full border border-green-400/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Online
                    </div>
                </div>

                <div className="mt-auto">
                    <a
                        href={shopUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn flex items-center justify-center w-full bg-white text-indigo-600 py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-50 transition-all duration-200 shadow-sm hover:shadow"
                    >
                        <span>Visit Store</span>
                        <svg
                            className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                    <p className="text-xs text-indigo-200 text-center mt-3 opacity-80">
                        {shop.subdomain}.{baseDomain}
                    </p>
                </div>
            </div>
        </div>
    );
}
