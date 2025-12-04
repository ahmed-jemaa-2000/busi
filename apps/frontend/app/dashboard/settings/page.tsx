'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Shop } from '@busi/types';
import { Tabs, TabPanel } from '@/components/ui/Tabs';
import PresetGallery from '@/components/dashboard/settings/PresetGallery';
import ColorCustomizer from '@/components/dashboard/settings/ColorCustomizer';
import TypographyEditor from '@/components/dashboard/settings/TypographyEditor';
import LayoutDesigner from '@/components/dashboard/settings/LayoutDesigner';
import BasicSettings from '@/components/dashboard/settings/BasicSettings';

export default function SettingsPage() {
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    primaryColor: '#2563EB',
    secondaryColor: '#F59E0B',
    font: 'inter' as const,
    template: 'minimal' as const,
    themeId: undefined as string | undefined,
    heroStyle: 'big-banner' as const,
    cardStyle: 'rounded' as const,
    whatsappNumber: '',
    instagramUrl: '',
    facebookUrl: '',
    logo: null as File | null,
  });

  useEffect(() => {
    fetchShop();
  }, []);

  const fetchShop = async () => {
    try {
      const response = await fetch('/api/dashboard/shop');
      if (response.ok) {
        const data = await response.json();
        setShop(data);
        setFormData({
          name: data.name,
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          font: data.font,
          template: data.template,
          themeId: data.themeId,
          heroStyle: data.heroStyle,
          cardStyle: data.cardStyle,
          whatsappNumber: data.whatsappNumber || '',
          instagramUrl: data.instagramUrl || '',
          facebookUrl: data.facebookUrl || '',
          logo: null,
        });
      }
    } catch (error) {
      console.error('Error fetching shop:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formDataToSend = new FormData();

      const data: any = {
        name: formData.name.trim(),
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        font: formData.font,
        template: formData.template,
        themeId: formData.themeId,
        heroStyle: formData.heroStyle,
        cardStyle: formData.cardStyle,
      };

      if (formData.whatsappNumber) {
        data.whatsappNumber = formData.whatsappNumber.replace(/\s/g, '');
      }
      if (formData.instagramUrl) {
        data.instagramUrl = formData.instagramUrl.trim();
      }
      if (formData.facebookUrl) {
        data.facebookUrl = formData.facebookUrl.trim();
      }

      formDataToSend.append('data', JSON.stringify(data));

      if (formData.logo) {
        formDataToSend.append('files.logo', formData.logo);
      }

      const response = await fetch('/api/dashboard/shop', {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      toast.success('Settings saved successfully!');
      router.refresh();
      fetchShop();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">Failed to load shop settings</p>
      </div>
    );
  }

  const tabs = [
    {
      id: 'basic',
      label: 'Basic Info',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'presets',
      label: 'Presets',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      id: 'colors',
      label: 'Colors',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      id: 'typography',
      label: 'Typography',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      ),
    },
    {
      id: 'layout',
      label: 'Layout',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shop Settings</h1>
          <p className="mt-1 text-gray-600">Customize your storefront appearance and information</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
        >
          {saving ? (
            <>
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Tabbed Interface */}
      <Tabs tabs={tabs} defaultTab="basic" variant="line">
        <TabPanel id="basic">
          <BasicSettings
            shop={shop}
            formData={formData}
            setFormData={setFormData}
          />
        </TabPanel>

        <TabPanel id="presets">
          <PresetGallery
            onApplyPreset={(preset) => {
              setFormData({
                ...formData,
                template: preset.template,
                themeId: preset.themeId,
                heroStyle: preset.heroStyle,
                cardStyle: preset.cardStyle,
                primaryColor: preset.primaryColor,
                secondaryColor: preset.secondaryColor,
                font: preset.font,
              });
              // Note: The actual save happens when user clicks "Save Changes"
            }}
            currentPreset={{
              template: formData.template,
              primaryColor: formData.primaryColor,
              secondaryColor: formData.secondaryColor,
              font: formData.font,
              themeId: formData.themeId,
            }}
          />
        </TabPanel>

        <TabPanel id="colors">
          <ColorCustomizer
            primaryColor={formData.primaryColor}
            secondaryColor={formData.secondaryColor}
            onChange={(colors) => {
              setFormData({ ...formData, ...colors });
            }}
          />
        </TabPanel>

        <TabPanel id="typography">
          <TypographyEditor
            font={formData.font}
            onChange={(font) => setFormData({ ...formData, font })}
          />
        </TabPanel>

        <TabPanel id="layout">
          <LayoutDesigner
            template={formData.template}
            heroStyle={formData.heroStyle}
            cardStyle={formData.cardStyle}
            theme={{
              name: formData.name,
              primaryColor: formData.primaryColor,
              secondaryColor: formData.secondaryColor,
              font: formData.font,
              template: formData.template,
              heroStyle: formData.heroStyle,
              cardStyle: formData.cardStyle,
            }}
            onChange={(layout) => setFormData({ ...formData, ...layout })}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
}
