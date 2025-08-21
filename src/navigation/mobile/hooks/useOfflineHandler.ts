import { useState, useEffect, useCallback, useRef } from 'react';
import { OfflineState } from '../types';

interface OfflineAction {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  retryCount: number;
  maxRetries: number;
}

interface UseOfflineHandlerOptions {
  enableStorage?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  storageKey?: string;
}

export const useOfflineHandler = (options: UseOfflineHandlerOptions = {}) => {
  const {
    enableStorage = true,
    maxRetries = 3,
    retryDelay = 1000,
    storageKey = 'offline-actions',
  } = options;

  const [offlineState, setOfflineState] = useState<OfflineState>({
    isOffline: !navigator.onLine,
    lastSyncTime: new Date(),
    pendingActions: 0,
    hasUnsavedChanges: false,
  });

  const pendingActionsRef = useRef<OfflineAction[]>([]);
  const retryTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Load pending actions from storage
  useEffect(() => {
    if (!enableStorage) return;

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const actions = JSON.parse(stored) as OfflineAction[];
        pendingActionsRef.current = actions.map(action => ({
          ...action,
          timestamp: new Date(action.timestamp),
        }));
        setOfflineState(prev => ({
          ...prev,
          pendingActions: actions.length,
          hasUnsavedChanges: actions.length > 0,
        }));
      }
    } catch (error) {
      console.warn('Failed to load offline actions from storage:', error);
    }
  }, [enableStorage, storageKey]);

  // Save pending actions to storage
  const savePendingActions = useCallback(() => {
    if (!enableStorage) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(pendingActionsRef.current));
    } catch (error) {
      console.warn('Failed to save offline actions to storage:', error);
    }
  }, [enableStorage, storageKey]);

  // Handle online/offline status changes
  useEffect(() => {
    const handleOnline = () => {
      setOfflineState(prev => ({
        ...prev,
        isOffline: false,
        lastSyncTime: new Date(),
      }));
      // Retry pending actions when coming back online
      retryPendingActions();
    };

    const handleOffline = () => {
      setOfflineState(prev => ({
        ...prev,
        isOffline: true,
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Add action to pending queue
  const addPendingAction = useCallback((
    type: string,
    data: any,
    actionId?: string
  ): string => {
    const id = actionId || `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const action: OfflineAction = {
      id,
      type,
      data,
      timestamp: new Date(),
      retryCount: 0,
      maxRetries,
    };

    pendingActionsRef.current.push(action);
    
    setOfflineState(prev => ({
      ...prev,
      pendingActions: pendingActionsRef.current.length,
      hasUnsavedChanges: true,
    }));

    savePendingActions();
    return id;
  }, [maxRetries, savePendingActions]);

  // Remove action from pending queue
  const removePendingAction = useCallback((actionId: string) => {
    pendingActionsRef.current = pendingActionsRef.current.filter(
      action => action.id !== actionId
    );
    
    setOfflineState(prev => ({
      ...prev,
      pendingActions: pendingActionsRef.current.length,
      hasUnsavedChanges: pendingActionsRef.current.length > 0,
    }));

    savePendingActions();

    // Clear any retry timeout for this action
    const timeout = retryTimeoutsRef.current.get(actionId);
    if (timeout) {
      clearTimeout(timeout);
      retryTimeoutsRef.current.delete(actionId);
    }
  }, [savePendingActions]);

  // Execute an action with automatic offline handling
  const executeAction = useCallback(async <T>(
    type: string,
    actionFn: () => Promise<T>,
    data?: any
  ): Promise<T> => {
    if (offlineState.isOffline) {
      // Queue action for later execution
      addPendingAction(type, data);
      throw new Error('Action queued for execution when online');
    }

    try {
      const result = await actionFn();
      setOfflineState(prev => ({
        ...prev,
        lastSyncTime: new Date(),
      }));
      return result;
    } catch (error) {
      if (!navigator.onLine) {
        // Connection lost during action
        addPendingAction(type, data);
        throw new Error('Action queued due to connection loss');
      }
      throw error;
    }
  }, [offlineState.isOffline, addPendingAction]);

  // Retry a specific action
  const retryAction = useCallback(async (
    action: OfflineAction,
    retryFn: (data: any) => Promise<void>
  ) => {
    try {
      await retryFn(action.data);
      removePendingAction(action.id);
    } catch (error) {
      action.retryCount++;
      
      if (action.retryCount >= action.maxRetries) {
        console.error(`Max retries reached for action ${action.id}:`, error);
        removePendingAction(action.id);
      } else {
        // Schedule next retry with exponential backoff
        const delay = retryDelay * Math.pow(2, action.retryCount - 1);
        const timeout = setTimeout(() => {
          retryAction(action, retryFn);
        }, delay);
        
        retryTimeoutsRef.current.set(action.id, timeout);
      }
    }
  }, [retryDelay, removePendingAction]);

  // Retry all pending actions
  const retryPendingActions = useCallback((
    retryFn?: (type: string, data: any) => Promise<void>
  ) => {
    if (!retryFn) return;

    pendingActionsRef.current.forEach(action => {
      retryAction(action, () => retryFn(action.type, action.data));
    });
  }, [retryAction]);

  // Clear all pending actions
  const clearPendingActions = useCallback(() => {
    pendingActionsRef.current = [];
    
    // Clear all retry timeouts
    retryTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    retryTimeoutsRef.current.clear();
    
    setOfflineState(prev => ({
      ...prev,
      pendingActions: 0,
      hasUnsavedChanges: false,
    }));

    if (enableStorage) {
      localStorage.removeItem(storageKey);
    }
  }, [enableStorage, storageKey]);

  // Get all pending actions
  const getPendingActions = useCallback(() => {
    return [...pendingActionsRef.current];
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      retryTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return {
    offlineState,
    addPendingAction,
    removePendingAction,
    executeAction,
    retryPendingActions,
    clearPendingActions,
    getPendingActions,
  };
};

// Hook for simple offline detection
export const useOfflineDetection = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
};

export default useOfflineHandler;
