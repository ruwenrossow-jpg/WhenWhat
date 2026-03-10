// 📏 APP-SPEZIFISCHE DESIGN-KONSTANTEN
// Werte die sich auf App-Logik beziehen, nicht auf allgemeines Branding

export const calendarConstants = {
  // Timeline-Konfiguration
  timeline: {
    hourHeightDesktop: 60,  // px pro Stunde auf Desktop
    hourHeightMobile: 50,   // px pro Stunde auf Mobile
    hourCount: 24,          // Anzahl Stunden im Tag
    autoScrollOffset: 2,    // Stunden vor aktueller Zeit beim Auto-Scroll
    timeColumnWidth: '5rem', // 80px
  },

  // Week Grid Konfiguration
  weekGrid: {
    minWidth: {
      regular: '700px',    // Minimale Breite für reguläres Week-Grid
      timeline: '800px',   // Minimale Breite für Week-Timeline-Grid
    },
    minCellHeight: '250px',
    headerHeight: '4rem',  // 64px
    maxVisibleEvents: 3,   // Max Events bevor "+X mehr" Badge
  },

  // Event-Darstellung
  event: {
    minHeight: '44px',     // Mindesthöhe für Touch-Target (WCAG)
    borderLeftWidth: '6px', // Linke Akzent-Border (Day-Timeline)
    borderLeftWidthWeek: '4px', // Week-Grid hat dünnere Border
    titleMaxLength: 200,    // Max Zeichen für Event-Titel
  },

  // Layout
  layout: {
    navHeight: '4rem',           // 64px
    fabBottomMobile: '5rem',     // 80px (bottom-20)
    fabBottomDesktop: '1.5rem',  // 24px (bottom-6)
    fabRight: '1.5rem',          // 24px (right-6)
    contentMaxHeight: 'calc(100vh - 16rem)', // Scroll-Container-Höhe
  },
} as const;

export type CalendarConstants = typeof calendarConstants;
