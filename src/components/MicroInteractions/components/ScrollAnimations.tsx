import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  Box,
  useTheme,
} from '@mui/material';
import { animationConfig, easingCurves, timings, keyframeAnimations } from '../config';

interface ScrollAnimationProps {
  children: React.ReactNode;
  animationType?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideInUp' | 'slideInDown' | 'slideInLeft' | 'slideInRight' | 'rotateIn' | 'bounceIn';
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
  easing?: string;
  disabled?: boolean;
  onEnter?: () => void;
  onExit?: () => void;
  className?: string;
  sx?: object;
}

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  disabled?: boolean;
  className?: string;
  sx?: object;
}

interface RevealAnimationProps extends ScrollAnimationProps {
  stagger?: boolean;
  staggerDelay?: number;
}

// Hook for intersection observer
export const useIntersectionObserver = (
  threshold: number = 0.1,
  rootMargin: string = '0px',
  triggerOnce: boolean = true
) => {
  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        
        if (inView && (!triggerOnce || !hasTriggered)) {
          setIsInView(true);
          setHasTriggered(true);
        } else if (!triggerOnce && !inView) {
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { elementRef, isInView, hasTriggered };
};

// Hook for scroll position
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
};

// Hook for parallax effect
export const useParallax = (speed: number = 0.5, direction: 'up' | 'down' | 'left' | 'right' = 'up') => {
  const [offset, setOffset] = useState(0);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;

      let transform = '';
      switch (direction) {
        case 'up':
          transform = `translateY(${rate}px)`;
          break;
        case 'down':
          transform = `translateY(${-rate}px)`;
          break;
        case 'left':
          transform = `translateX(${rate}px)`;
          break;
        case 'right':
          transform = `translateX(${-rate}px)`;
          break;
      }

      setOffset(rate);
      if (elementRef.current) {
        elementRef.current.style.transform = transform;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  return { elementRef, offset };
};

// Get animation styles based on type
const getAnimationStyles = (
  animationType: string,
  isInView: boolean,
  duration: number,
  easing: string,
  delay: number
) => {
  const baseStyles = {
    transition: `all ${duration}ms ${easing}`,
    transitionDelay: `${delay}ms`,
    willChange: 'transform, opacity',
  };

  if (!isInView) {
    switch (animationType) {
      case 'fadeIn':
        return {
          ...baseStyles,
          opacity: 0,
        };
      case 'fadeInUp':
        return {
          ...baseStyles,
          opacity: 0,
          transform: `translateY(${animationConfig.scroll.reveal.slideDistance}px)`,
        };
      case 'fadeInDown':
        return {
          ...baseStyles,
          opacity: 0,
          transform: `translateY(-${animationConfig.scroll.reveal.slideDistance}px)`,
        };
      case 'fadeInLeft':
        return {
          ...baseStyles,
          opacity: 0,
          transform: `translateX(-${animationConfig.scroll.reveal.slideDistance}px)`,
        };
      case 'fadeInRight':
        return {
          ...baseStyles,
          opacity: 0,
          transform: `translateX(${animationConfig.scroll.reveal.slideDistance}px)`,
        };
      case 'scaleIn':
        return {
          ...baseStyles,
          opacity: 0,
          transform: 'scale(0.8)',
        };
      case 'slideInUp':
        return {
          ...baseStyles,
          transform: `translateY(${animationConfig.scroll.reveal.slideDistance}px)`,
        };
      case 'slideInDown':
        return {
          ...baseStyles,
          transform: `translateY(-${animationConfig.scroll.reveal.slideDistance}px)`,
        };
      case 'slideInLeft':
        return {
          ...baseStyles,
          transform: `translateX(-${animationConfig.scroll.reveal.slideDistance}px)`,
        };
      case 'slideInRight':
        return {
          ...baseStyles,
          transform: `translateX(${animationConfig.scroll.reveal.slideDistance}px)`,
        };
      case 'rotateIn':
        return {
          ...baseStyles,
          opacity: 0,
          transform: 'rotate(-10deg) scale(0.8)',
        };
      case 'bounceIn':
        return {
          ...baseStyles,
          opacity: 0,
          transform: 'scale(0.3)',
        };
      default:
        return {
          ...baseStyles,
          opacity: 0,
        };
    }
  }

  // In view styles
  return {
    ...baseStyles,
    opacity: 1,
    transform: 'none',
  };
};

// Main scroll animation component
export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  animationType = 'fadeInUp',
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
  delay = 0,
  duration = timings.moderate,
  easing = easingCurves.decelerate,
  disabled = false,
  onEnter,
  onExit,
  className,
  sx,
}) => {
  const { elementRef, isInView } = useIntersectionObserver(threshold, rootMargin, triggerOnce);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (isInView && !hasEntered) {
      setHasEntered(true);
      onEnter?.();
    } else if (!isInView && hasEntered && !triggerOnce) {
      setHasEntered(false);
      onExit?.();
    }
  }, [isInView, hasEntered, triggerOnce, onEnter, onExit]);

  if (disabled) {
    return <Box className={className} sx={sx}>{children}</Box>;
  }

  const animationStyles = getAnimationStyles(
    animationType,
    isInView,
    duration,
    easing,
    delay
  );

  return (
    <Box
      ref={elementRef}
      className={className}
      sx={{
        ...animationStyles,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

// Parallax component
export const Parallax: React.FC<ParallaxProps> = ({
  children,
  speed = 0.5,
  direction = 'up',
  disabled = false,
  className,
  sx,
}) => {
  const { elementRef } = useParallax(speed, direction);

  if (disabled) {
    return <Box className={className} sx={sx}>{children}</Box>;
  }

  return (
    <Box
      ref={elementRef}
      className={className}
      sx={{
        willChange: 'transform',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

// Reveal animation for multiple elements with stagger
export const RevealAnimation: React.FC<RevealAnimationProps> = ({
  children,
  stagger = false,
  staggerDelay = 100,
  ...props
}) => {
  const childrenArray = React.Children.toArray(children);

  if (!stagger) {
    return <ScrollAnimation {...props}>{children}</ScrollAnimation>;
  }

  return (
    <Box>
      {childrenArray.map((child, index) => (
        <ScrollAnimation
          key={index}
          {...props}
          delay={(props.delay || 0) + (index * staggerDelay)}
        >
          {child}
        </ScrollAnimation>
      ))}
    </Box>
  );
};

// Fade in on scroll component
export const FadeInOnScroll: React.FC<ScrollAnimationProps> = (props) => (
  <ScrollAnimation animationType="fadeIn" {...props} />
);

// Slide up on scroll component
export const SlideUpOnScroll: React.FC<ScrollAnimationProps> = (props) => (
  <ScrollAnimation animationType="fadeInUp" {...props} />
);

// Scale in on scroll component
export const ScaleInOnScroll: React.FC<ScrollAnimationProps> = (props) => (
  <ScrollAnimation animationType="scaleIn" {...props} />
);

// Staggered list animation
export const StaggeredList: React.FC<{
  children: React.ReactNode[];
  staggerDelay?: number;
  animationType?: ScrollAnimationProps['animationType'];
  threshold?: number;
}> = ({
  children,
  staggerDelay = 100,
  animationType = 'fadeInUp',
  threshold = 0.1,
}) => {
  return (
    <Box>
      {children.map((child, index) => (
        <ScrollAnimation
          key={index}
          animationType={animationType}
          threshold={threshold}
          delay={index * staggerDelay}
          triggerOnce={true}
        >
          {child}
        </ScrollAnimation>
      ))}
    </Box>
  );
};

// Scroll progress indicator
export const ScrollProgressIndicator: React.FC<{
  height?: number;
  color?: string;
  backgroundColor?: string;
  position?: 'top' | 'bottom';
}> = ({
  height = 4,
  color,
  backgroundColor,
  position = 'top',
}) => {
  const theme = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        [position]: 0,
        left: 0,
        right: 0,
        height: height,
        backgroundColor: backgroundColor || alpha(theme.palette.primary.main, 0.1),
        zIndex: theme.zIndex.appBar + 1,
      }}
    >
      <Box
        sx={{
          height: '100%',
          width: `${scrollProgress}%`,
          backgroundColor: color || theme.palette.primary.main,
          transition: 'width 0.1s ease-out',
        }}
      />
    </Box>
  );
};

// Scroll to top button with animation
export const ScrollToTopButton: React.FC<{
  threshold?: number;
  size?: number;
  position?: { bottom: number; right: number };
  onClick?: () => void;
}> = ({
  threshold = 300,
  size = 56,
  position = { bottom: 24, right: 24 },
  onClick,
}) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const scrollPosition = useScrollPosition();

  useEffect(() => {
    setIsVisible(scrollPosition > threshold);
  }, [scrollPosition, threshold]);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    onClick?.();
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: 'fixed',
        bottom: position.bottom,
        right: position.right,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: theme.zIndex.fab,
        transform: isVisible ? 'scale(1)' : 'scale(0)',
        opacity: isVisible ? 1 : 0,
        transition: `all ${timings.standard}ms ${easingCurves.smooth}`,
        boxShadow: theme.shadows[6],
        '&:hover': {
          transform: isVisible ? 'scale(1.1)' : 'scale(0)',
          boxShadow: theme.shadows[8],
        },
        '&:active': {
          transform: isVisible ? 'scale(0.95)' : 'scale(0)',
        },
      }}
    >
      <Box
        component="svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
      </Box>
    </Box>
  );
};

// Infinite scroll loader
export const InfiniteScrollLoader: React.FC<{
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  threshold?: number;
  loader?: React.ReactNode;
}> = ({
  onLoadMore,
  hasMore,
  loading,
  threshold = 0.8,
  loader,
}) => {
  const theme = useTheme();
  const { elementRef, isInView } = useIntersectionObserver(threshold);

  useEffect(() => {
    if (isInView && hasMore && !loading) {
      onLoadMore();
    }
  }, [isInView, hasMore, loading, onLoadMore]);

  if (!hasMore) return null;

  return (
    <Box
      ref={elementRef}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4,
      }}
    >
      {loading && (
        loader || (
          <Box
            sx={{
              width: 32,
              height: 32,
              border: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              borderTop: `3px solid ${theme.palette.primary.main}`,
              borderRadius: '50%',
              animation: `${keyframeAnimations.spin} 1s linear infinite`,
            }}
          />
        )
      )}
    </Box>
  );
};

export default {
  ScrollAnimation,
  Parallax,
  RevealAnimation,
  FadeInOnScroll,
  SlideUpOnScroll,
  ScaleInOnScroll,
  StaggeredList,
  ScrollProgressIndicator,
  ScrollToTopButton,
  InfiniteScrollLoader,
  useIntersectionObserver,
  useScrollPosition,
  useParallax,
};
