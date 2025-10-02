'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

interface TransitionState {
  isTransitioning: boolean;
  targetUrl: string | null;
  triggerElement: HTMLElement | null;
}

// Global transition state
let globalTransitionState: TransitionState = {
  isTransitioning: false,
  targetUrl: null,
  triggerElement: null,
};

// Global listeners
const transitionListeners: ((state: TransitionState) => void)[] = [];

export const triggerPageTransition = (targetUrl: string, triggerElement?: HTMLElement) => {
  globalTransitionState = {
    isTransitioning: true,
    targetUrl,
    triggerElement: triggerElement || null,
  };
  
  // Notify all listeners
  transitionListeners.forEach(listener => listener(globalTransitionState));
};

export default function PageTransition({ children }: PageTransitionProps) {
  const router = useRouter();
  const [transitionState, setTransitionState] = useState<TransitionState>(globalTransitionState);

  useEffect(() => {
    // Add this component as a listener
    const listener = (state: TransitionState) => {
      setTransitionState({ ...state });
    };
    
    transitionListeners.push(listener);

    // Cleanup
    return () => {
      const index = transitionListeners.indexOf(listener);
      if (index > -1) {
        transitionListeners.splice(index, 1);
      }
    };
  }, []);

  useEffect(() => {
    if (transitionState.isTransitioning && transitionState.targetUrl) {
      // Navigate after animation completes
      const timer = setTimeout(() => {
        router.push(transitionState.targetUrl!);
        
        // Reset state after navigation
        setTimeout(() => {
          globalTransitionState = {
            isTransitioning: false,
            targetUrl: null,
            triggerElement: null,
          };
          setTransitionState({ ...globalTransitionState });
        }, 100);
      }, 1200); // Total animation duration

      return () => clearTimeout(timer);
    }
  }, [transitionState.isTransitioning, transitionState.targetUrl, router]);

  const getInitialPosition = () => {
    if (transitionState.triggerElement) {
      const rect = transitionState.triggerElement.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
      };
    }
    
    // Fallback to center of screen
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: 200,
      height: 50,
    };
  };

  return (
    <>
      {children}
      
      <AnimatePresence>
        {transitionState.isTransitioning && (
          <motion.div
            initial={(() => {
              const pos = getInitialPosition();
              return {
                top: pos.y - pos.height / 2,
                left: pos.x - pos.width / 2,
                width: pos.width,
                height: pos.height,
                borderRadius: '50px',
              };
            })()}
            animate={{
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              borderRadius: '0px',
              transition: {
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for smooth expansion
              },
            }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.3,
                delay: 0.1,
              },
            }}
            style={{
              position: 'fixed',
              background: 'linear-gradient(135deg, var(--mantine-color-ocean-5) 0%, var(--mantine-color-ocean-6) 100%)',
              zIndex: 9999,
              pointerEvents: 'none',
              transformOrigin: 'center center',
            }}
          />
        )}
      </AnimatePresence>

      {/* Loading indicator during transition */}
      <AnimatePresence>
        {transitionState.isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              transition: { delay: 0.6, duration: 0.3 }
            }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10000,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              animate={{
                rotate: 360,
                transition: {
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }}
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                borderTop: '3px solid white',
                borderRadius: '50%',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
