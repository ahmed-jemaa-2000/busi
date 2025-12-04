'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { THEME_PRESETS, searchPresets, type ThemePreset } from '@/lib/constants/presets';
import { staggerContainer, staggerItem } from '@/lib/animations';
import PresetCard from './PresetCard';
import PresetFilter, { type FilterState } from './PresetFilter';
import PresetPreviewModal from './PresetPreviewModal';

interface PresetGalleryProps {
  onApplyPreset: (preset: ThemePreset['values'] & { name: string; themeId: string }) => void;
  currentPreset?: {
    template: string;
    primaryColor: string;
    secondaryColor: string;
    font: string;
    themeId?: string;
  };
}

export default function PresetGallery({ onApplyPreset, currentPreset }: PresetGalleryProps) {
  const presetCount = THEME_PRESETS.length;
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    style: 'all',
    colorScheme: 'all',
    search: '',
  });
  const [previewPreset, setPreviewPreset] = useState<ThemePreset | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'name'>('popular');

  const lineupSummary = useMemo(
    () =>
      THEME_PRESETS.map((preset) => ({
        id: preset.id,
        name: preset.name,
        style: preset.style,
        category: preset.category,
        primaryColor: preset.values.primaryColor,
        secondaryColor: preset.values.secondaryColor,
        bestFor: preset.bestFor.slice(0, 2).join(' · '),
      })),
    []
  );

  // Filter and search presets
  const filteredPresets = useMemo(() => {
    let results = [...THEME_PRESETS];

    // Apply search
    if (filters.search) {
      results = searchPresets(filters.search);
    }

    // Apply category filter
    if (filters.category !== 'all') {
      results = results.filter((preset) => preset.category === filters.category);
    }

    // Apply style filter
    if (filters.style !== 'all') {
      results = results.filter((preset) => preset.style === filters.style);
    }

    // Apply color scheme filter
    if (filters.colorScheme !== 'all') {
      results = results.filter((preset) => preset.colorScheme === filters.colorScheme);
    }

    // Sort results
    if (sortBy === 'popular') {
      results.sort((a, b) => {
        if (a.badge === 'popular') return -1;
        if (b.badge === 'popular') return 1;
        if (a.badge === 'premium') return -1;
        if (b.badge === 'premium') return 1;
        return 0;
      });
    } else {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    return results;
  }, [filters, sortBy]);

  // Check if preset is currently selected
  const isPresetSelected = (preset: ThemePreset) => {
    if (!currentPreset) return false;
    // Prefer themeId matching, fallback to old values matching
    if (currentPreset.themeId) {
      return preset.themeId === currentPreset.themeId;
    }
    return (
      preset.values.template === currentPreset.template &&
      preset.values.primaryColor === currentPreset.primaryColor &&
      preset.values.secondaryColor === currentPreset.secondaryColor &&
      preset.values.font === currentPreset.font
    );
  };

  const handleApplyPreset = (preset: ThemePreset) => {
    onApplyPreset({ ...preset.values, name: preset.name, themeId: preset.themeId });
    toast.success(`${preset.name} theme applied successfully!`, {
      description: 'Your store will now use the new design system. Visit your store to see the changes!',
      duration: 5000,
    });
  };

  const handlePreview = (preset: ThemePreset) => {
    setPreviewPreset(preset);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Store's Personality</h2>
        <p className="mt-2 text-gray-700">
          {presetCount} opinionated themes built for different storefront goals. See what each one is best at, then apply and refine.
        </p>
      </div>

      {/* Lineup purpose strip */}
      <div className="grid gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm md:grid-cols-3">
        {lineupSummary.map((preset) => (
          <div
            key={preset.id}
            className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-3 shadow-sm ring-1 ring-blue-100"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center gap-1 rounded-lg border border-gray-200 shadow-inner ring-1 ring-gray-100">
                <span className="h-4 w-4 rounded-full" style={{ background: preset.primaryColor }} />
                <span className="h-4 w-4 rounded-full border border-white/70" style={{ background: preset.secondaryColor }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{preset.name}</p>
                <p className="text-xs text-gray-600">
                  Best for: {preset.bestFor || preset.category}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-800">
              {preset.style}
            </span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <PresetFilter onFilterChange={setFilters} />

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{filteredPresets.length}</span>{' '}
          {filteredPresets.length === 1 ? 'theme' : 'themes'} available
        </p>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'popular' | 'name')}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="popular">Most Popular</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Presets Grid */}
      {filteredPresets.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {filteredPresets.map((preset) => (
            <motion.div key={preset.id} variants={staggerItem}>
              <PresetCard
                preset={preset}
                isSelected={isPresetSelected(preset)}
                onPreview={() => handlePreview(preset)}
                onApply={() => handleApplyPreset(preset)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-16">
          <svg
            className="h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No themes found</h3>
          <p className="mt-2 text-sm text-gray-600">
            Try adjusting your filters or search terms
          </p>
          <button
            onClick={() =>
              setFilters({
                category: 'all',
                style: 'all',
                colorScheme: 'all',
                search: '',
              })
            }
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Info Footer */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <svg
            className="h-5 w-5 flex-shrink-0 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <div className="flex-1">
            <p className="font-semibold text-blue-900">Customize After Applying</p>
            <p className="mt-1 text-sm text-blue-700">
              After selecting a preset, you can fine-tune every aspect including colors, fonts, and layout in the other tabs. Don't worry - nothing is permanent!
            </p>
          </div>
        </div>
      </div>

      {/* Helpful Tips */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Choosing the Right Theme</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Match Your Products</p>
              <p className="mt-1 text-sm text-gray-600">
                Choose a theme that complements your product photography and brand style
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Preview Before Applying</p>
              <p className="mt-1 text-sm text-gray-600">
                Use the preview feature to see how themes look on different devices
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Start Simple</p>
              <p className="mt-1 text-sm text-gray-600">
                Minimal themes are easier to customize and work well for most products
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">You Can Always Change</p>
              <p className="mt-1 text-sm text-gray-600">
                Themes can be switched anytime - experiment to find what works best
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <PresetPreviewModal
        preset={previewPreset}
        isOpen={!!previewPreset}
        onClose={() => setPreviewPreset(null)}
        onApply={() => {
          if (previewPreset) {
            handleApplyPreset(previewPreset);
            setPreviewPreset(null);
          }
        }}
      />
    </div>
  );
}
