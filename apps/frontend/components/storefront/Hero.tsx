'use client';

import type { Shop, Product } from '@busi/types';
import ProductCard from './ProductCard';
import Button from '@/components/ui/Button';

interface HeroProps {
  shop: Shop;
  featuredProducts: Product[];
}

export default function Hero({ shop, featuredProducts }: HeroProps) {
  const { heroStyle } = shop;

  if (heroStyle === 'small-hero') {
    return (
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 md:py-20 overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            <span className="text-gradient">{shop.name}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Discover our curated collection of quality clothing
          </p>
        </div>
      </section>
    );
  }

  if (heroStyle === 'carousel' && featuredProducts.length > 0) {
    return (
      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked selections from our latest collection
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 stagger-fade-in">
            {featuredProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} shop={shop} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default: big-banner
  return (
    <section
      className="relative min-h-[600px] lg:min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-100 overflow-hidden"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl text-center relative z-10 py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in">
            <span className="block mb-2">{shop.name}</span>
            <span className="text-gradient block text-4xl md:text-5xl lg:text-6xl">
              Style Meets Quality
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Discover our exclusive collection of handpicked clothing for every occasion
          </p>

          {/* CTA Buttons */}
          {featuredProducts.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-scale-in">
              <Button
                variant="primary"
                size="lg"
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Shop Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Collection
              </Button>
            </div>
          )}

          {/* Scroll Indicator */}
          <div className="pt-12 animate-bounce">
            <svg
              className="w-6 h-6 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 md:h-24 text-white"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z"
            fill="currentColor"
            opacity=".25"
          />
          <path
            d="M0 0v15.81c13 21.11 27.64 41.05 47.69 56.24C99.41 111.27 165 111 224.58 91.58c31.15-10.15 60.09-26.07 89.67-39.8 40.92-19 84.73-46 130.83-49.67 36.26-2.85 70.9 9.42 98.6 31.56 31.77 25.39 62.32 62 103.63 73 40.44 10.79 81.35-6.69 119.13-24.28s75.16-39 116.92-43.05c59.73-5.85 113.28 22.88 168.9 38.84 30.2 8.66 59 6.17 87.09-7.5 22.43-10.89 48-26.93 60.65-49.24V0z"
            fill="currentColor"
            opacity=".5"
          />
          <path
            d="M0 0v5.63C149.93 59 314.09 71.32 475.83 42.57c43-7.64 84.23-20.12 127.61-26.46 59-8.63 112.48 12.24 165.56 35.4C827.93 77.22 886 95.24 951.2 90c86.53-7 172.46-45.71 248.8-84.81V0z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}
