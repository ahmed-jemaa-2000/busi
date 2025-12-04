'use client';

import type { ShopTemplate, ShopHeroStyle, ShopCardStyle } from '@busi/types';

interface LayoutDesignerProps {
  template: ShopTemplate;
  heroStyle: ShopHeroStyle;
  cardStyle: ShopCardStyle;
  onChange: (layout: {
    template?: ShopTemplate;
    heroStyle?: ShopHeroStyle;
    cardStyle?: ShopCardStyle;
  }) => void;
}

const TEMPLATES = [
  {
    value: 'minimal' as const,
    label: 'Minimal',
    description: 'Clean and simple design with ample whitespace',
    accent: 'from-slate-50 via-white to-slate-100',
    features: ['Product-first', 'Clean lines', 'Neutral tones']
  },
  {
    value: 'boutique' as const,
    label: 'Boutique',
    description: 'Elegant and curated with sophisticated spacing',
    accent: 'from-amber-50 via-white to-rose-50',
    features: ['Luxury feel', 'Editorial style', 'Warm colors']
  },
  {
    value: 'kids' as const,
    label: 'Kids',
    description: 'Playful and colorful with rounded shapes',
    accent: 'from-sky-50 via-pink-50 to-amber-50',
    features: ['Fun animations', 'Bright colors', 'Rounded corners']
  },
  {
    value: 'street' as const,
    label: 'Street',
    description: 'Bold and urban with high contrast',
    accent: 'from-gray-900 via-gray-800 to-gray-700',
    features: ['Sharp edges', 'Bold typography', 'High energy']
  },
];

const HERO_STYLES = [
  {
    value: 'big-banner' as const,
    label: 'Big Banner',
    description: 'Large hero section with text overlay',
    height: 'Tall (500-600px)'
  },
  {
    value: 'small-hero' as const,
    label: 'Small Hero',
    description: 'Compact header section',
    height: 'Short (200-300px)'
  },
  {
    value: 'carousel' as const,
    label: 'Carousel',
    description: 'Rotating featured products slider',
    height: 'Medium (400px)'
  },
];

const CARD_STYLES = [
  {
    value: 'rounded' as const,
    label: 'Rounded',
    description: 'Soft rounded corners (12px radius)',
    preview: 'rounded-xl'
  },
  {
    value: 'square' as const,
    label: 'Square',
    description: 'Sharp edges with no rounding',
    preview: 'rounded-none'
  },
  {
    value: 'elevated' as const,
    label: 'Elevated',
    description: 'Card with prominent shadow',
    preview: 'rounded-xl shadow-lg'
  },
];

export default function LayoutDesigner({ template, heroStyle, cardStyle, onChange }: LayoutDesignerProps) {
  return (
    <div className="space-y-6">
      {/* Template Style */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Template Style</h3>
        <p className="mb-6 text-sm text-gray-600">
          Choose the overall design style for your storefront. This affects spacing, animations, and overall feel.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange({ template: t.value })}
              className={`
                relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all
                ${
                  template === t.value
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50'
                }
              `}
            >
              {/* Gradient Preview */}
              <div className={`mb-4 h-24 rounded-lg bg-gradient-to-br ${t.accent} p-4 ${t.value === 'street' ? 'text-white' : 'text-gray-900'}`}>
                <div className="text-sm font-semibold">{t.label}</div>
                <div className={`mt-1 text-xs ${t.value === 'street' ? 'text-gray-300' : 'text-gray-600'}`}>Preview</div>
              </div>

              {/* Info */}
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">{t.label}</h4>
                  {template === t.value && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-600">{t.description}</p>

                {/* Features */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Hero Style */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Hero Section Style</h3>
        <p className="mb-6 text-sm text-gray-600">
          Configure how your homepage hero section appears.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {HERO_STYLES.map((h) => (
            <button
              key={h.value}
              type="button"
              onClick={() => onChange({ heroStyle: h.value })}
              className={`
                rounded-xl border-2 p-4 text-left transition-all
                ${
                  heroStyle === h.value
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50'
                }
              `}
            >
              {/* Visual Preview */}
              <div className="mb-4 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <div
                  className={`
                    bg-gradient-to-r from-primary to-primary/60 p-2
                    ${h.value === 'big-banner' ? 'h-24' : h.value === 'small-hero' ? 'h-12' : 'h-16'}
                  `}
                >
                  <div className="text-xs text-white/90">{h.height}</div>
                </div>
                {h.value === 'carousel' && (
                  <div className="flex gap-1 p-2">
                    <div className="h-8 flex-1 rounded bg-gray-200" />
                    <div className="h-8 flex-1 rounded bg-gray-200" />
                    <div className="h-8 flex-1 rounded bg-gray-200" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">{h.label}</h4>
                  {heroStyle === h.value && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-600">{h.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Card Style */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Product Card Style</h3>
        <p className="mb-6 text-sm text-gray-600">
          Choose how product cards appear in grids and lists.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {CARD_STYLES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => onChange({ cardStyle: c.value })}
              className={`
                rounded-xl border-2 p-4 text-left transition-all
                ${
                  cardStyle === c.value
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50'
                }
              `}
            >
              {/* Visual Preview */}
              <div className="mb-4 flex gap-2">
                <div
                  className={`
                    flex-1 border bg-white p-3
                    ${c.preview}
                  `}
                >
                  <div className="mb-2 aspect-square bg-gradient-to-br from-primary/20 to-primary/10" />
                  <div className="h-2 rounded bg-gray-200" />
                  <div className="mt-1 h-2 w-2/3 rounded bg-gray-200" />
                </div>
              </div>

              {/* Info */}
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">{c.label}</h4>
                  {cardStyle === c.value && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-600">{c.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Layout Summary */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Current Layout Configuration</h3>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Template</div>
            <div className="mt-1 font-semibold capitalize text-gray-900">
              {TEMPLATES.find(t => t.value === template)?.label}
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Hero Style</div>
            <div className="mt-1 font-semibold capitalize text-gray-900">
              {HERO_STYLES.find(h => h.value === heroStyle)?.label}
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Card Style</div>
            <div className="mt-1 font-semibold capitalize text-gray-900">
              {CARD_STYLES.find(c => c.value === cardStyle)?.label}
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-xl border border-green-200 bg-green-50 p-4">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 flex-shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1 text-sm text-green-900">
            <div className="font-semibold">Layout Best Practices:</div>
            <ul className="mt-1 list-inside list-disc space-y-0.5">
              <li><strong>Minimal</strong> + Big Banner = Great for showcasing hero products</li>
              <li><strong>Boutique</strong> + Small Hero + Elevated cards = Luxury feel</li>
              <li><strong>Kids</strong> + Carousel + Rounded cards = Fun and engaging</li>
              <li><strong>Street</strong> + Big Banner + Square cards = Bold and modern</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
