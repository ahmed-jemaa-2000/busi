'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';

interface ColorCustomizerProps {
  primaryColor: string;
  secondaryColor: string;
  onChange: (colors: { primaryColor: string; secondaryColor: string }) => void;
}

// Popular color palettes
const COLOR_PALETTES = [
  {
    name: 'Ocean Blue',
    primary: '#2563EB',
    secondary: '#DBEAFE',
    category: 'Professional'
  },
  {
    name: 'Forest Green',
    primary: '#059669',
    secondary: '#D1FAE5',
    category: 'Natural'
  },
  {
    name: 'Sunset Orange',
    primary: '#EA580C',
    secondary: '#FED7AA',
    category: 'Energetic'
  },
  {
    name: 'Royal Purple',
    primary: '#7C3AED',
    secondary: '#EDE9FE',
    category: 'Luxury'
  },
  {
    name: 'Rose Pink',
    primary: '#E11D48',
    secondary: '#FFE4E6',
    category: 'Playful'
  },
  {
    name: 'Slate Gray',
    primary: '#475569',
    secondary: '#F1F5F9',
    category: 'Minimal'
  },
  {
    name: 'Golden Yellow',
    primary: '#F59E0B',
    secondary: '#FEF3C7',
    category: 'Warm'
  },
  {
    name: 'Teal Aqua',
    primary: '#14B8A6',
    secondary: '#CCFBF1',
    category: 'Fresh'
  },
];

// Generate shades for a color
function generateShades(hex: string): string[] {
  const shades = [];
  for (let i = 0; i < 7; i++) {
    const factor = 1 - (i * 0.15);
    shades.push(adjustColor(hex, factor));
  }
  return shades;
}

function adjustColor(hex: string, factor: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.floor(((num >> 16) & 255) * factor));
  const g = Math.min(255, Math.floor(((num >> 8) & 255) * factor));
  const b = Math.min(255, Math.floor((num & 255) * factor));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// Check contrast ratio
function getContrastRatio(hex1: string, hex2: string): number {
  const getLuminance = (hex: string) => {
    const rgb = parseInt(hex.replace('#', ''), 16);
    const r = ((rgb >> 16) & 255) / 255;
    const g = ((rgb >> 8) & 255) / 255;
    const b = (rgb & 255) / 255;

    const [rs, gs, bs] = [r, g, b].map(c =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export default function ColorCustomizer({ primaryColor, secondaryColor, onChange }: ColorCustomizerProps) {
  const [activeColor, setActiveColor] = useState<'primary' | 'secondary'>('primary');

  const primaryShades = generateShades(primaryColor);
  const contrastRatio = getContrastRatio(primaryColor, '#FFFFFF');
  const meetsWCAG = contrastRatio >= 4.5;

  const handlePaletteSelect = (palette: typeof COLOR_PALETTES[0]) => {
    onChange({
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Palettes */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Color Palettes</h3>
            <p className="text-sm text-gray-600">Choose a pre-made color combination</p>
          </div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3 md:grid-cols-4"
        >
          {COLOR_PALETTES.map((palette) => (
            <motion.button
              key={palette.name}
              variants={staggerItem}
              type="button"
              onClick={() => handlePaletteSelect(palette)}
              className="group relative overflow-hidden rounded-xl border-2 border-gray-200 p-3 text-left transition-all hover:border-primary hover:shadow-md"
            >
              {/* Color Preview */}
              <div className="mb-2 flex gap-2">
                <div
                  className="h-12 flex-1 rounded-lg shadow-inner ring-1 ring-gray-200"
                  style={{ backgroundColor: palette.primary }}
                />
                <div
                  className="h-12 flex-1 rounded-lg shadow-inner ring-1 ring-gray-200"
                  style={{ backgroundColor: palette.secondary }}
                />
              </div>

              {/* Info */}
              <div className="text-xs">
                <div className="font-semibold text-gray-900">{palette.name}</div>
                <div className="text-gray-500">{palette.category}</div>
              </div>

              {/* Selected Indicator */}
              {primaryColor === palette.primary && secondaryColor === palette.secondary && (
                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Custom Colors */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Primary Color */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Primary Color</h3>

          <div className="space-y-4">
            {/* Color Picker */}
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => onChange({ primaryColor: e.target.value, secondaryColor })}
                className="h-16 w-16 cursor-pointer rounded-lg border-2 border-gray-200"
              />
              <div className="flex-1">
                <div className="mb-1 text-sm font-medium text-gray-700">HEX Value</div>
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                      onChange({ primaryColor: value, secondaryColor });
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm uppercase transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="#2563EB"
                />
              </div>
            </div>

            {/* Shades Preview */}
            <div>
              <div className="mb-2 text-sm font-medium text-gray-700">Color Shades</div>
              <div className="grid grid-cols-7 gap-1">
                {primaryShades.map((shade, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => onChange({ primaryColor: shade, secondaryColor })}
                    className="group relative aspect-square rounded-lg ring-1 ring-gray-200 transition-transform hover:scale-110"
                    style={{ backgroundColor: shade }}
                    title={`Shade ${index + 1}`}
                  >
                    {shade === primaryColor && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-white shadow-sm ring-2 ring-gray-900/20" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>Lighter</span>
                <span>Darker</span>
              </div>
            </div>

            {/* Usage Info */}
            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
              <div className="font-medium text-gray-700">Used for:</div>
              <ul className="mt-1 list-inside list-disc space-y-0.5">
                <li>Buttons and CTAs</li>
                <li>Links and highlights</li>
                <li>Active states</li>
              </ul>
            </div>

            {/* Accessibility Check */}
            <div className={`rounded-lg p-3 ${meetsWCAG ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <div className="flex items-start gap-2">
                <svg
                  className={`h-5 w-5 flex-shrink-0 ${meetsWCAG ? 'text-green-600' : 'text-yellow-600'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={meetsWCAG ? "M5 13l4 4L19 7" : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"} />
                </svg>
                <div className="flex-1 text-sm">
                  <div className={`font-medium ${meetsWCAG ? 'text-green-900' : 'text-yellow-900'}`}>
                    {meetsWCAG ? 'Passes WCAG AA' : 'Consider darker shade'}
                  </div>
                  <div className={`${meetsWCAG ? 'text-green-700' : 'text-yellow-700'}`}>
                    Contrast ratio: {contrastRatio.toFixed(2)}:1
                    {!meetsWCAG && ' (4.5:1 recommended)'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Color */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Secondary Color</h3>

          <div className="space-y-4">
            {/* Color Picker */}
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => onChange({ primaryColor, secondaryColor: e.target.value })}
                className="h-16 w-16 cursor-pointer rounded-lg border-2 border-gray-200"
              />
              <div className="flex-1">
                <div className="mb-1 text-sm font-medium text-gray-700">HEX Value</div>
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                      onChange({ primaryColor, secondaryColor: value });
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm uppercase transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="#DBEAFE"
                />
              </div>
            </div>

            {/* Preview with Primary */}
            <div>
              <div className="mb-2 text-sm font-medium text-gray-700">Color Harmony</div>
              <div className="flex gap-2">
                <div
                  className="flex-1 rounded-lg p-4 text-center font-semibold text-white shadow-inner ring-1 ring-gray-200"
                  style={{ backgroundColor: primaryColor }}
                >
                  Primary
                </div>
                <div
                  className="flex-1 rounded-lg p-4 text-center font-semibold shadow-inner ring-1 ring-gray-200"
                  style={{ backgroundColor: secondaryColor, color: primaryColor }}
                >
                  Secondary
                </div>
              </div>
            </div>

            {/* Usage Info */}
            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
              <div className="font-medium text-gray-700">Used for:</div>
              <ul className="mt-1 list-inside list-disc space-y-0.5">
                <li>Backgrounds and surfaces</li>
                <li>Badges and tags</li>
                <li>Supporting elements</li>
              </ul>
            </div>

            {/* Live Preview */}
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 text-sm font-medium text-gray-700">Button Preview</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-lg px-4 py-2 font-semibold text-white shadow-sm transition-transform hover:scale-105"
                  style={{ backgroundColor: primaryColor }}
                >
                  Primary
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg border-2 px-4 py-2 font-semibold shadow-sm transition-transform hover:scale-105"
                  style={{
                    borderColor: primaryColor,
                    color: primaryColor,
                    backgroundColor: secondaryColor
                  }}
                >
                  Secondary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 flex-shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <div className="flex-1 text-sm text-blue-900">
            <div className="font-semibold">Color Tips:</div>
            <ul className="mt-1 list-inside list-disc space-y-0.5">
              <li>Use high contrast between primary color and white text</li>
              <li>Secondary color works best as a light tint of primary or complementary color</li>
              <li>Test your colors on different devices and in different lighting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
