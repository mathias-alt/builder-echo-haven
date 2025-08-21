import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { LoadingStateContextValue, LoadingConfig, LoadingState } from './types';
import { LoadingOverlay } from './components/LoadingSpinners';
import { useNetworkAwareLoading } from './hooks/useLoadingState';

// Create the context
const LoadingStateContext = createContext<LoadingStateContextValue | undefined>(undefined);

// Provider component
export const LoadingStateProvider: React.FC<{
  children: React.ReactNode;
  showGlobalOverlay?: boolean;
}> = ({ children, showGlobalOverlay = true }) => {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const timeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});
  const { getOptimizedConfig } = useNetworkAwareLoading();

  const showLoadingDelay = useCallback((key: string, delay: number = 200) => {
    // Clear existing timeout if any
    if (timeoutsRef.current[key]) {
      clearTimeout(timeoutsRef.current[key]);
    }

    // Set new timeout
    timeoutsRef.current[key] = setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [key]: true }));
      delete timeoutsRef.current[key];
    }, delay);
  }, []);

  const hideLoading = useCallback((key: string) => {
    // Clear timeout if exists
    if (timeoutsRef.current[key]) {
      clearTimeout(timeoutsRef.current[key]);
      delete timeoutsRef.current[key];
    }

    // Remove loading state
    setLoadingStates(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const executeWithLoading = useCallback(<T>(
    key: string,
    asyncFn: () => Promise<T>,
    config?: LoadingConfig
  ): Promise<T> => {
    return (async () => {
      const optimizedConfig = getOptimizedConfig(config);
      
      try {
        // Show loading with delay
        if (optimizedConfig.showDelay) {
          showLoadingDelay(key, optimizedConfig.showDelay);
        } else {
          setLoadingStates(prev => ({ ...prev, [key]: true }));
        }

        const startTime = Date.now();
        const result = await asyncFn();

        // Ensure minimum duration
        if (optimizedConfig.minDuration) {
          const elapsed = Date.now() - startTime;
          if (elapsed < optimizedConfig.minDuration) {
            await new Promise(resolve => 
              setTimeout(resolve, optimizedConfig.minDuration! - elapsed)
            );
          }
        }

        return result;
      } finally {
        hideLoading(key);
      }
    })();
  }, [getOptimizedConfig, showLoadingDelay, hideLoading]);

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      Object.values(timeoutsRef.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);

  const contextValue: LoadingStateContextValue = {
    globalLoading,
    setGlobalLoading,
    showLoadingDelay,
    hideLoading,
    loadingStates,
    executeWithLoading,
  };

  return (
    <LoadingStateContext.Provider value={contextValue}>
      {children}
      {showGlobalOverlay && globalLoading && (
        <LoadingOverlay
          variant="brand"
          message="Loading..."
          fullScreen={true}
        />
      )}
    </LoadingStateContext.Provider>
  );
};

// Hook to use the loading state context
export const useLoadingStateContext = () => {
  const context = useContext(LoadingStateContext);
  if (context === undefined) {
    throw new Error('useLoadingStateContext must be used within a LoadingStateProvider');
  }
  return context;
};

// Hook for scoped loading operations
export const useScopedLoading = (scope: string) => {
  const { loadingStates, showLoadingDelay, hideLoading, executeWithLoading } = useLoadingStateContext();

  const isLoading = loadingStates[scope] || false;

  const execute = useCallback(<T>(
    asyncFn: () => Promise<T>,
    config?: LoadingConfig
  ): Promise<T> => {
    return executeWithLoading(scope, asyncFn, config);
  }, [scope, executeWithLoading]);

  const setLoading = useCallback((loading: boolean, delay?: number) => {
    if (loading) {
      showLoadingDelay(scope, delay);
    } else {
      hideLoading(scope);
    }
  }, [scope, showLoadingDelay, hideLoading]);

  return {
    isLoading,
    setLoading,
    execute,
  };
};

// Higher-order component for loading states
export const withLoadingState = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  loadingKey: string
) => {
  const WithLoadingStateComponent: React.FC<P> = (props) => {
    const { isLoading } = useScopedLoading(loadingKey);

    if (isLoading) {
      return (
        <LoadingOverlay
          variant="circular"
          message="Loading..."
        />
      );
    }

    return <WrappedComponent {...props} />;
  };

  WithLoadingStateComponent.displayName = `withLoadingState(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithLoadingStateComponent;
};

// Component for conditional loading display
export const LoadingBoundary: React.FC<{
  children: React.ReactNode;
  loadingKey: string;
  fallback?: React.ReactNode;
  showOverlay?: boolean;
}> = ({ children, loadingKey, fallback, showOverlay = false }) => {
  const { isLoading } = useScopedLoading(loadingKey);

  if (isLoading) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showOverlay) {
      return (
        <>
          {children}
          <LoadingOverlay variant="circular" message="Loading..." />
        </>
      );
    }

    return (
      <LoadingOverlay
        variant="circular"
        message="Loading..."
        backdrop={false}
      />
    );
  }

  return <>{children}</>;
};

// Hook for managing form loading states
export const useFormLoading = () => {
  const [loadingFields, setLoadingFields] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setFieldLoading = useCallback((field: string, loading: boolean) => {
    setLoadingFields(prev => {
      if (loading) {
        return { ...prev, [field]: true };
      } else {
        const { [field]: _, ...rest } = prev;
        return rest;
      }
    });
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
    setFieldLoading(field, false);
  }, [setFieldLoading]);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const executeFieldOperation = useCallback(<T>(
    field: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    return (async () => {
      setFieldLoading(field, true);
      clearFieldError(field);

      try {
        const result = await operation();
        setFieldLoading(field, false);
        return result;
      } catch (error) {
        setFieldError(field, error instanceof Error ? error.message : String(error));
        throw error;
      }
    })();
  }, [setFieldLoading, clearFieldError, setFieldError]);

  const isAnyFieldLoading = Object.values(loadingFields).some(Boolean);

  return {
    loadingFields,
    errors,
    isAnyFieldLoading,
    setFieldLoading,
    setFieldError,
    clearFieldError,
    executeFieldOperation,
    isFieldLoading: (field: string) => loadingFields[field] || false,
    getFieldError: (field: string) => errors[field],
  };
};

// Hook for managing bulk operations
export const useBulkOperations = () => {
  const [operations, setOperations] = useState<Record<string, {
    total: number;
    completed: number;
    failed: number;
    status: 'idle' | 'running' | 'completed' | 'failed';
  }>>({});

  const startBulkOperation = useCallback((operationId: string, total: number) => {
    setOperations(prev => ({
      ...prev,
      [operationId]: {
        total,
        completed: 0,
        failed: 0,
        status: 'running',
      }
    }));
  }, []);

  const updateProgress = useCallback((operationId: string, completed: number, failed: number = 0) => {
    setOperations(prev => {
      const operation = prev[operationId];
      if (!operation) return prev;

      const newCompleted = completed;
      const newFailed = failed;
      const isCompleted = newCompleted + newFailed >= operation.total;

      return {
        ...prev,
        [operationId]: {
          ...operation,
          completed: newCompleted,
          failed: newFailed,
          status: isCompleted ? (newFailed > 0 ? 'failed' : 'completed') : 'running',
        }
      };
    });
  }, []);

  const getProgress = useCallback((operationId: string) => {
    const operation = operations[operationId];
    if (!operation) return 0;
    return Math.round(((operation.completed + operation.failed) / operation.total) * 100);
  }, [operations]);

  const getOperation = useCallback((operationId: string) => {
    return operations[operationId];
  }, [operations]);

  return {
    operations,
    startBulkOperation,
    updateProgress,
    getProgress,
    getOperation,
  };
};

export default LoadingStateProvider;