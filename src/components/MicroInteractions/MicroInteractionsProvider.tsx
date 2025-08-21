import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { responsiveConfig, animationConfig, timings } from './config';
import { ToastProvider } from './components/AnimatedToasts';

interface MicroInteractionsConfig {
  enabled: boolean;
  respectReduceMotion: boolean;
  performanceMode: 'auto' | 'high' | 'low';
  animationSpeed: number; // Multiplier for all animation durations
  enableComplexAnimations: boolean;
  enableParallax: boolean;
  enableDragDrop: boolean;
}

interface MicroInteractionsContextValue {
  config: MicroInteractionsConfig;
  updateConfig: (updates: Partial<MicroInteractionsConfig>) => void;
  getOptimizedDuration: (baseDuration: number) => number;
  shouldAnimate: (animationType?: 'simple' | 'complex') => boolean;
  isReducedMotion: boolean;
  isLowPerformance: boolean;
}

// Default configuration
const defaultConfig: MicroInteractionsConfig = {
  enabled: true,
  respectReduceMotion: true,
  performanceMode: 'auto',
  animationSpeed: 1,
  enableComplexAnimations: true,
  enableParallax: true,
  enableDragDrop: true,
};

// Context
const MicroInteractionsContext = createContext<MicroInteractionsContextValue | undefined>(undefined);

// Hook to use micro-interactions context
export const useMicroInteractions = () => {
  const context = useContext(MicroInteractionsContext);
  if (!context) {
    throw new Error('useMicroInteractions must be used within a MicroInteractionsProvider');
  }
  return context;
};

// Performance detection hook
const usePerformanceDetection = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    // Check for low-end device indicators
    const checkPerformance = () => {
      const connection = (navigator as any).connection;
      const memory = (performance as any).memory;
      
      let lowPerformanceIndicators = 0;

      // Check connection speed
      if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
        lowPerformanceIndicators++;
      }

      // Check device memory (if available)
      if (memory && memory.totalJSHeapSize && memory.totalJSHeapSize < 100000000) { // Less than 100MB
        lowPerformanceIndicators++;
      }

      // Check hardware concurrency
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
        lowPerformanceIndicators++;
      }

      // Check device pixel ratio (lower DPR might indicate older device)
      if (window.devicePixelRatio && window.devicePixelRatio < 1.5) {
        lowPerformanceIndicators++;
      }

      // If 2 or more indicators suggest low performance
      setIsLowPerformance(lowPerformanceIndicators >= 2);
    };

    checkPerformance();

    // Also check on connection change
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', checkPerformance);
      return () => {
        (navigator as any).connection.removeEventListener('change', checkPerformance);
      };
    }
  }, []);

  return isLowPerformance;
};

// Provider component
export const MicroInteractionsProvider: React.FC<{
  children: React.ReactNode;
  initialConfig?: Partial<MicroInteractionsConfig>;
}> = ({ children, initialConfig = {} }) => {
  const theme = useTheme();
  const [config, setConfig] = useState<MicroInteractionsConfig>({
    ...defaultConfig,
    ...initialConfig,
  });

  // Check for reduced motion preference
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isLowPerformance = usePerformanceDetection();

  // Update configuration based on system preferences and performance
  useEffect(() => {
    setConfig(prev => {
      let updates: Partial<MicroInteractionsConfig> = {};

      // Respect reduced motion preference
      if (prev.respectReduceMotion && prefersReducedMotion) {
        updates = {
          ...updates,
          animationSpeed: responsiveConfig.reduceMotion.duration / timings.standard,
          enableComplexAnimations: false,
          enableParallax: false,
        };
      }

      // Auto-adjust for performance
      if (prev.performanceMode === 'auto') {
        if (isLowPerformance) {
          updates = {
            ...updates,
            animationSpeed: Math.min(prev.animationSpeed, responsiveConfig.performance.lowEnd.reduceDuration),
            enableComplexAnimations: false,
            enableParallax: false,
          };
        }
      }

      // Apply low performance settings
      if (prev.performanceMode === 'low' || isLowPerformance) {
        updates = {
          ...updates,
          enableComplexAnimations: false,
          enableParallax: false,
          animationSpeed: 0.7,
        };
      }

      return { ...prev, ...updates };
    });
  }, [prefersReducedMotion, isLowPerformance]);

  const updateConfig = useCallback((updates: Partial<MicroInteractionsConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const getOptimizedDuration = useCallback((baseDuration: number): number => {
    if (!config.enabled) return 0;
    
    const adjustedDuration = baseDuration * config.animationSpeed;
    
    // Apply reduced motion settings
    if (config.respectReduceMotion && prefersReducedMotion) {
      return Math.min(adjustedDuration, responsiveConfig.reduceMotion.duration);
    }
    
    return adjustedDuration;
  }, [config.enabled, config.animationSpeed, config.respectReduceMotion, prefersReducedMotion]);

  const shouldAnimate = useCallback((animationType: 'simple' | 'complex' = 'simple'): boolean => {
    if (!config.enabled) return false;
    
    if (config.respectReduceMotion && prefersReducedMotion) {
      return false;
    }
    
    if (animationType === 'complex' && !config.enableComplexAnimations) {
      return false;
    }
    
    return true;
  }, [config.enabled, config.enableComplexAnimations, config.respectReduceMotion, prefersReducedMotion]);

  const contextValue: MicroInteractionsContextValue = {
    config,
    updateConfig,
    getOptimizedDuration,
    shouldAnimate,
    isReducedMotion: prefersReducedMotion,
    isLowPerformance,
  };

  return (
    <MicroInteractionsContext.Provider value={contextValue}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </MicroInteractionsContext.Provider>
  );
};

// Hook for optimized animation props
export const useOptimizedAnimation = (
  baseDuration: number,
  animationType: 'simple' | 'complex' = 'simple'
) => {
  const { getOptimizedDuration, shouldAnimate } = useMicroInteractions();
  
  return {
    duration: shouldAnimate(animationType) ? getOptimizedDuration(baseDuration) : 0,
    disabled: !shouldAnimate(animationType),
  };
};

// Hook for responsive animation configuration
export const useResponsiveAnimation = () => {
  const { config, isReducedMotion, isLowPerformance } = useMicroInteractions();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return {
    // Duration multipliers
    getDuration: (base: number) => {
      let multiplier = config.animationSpeed;
      
      if (isMobile) {
        multiplier *= 0.8; // Faster on mobile
      }
      
      if (isLowPerformance) {
        multiplier *= responsiveConfig.performance.lowEnd.reduceDuration;
      }
      
      return Math.round(base * multiplier);
    },
    
    // Should use specific animation types
    useComplex: config.enableComplexAnimations && !isReducedMotion && !isLowPerformance,
    useParallax: config.enableParallax && !isReducedMotion && !isMobile,
    useDragDrop: config.enableDragDrop,
    
    // Performance flags
    isMobile,
    isReducedMotion,
    isLowPerformance,
  };
};

// HOC for wrapping components with micro-interactions
export const withMicroInteractions = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: {
    requiresComplex?: boolean;
    requiresParallax?: boolean;
  }
) => {
  const WithMicroInteractionsComponent: React.FC<P> = (props) => {
    const { shouldAnimate } = useMicroInteractions();
    
    const canRender = 
      (!options?.requiresComplex || shouldAnimate('complex')) &&
      (!options?.requiresParallax || shouldAnimate('complex'));
    
    if (!canRender) {
      return <WrappedComponent {...props} />;
    }
    
    return <WrappedComponent {...props} />;
  };
  
  WithMicroInteractionsComponent.displayName = 
    `withMicroInteractions(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithMicroInteractionsComponent;
};

// Settings component for micro-interactions
export const MicroInteractionsSettings: React.FC = () => {
  const { config, updateConfig } = useMicroInteractions();
  
  return (
    <div>
      <h3>Animation Settings</h3>
      
      <label>
        <input
          type="checkbox"
          checked={config.enabled}
          onChange={(e) => updateConfig({ enabled: e.target.checked })}
        />
        Enable Animations
      </label>
      
      <label>
        <input
          type="checkbox"
          checked={config.respectReduceMotion}
          onChange={(e) => updateConfig({ respectReduceMotion: e.target.checked })}
        />
        Respect Reduced Motion Preference
      </label>
      
      <label>
        Animation Speed:
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={config.animationSpeed}
          onChange={(e) => updateConfig({ animationSpeed: parseFloat(e.target.value) })}
        />
        {config.animationSpeed}x
      </label>
      
      <label>
        Performance Mode:
        <select
          value={config.performanceMode}
          onChange={(e) => updateConfig({ 
            performanceMode: e.target.value as 'auto' | 'high' | 'low' 
          })}
        >
          <option value="auto">Auto</option>
          <option value="high">High Performance</option>
          <option value="low">Low Performance</option>
        </select>
      </label>
      
      <label>
        <input
          type="checkbox"
          checked={config.enableComplexAnimations}
          onChange={(e) => updateConfig({ enableComplexAnimations: e.target.checked })}
        />
        Enable Complex Animations
      </label>
      
      <label>
        <input
          type="checkbox"
          checked={config.enableParallax}
          onChange={(e) => updateConfig({ enableParallax: e.target.checked })}
        />
        Enable Parallax Effects
      </label>
    </div>
  );
};

export default MicroInteractionsProvider;
