'use client';

import { motion } from 'framer-motion';
import type { ShopTemplate, ShopHeroStyle, ShopCardStyle, ShopFont } from '@busi/types';
import { staggerContainer, staggerItem, hoverLift } from '@/lib/animations';

interface ThemePreset {
  name: string;
  description: string;
  badge?: string;
  accent: string;
  preview: string;
  values: {
    template: ShopTemplate;
    heroStyle: ShopHeroStyle;
    cardStyle: ShopCardStyle;
    primaryColor: string;
    secondaryColor: string;
    font: ShopFont;
  };
}

const THEME_PRESETS: ThemePreset[] = [
  {
    name: 'Modern Minimal',
    description: 'Calm neutrals with a product-first layout. Perfect for contemporary brands.',
    badge: 'Popular',
    accent: 'from-slate-900 via-slate-700 to-slate-500',
    preview: 'Clean lines, ample whitespace, and neutral tones',
    values: {
      template: 'minimal',
      heroStyle: 'big-banner',
      cardStyle: 'rounded',
      primaryColor: '#111827',
      secondaryColor: '#F3F4F6',
      font: 'inter',
    },
  },
  {
    name: 'Boutique Luxe',
    description: 'Elegant gold accents and editorial feel. Ideal for luxury boutiques.',
    badge: 'Premium',
    accent: 'from-amber-500 via-rose-400 to-amber-300',
    preview: 'Sophisticated typography, warm colors, elevated design',
    values: {
      template: 'boutique',
      heroStyle: 'small-hero',
      cardStyle: 'elevated',
      primaryColor: '#B45309',
      secondaryColor: '#FEF3C7',
      font: 'playfair',
    },
  },
  {
    name: 'Playful Kids',
    description: 'Bright gradients and rounded shapes. Great for children\'s products.',
    accent: 'from-sky-400 via-pink-400 to-lime-300',
    preview: 'Fun colors, playful animations, cheerful atmosphere',
    values: {
      template: 'kids',
      heroStyle: 'carousel',
      cardStyle: 'rounded',
      primaryColor: '#06B6D4',
      secondaryColor: '#F9A8D4',
      font: 'poppins',
    },
  },
  {
    name: 'Street Bold',
    description: 'High contrast with graphic headlines. Perfect for urban fashion.',
    accent: 'from-gray-900 via-red-600 to-amber-400',
    preview: 'Bold typography, sharp edges, high energy',
    values: {
      template: 'street',
      heroStyle: 'big-banner',
      cardStyle: 'square',
      primaryColor: '#111827',
      secondaryColor: '#F97316',
      font: 'montserrat',
    },
  },
];

interface PresetGalleryProps {
  onApplyPreset: (preset: ThemePreset['values'] & { name: string }) => void;
}

export default function PresetGallery({ onApplyPreset }: PresetGalleryProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900">Choose a Starting Point</h3>
            <p className="mt-1 text-sm text-blue-700">
              Select a professionally designed theme preset, then customize it to match your brand. All presets can be fully customized in the other tabs.
            </p>
          </div>
        </div>
      </div>

      {/* Presets Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        {THEME_PRESETS.map((preset) => (
          <motion.div
            key={preset.name}
            variants={staggerItem}
            className="group relative"
          >
            <motion.div
              variants={hoverLift}
              initial="rest"
              whileHover="hover"
              className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow"
            >
              {/* Preview Header with Gradient */}
              <div className={`relative h-32 bg-gradient-to-br ${preset.accent} p-6`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.3)_0%,_transparent_50%),_radial-gradient(circle_at_70%_70%,_rgba(255,255,255,0.2)_0%,_transparent_50%)]" />
                <div className="relative flex items-start justify-between">
                  <div className="text-white">
                    <h3 className="text-xl font-bold drop-shadow">{preset.name}</h3>
                    <p className="mt-1 text-sm opacity-90">{preset.preview}</p>
                  </div>
                  {preset.badge && (
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {preset.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-sm text-gray-600">{preset.description}</p>

                {/* Theme Details */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-gray-50 p-2">
                    <div className="font-semibold text-gray-700">Template</div>
                    <div className="mt-0.5 capitalize text-gray-600">{preset.values.template}</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-2">
                    <div className="font-semibold text-gray-700">Hero</div>
                    <div className="mt-0.5 capitalize text-gray-600">
                      {preset.values.heroStyle.replace('-', ' ')}
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-2">
                    <div className="font-semibold text-gray-700">Cards</div>
                    <div className="mt-0.5 capitalize text-gray-600">{preset.values.cardStyle}</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-2">
                    <div className="font-semibold text-gray-700">Font</div>
                    <div className="mt-0.5 capitalize text-gray-600">
                      {preset.values.font === 'playfair' ? 'Playfair' : preset.values.font}
                    </div>
                  </div>
                </div>

                {/* Color Swatches */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-600">Colors:</span>
                  <div className="flex gap-1.5">
                    <div
                      className="h-6 w-6 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
                      style={{ backgroundColor: preset.values.primaryColor }}
                      title="Primary color"
                    />
                    <div
                      className="h-6 w-6 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
                      style={{ backgroundColor: preset.values.secondaryColor }}
                      title="Secondary color"
                    />
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => onApplyPreset({ ...preset.values, name: preset.name })}
                  className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  Apply This Preset
                </button>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Info Footer */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-600">
            <strong>Tip:</strong> After applying a preset, you can fine-tune every aspect including colors, typography, and layout in the other tabs. Your changes are saved automatically when you click "Save Changes".
          </p>
        </div>
      </div>
    </div>
  );
}
