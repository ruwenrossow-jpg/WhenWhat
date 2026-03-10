import { brandTokens } from './tokens';
import type { Config } from 'tailwindcss';

// Konvertiert Design-Tokens in Tailwind-Theme-Format
export const customTheme = {
  extend: {
    // Custom Font Sizes
    fontSize: {
      'brand-xs': brandTokens.typography.fontSize.xs,
      'brand-sm': brandTokens.typography.fontSize.sm,
      'brand-base': brandTokens.typography.fontSize.base,
      'brand-lg': brandTokens.typography.fontSize.lg,
      'brand-xl': brandTokens.typography.fontSize.xl,
      'brand-2xl': brandTokens.typography.fontSize['2xl'],
      'brand-3xl': brandTokens.typography.fontSize['3xl'],
    },

    // Custom Spacing
    spacing: {
      'brand-xs': brandTokens.spacing.xs,
      'brand-sm': brandTokens.spacing.sm,
      'brand-md': brandTokens.spacing.md,
      'brand-lg': brandTokens.spacing.lg,
      'brand-xl': brandTokens.spacing.xl,
      'brand-2xl': brandTokens.spacing['2xl'],
    },

    // Custom Box Shadow
    boxShadow: {
      'brand-sm': brandTokens.shadows.sm,
      'brand-md': brandTokens.shadows.md,
      'brand-lg': brandTokens.shadows.lg,
      'brand-xl': brandTokens.shadows.xl,
    },

    // Custom Border Width
    borderWidth: {
      'brand-thin': brandTokens.borderWidth.thin,
      'brand-medium': brandTokens.borderWidth.medium,
      'brand-thick': brandTokens.borderWidth.thick,
      'brand-event': brandTokens.borderWidth.eventAccent,
    },

    // Custom Transition Durations
    transitionDuration: {
      'brand-fast': brandTokens.transitions.fast,
      'brand-base': brandTokens.transitions.base,
      'brand-slow': brandTokens.transitions.slow,
    },
  },
};
