'use client';

import { useCallback } from 'react';
import { triggerPageTransition } from '@/components/transitions/PageTransition';

export const usePageTransition = () => {
  const navigateWithTransition = useCallback((
    targetUrl: string, 
    triggerElement?: HTMLElement | React.MouseEvent<HTMLElement>
  ) => {
    let element: HTMLElement | undefined;
    
    if (triggerElement) {
      // If it's a mouse event, get the current target
      if ('currentTarget' in triggerElement) {
        element = triggerElement.currentTarget as HTMLElement;
      } else {
        element = triggerElement as HTMLElement;
      }
    }
    
    triggerPageTransition(targetUrl, element);
  }, []);

  return { navigateWithTransition };
};
