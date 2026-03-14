// 🎨 BRANDING ZENTRALE - Wave Brand "Ride the wave of life"
// Zielgruppe: Surfer, Schwimmer, Wassersport-Liebhaber (20-40 Jahre)
// Brand Persönlichkeit: Fließend, Kraftvoll, Frei, Naturverbunden, Lebendig

export const brandTokens = {
  // 🌊 WAVE COLORS (Exact Hex Codes)
  colors: {
    // Hauptfarben
    primary: '#0D5C7D',       // Deep Ocean Blue - Hauptfarbe für Branding
    secondary: '#F8B500',     // Sunset Gold - Akzente und CTAs
    tertiary: '#4A9BB8',      // Sky Blue - Sekundäre UI-Elemente
    accent: '#FF8A5C',        // Coral Orange - Highlights
    
    // Hintergrund & Oberflächen
    background: '#F7FBFC',    // Ocean Mist - App Hintergrund
    surface: '#FFFFFF',       // White - Karten und erhöhte Elemente
    
    // Text
    text: '#0A2E3D',          // Deep Sea - Haupttext
    textLight: '#4A6B7C',     // Stormy Grey - Sekundärtext
    
    // Spezial: Current Time Indicator & Events
    currentTime: '#FF8A5C',   // Coral Orange (accent) - "Jetzt"-Indicator
    eventAccent: '#0D5C7D',   // Primary - Event-Border-Akzentfarbe
    eventBg: '#0D5C7D',       // Primary - Event-Hintergrund (mit opacity)
    eventBgOpacity: '0.1',    // Event-Background-Transparenz
    eventBgHoverOpacity: '0.15', // Event-Hover-Hintergrund
  },

  // 🎨 EVENT COLOR PALETTE (6 Wave Brand Colors für Event-Kategorisierung)
  eventColors: [
    {
      id: 'primary',
      hex: '#0D5C7D',
      name: 'Deep Ocean',
      bg: 'rgba(13, 92, 125, 0.1)',
      bgHover: 'rgba(13, 92, 125, 0.15)',
      border: '#0D5C7D',
    },
    {
      id: 'secondary',
      hex: '#F8B500',
      name: 'Sunset Gold',
      bg: 'rgba(248, 181, 0, 0.1)',
      bgHover: 'rgba(248, 181, 0, 0.15)',
      border: '#F8B500',
    },
    {
      id: 'tertiary',
      hex: '#4A9BB8',
      name: 'Sky Blue',
      bg: 'rgba(74, 155, 184, 0.1)',
      bgHover: 'rgba(74, 155, 184, 0.15)',
      border: '#4A9BB8',
    },
    {
      id: 'accent',
      hex: '#FF8A5C',
      name: 'Coral Orange',
      bg: 'rgba(255, 138, 92, 0.1)',
      bgHover: 'rgba(255, 138, 92, 0.15)',
      border: '#FF8A5C',
    },
    {
      id: 'dark',
      hex: '#0A2E3D',
      name: 'Deep Sea',
      bg: 'rgba(10, 46, 61, 0.1)',
      bgHover: 'rgba(10, 46, 61, 0.15)',
      border: '#0A2E3D',
    },
    {
      id: 'light',
      hex: '#4A6B7C',
      name: 'Stormy Grey',
      bg: 'rgba(74, 107, 124, 0.1)',
      bgHover: 'rgba(74, 107, 124, 0.15)',
      border: '#4A6B7C',
    },
  ],

  // 🔤 WAVE TYPOGRAPHY (Google Fonts)
  typography: {
    // Font-Familien (4 verschiedene Fonts für Wave Brand)
    fontFamily: {
      display: '"Bebas Neue", sans-serif',       // Logo & große Brand Headlines
      heading: '"Manrope", sans-serif',          // Section Headings (weight: 700)
      body: '"Manrope", sans-serif',             // ALLE funktionalen Elemente (weight: 400)
      accent: '"Dancing Script", cursive',       // NUR für besondere Akzente wie "This Week"
    },
    
    // Font-Größen (Wave Typography Scale)
    fontSize: {
      display: '4.5rem',      // 72px - Logo & Brand Headlines
      h1: '3rem',             // 48px - Page Titles
      h2: '2.25rem',          // 36px - Section Headings
      h3: '1.75rem',          // 28px - Subsection Headings
      bodyLarge: '1.125rem',  // 18px - Wichtige Texte
      body: '1rem',           // 16px - Standard Body Text
      bodySmall: '0.875rem',  // 14px - Kleinere Texte
      caption: '0.75rem',     // 12px - Captions, Labels
      
      // Legacy Aliases (für Kompatibilität)
      xs: '0.75rem',      // = caption
      sm: '0.875rem',     // = bodySmall
      base: '1rem',       // = body
      lg: '1.125rem',     // = bodyLarge
      xl: '1.75rem',      // = h3
      '2xl': '2.25rem',   // = h2
      '3xl': '3rem',      // = h1
    },
    
    // Font-Weights (semantisch)
    fontWeight: {
      normal: '400',      // Body Font Standard
      medium: '500',      
      semibold: '600',
      bold: '700',        // Heading Font Standard
    },
    
    // Line-Heights (Wave Specification)
    lineHeight: {
      tight: '1.1',       // Display & Headlines
      normal: '1.5',      // Body Text
      relaxed: '1.75',    // Große Textblöcke
    },
    
    // Letter-Spacing (Wave Specification)
    letterSpacing: {
      tight: '-0.02em',   // Display & Headlines
      normal: '0',        // Standard
      wide: '0.04em',     // Buttons & Labels
    },
  },

  // 📐 WAVE SPACING SYSTEM
  spacing: {
    // Basis-Skala (Wave Brand Guidelines)
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    xxl: '3rem',     // 48px - Wave Extra Large
    
    // Legacy Alias
    '2xl': '3rem',   // = xxl
    
    // Spezifische Anwendungen
    buttonPaddingX: {
      sm: '0.75rem',   // 12px
      md: '1rem',      // 16px
      lg: '2rem',      // 32px
    },
    buttonPaddingY: {
      sm: '0.5rem',    // 8px
      md: '0.5rem',    // 8px
      lg: '0.5rem',    // 8px
    },
    cardPadding: '1rem',        // 16px (md)
    dialogPadding: '1.5rem',    // 24px (lg)
    formFieldGap: '1rem',       // 16px (md)
  },

  // 🔲 WAVE BORDER RADIUS SYSTEM
  borderRadius: {
    sm: '0.5rem',     // 8px - Small
    md: '0.75rem',    // 12px - Medium
    lg: '1rem',       // 16px - Large
    xl: '1.5rem',     // 24px - Extra Large
    full: '9999px',   // Full - Pills & Circles
  },

  // 🌫️ SHADOWS (semantisch)
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },

  // 🖼️ BORDER WIDTHS
  borderWidth: {
    thin: '1px',
    medium: '2px',
    thick: '4px',
    eventAccent: '6px', // Linke Event-Border in Day-Timeline
  },

  // 📏 SIZE SCALE (Icon-Größen, Button-Höhen etc.)
  sizes: {
    icon: {
      xs: '0.75rem',   // 12px (h-3 w-3)
      sm: '1rem',      // 16px (h-4 w-4) - Standard
      md: '1.25rem',   // 20px (h-5 w-5)
      lg: '1.5rem',    // 24px (h-6 w-6)
      xl: '2rem',      // 32px (h-8 w-8)
    },
    button: {
      sm: '2rem',      // 32px (h-8)
      md: '2.25rem',   // 36px (h-9) - Standard
      lg: '2.5rem',    // 40px (h-10)
      icon: '2.25rem', // 36px (h-9 w-9)
    },
    fab: {
      width: '3.5rem',  // 56px (h-14 w-14)
      height: '3.5rem',
    },
  },

  // ⏱️ TRANSITIONS
  transitions: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    page: '240ms',
    easings: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      wave: 'cubic-bezier(0.22, 1, 0.36, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    nav: {
      pressScale: '0.98',
      activeScale: '1.03',
      indicatorDuration: '220ms',
    },
  },

  // 📊 Z-INDEX SCALE
  zIndex: {
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    modalBackdrop: '1040',
    modal: '1050',
    popover: '1060',
    tooltip: '1070',
  },

  // 📱 BREAKPOINTS (können in tailwind.config verwendet werden)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// Type-Safety Export
export type BrandTokens = typeof brandTokens;
export type EventColor = typeof brandTokens.eventColors[number];
export type EventColorId = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'dark' | 'light';
