import { useState, useCallback, useRef, useEffect } from 'react';
import { PullToRefreshConfig } from '../types';

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

interface PullToRefreshState {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
  canPull: boolean;
}

interface UsePullToRefreshOptions extends Partial<PullToRefreshConfig> {
  disabled?: boolean;
}

export const usePullToRefresh = (options: UsePullToRefreshOptions = {}) => {
  const {
    threshold = 80,
    loadingHeight = 60,
    onRefresh,
    enabled = true,
    disabled = false,
  } = options;

  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    pullDistance: 0,
    isRefreshing: false,
    canPull: false,
  });

  const touchStartRef = useRef<TouchPoint | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const isEnabledRef = useRef(enabled && !disabled);

  // Update enabled state
  useEffect(() => {
    isEnabledRef.current = enabled && !disabled;
  }, [enabled, disabled]);

  const canStartPull = useCallback((element: HTMLElement): boolean => {
    // Can only start pull if scrolled to top
    return element.scrollTop === 0;
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!isEnabledRef.current || !containerRef.current) return;

    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    const canPull = canStartPull(containerRef.current);
    setState(prev => ({ ...prev, canPull }));
  }, [canStartPull]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (
      !isEnabledRef.current || 
      !touchStartRef.current || 
      !containerRef.current ||
      state.isRefreshing
    ) return;

    const touch = event.touches[0];
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);

    // Only handle vertical pulls (ignore horizontal swipes)
    if (deltaX > 20) return;

    // Only handle downward pulls when at top of container
    if (deltaY > 0 && state.canPull) {
      event.preventDefault();

      // Apply resistance curve for smooth feel
      const resistance = deltaY < threshold ? 0.8 : 0.4;
      const pullDistance = Math.min(deltaY * resistance, threshold * 1.5);

      setState(prev => ({
        ...prev,
        isPulling: pullDistance > 10,
        pullDistance,
      }));
    }
  }, [state.canPull, state.isRefreshing, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!isEnabledRef.current || state.isRefreshing) return;

    const shouldRefresh = state.pullDistance >= threshold;

    if (shouldRefresh && onRefresh) {
      setState(prev => ({
        ...prev,
        isRefreshing: true,
        pullDistance: loadingHeight,
      }));

      try {
        await onRefresh();
      } catch (error) {
        console.error('Pull to refresh failed:', error);
      } finally {
        setState(prev => ({
          ...prev,
          isRefreshing: false,
          isPulling: false,
          pullDistance: 0,
        }));
      }
    } else {
      // Animate back to original position
      setState(prev => ({
        ...prev,
        isPulling: false,
        pullDistance: 0,
      }));
    }

    touchStartRef.current = null;
  }, [state.pullDistance, state.isRefreshing, threshold, loadingHeight, onRefresh]);

  const attachPullToRefresh = useCallback((element: HTMLElement | null) => {
    containerRef.current = element;
    
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const triggerRefresh = useCallback(async () => {
    if (state.isRefreshing || !onRefresh) return;

    setState(prev => ({
      ...prev,
      isRefreshing: true,
      pullDistance: loadingHeight,
    }));

    try {
      await onRefresh();
    } catch (error) {
      console.error('Manual refresh failed:', error);
    } finally {
      setState(prev => ({
        ...prev,
        isRefreshing: false,
        isPulling: false,
        pullDistance: 0,
      }));
    }
  }, [state.isRefreshing, loadingHeight, onRefresh]);

  const pullToRefreshHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return {
    ...state,
    attachPullToRefresh,
    triggerRefresh,
    pullToRefreshHandlers,
    threshold,
    loadingHeight,
  };
};

// Simplified hook for basic pull-to-refresh
export const useSimplePullToRefresh = (
  onRefresh: () => Promise<void>,
  disabled: boolean = false
) => {
  return usePullToRefresh({
    threshold: 80,
    loadingHeight: 60,
    onRefresh,
    enabled: true,
    disabled,
  });
};

export default usePullToRefresh;
