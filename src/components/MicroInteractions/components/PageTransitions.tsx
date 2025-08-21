import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import {
  Box,
  Fade,
  Slide,
  Zoom,
  Grow,
  Collapse,
  useTheme,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { animationConfig, easingCurves, timings, keyframeAnimations } from '../config';

type TransitionType = 'fade' | 'slide' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoom' | 'grow' | 'none';
type NavigationDirection = 'forward' | 'backward' | 'replace';

interface PageTransitionProps {
  children: React.ReactNode;
  transitionType?: TransitionType;
  duration?: number;
  easing?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  enableRouteTransitions?: boolean;
  customTransition?: React.ComponentType<TransitionProps>;
  onEnterStart?: () => void;
  onEnterEnd?: () => void;
  onExitStart?: () => void;
  onExitEnd?: () => void;
}

interface RouteTransitionConfig {
  [key: string]: {
    enter: TransitionType;
    exit: TransitionType;
    duration?: number;
  };
}

// Default route transition configurations
const defaultRouteTransitions: RouteTransitionConfig = {
  '/': { enter: 'fade', exit: 'fade' },
  '/login': { enter: 'slideRight', exit: 'slideLeft' },
  '/signup': { enter: 'slideRight', exit: 'slideLeft' },
  '/dashboard': { enter: 'slideLeft', exit: 'slideRight' },
  '/canvas': { enter: 'slideUp', exit: 'slideDown' },
  '/team': { enter: 'slideLeft', exit: 'slideRight' },
  '/analytics': { enter: 'slideLeft', exit: 'slideRight' },
  '/settings': { enter: 'slideLeft', exit: 'slideRight' },
};

// Hook to track navigation direction
export const useNavigationDirection = (): NavigationDirection => {
  const navigationType = useNavigationType();
  
  switch (navigationType) {
    case 'PUSH':
      return 'forward';
    case 'POP':
      return 'backward';
    case 'REPLACE':
      return 'replace';
    default:
      return 'forward';
  }
};

// Hook for page transitions
export const usePageTransition = (
  transitionType: TransitionType = 'fade',
  customDuration?: number
) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const navigationDirection = useNavigationDirection();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (location.pathname !== currentPath) {
      // Start exit transition
      setIsVisible(false);
      
      // After exit animation, update path and start enter transition
      const duration = customDuration || animationConfig.page.transition.duration;
      timeoutRef.current = setTimeout(() => {
        setCurrentPath(location.pathname);
        setIsVisible(true);
      }, duration / 2);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location.pathname, currentPath, customDuration]);

  return {
    isVisible,
    currentPath,
    navigationDirection,
  };
};

// Fade transition component
export const FadeTransition: React.FC<PageTransitionProps> = ({
  children,
  duration = timings.moderate,
  onEnterStart,
  onEnterEnd,
  onExitStart,
  onExitEnd,
}) => {
  const { isVisible } = usePageTransition('fade', duration);

  return (
    <Fade
      in={isVisible}
      timeout={duration}
      easing={easingCurves.smooth}
      onEntering={onEnterStart}
      onEntered={onEnterEnd}
      onExiting={onExitStart}
      onExited={onExitEnd}
    >
      <Box>{children}</Box>
    </Fade>
  );
};

// Slide transition component
export const SlideTransition: React.FC<PageTransitionProps> = ({
  children,
  direction = 'left',
  duration = timings.moderate,
  onEnterStart,
  onEnterEnd,
  onExitStart,
  onExitEnd,
}) => {
  const { isVisible } = usePageTransition('slide', duration);

  return (
    <Slide
      in={isVisible}
      direction={direction}
      timeout={duration}
      easing={easingCurves.standard}
      onEntering={onEnterStart}
      onEntered={onEnterEnd}
      onExiting={onExitStart}
      onExited={onExitEnd}
    >
      <Box>{children}</Box>
    </Slide>
  );
};

// Zoom transition component
export const ZoomTransition: React.FC<PageTransitionProps> = ({
  children,
  duration = timings.moderate,
  onEnterStart,
  onEnterEnd,
  onExitStart,
  onExitEnd,
}) => {
  const { isVisible } = usePageTransition('zoom', duration);

  return (
    <Zoom
      in={isVisible}
      timeout={duration}
      easing={easingCurves.smooth}
      onEntering={onEnterStart}
      onEntered={onEnterEnd}
      onExiting={onExitStart}
      onExited={onExitEnd}
    >
      <Box>{children}</Box>
    </Zoom>
  );
};

// Grow transition component
export const GrowTransition: React.FC<PageTransitionProps> = ({
  children,
  duration = timings.moderate,
  onEnterStart,
  onEnterEnd,
  onExitStart,
  onExitEnd,
}) => {
  const { isVisible } = usePageTransition('grow', duration);

  return (
    <Grow
      in={isVisible}
      timeout={duration}
      easing={easingCurves.smooth}
      onEntering={onEnterStart}
      onEntered={onEnterEnd}
      onExiting={onExitStart}
      onExited={onExitEnd}
    >
      <Box>{children}</Box>
    </Grow>
  );
};

// Custom slide transitions with keyframes
export const CustomSlideTransition: React.FC<PageTransitionProps & {
  distance?: number;
}> = ({
  children,
  direction = 'left',
  duration = timings.moderate,
  distance = 30,
  onEnterStart,
  onEnterEnd,
  onExitStart,
  onExitEnd,
}) => {
  const { isVisible } = usePageTransition('slide', duration);
  const theme = useTheme();

  const getTransformValue = () => {
    if (!isVisible) {
      switch (direction) {
        case 'left':
          return `translateX(-${distance}px)`;
        case 'right':
          return `translateX(${distance}px)`;
        case 'up':
          return `translateY(-${distance}px)`;
        case 'down':
          return `translateY(${distance}px)`;
        default:
          return 'translateX(0)';
      }
    }
    return 'translateX(0)';
  };

  return (
    <Box
      sx={{
        transform: getTransformValue(),
        opacity: isVisible ? 1 : 0,
        transition: `all ${duration}ms ${easingCurves.standard}`,
        willChange: 'transform, opacity',
      }}
      onTransitionStart={() => {
        if (isVisible) {
          onEnterStart?.();
        } else {
          onExitStart?.();
        }
      }}
      onTransitionEnd={() => {
        if (isVisible) {
          onEnterEnd?.();
        } else {
          onExitEnd?.();
        }
      }}
    >
      {children}
    </Box>
  );
};

// Staggered transition for lists/grids
export const StaggeredTransition: React.FC<{
  children: React.ReactNode[];
  staggerDelay?: number;
  transitionType?: TransitionType;
  duration?: number;
}> = ({
  children,
  staggerDelay = 100,
  transitionType = 'fadeInUp',
  duration = timings.moderate,
}) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    children.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setVisibleItems(prev => {
          const newVisible = [...prev];
          newVisible[index] = true;
          return newVisible;
        });
      }, index * staggerDelay);
      
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [children, staggerDelay]);

  return (
    <>
      {children.map((child, index) => (
        <Box
          key={index}
          sx={{
            opacity: visibleItems[index] ? 1 : 0,
            transform: visibleItems[index] ? 'translateY(0)' : 'translateY(30px)',
            transition: `all ${duration}ms ${easingCurves.decelerate}`,
            transitionDelay: `${index * staggerDelay}ms`,
          }}
        >
          {child}
        </Box>
      ))}
    </>
  );
};

// Route-aware page transition wrapper
export const RouteTransition: React.FC<{
  children: React.ReactNode;
  customTransitions?: RouteTransitionConfig;
}> = ({ children, customTransitions = {} }) => {
  const location = useLocation();
  const navigationDirection = useNavigationDirection();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  const transitions = { ...defaultRouteTransitions, ...customTransitions };
  const currentTransition = transitions[location.pathname] || { enter: 'fade', exit: 'fade' };

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsTransitioning(true);
    }
  }, [location.pathname, displayLocation.pathname]);

  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);
    setDisplayLocation(location);
  }, [location]);

  const getTransitionComponent = () => {
    const transitionType = isTransitioning ? currentTransition.exit : currentTransition.enter;
    const duration = currentTransition.duration || timings.moderate;

    switch (transitionType) {
      case 'slideLeft':
        return (
          <SlideTransition 
            direction={navigationDirection === 'forward' ? 'left' : 'right'}
            duration={duration}
            onExitEnd={handleTransitionEnd}
          >
            {children}
          </SlideTransition>
        );
      case 'slideRight':
        return (
          <SlideTransition 
            direction={navigationDirection === 'forward' ? 'right' : 'left'}
            duration={duration}
            onExitEnd={handleTransitionEnd}
          >
            {children}
          </SlideTransition>
        );
      case 'slideUp':
        return (
          <SlideTransition 
            direction="up"
            duration={duration}
            onExitEnd={handleTransitionEnd}
          >
            {children}
          </SlideTransition>
        );
      case 'slideDown':
        return (
          <SlideTransition 
            direction="down"
            duration={duration}
            onExitEnd={handleTransitionEnd}
          >
            {children}
          </SlideTransition>
        );
      case 'zoom':
        return (
          <ZoomTransition 
            duration={duration}
            onExitEnd={handleTransitionEnd}
          >
            {children}
          </ZoomTransition>
        );
      case 'grow':
        return (
          <GrowTransition 
            duration={duration}
            onExitEnd={handleTransitionEnd}
          >
            {children}
          </GrowTransition>
        );
      case 'fade':
      default:
        return (
          <FadeTransition 
            duration={duration}
            onExitEnd={handleTransitionEnd}
          >
            {children}
          </FadeTransition>
        );
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {getTransitionComponent()}
    </Box>
  );
};

// Page wrapper with built-in transitions
export const AnimatedPage: React.FC<PageTransitionProps> = ({
  children,
  transitionType = 'fade',
  duration = timings.moderate,
  ...props
}) => {
  const getTransitionComponent = () => {
    switch (transitionType) {
      case 'slide':
      case 'slideLeft':
        return <SlideTransition direction="left" duration={duration} {...props}>{children}</SlideTransition>;
      case 'slideRight':
        return <SlideTransition direction="right" duration={duration} {...props}>{children}</SlideTransition>;
      case 'slideUp':
        return <SlideTransition direction="up" duration={duration} {...props}>{children}</SlideTransition>;
      case 'slideDown':
        return <SlideTransition direction="down" duration={duration} {...props}>{children}</SlideTransition>;
      case 'zoom':
        return <ZoomTransition duration={duration} {...props}>{children}</ZoomTransition>;
      case 'grow':
        return <GrowTransition duration={duration} {...props}>{children}</GrowTransition>;
      case 'fade':
      default:
        return <FadeTransition duration={duration} {...props}>{children}</FadeTransition>;
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        willChange: 'transform, opacity',
      }}
    >
      {getTransitionComponent()}
    </Box>
  );
};

// Loading transition overlay
export const LoadingTransition: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}> = ({ loading, children, loadingComponent }) => {
  const theme = useTheme();

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Fade in={!loading} timeout={timings.fast}>
        <Box>{children}</Box>
      </Fade>
      
      <Fade in={loading} timeout={timings.fast}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.background.default,
            zIndex: 10,
          }}
        >
          {loadingComponent || (
            <Box
              sx={{
                width: 40,
                height: 40,
                border: `4px solid ${theme.palette.divider}`,
                borderTop: `4px solid ${theme.palette.primary.main}`,
                borderRadius: '50%',
                animation: `${keyframeAnimations.spin} 1s linear infinite`,
              }}
            />
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default {
  RouteTransition,
  AnimatedPage,
  FadeTransition,
  SlideTransition,
  ZoomTransition,
  GrowTransition,
  CustomSlideTransition,
  StaggeredTransition,
  LoadingTransition,
  usePageTransition,
  useNavigationDirection,
};
