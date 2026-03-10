import type { BrandTokens } from './tokens';
import type { CalendarConstants } from './constants';
import type { IconName, IconSize } from './icon-registry';

// Re-Export alle Design-System-Typen für einfachen Import
export type {
  BrandTokens,
  CalendarConstants,
  IconName,
  IconSize,
};

// Utility-Type für Theme-Werte
export type ThemeValue<T extends keyof BrandTokens> = BrandTokens[T];
