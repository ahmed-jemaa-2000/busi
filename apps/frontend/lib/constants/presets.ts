import type { ShopTemplate, ShopHeroStyle, ShopCardStyle, ShopFont } from '@busi/types';

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  category: 'fashion' | 'electronics' | 'food' | 'handmade' | 'beauty' | 'general';
  style: 'minimal' | 'bold' | 'elegant' | 'playful';
  colorScheme: 'light' | 'dark' | 'colorful' | 'monochrome';
  badge?: 'popular' | 'premium' | 'new';

  // Visual assets
  screenshot: string;
  thumbnail: string;

  // Best for
  bestFor: string[];
  mood: string[];

  // Configuration
  values: {
    template: ShopTemplate;
    heroStyle: ShopHeroStyle;
    cardStyle: ShopCardStyle;
    primaryColor: string;
    secondaryColor: string;
    font: ShopFont;
  };
}

export const THEME_PRESETS: ThemePreset[] = [
  // 1. Modern Minimal - Clean & Professional
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean lines, ample whitespace, and product-first design. Perfect for fashion and lifestyle brands that want a professional, modern look.',
    category: 'fashion',
    style: 'minimal',
    colorScheme: 'monochrome',
    badge: 'popular',
    screenshot: '/presets/modern-minimal-full.jpg',
    thumbnail: '/presets/modern-minimal-thumb.jpg',
    bestFor: ['Fashion', 'Lifestyle', 'General Stores'],
    mood: ['Professional', 'Clean', 'Modern'],
    values: {
      template: 'minimal',
      heroStyle: 'full-image',
      cardStyle: 'clean',
      primaryColor: '#111827',
      secondaryColor: '#F3F4F6',
      font: 'inter',
    },
  },

  // 2. Luxury Boutique - Sophisticated & Premium
  {
    id: 'boutique-luxe',
    name: 'Luxury Boutique',
    description: 'Sophisticated and elegant with warm tones and refined spacing. Ideal for luxury boutiques, high-end fashion, and premium products.',
    category: 'fashion',
    style: 'elegant',
    colorScheme: 'light',
    badge: 'premium',
    screenshot: '/presets/boutique-luxe-full.jpg',
    thumbnail: '/presets/boutique-luxe-thumb.jpg',
    bestFor: ['Luxury Boutiques', 'High-end Fashion', 'Jewelry', 'Premium Goods'],
    mood: ['Sophisticated', 'Elegant', 'Premium', 'Refined'],
    values: {
      template: 'boutique',
      heroStyle: 'split',
      cardStyle: 'elevated',
      primaryColor: '#92400E',
      secondaryColor: '#FEF3C7',
      font: 'playfair',
    },
  },

  // 3. Bold Urban - High Energy & Striking
  {
    id: 'street-bold',
    name: 'Bold Urban',
    description: 'High contrast design with strong borders and dramatic visuals. Perfect for streetwear, urban fashion, and youth-oriented brands.',
    category: 'fashion',
    style: 'bold',
    colorScheme: 'dark',
    badge: 'new',
    screenshot: '/presets/street-bold-full.jpg',
    thumbnail: '/presets/street-bold-thumb.jpg',
    bestFor: ['Streetwear', 'Urban Fashion', 'Electronics', 'Youth Brands'],
    mood: ['Bold', 'Energetic', 'Urban', 'Striking'],
    values: {
      template: 'playful',
      heroStyle: 'video',
      cardStyle: 'bordered',
      primaryColor: '#111827',
      secondaryColor: '#F97316',
      font: 'montserrat',
    },
  },

  // 4. Soft & Elegant - Gentle & Feminine
  {
    id: 'beauty-soft',
    name: 'Soft & Elegant',
    description: 'Soft pastels, gentle aesthetics, and refined details. Designed for beauty, cosmetics, wellness, and feminine products.',
    category: 'beauty',
    style: 'elegant',
    colorScheme: 'light',
    screenshot: '/presets/beauty-soft-full.jpg',
    thumbnail: '/presets/beauty-soft-thumb.jpg',
    bestFor: ['Beauty Products', 'Cosmetics', 'Wellness', 'Feminine Brands'],
    mood: ['Soft', 'Gentle', 'Feminine', 'Elegant'],
    values: {
      template: 'boutique',
      heroStyle: 'minimal',
      cardStyle: 'elevated',
      primaryColor: '#EC4899',
      secondaryColor: '#FCE7F3',
      font: 'poppins',
    },
  },

  // 5. Playful Bright - Fun & Energetic
  {
    id: 'playful-kids',
    name: 'Playful Bright',
    description: 'Vibrant colors, rounded shapes, and fun animations. Great for children\'s products, toys, and family-friendly stores.',
    category: 'general',
    style: 'playful',
    colorScheme: 'colorful',
    screenshot: '/presets/playful-kids-full.jpg',
    thumbnail: '/presets/playful-kids-thumb.jpg',
    bestFor: ['Kids Products', 'Toys', 'Fun Brands', 'Family Stores'],
    mood: ['Fun', 'Cheerful', 'Playful', 'Energetic'],
    values: {
      template: 'playful',
      heroStyle: 'slider',
      cardStyle: 'bordered',
      primaryColor: '#06B6D4',
      secondaryColor: '#F9A8D4',
      font: 'poppins',
    },
  },

  // 6. Dark Premium - Luxurious & Modern
  {
    id: 'beauty-dark',
    name: 'Dark Premium',
    description: 'Luxurious dark theme with metallic accents and dramatic shadows. Perfect for premium beauty, tech products, and modern luxury brands.',
    category: 'beauty',
    style: 'elegant',
    colorScheme: 'dark',
    badge: 'premium',
    screenshot: '/presets/beauty-dark-full.jpg',
    thumbnail: '/presets/beauty-dark-thumb.jpg',
    bestFor: ['Premium Beauty', 'Tech Products', 'Luxury Cosmetics', 'Modern Brands'],
    mood: ['Luxurious', 'Sophisticated', 'Premium', 'Modern'],
    values: {
      template: 'minimal',
      heroStyle: 'full-image',
      cardStyle: 'elevated',
      primaryColor: '#1F2937',
      secondaryColor: '#D97706',
      font: 'inter',
    },
  },
];

// Helper functions
export function getPresetById(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((preset) => preset.id === id);
}

export function getPresetsByCategory(category: ThemePreset['category']): ThemePreset[] {
  return THEME_PRESETS.filter((preset) => preset.category === category);
}

export function getPresetsByStyle(style: ThemePreset['style']): ThemePreset[] {
  return THEME_PRESETS.filter((preset) => preset.style === style);
}

export function getPresetsByColorScheme(colorScheme: ThemePreset['colorScheme']): ThemePreset[] {
  return THEME_PRESETS.filter((preset) => preset.colorScheme === colorScheme);
}

export function searchPresets(query: string): ThemePreset[] {
  const lowerQuery = query.toLowerCase();
  return THEME_PRESETS.filter(
    (preset) =>
      preset.name.toLowerCase().includes(lowerQuery) ||
      preset.description.toLowerCase().includes(lowerQuery) ||
      preset.bestFor.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      preset.mood.some((mood) => mood.toLowerCase().includes(lowerQuery))
  );
}
