'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import type { Shop } from '@busi/types';
import { getStrapiMediaUrl } from '@/lib/strapi';

const TEMPLATES = [
  { value: 'minimal', label: 'Minimal', description: 'Clean and simple design' },
  { value: 'boutique', label: 'Boutique', description: 'Elegant and curated' },
  { value: 'kids', label: 'Kids', description: 'Playful and colorful' },
  { value: 'street', label: 'Street', description: 'Bold and urban' },
];

const HERO_STYLES = [
  { value: 'big-banner', label: 'Big Banner', description: 'Large hero with text overlay' },
  { value: 'small-hero', label: 'Small Hero', description: 'Compact header section' },
  { value: 'carousel', label: 'Carousel', description: 'Featured products slider' },
];

const CARD_STYLES = [
  { value: 'rounded', label: 'Rounded', description: 'Soft rounded corners' },
  { value: 'square', label: 'Square', description: 'Sharp edges' },
  { value: 'elevated', label: 'Elevated', description: 'Card with shadow' },
];

const FONTS = [
  { value: 'inter', label: 'Inter', description: 'Modern sans-serif' },
  { value: 'playfair', label: 'Playfair Display', description: 'Elegant serif' },
  { value: 'montserrat', label: 'Montserrat', description: 'Geometric sans-serif' },
  { value: 'roboto', label: 'Roboto', description: 'Clean and readable' },
  { value: 'poppins', label: 'Poppins', description: 'Friendly and rounded' },
];

export default function SettingsPage() {
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#ffffff');
  const [font, setFont] = useState('inter');
  const [template, setTemplate] = useState('minimal');
  const [heroStyle, setHeroStyle] = useState('big-banner');
  const [cardStyle, setCardStyle] = useState('rounded');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');

  // Logo handling
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchShop();
  }, []);

  const fetchShop = async () => {
    try {
      const response = await fetch('/api/dashboard/shop');
      if (response.ok) {
        const data = await response.json();
        setShop(data);
        populateForm(data);
      }
    } catch (error) {
      console.error('Error fetching shop:', error);
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (shopData: Shop) => {
    setName(shopData.name);
    setPrimaryColor(shopData.primaryColor);
    setSecondaryColor(shopData.secondaryColor);
    setFont(shopData.font);
    setTemplate(shopData.template);
    setHeroStyle(shopData.heroStyle);
    setCardStyle(shopData.cardStyle);
    setWhatsappNumber(shopData.whatsappNumber || '');
    setInstagramUrl(shopData.instagramUrl || '');
    setFacebookUrl(shopData.facebookUrl || '');

    if (shopData.logo) {
      setCurrentLogo(getStrapiMediaUrl(shopData.logo.url));
    }
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo must be less than 5MB');
        return;
      }

      setNewLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setNewLogo(null);
    setLogoPreview(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    if (!name.trim()) {
      toast.error('Shop name is required');
      return false;
    }

    if (whatsappNumber && !/^[+]?[0-9]{8,15}$/.test(whatsappNumber.replace(/\s/g, ''))) {
      toast.error('Invalid WhatsApp number format');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      const data: any = {
        name: name.trim(),
        primaryColor,
        secondaryColor,
        font,
        template,
        heroStyle,
        cardStyle,
      };

      if (whatsappNumber) {
        data.whatsappNumber = whatsappNumber.replace(/\s/g, '');
      }
      if (instagramUrl) {
        data.instagramUrl = instagramUrl.trim();
      }
      if (facebookUrl) {
        data.facebookUrl = facebookUrl.trim();
      }

      formData.append('data', JSON.stringify(data));

      if (newLogo) {
        formData.append('files.logo', newLogo);
      }

      const response = await fetch('/api/dashboard/shop', {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      toast.success('Settings saved successfully!');
      router.refresh();
      fetchShop();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load shop settings</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Shop Settings</h1>
        <p className="text-gray-600 mt-1">Customize your storefront appearance and information</p>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shop Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shop Logo</label>
          <div className="flex items-center space-x-4">
            {(logoPreview || currentLogo) && (
              <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                <Image
                  src={logoPreview || currentLogo || ''}
                  alt="Shop logo"
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                {currentLogo || logoPreview ? 'Change Logo' : 'Upload Logo'}
              </button>
              {(logoPreview || currentLogo) && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="ml-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Remove
                </button>
              )}
              <p className="text-sm text-gray-500 mt-1">Recommended: 200x200px, max 5MB</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subdomain
          </label>
          <input
            type="text"
            value={shop.subdomain}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
          />
          <p className="text-sm text-gray-500 mt-1">
            Your storefront: https://{shop.subdomain}.{process.env.NODE_ENV === 'development' ? 'brandini.test:3000' : 'brandini.tn'}
          </p>
        </div>
      </div>

      {/* Theme Customization */}
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h3 className="text-lg font-semibold mb-4">Theme & Appearance</h3>

        {/* Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-16 h-16 border-2 border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                placeholder="#000000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-16 h-16 border-2 border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>

        {/* Template */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Template Style</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTemplate(t.value as any)}
                className={`p-4 border-2 rounded-lg text-left transition ${
                  template === t.value
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-sm">{t.label}</div>
                <div className="text-xs text-gray-500 mt-1">{t.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Hero Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Hero Section Style</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {HERO_STYLES.map((h) => (
              <button
                key={h.value}
                type="button"
                onClick={() => setHeroStyle(h.value as any)}
                className={`p-4 border-2 rounded-lg text-left transition ${
                  heroStyle === h.value
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-sm">{h.label}</div>
                <div className="text-xs text-gray-500 mt-1">{h.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Card Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Product Card Style</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {CARD_STYLES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCardStyle(c.value as any)}
                className={`p-4 border-2 rounded-lg text-left transition ${
                  cardStyle === c.value
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-sm">{c.label}</div>
                <div className="text-xs text-gray-500 mt-1">{c.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Font */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Typography</label>
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {FONTS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label} — {f.description}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contact & Social */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Contact & Social Links</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            WhatsApp Number
          </label>
          <input
            type="text"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="+216 XX XXX XXX"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-sm text-gray-500 mt-1">
            Used for "Order via WhatsApp" button
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instagram URL
          </label>
          <input
            type="url"
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            placeholder="https://instagram.com/yourshop"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Facebook URL
          </label>
          <input
            type="url"
            value={facebookUrl}
            onChange={(e) => setFacebookUrl(e.target.value)}
            placeholder="https://facebook.com/yourshop"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end space-x-4 pt-4 border-t">
        <button
          type="button"
          onClick={() => populateForm(shop)}
          disabled={saving}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center space-x-2"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Settings</span>
          )}
        </button>
      </div>
    </form>
  );
}
