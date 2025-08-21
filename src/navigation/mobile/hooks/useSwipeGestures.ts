import { useRef, useCallback, useEffect } from 'react';
import { SwipeGestureConfig, NavigationDirection } from '../types';

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

interface SwipeResult {
  direction: NavigationDirection;
  distance: number;
  velocity: number;
  duration: number;
}

export const useSwipeGestures = (config: SwipeGestureConfig) => {
  const touchStartRef = useRef<TouchPoint | null>(null);
  const touchEndRef = useRef<TouchPoint | null>(null);
  const isSwipingRef = useRef(false);

  const calculateDistance = (start: TouchPoint, end: TouchPoint): number => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const calculateVelocity = (start: TouchPoint, end: TouchPoint): number => {
    const distance = calculateDistance(start, end);
    const duration = end.time - start.time;
    return duration > 0 ? distance / duration : 0;
  };

  const getSwipeDirection = (start: TouchPoint, end: TouchPoint): NavigationDirection => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > absDy) {
      return dx > 0 ? 'right' : 'left';
    } else {
      return dy > 0 ? 'down' : 'up';
    }
  };

  const handleSwipe = useCallback((swipeResult: SwipeResult) => {
    const { direction, velocity, distance } = swipeResult;

    // Check if swipe meets threshold requirements
    if (distance < config.threshold || velocity < config.velocity) {
      return;
    }

    // Check if direction is enabled
    if (config.direction === 'horizontal' && ['up', 'down'].includes(direction)) {
      return;
    }
    if (config.direction === 'vertical' && ['left', 'right'].includes(direction)) {
      return;
    }

    // Execute appropriate callback
    switch (direction) {
      case 'left':
        config.onSwipeLeft?.();
        break;
      case 'right':
        config.onSwipeRight?.();
        break;
      case 'up':
        config.onSwipeUp?.();
        break;
      case 'down':
        config.onSwipeDown?.();
        break;
    }
  }, [config]);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    event.preventDefault();
    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    isSwipingRef.current = true;
  }, []);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!isSwipingRef.current || !touchStartRef.current) return;
    
    // Prevent default scrolling behavior during swipe
    const touch = event.touches[0];
    const currentPoint = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    const direction = getSwipeDirection(touchStartRef.current, currentPoint);
    const distance = calculateDistance(touchStartRef.current, currentPoint);

    // Prevent default scroll if this is a valid swipe gesture
    if (distance > 20) {
      if (config.direction === 'horizontal' && ['left', 'right'].includes(direction)) {
        event.preventDefault();
      }
      if (config.direction === 'vertical' && ['up', 'down'].includes(direction)) {
        event.preventDefault();
      }
      if (config.direction === 'both') {
        event.preventDefault();
      }
    }
  }, [config.direction]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!isSwipingRef.current || !touchStartRef.current) return;

    const touch = event.changedTouches[0];
    touchEndRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    const swipeResult: SwipeResult = {
      direction: getSwipeDirection(touchStartRef.current, touchEndRef.current),
      distance: calculateDistance(touchStartRef.current, touchEndRef.current),
      velocity: calculateVelocity(touchStartRef.current, touchEndRef.current),
      duration: touchEndRef.current.time - touchStartRef.current.time,
    };

    handleSwipe(swipeResult);

    // Reset state
    touchStartRef.current = null;
    touchEndRef.current = null;
    isSwipingRef.current = false;
  }, [handleSwipe]);

  const attachSwipeListeners = useCallback((element: HTMLElement | null) => {
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

  const swipeHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return {
    attachSwipeListeners,
    swipeHandlers,
    isSwipping: isSwipingRef.current,
  };
};

// Hook for swipe navigation between pages/tabs
export const useSwipeNavigation = (
  pages: string[],
  currentPage: string,
  onPageChange: (page: string) => void,
  options?: Partial<SwipeGestureConfig>
) => {
  const currentIndex = pages.indexOf(currentPage);

  const swipeConfig: SwipeGestureConfig = {
    threshold: 50,
    velocity: 0.3,
    direction: 'horizontal',
    onSwipeLeft: () => {
      if (currentIndex < pages.length - 1) {
        onPageChange(pages[currentIndex + 1]);
      }
    },
    onSwipeRight: () => {
      if (currentIndex > 0) {
        onPageChange(pages[currentIndex - 1]);
      }
    },
    ...options,
  };

  return useSwipeGestures(swipeConfig);
};

export default useSwipeGestures;
