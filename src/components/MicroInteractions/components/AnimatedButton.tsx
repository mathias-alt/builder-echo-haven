import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Button,
  ButtonProps,
  Box,
  alpha,
  useTheme,
} from '@mui/material';
import { animationConfig, easingCurves, timings, keyframeAnimations } from '../config';

interface RippleEffect {
  key: number;
  x: number;
  y: number;
  size: number;
}

interface AnimatedButtonProps extends Omit<ButtonProps, 'ref'> {
  rippleEffect?: boolean;
  scaleOnHover?: boolean;
  elevationOnHover?: boolean;
  glowEffect?: boolean;
  bounceOnClick?: boolean;
  pulseOnFocus?: boolean;
  customAnimation?: string;
  animationDuration?: number;
  disabled?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  rippleEffect = true,
  scaleOnHover = true,
  elevationOnHover = true,
  glowEffect = false,
  bounceOnClick = true,
  pulseOnFocus = true,
  customAnimation,
  animationDuration,
  disabled = false,
  onClick,
  onMouseDown,
  onMouseUp,
  onFocus,
  onBlur,
  sx,
  ...buttonProps
}) => {
  const theme = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const rippleKey = useRef(0);

  // Create ripple effect
  const createRipple = useCallback((event: React.MouseEvent) => {
    if (!rippleEffect || disabled) return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;

    const newRipple: RippleEffect = {
      key: rippleKey.current++,
      x: x - size / 2,
      y: y - size / 2,
      size,
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.key !== newRipple.key));
    }, animationConfig.button.loading.duration);
  }, [rippleEffect, disabled]);

  // Handle mouse down
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      setIsPressed(true);
      createRipple(event);
    }
    onMouseDown?.(event);
  }, [disabled, createRipple, onMouseDown]);

  // Handle mouse up
  const handleMouseUp = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    onMouseUp?.(event);
  }, [onMouseUp]);

  // Handle click
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      onClick?.(event);
    }
  }, [disabled, onClick]);

  // Handle focus
  const handleFocus = useCallback((event: React.FocusEvent<HTMLButtonElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  }, [onFocus]);

  // Handle blur
  const handleBlur = useCallback((event: React.FocusEvent<HTMLButtonElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  }, [onBlur]);

  // Clean up ripples on unmount
  useEffect(() => {
    return () => {
      setRipples([]);
    };
  }, []);

  // Get animation styles
  const getAnimationStyles = () => {
    const baseTransition = `all ${animationDuration || timings.quick}ms ${easingCurves.smooth}`;
    const transforms: string[] = [];
    const shadows: string[] = [];
    const filters: string[] = [];

    // Scale on hover
    if (scaleOnHover && isHovered && !disabled) {
      transforms.push(`scale(${animationConfig.button.hover.scale})`);
    }

    // Scale on press
    if (bounceOnClick && isPressed && !disabled) {
      transforms.push(`scale(${animationConfig.button.click.scale})`);
    }

    // Elevation on hover
    if (elevationOnHover && isHovered && !disabled) {
      shadows.push(theme.shadows[animationConfig.button.hover.elevation]);
    }

    // Glow effect
    if (glowEffect && (isHovered || isFocused) && !disabled) {
      const glowColor = alpha(theme.palette.primary.main, 0.3);
      shadows.push(`0 0 20px ${glowColor}`);
    }

    // Pulse on focus
    if (pulseOnFocus && isFocused && !disabled) {
      filters.push('brightness(1.1)');
    }

    return {
      transition: baseTransition,
      transform: transforms.join(' ') || 'none',
      boxShadow: shadows.join(', ') || 'none',
      filter: filters.join(' ') || 'none',
      animation: customAnimation || 'none',
    };
  };

  return (
    <Button
      ref={buttonRef}
      disabled={disabled}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        ...getAnimationStyles(),
        '&:disabled': {
          opacity: 0.6,
          transform: 'none !important',
          boxShadow: 'none !important',
          filter: 'none !important',
        },
        ...sx,
      }}
      {...buttonProps}
    >
      {children}
      
      {/* Ripple effects */}
      {rippleEffect && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            overflow: 'hidden',
          }}
        >
          {ripples.map((ripple) => (
            <Box
              key={ripple.key}
              sx={{
                position: 'absolute',
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size,
                borderRadius: '50%',
                backgroundColor: alpha(theme.palette.common.white, 0.3),
                animation: `${keyframeAnimations.buttonRipple} ${animationConfig.button.loading.duration}ms ${easingCurves.standard}`,
                pointerEvents: 'none',
              }}
            />
          ))}
        </Box>
      )}
    </Button>
  );
};

// Specialized button variants with predefined animations
export const PrimaryAnimatedButton: React.FC<AnimatedButtonProps> = (props) => (
  <AnimatedButton
    variant="contained"
    color="primary"
    scaleOnHover={true}
    elevationOnHover={true}
    glowEffect={true}
    {...props}
  />
);

export const SecondaryAnimatedButton: React.FC<AnimatedButtonProps> = (props) => (
  <AnimatedButton
    variant="outlined"
    color="primary"
    scaleOnHover={true}
    elevationOnHover={false}
    glowEffect={false}
    {...props}
  />
);

export const FloatingActionAnimatedButton: React.FC<AnimatedButtonProps> = (props) => {
  const theme = useTheme();
  
  return (
    <AnimatedButton
      variant="contained"
      color="primary"
      scaleOnHover={true}
      elevationOnHover={true}
      glowEffect={true}
      pulseOnFocus={true}
      sx={{
        borderRadius: '50%',
        minWidth: 56,
        height: 56,
        '&:hover': {
          animation: `${keyframeAnimations.buttonPulse} ${timings.moderate}ms ${easingCurves.bounce}`,
        },
      }}
      {...props}
    />
  );
};

export const IconAnimatedButton: React.FC<AnimatedButtonProps> = (props) => (
  <AnimatedButton
    variant="text"
    scaleOnHover={true}
    elevationOnHover={false}
    glowEffect={false}
    rippleEffect={true}
    sx={{
      borderRadius: '50%',
      minWidth: 48,
      height: 48,
      padding: 1,
    }}
    {...props}
  />
);

export const LoadingAnimatedButton: React.FC<AnimatedButtonProps & {
  loading?: boolean;
  loadingIndicator?: React.ReactNode;
}> = ({ loading = false, loadingIndicator, children, disabled, ...props }) => {
  const theme = useTheme();

  return (
    <AnimatedButton
      disabled={disabled || loading}
      sx={{
        position: 'relative',
        '& .button-content': {
          opacity: loading ? 0 : 1,
          transition: `opacity ${timings.fast}ms ${easingCurves.smooth}`,
        },
        '& .loading-indicator': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: loading ? 1 : 0,
          transition: `opacity ${timings.fast}ms ${easingCurves.smooth}`,
        },
      }}
      {...props}
    >
      <Box className="button-content">
        {children}
      </Box>
      {loading && (
        <Box className="loading-indicator">
          {loadingIndicator || (
            <Box
              sx={{
                width: 20,
                height: 20,
                border: `2px solid ${alpha(theme.palette.common.white, 0.3)}`,
                borderTop: `2px solid ${theme.palette.common.white}`,
                borderRadius: '50%',
                animation: `${keyframeAnimations.spin} 1s linear infinite`,
              }}
            />
          )}
        </Box>
      )}
    </AnimatedButton>
  );
};

// Success/Error button states
export const SuccessAnimatedButton: React.FC<AnimatedButtonProps> = (props) => {
  const theme = useTheme();
  
  return (
    <AnimatedButton
      sx={{
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
        animation: `${keyframeAnimations.successBounce} ${timings.moderate}ms ${easingCurves.bounce}`,
        '&:hover': {
          backgroundColor: theme.palette.success.dark,
        },
      }}
      {...props}
    />
  );
};

export const ErrorAnimatedButton: React.FC<AnimatedButtonProps> = (props) => {
  const theme = useTheme();
  
  return (
    <AnimatedButton
      sx={{
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
        animation: `${keyframeAnimations.errorShake} ${timings.fast}ms ${easingCurves.sharp}`,
        '&:hover': {
          backgroundColor: theme.palette.error.dark,
        },
      }}
      {...props}
    />
  );
};

export default AnimatedButton;
