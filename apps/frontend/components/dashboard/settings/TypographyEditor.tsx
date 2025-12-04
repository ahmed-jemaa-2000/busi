'use client';

import type { ShopFont } from '@busi/types';

interface TypographyEditorProps {
  font: ShopFont;
  onChange: (font: ShopFont) => void;
}

const FONTS: Array<{
  value: ShopFont;
  label: string;
  description: string;
  sample: string;
  category: string;
}> = [
  {
    value: 'inter',
    label: 'Inter',
    description: 'Modern sans-serif with excellent readability',
    sample: 'Modern retail experience',
    category: 'Sans-serif'
  },
  {
    value: 'playfair',
    label: 'Playfair Display',
    description: 'Elegant serif for luxury brands',
    sample: 'Boutique stories',
    category: 'Serif'
  },
  {
    value: 'montserrat',
    label: 'Montserrat',
    description: 'Geometric sans-serif with urban feel',
    sample: 'Street market',
    category: 'Sans-serif'
  },
  {
    value: 'roboto',
    label: 'Roboto',
    description: 'Clean and friendly, works everywhere',
    sample: 'Everyday shop',
    category: 'Sans-serif'
  },
  {
    value: 'poppins',
    label: 'Poppins',
    description: 'Rounded and playful, perfect for kids',
    sample: 'Kids collection',
    category: 'Sans-serif'
  },
];

export default function TypographyEditor({ font, onChange }: TypographyEditorProps) {
  return (
    <div className="space-y-6">
      {/* Font Selection */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Font Family</h3>
        <p className="mb-6 text-sm text-gray-600">
          Choose a typeface that matches your brand personality. The selected font will be used across your entire storefront.
        </p>

        <div className="grid gap-4">
          {FONTS.map((fontOption) => (
            <button
              key={fontOption.value}
              type="button"
              onClick={() => onChange(fontOption.value)}
              className={`
                group relative overflow-hidden rounded-xl border-2 p-6 text-left transition-all
                ${
                  font === fontOption.value
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50'
                }
              `}
              style={{ fontFamily: FONT_FAMILIES[fontOption.value] }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="text-xl font-bold text-gray-900">{fontOption.label}</h4>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {fontOption.category}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {fontOption.description}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-gray-800">
                    {fontOption.sample}
                  </p>
                  <p className="mt-2 text-sm uppercase tracking-widest text-gray-500">
                    Aa Bb Cc Dd Ee Ff Gg
                  </p>
                </div>

                {font === fontOption.value && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Typography Preview */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Live Preview</h3>
        <p className="mb-6 text-sm text-gray-600">
          See how {FONTS.find(f => f.value === font)?.label} looks in different sizes and weights.
        </p>

        <div className="space-y-6 rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6" style={{ fontFamily: FONT_FAMILIES[font] }}>
          {/* Heading Sizes */}
          <div>
            <div className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              Headings
            </div>
            <h1 className="mb-2 text-4xl font-bold text-gray-900">Heading 1 - Hero Title</h1>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">Heading 2 - Section Title</h2>
            <h3 className="mb-2 text-2xl font-semibold text-gray-900">Heading 3 - Subsection</h3>
            <h4 className="text-xl font-semibold text-gray-900">Heading 4 - Card Title</h4>
          </div>

          {/* Body Text */}
          <div>
            <div className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              Body Text
            </div>
            <p className="mb-2 text-base text-gray-700">
              Regular paragraph text - This is how your product descriptions and regular content will look. It should be easy to read and comfortable for long-form content.
            </p>
            <p className="text-sm text-gray-600">
              Small text - Used for captions, metadata, and supporting information throughout your store.
            </p>
          </div>

          {/* UI Elements */}
          <div>
            <div className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              UI Elements
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-lg bg-primary px-6 py-2 font-semibold text-white">
                Add to Cart
              </button>
              <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                Category Tag
              </span>
              <span className="text-2xl font-bold text-gray-900">$29.99</span>
            </div>
          </div>

          {/* Numbers */}
          <div>
            <div className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              Numbers & Prices
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-gray-900">1234567890</span>
              <span className="text-2xl text-gray-600">$€¥£</span>
            </div>
          </div>
        </div>
      </div>

      {/* Font Pairing Tip */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 flex-shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <div className="flex-1 text-sm text-amber-900">
            <div className="font-semibold">Font Selection Tips:</div>
            <ul className="mt-1 list-inside list-disc space-y-0.5">
              <li><strong>Inter</strong> - Best for modern, minimalist stores</li>
              <li><strong>Playfair</strong> - Ideal for luxury and boutique brands</li>
              <li><strong>Montserrat</strong> - Great for bold, urban fashion</li>
              <li><strong>Poppins</strong> - Perfect for playful, kid-friendly stores</li>
              <li><strong>Roboto</strong> - Safe choice that works for any brand</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
