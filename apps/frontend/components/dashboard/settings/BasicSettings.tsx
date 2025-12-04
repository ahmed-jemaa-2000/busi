'use client';

import { useRef } from 'react';
import Image from 'next/image';
import type { Shop } from '@busi/types';
import { getStrapiMediaUrl } from '@/lib/strapi';
import { toast } from 'sonner';

interface BasicSettingsProps {
  shop: Shop;
  formData: {
    name: string;
    whatsappNumber: string;
    instagramUrl: string;
    facebookUrl: string;
    logo: File | null;
  };
  setFormData: (data: any) => void;
}

export default function BasicSettings({ shop, formData, setFormData }: BasicSettingsProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const logoPreviewUrl = formData.logo
    ? URL.createObjectURL(formData.logo)
    : shop.logo
    ? getStrapiMediaUrl(shop.logo.url)
    : null;

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
      setFormData({ ...formData, logo: file });
    }
  };

  const handleRemoveLogo = () => {
    setFormData({ ...formData, logo: null });
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Shop Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Shop Information</h3>

        <div className="space-y-4">
          {/* Shop Name */}
          <div>
            <label htmlFor="shop-name" className="mb-1 block text-sm font-medium text-gray-700">
              Shop Name <span className="text-red-500">*</span>
            </label>
            <input
              id="shop-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 font-medium transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="My Amazing Store"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              This is the name that appears in your storefront header and browser title.
            </p>
          </div>

          {/* Subdomain (Read-only) */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Subdomain
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shop.subdomain}
                disabled
                className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-600"
              />
              <button
                type="button"
                onClick={() => {
                  const url = `https://${shop.subdomain}.${process.env.NODE_ENV === 'development' ? 'brandini.test:3000' : 'brandini.tn'}`;
                  navigator.clipboard.writeText(url);
                  toast.success('URL copied to clipboard');
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Copy URL
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Your storefront URL: <strong>https://{shop.subdomain}.{process.env.NODE_ENV === 'development' ? 'brandini.test:3000' : 'brandini.tn'}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Shop Logo</h3>

        <div className="space-y-4">
          <div className="flex items-start gap-6">
            {/* Logo Preview */}
            {logoPreviewUrl && (
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-50">
                <Image
                  src={logoPreviewUrl}
                  alt="Shop logo"
                  fill
                  className="object-contain p-2"
                />
              </div>
            )}

            {/* Upload Controls */}
            <div className="flex-1 space-y-3">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoSelect}
                className="hidden"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  {logoPreviewUrl ? 'Change Logo' : 'Upload Logo'}
                </button>

                {logoPreviewUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="rounded-lg bg-gray-50 p-3">
                <div className="flex items-start gap-2">
                  <svg className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Recommended:</p>
                    <ul className="mt-1 list-inside list-disc space-y-0.5">
                      <li>Square format (e.g., 200x200px)</li>
                      <li>PNG or SVG for best quality</li>
                      <li>Maximum file size: 5MB</li>
                      <li>Transparent background works best</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Social */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Contact & Social Links</h3>

        <div className="space-y-4">
          {/* WhatsApp */}
          <div>
            <label htmlFor="whatsapp" className="mb-1 block text-sm font-medium text-gray-700">
              WhatsApp Number
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <input
                id="whatsapp"
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="+216 XX XXX XXX"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Used for the "Order via WhatsApp" button on product pages
            </p>
          </div>

          {/* Instagram */}
          <div>
            <label htmlFor="instagram" className="mb-1 block text-sm font-medium text-gray-700">
              Instagram URL
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <input
                id="instagram"
                type="url"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/yourshop"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Facebook */}
          <div>
            <label htmlFor="facebook" className="mb-1 block text-sm font-medium text-gray-700">
              Facebook URL
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <input
                id="facebook"
                type="url"
                value={formData.facebookUrl}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/yourshop"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
