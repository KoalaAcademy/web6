import React, { useEffect } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
  theme: {
    primaryColor?: string;
    backgroundColor?: string;
    buttonColor?: string;
    font?: string;
    layoutTemplate?: string;
    language?: string;
  };
}

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  useEffect(() => {
    // Apply theme to CSS custom properties
    const root = document.documentElement;
    
    if (theme.primaryColor) {
      root.style.setProperty('--primary', theme.primaryColor);
      root.style.setProperty('--color-primary', theme.primaryColor);
      root.style.setProperty('--sidebar-primary', theme.primaryColor);
      root.style.setProperty('--color-sidebar-primary', theme.primaryColor);
    }
    
    if (theme.backgroundColor) {
      root.style.setProperty('--background', theme.backgroundColor);
      root.style.setProperty('--color-background', theme.backgroundColor);
      document.body.style.backgroundColor = theme.backgroundColor;
    }
    
    if (theme.buttonColor) {
      root.style.setProperty('--button-color', theme.buttonColor);
      // Also update primary for buttons
      root.style.setProperty('--primary', theme.buttonColor);
      root.style.setProperty('--color-primary', theme.buttonColor);
    }
    
    if (theme.font) {
      root.style.setProperty('--font-family', theme.font);
      document.body.style.fontFamily = theme.font;
    }
    
    // Add layout template class to body
    if (theme.layoutTemplate) {
      document.body.classList.remove('layout-grid', 'layout-masonry', 'layout-list');
      document.body.classList.add(`layout-${theme.layoutTemplate}`);
    }
    
    // Set language attribute
    if (theme.language) {
      document.documentElement.lang = theme.language;
    }
  }, [theme]);

  return <>{children}</>;
}