'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('common');
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
      }, 2000); // Total animation duration - increased to 2 seconds

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
                duration: 1.0,
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

      {/* Animated camera icon during transition */}
      <AnimatePresence>
        {transitionState.isTransitioning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: 1,
              scale: 1,
              transition: { delay: 0.6, duration: 0.5, ease: "backOut" }
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10000,
              pointerEvents: 'none',
            }}
          >
            {/* Camera Body */}
            <motion.div
              animate={{
                y: [0, -2, 0],
                transition: {
                  duration: 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              }}
              style={{
                position: 'relative',
                width: '48px',
                height: '36px',
                backgroundColor: 'white',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              }}
            >
              {/* Camera Lens */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  transition: {
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                }}
                style={{
                  position: 'absolute',
                  top: '18px',
                  left: '24px',
                  transform: 'translate(-50%, -50%)',
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#374151',
                  borderRadius: '50%',
                  border: '2px solid #6B7280',
                }}
              >
                {/* Lens Center */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#111827',
                    borderRadius: '50%',
                  }}
                >
                  {/* Lens Reflection */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '1px',
                      left: '1px',
                      width: '3px',
                      height: '3px',
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '50%',
                    }}
                  />
                </div>
              </motion.div>
              
              {/* Camera Flash */}
              <motion.div
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1.2, 0.8],
                  transition: {
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                }}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '6px',
                  height: '4px',
                  backgroundColor: '#FEF3C7',
                  borderRadius: '2px',
                  boxShadow: '0 0 8px rgba(254, 243, 199, 0.8)',
                }}
              />
              
              {/* Viewfinder */}
              <div
                style={{
                  position: 'absolute',
                  top: '6px',
                  left: '8px',
                  width: '8px',
                  height: '6px',
                  backgroundColor: '#1F2937',
                  borderRadius: '2px',
                }}
              />
            </motion.div>
            
            {/* Flash Effect */}
            <AnimatePresence>
              <motion.div
                key="flash"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{
                  opacity: [0, 0.9, 0],
                  scale: [0.3, 3.5, 5],
                  transition: {
                    duration: 0.4,
                    repeat: Infinity,
                    repeatDelay: 0.8,
                    ease: "easeOut",
                  }
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100px',
                  height: '100px',
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 40%, transparent 70%)',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }}
              />
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Smile!" Text */}
      <AnimatePresence>
        {transitionState.isTransitioning && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ 
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { delay: 0.9, duration: 0.5, ease: "backOut" }
            }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            style={{
              position: 'fixed',
              top: '60%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10001,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              }}
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: 'white',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                letterSpacing: '1px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              {t('transition_smile')}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
