import { useState, useCallback, useRef, useEffect } from 'react';
import { LoadingConfig, LoadingState, NetworkAwareConfig } from '../types';

// Default loading configuration
const defaultConfig: LoadingConfig = {
  showDelay: 200,
  minDuration: 500,
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};

// Network-aware configuration
const networkConfig: NetworkAwareConfig = {
  slowConnection: {
    threshold: 4000, // 4 seconds
    showImprovedSkeleton: true,
    simplifyAnimations: true,
  },
  offline: {
    showOfflineMessage: true,
    enableCache: true,
  },
  lowData: {
    reduceAnimations: true,
    useSimpleSkeletons: true,
  },
};

// Hook for managing individual loading state
export const useLoadingState = (initialState: LoadingState = 'idle') => {
  const [state, setState] = useState<LoadingState>(initialState);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>();

  const setLoading = useCallback(() => {
    setState('loading');
    setError(null);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  const setSuccess = useCallback(() => {
    setState('success');
    setError(null);
    setProgress(100);
  }, []);

  const setError_ = useCallback((err: Error | string) => {
    setState('error');
    setError(err instanceof Error ? err : new Error(err));
    setProgress(0);
  }, []);

  const setEmpty = useCallback(() => {
    setState('empty');
    setError(null);
    setProgress(0);
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setError(null);
    setProgress(0);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const executeAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    config: LoadingConfig = defaultConfig
  ): Promise<T> => {
    setLoading();

    const startTime = Date.now();
    let showDelayTimeout: NodeJS.Timeout | undefined;

    // Set up timeout
    if (config.timeout) {
      timeoutRef.current = setTimeout(() => {
        setError_(new Error('Operation timed out'));
      }, config.timeout);
    }

    try {
      // Add delay before showing loading state
      if (config.showDelay) {
        showDelayTimeout = setTimeout(() => {
          if (state === 'loading') {
            setState('loading');
          }
        }, config.showDelay);
      }

      const result = await asyncFn();
      
      // Ensure minimum duration
      const elapsed = Date.now() - startTime;
      if (config.minDuration && elapsed < config.minDuration) {
        await new Promise(resolve => 
          setTimeout(resolve, config.minDuration! - elapsed)
        );
      }

      setSuccess();
      return result;
    } catch (err) {
      setError_(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (showDelayTimeout) {
        clearTimeout(showDelayTimeout);
      }
    }
  }, [state, setLoading, setSuccess, setError_]);

  // Auto-reset success/error states after delay
  useEffect(() => {
    if (state === 'success' || state === 'error') {
      const timer = setTimeout(() => {
        setState('idle');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return {
    state,
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    isError: state === 'error',
    isEmpty: state === 'empty',
    isIdle: state === 'idle',
    error,
    progress,
    setProgress,
    setLoading,
    setSuccess,
    setError: setError_,
    setEmpty,
    reset,
    executeAsync,
  };
};

// Hook for managing multiple loading states
export const useMultipleLoadingStates = () => {
  const [states, setStates] = useState<Record<string, LoadingState>>({});
  const [errors, setErrors] = useState<Record<string, Error>>({});
  const [progress, setProgress] = useState<Record<string, number>>({});

  const setLoadingState = useCallback((key: string, state: LoadingState) => {
    setStates(prev => ({ ...prev, [key]: state }));
    if (state !== 'error') {
      setErrors(prev => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
    }
  }, []);

  const setError = useCallback((key: string, error: Error | string) => {
    setStates(prev => ({ ...prev, [key]: 'error' }));
    setErrors(prev => ({
      ...prev,
      [key]: error instanceof Error ? error : new Error(error)
    }));
  }, []);

  const setProgress_ = useCallback((key: string, value: number) => {
    setProgress(prev => ({ ...prev, [key]: value }));
  }, []);

  const removeState = useCallback((key: string) => {
    setStates(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
    setErrors(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
    setProgress(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const executeAsync = useCallback(async <T>(
    key: string,
    asyncFn: () => Promise<T>,
    config: LoadingConfig = defaultConfig
  ): Promise<T> => {
    setLoadingState(key, 'loading');
    setProgress_(key, 0);

    try {
      const result = await asyncFn();
      setLoadingState(key, 'success');
      setProgress_(key, 100);
      return result;
    } catch (err) {
      setError(key, err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  }, [setLoadingState, setProgress_, setError]);

  const getState = useCallback((key: string): LoadingState => {
    return states[key] || 'idle';
  }, [states]);

  const isLoading = useCallback((key?: string): boolean => {
    if (key) {
      return states[key] === 'loading';
    }
    return Object.values(states).some(state => state === 'loading');
  }, [states]);

  const hasError = useCallback((key?: string): boolean => {
    if (key) {
      return states[key] === 'error';
    }
    return Object.values(states).some(state => state === 'error');
  }, [states]);

  return {
    states,
    errors,
    progress,
    setLoadingState,
    setError,
    setProgress: setProgress_,
    removeState,
    executeAsync,
    getState,
    isLoading,
    hasError,
    getError: (key: string) => errors[key],
    getProgress: (key: string) => progress[key] || 0,
  };
};

// Hook for network-aware loading
export const useNetworkAwareLoading = () => {
  const [connectionSpeed, setConnectionSpeed] = useState<'fast' | 'slow' | 'offline'>('fast');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setConnectionSpeed('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Measure connection speed
  useEffect(() => {
    if (!isOnline) return;

    const measureSpeed = async () => {
      const startTime = Date.now();
      try {
        // Make a small request to measure latency
        await fetch('/favicon.ico?' + Math.random(), { 
          cache: 'no-cache',
          mode: 'no-cors' 
        });
        const endTime = Date.now();
        const latency = endTime - startTime;
        
        setConnectionSpeed(latency > networkConfig.slowConnection.threshold ? 'slow' : 'fast');
      } catch {
        // If request fails, assume slow connection
        setConnectionSpeed('slow');
      }
    };

    measureSpeed();
    const interval = setInterval(measureSpeed, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isOnline]);

  const getOptimizedConfig = useCallback((baseConfig: LoadingConfig = defaultConfig): LoadingConfig => {
    if (!isOnline) {
      return {
        ...baseConfig,
        timeout: 0, // No timeout when offline
        showDelay: 0, // Show immediately when offline
      };
    }

    if (connectionSpeed === 'slow') {
      return {
        ...baseConfig,
        showDelay: Math.max(baseConfig.showDelay || 0, 100), // Show sooner
        timeout: (baseConfig.timeout || 30000) * 2, // Longer timeout
        minDuration: Math.max(baseConfig.minDuration || 0, 1000), // Longer min duration
      };
    }

    return baseConfig;
  }, [isOnline, connectionSpeed]);

  const shouldSimplifyAnimations = useCallback(() => {
    return connectionSpeed === 'slow' && networkConfig.lowData.reduceAnimations;
  }, [connectionSpeed]);

  const shouldUseSimpleSkeletons = useCallback(() => {
    return connectionSpeed === 'slow' && networkConfig.lowData.useSimpleSkeletons;
  }, [connectionSpeed]);

  return {
    isOnline,
    connectionSpeed,
    getOptimizedConfig,
    shouldSimplifyAnimations,
    shouldUseSimpleSkeletons,
    networkConfig,
  };
};

// Hook for debounced loading state
export const useDebouncedLoading = (delay: number = 200) => {
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const setLoading = useCallback((loading: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (loading) {
      timeoutRef.current = setTimeout(() => {
        setIsLoading(true);
      }, delay);
    } else {
      setIsLoading(false);
    }
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [isLoading, setLoading] as const;
};

// Hook for retry logic
export const useRetryableOperation = <T>() => {
  const [attempt, setAttempt] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const executeWithRetry = useCallback(async (
    operation: () => Promise<T>,
    config: LoadingConfig = defaultConfig
  ): Promise<T> => {
    const maxAttempts = config.retryAttempts || 1;
    let lastError: Error;

    for (let i = 0; i < maxAttempts; i++) {
      setAttempt(i + 1);
      
      if (i > 0) {
        setIsRetrying(true);
        await new Promise(resolve => 
          setTimeout(resolve, (config.retryDelay || 1000) * Math.pow(2, i - 1))
        );
      }

      try {
        const result = await operation();
        setIsRetrying(false);
        setAttempt(0);
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (i === maxAttempts - 1) {
          setIsRetrying(false);
          setAttempt(0);
          throw lastError;
        }
      }
    }

    throw lastError!;
  }, []);

  return {
    attempt,
    isRetrying,
    executeWithRetry,
  };
};

export default useLoadingState;
