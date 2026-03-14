import { useState, useEffect } from 'react';
import { calendarConstants } from './constants';

type TimelineViewMode = 'day' | 'week';
type TimelineZoomPreset = keyof typeof calendarConstants.timeline.zoomLevels;

const TIMELINE_ZOOM_PRESETS = Object.keys(
  calendarConstants.timeline.zoomLevels
) as TimelineZoomPreset[];

function getTimelineDefaultHeight(isMobile: boolean): number {
  return isMobile
    ? calendarConstants.timeline.hourHeightMobile
    : calendarConstants.timeline.hourHeightDesktop;
}

// Hook für responsive Timeline-Höhe
export function useTimelineHeight(): number {
  const [hourHeight, setHourHeight] = useState<number>(
    typeof window !== 'undefined' && window.innerWidth < 768
      ? getTimelineDefaultHeight(true)
      : getTimelineDefaultHeight(false)
  );

  useEffect(() => {
    const updateHeight = () => {
      const newHeight = window.innerWidth < 768
        ? getTimelineDefaultHeight(true)
        : getTimelineDefaultHeight(false);
      setHourHeight(newHeight);
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return hourHeight;
}

export function useTimelineViewport(mode: TimelineViewMode) {
  const isClient = typeof window !== 'undefined';
  const [zoomPreset, setZoomPreset] = useState<TimelineZoomPreset>('standard');

  useEffect(() => {
    if (!isClient) {
      return;
    }

    const storedPreset = window.localStorage.getItem(`timeline-zoom-${mode}`) as TimelineZoomPreset | null;
    if (storedPreset && TIMELINE_ZOOM_PRESETS.includes(storedPreset)) {
      setZoomPreset(storedPreset);
    }
  }, [isClient, mode]);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    window.localStorage.setItem(`timeline-zoom-${mode}`, zoomPreset);
  }, [isClient, mode, zoomPreset]);

  const currentIndex = TIMELINE_ZOOM_PRESETS.indexOf(zoomPreset);

  return {
    zoomPreset,
    hourHeight: calendarConstants.timeline.zoomLevels[zoomPreset],
    canZoomOut: currentIndex > 0,
    canZoomIn: currentIndex < TIMELINE_ZOOM_PRESETS.length - 1,
    zoomOut: () => setZoomPreset(TIMELINE_ZOOM_PRESETS[Math.max(0, currentIndex - 1)]),
    zoomIn: () => setZoomPreset(TIMELINE_ZOOM_PRESETS[Math.min(TIMELINE_ZOOM_PRESETS.length - 1, currentIndex + 1)]),
    setZoomPreset,
  };
}

// Hook für Breakpoint-Detection
export function useBreakpoint() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  
  return { isMobile, isDesktop: !isMobile };
}
