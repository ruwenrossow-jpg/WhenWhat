import {
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  LogOut,
  Calendar,
  CalendarDays,
  Pencil,
  Trash2,
  FileText,
  AlertCircle,
} from 'lucide-react';

// 🎭 ICON REGISTRY
// Zentrale Icon-Verwaltung mit semantischen Namen

export const icons = {
  // Navigation
  close: X,
  previousNav: ChevronLeft,
  nextNav: ChevronRight,
  
  // Zeit & Kalender
  clock: Clock,
  calendarDay: Calendar,
  calendarWeek: CalendarDays,
  
  // Aktionen
  add: Plus,
  edit: Pencil,
  delete: Trash2,
  logout: LogOut,
  
  // Content
  description: FileText,
  
  // Status
  error: AlertCircle,
} as const;

// Größen-Mapping zu Tailwind-Klassen
export const iconSizeClasses = {
  xs: 'h-3 w-3',        // 12px
  sm: 'h-4 w-4',        // 16px - Standard
  md: 'h-5 w-5',        // 20px
  lg: 'h-6 w-6',        // 24px
  xl: 'h-8 w-8',        // 32px
} as const;

export type IconName = keyof typeof icons;
export type IconSize = keyof typeof iconSizeClasses;
