import { useState, useEffect } from 'react';
import { calendarConstants } from './constants';

// Hook für responsive Timeline-Höhe
export function useTimelineHeight(): number {
  const [hourHeight, setHourHeight] = useState<number>(
    typeof window !== 'undefined' && window.innerWidth < 768
      ? calendarConstants.timeline.hourHeightMobile
      : calendarConstants.timeline.hourHeightDesktop
  );

  useEffect(() => {
    const updateHeight = () => {
      const newHeight = window.innerWidth < 768
        ? calendarConstants.timeline.hourHeightMobile
        : calendarConstants.timeline.hourHeightDesktop;
      setHourHeight(newHeight);
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return hourHeight;
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
