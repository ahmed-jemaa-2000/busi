'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import type { Shop } from '@busi/types';

interface ThemeContextType {
  shop: Shop;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  shop: Shop;
  children: ReactNode;
}

const FONT_FAMILIES = {
  inter: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  playfair: "'Playfair Display', Georgia, serif",
  montserrat: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
  roboto: "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
  poppins: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
};

export function ThemeProvider({ shop, children }: ThemeProviderProps) {
  useEffect(() => {
    // Apply theme CSS variables to root element
    const root = document.documentElement;

    root.style.setProperty('--color-primary', shop.primaryColor);
    root.style.setProperty('--color-secondary', shop.secondaryColor);
    root.style.setProperty('--font-family', FONT_FAMILIES[shop.font] || FONT_FAMILIES.inter);

    // Apply template-specific classes
    root.setAttribute('data-template', shop.template);
    root.setAttribute('data-hero-style', shop.heroStyle);
    root.setAttribute('data-card-style', shop.cardStyle);

    // Cleanup on unmount
    return () => {
      root.removeAttribute('data-template');
      root.removeAttribute('data-hero-style');
      root.removeAttribute('data-card-style');
    };
  }, [shop]);

  return (
    <ThemeContext.Provider value={{ shop }}>
      {children}
    </ThemeContext.Provider>
  );
}
