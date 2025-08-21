import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useSwipeGestures } from '../hooks/useSwipeGestures';
import { SwipeGestureConfig } from '../types';

interface SwipeGestureProviderProps {
  children: React.ReactNode;
  config: SwipeGestureConfig;
  disabled?: boolean;
  className?: string;
  sx?: object;
}

export const SwipeGestureProvider: React.FC<SwipeGestureProviderProps> = ({
  children,
  config,
  disabled = false,
  className,
  sx,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { attachSwipeListeners } = useSwipeGestures(config);

  useEffect(() => {
    if (disabled || !containerRef.current) return;

    const cleanup = attachSwipeListeners(containerRef.current);
    return cleanup;
  }, [attachSwipeListeners, disabled]);

  return (
    <Box
      ref={containerRef}
      className={className}
      sx={{
        width: '100%',
        height: '100%',
        touchAction: disabled ? 'auto' : 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

// Swipeable page container for tab-like navigation
interface SwipeablePageContainerProps {
  children: React.ReactNode;
  pages: string[];
  currentPage: string;
  onPageChange: (page: string) => void;
  animationDuration?: number;
  disabled?: boolean;
}

export const SwipeablePageContainer: React.FC<SwipeablePageContainerProps> = ({
  children,
  pages,
  currentPage,
  onPageChange,
  animationDuration = 300,
  disabled = false,
}) => {
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
  };

  return (
    <SwipeGestureProvider
      config={swipeConfig}
      disabled={disabled}
      sx={{
        overflow: 'hidden',
        position: 'relative',
        '& > *': {
          transition: `transform ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        },
      }}
    >
      {children}
    </SwipeGestureProvider>
  );
};

// Swipeable drawer component
interface SwipeableDrawerProps {
  children: React.ReactNode;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  threshold?: number;
  disabled?: boolean;
}

export const SwipeableDrawer: React.FC<SwipeableDrawerProps> = ({
  children,
  open,
  onOpen,
  onClose,
  anchor = 'left',
  threshold = 50,
  disabled = false,
}) => {
  const getSwipeConfig = (): SwipeGestureConfig => {
    switch (anchor) {
      case 'left':
        return {
          threshold,
          velocity: 0.3,
          direction: 'horizontal',
          onSwipeRight: onOpen,
          onSwipeLeft: open ? onClose : undefined,
        };
      case 'right':
        return {
          threshold,
          velocity: 0.3,
          direction: 'horizontal',
          onSwipeLeft: onOpen,
          onSwipeRight: open ? onClose : undefined,
        };
      case 'top':
        return {
          threshold,
          velocity: 0.3,
          direction: 'vertical',
          onSwipeDown: onOpen,
          onSwipeUp: open ? onClose : undefined,
        };
      case 'bottom':
        return {
          threshold,
          velocity: 0.3,
          direction: 'vertical',
          onSwipeUp: onOpen,
          onSwipeDown: open ? onClose : undefined,
        };
      default:
        return {
          threshold,
          velocity: 0.3,
          direction: 'horizontal',
          onSwipeRight: onOpen,
          onSwipeLeft: onClose,
        };
    }
  };

  return (
    <SwipeGestureProvider
      config={getSwipeConfig()}
      disabled={disabled}
    >
      {children}
    </SwipeGestureProvider>
  );
};

export default SwipeGestureProvider;
