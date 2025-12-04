'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ShopTemplate, ShopHeroStyle, ShopCardStyle, ShopTheme } from '@busi/types';
import TemplateStyleSelector from './TemplateStyleSelector';
import HeroSectionBuilder from './HeroSectionBuilder';
import ProductCardConfigurator from './ProductCardConfigurator';
import SpacingControls from './SpacingControls';
import LivePreviewPane from './LivePreviewPane';
import { Sparkles, Layout, Sliders, Eye } from 'lucide-react';

interface LayoutDesignerProps {
  template: ShopTemplate;
  heroStyle: ShopHeroStyle;
  cardStyle: ShopCardStyle;
  theme: ShopTheme; // Full theme for preview
  onChange: (layout: {
    template?: ShopTemplate;
    heroStyle?: ShopHeroStyle;
    cardStyle?: ShopCardStyle;
    spacing?: {
      productGap: number;
      sectionPadding: number;
      cardPadding: number;
      borderRadius: number;
    };
  }) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function LayoutDesigner({
  template,
  heroStyle,
  cardStyle,
  theme,
  onChange,
}: LayoutDesignerProps) {
  const [spacing, setSpacing] = useState({
    productGap: 24,
    sectionPadding: 48,
    cardPadding: 16,
    borderRadius: 12,
  });

  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const handleSpacingChange = (newSpacing: typeof spacing) => {
    setSpacing(newSpacing);
    onChange({ spacing: newSpacing });
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Layout className="w-6 h-6 text-white" />
              </div>
              Layout Designer
            </h2>
            <p className="text-gray-600">
              Craft the perfect layout for your store with visual controls and live preview
            </p>
          </div>

          {/* Preview toggle button */}
          <button
            type="button"
            onClick={() => setIsPreviewVisible(!isPreviewVisible)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shadow-sm
              ${
                isPreviewVisible
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-600 hover:text-indigo-600'
              }
            `}
          >
            <Eye className="w-5 h-5" />
            {isPreviewVisible ? 'Hide Preview' : 'Show Live Preview'}
          </button>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">All changes are live</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-gray-600">Visual builder mode</span>
          </div>
        </div>
      </div>

      {/* Main content with dynamic width based on preview */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
        style={{
          maxWidth: isPreviewVisible ? '50%' : '100%',
          transition: 'max-width 0.3s ease',
        }}
      >
        {/* 1. Template Style Selector */}
        <motion.div
          variants={sectionVariants}
          className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <TemplateStyleSelector
            value={template}
            onChange={(newTemplate) => onChange({ template: newTemplate })}
          />
        </motion.div>

        {/* 2. Hero Section Builder */}
        <motion.div
          variants={sectionVariants}
          className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <HeroSectionBuilder
            value={heroStyle}
            onChange={(newHeroStyle) => onChange({ heroStyle: newHeroStyle })}
          />
        </motion.div>

        {/* 3. Product Card Configurator */}
        <motion.div
          variants={sectionVariants}
          className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <ProductCardConfigurator
            value={cardStyle}
            onChange={(newCardStyle) => onChange({ cardStyle: newCardStyle })}
          />
        </motion.div>

        {/* 4. Spacing Controls */}
        <motion.div
          variants={sectionVariants}
          className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <SpacingControls spacing={spacing} onChange={handleSpacingChange} />
        </motion.div>

        {/* Current Configuration Summary */}
        <motion.div
          variants={sectionVariants}
          className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Current Configuration
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wide text-indigo-600 mb-1">
                Template
              </div>
              <div className="font-bold text-gray-900 capitalize">
                {template.replace('-', ' ')}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wide text-indigo-600 mb-1">
                Hero Style
              </div>
              <div className="font-bold text-gray-900 capitalize">
                {heroStyle.replace('-', ' ')}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wide text-indigo-600 mb-1">
                Card Style
              </div>
              <div className="font-bold text-gray-900 capitalize">
                {cardStyle}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wide text-indigo-600 mb-1">
                Grid Gap
              </div>
              <div className="font-bold text-gray-900">
                {spacing.productGap}px
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pro Tips */}
        <motion.div
          variants={sectionVariants}
          className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 mb-2">
                Layout Combination Tips
              </h3>
              <div className="space-y-2 text-sm text-green-800">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>
                    <strong>Modern Minimal + Full Image Hero + Clean Cards</strong> - Perfect
                    for fashion and lifestyle brands
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>
                    <strong>Boutique Luxe + Split Layout + Elevated Cards</strong> - Ideal for
                    premium products and luxury items
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>
                    <strong>Playful + Video Hero + Bold Bordered Cards</strong> - Great for
                    kids products or creative brands
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>
                    <strong>Bold + Slider Hero + Compact Cards</strong> - Excellent for
                    high-energy stores with many products
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile tip */}
        <motion.div
          variants={sectionVariants}
          className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900"
        >
          <p>
            <strong>💡 Pro Tip:</strong> Use the live preview to see how your layout looks on
            different devices. Click "Show Live Preview" and toggle between Desktop, Tablet,
            and Mobile views.
          </p>
        </motion.div>
      </motion.div>

      {/* Live Preview Pane */}
      <LivePreviewPane
        theme={theme}
        isVisible={isPreviewVisible}
        onToggle={() => setIsPreviewVisible(!isPreviewVisible)}
      />
    </div>
  );
}
