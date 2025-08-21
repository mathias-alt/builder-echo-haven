import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Tooltip,
  TooltipProps,
  Fade,
  Grow,
  Slide,
  Zoom,
  Box,
  Typography,
  useTheme,
  alpha,
  Portal,
  Popper,
  ClickAwayListener,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { animationConfig, easingCurves, timings, keyframeAnimations } from '../config';

type TooltipAnimation = 'fade' | 'grow' | 'slide' | 'zoom' | 'bounce' | 'flip';
type TooltipTrigger = 'hover' | 'click' | 'focus' | 'manual';

interface AnimatedTooltipProps extends Omit<TooltipProps, 'TransitionComponent'> {
  animation?: TooltipAnimation;
  delay?: number;
  duration?: number;
  trigger?: TooltipTrigger;
  interactive?: boolean;
  maxWidth?: number | string;
  rich?: boolean;
  showArrow?: boolean;
  offset?: number;
  onShow?: () => void;
  onHide?: () => void;
}

interface RichTooltipProps {
  title?: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
  icon?: React.ReactNode;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

// Custom transition components
const SlideTooltipTransition = React.forwardRef<HTMLDivElement, TransitionProps & { placement?: string }>(
  function SlideTooltipTransition(props, ref) {
    const { placement = 'bottom', ...other } = props;
    
    let direction: 'up' | 'down' | 'left' | 'right' = 'up';
    
    if (placement.startsWith('top')) direction = 'up';
    if (placement.startsWith('bottom')) direction = 'down';
    if (placement.startsWith('left')) direction = 'right';
    if (placement.startsWith('right')) direction = 'left';

    return <Slide direction={direction} ref={ref} {...other} />;
  }
);

const BounceTransition = React.forwardRef<HTMLDivElement, TransitionProps>(
  function BounceTransition(props, ref) {
    return (
      <Zoom
        ref={ref}
        {...props}
        style={{
          transformOrigin: 'center',
        }}
        timeout={timings.standard}
        easing={easingCurves.bounce}
      />
    );
  }
);

const FlipTransition = React.forwardRef<HTMLDivElement, TransitionProps>(
  function FlipTransition(props, ref) {
    const { in: inProp, ...other } = props;
    
    return (
      <Box
        ref={ref}
        {...other}
        sx={{
          transform: inProp ? 'rotateX(0deg)' : 'rotateX(-90deg)',
          transformOrigin: 'center bottom',
          transition: `transform ${timings.quick}ms ${easingCurves.smooth}`,
          opacity: inProp ? 1 : 0,
        }}
      />
    );
  }
);

// Get transition component based on animation type
const getTransitionComponent = (animation: TooltipAnimation, placement?: string) => {
  switch (animation) {
    case 'grow':
      return Grow;
    case 'slide':
      return (props: TransitionProps) => <SlideTooltipTransition placement={placement} {...props} />;
    case 'zoom':
      return Zoom;
    case 'bounce':
      return BounceTransition;
    case 'flip':
      return FlipTransition;
    case 'fade':
    default:
      return Fade;
  }
};

// Main animated tooltip component
export const AnimatedTooltip: React.FC<AnimatedTooltipProps> = ({
  children,
  title,
  animation = 'fade',
  delay = 500,
  duration = timings.quick,
  trigger = 'hover',
  interactive = false,
  maxWidth = 300,
  rich = false,
  showArrow = true,
  offset = 8,
  placement = 'bottom',
  onShow,
  onHide,
  ...tooltipProps
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleOpen = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setOpen(true);
      onShow?.();
    }, trigger === 'hover' ? delay : 0);
  }, [delay, trigger, onShow]);

  const handleClose = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setOpen(false);
    onHide?.();
  }, [onHide]);

  const handleMouseEnter = useCallback(() => {
    if (trigger === 'hover') {
      handleOpen();
    }
  }, [trigger, handleOpen]);

  const handleMouseLeave = useCallback(() => {
    if (trigger === 'hover') {
      handleClose();
    }
  }, [trigger, handleClose]);

  const handleClick = useCallback(() => {
    if (trigger === 'click') {
      if (open) {
        handleClose();
      } else {
        handleOpen();
      }
    }
  }, [trigger, open, handleOpen, handleClose]);

  const handleFocus = useCallback(() => {
    if (trigger === 'focus') {
      handleOpen();
    }
  }, [trigger, handleOpen]);

  const handleBlur = useCallback(() => {
    if (trigger === 'focus') {
      handleClose();
    }
  }, [trigger, handleClose]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const TransitionComponent = getTransitionComponent(animation, placement);

  const tooltipSx = {
    maxWidth,
    backgroundColor: rich ? theme.palette.background.paper : undefined,
    color: rich ? theme.palette.text.primary : undefined,
    border: rich ? `1px solid ${theme.palette.divider}` : undefined,
    borderRadius: rich ? 2 : undefined,
    boxShadow: rich ? theme.shadows[8] : undefined,
    p: rich ? 0 : undefined,
    '& .MuiTooltip-arrow': showArrow ? {
      color: rich ? theme.palette.background.paper : undefined,
      '&::before': rich ? {
        border: `1px solid ${theme.palette.divider}`,
      } : undefined,
    } : { display: 'none' },
  };

  if (trigger === 'manual') {
    return (
      <Tooltip
        title={title}
        open={open}
        placement={placement}
        TransitionComponent={TransitionComponent}
        TransitionProps={{
          timeout: duration,
        }}
        arrow={showArrow}
        componentsProps={{
          tooltip: {
            sx: tooltipSx,
          },
        }}
        {...tooltipProps}
      >
        {children}
      </Tooltip>
    );
  }

  if (trigger === 'click' && interactive) {
    return (
      <ClickAwayListener onClickAway={handleClose}>
        <Box component="span">
          <Tooltip
            title={title}
            open={open}
            placement={placement}
            TransitionComponent={TransitionComponent}
            TransitionProps={{
              timeout: duration,
            }}
            arrow={showArrow}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            componentsProps={{
              tooltip: {
                sx: tooltipSx,
              },
            }}
            {...tooltipProps}
          >
            <Box
              component="span"
              onClick={handleClick}
              onFocus={handleFocus}
              onBlur={handleBlur}
              tabIndex={0}
            >
              {children}
            </Box>
          </Tooltip>
        </Box>
      </ClickAwayListener>
    );
  }

  return (
    <Tooltip
      title={title}
      placement={placement}
      TransitionComponent={TransitionComponent}
      TransitionProps={{
        timeout: duration,
      }}
      enterDelay={trigger === 'hover' ? delay : 0}
      arrow={showArrow}
      disableFocusListener={trigger !== 'focus'}
      disableHoverListener={trigger !== 'hover'}
      disableTouchListener={trigger !== 'hover'}
      componentsProps={{
        tooltip: {
          sx: tooltipSx,
        },
      }}
      {...tooltipProps}
    >
      <Box
        component="span"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={trigger === 'focus' ? 0 : undefined}
      >
        {children}
      </Box>
    </Tooltip>
  );
};

// Rich tooltip content component
export const RichTooltipContent: React.FC<RichTooltipProps> = ({
  title,
  content,
  footer,
  icon,
  color = 'default',
}) => {
  const theme = useTheme();

  const getColorStyles = () => {
    switch (color) {
      case 'primary':
        return {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        };
      case 'secondary':
        return {
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
        };
      case 'error':
        return {
          backgroundColor: theme.palette.error.main,
          color: theme.palette.error.contrastText,
        };
      case 'warning':
        return {
          backgroundColor: theme.palette.warning.main,
          color: theme.palette.warning.contrastText,
        };
      case 'info':
        return {
          backgroundColor: theme.palette.info.main,
          color: theme.palette.info.contrastText,
        };
      case 'success':
        return {
          backgroundColor: theme.palette.success.main,
          color: theme.palette.success.contrastText,
        };
      default:
        return {};
    }
  };

  const colorStyles = getColorStyles();

  return (
    <Box sx={{ p: 2, ...colorStyles }}>
      {/* Header */}
      {(title || icon) && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: content ? 1 : 0 }}>
          {icon}
          {title && (
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          )}
        </Box>
      )}

      {/* Content */}
      {content && (
        <Box sx={{ mb: footer ? 1 : 0 }}>
          {typeof content === 'string' ? (
            <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
              {content}
            </Typography>
          ) : (
            content
          )}
        </Box>
      )}

      {/* Footer */}
      {footer && (
        <Box sx={{ pt: 1, borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
          {footer}
        </Box>
      )}
    </Box>
  );
};

// Pre-built tooltip variants
export const HoverTooltip: React.FC<AnimatedTooltipProps> = (props) => (
  <AnimatedTooltip animation="fade" trigger="hover" delay={500} {...props} />
);

export const ClickTooltip: React.FC<AnimatedTooltipProps> = (props) => (
  <AnimatedTooltip animation="zoom" trigger="click" interactive {...props} />
);

export const BounceTooltip: React.FC<AnimatedTooltipProps> = (props) => (
  <AnimatedTooltip animation="bounce" trigger="hover" delay={300} {...props} />
);

export const SlideTooltip: React.FC<AnimatedTooltipProps> = (props) => (
  <AnimatedTooltip animation="slide" trigger="hover" delay={400} {...props} />
);

export const RichTooltip: React.FC<AnimatedTooltipProps & { tooltipContent: RichTooltipProps }> = ({
  tooltipContent,
  ...props
}) => (
  <AnimatedTooltip
    title={<RichTooltipContent {...tooltipContent} />}
    rich
    interactive
    trigger="click"
    animation="grow"
    {...props}
  />
);

// Tooltip with custom content and animations
export const CustomTooltip: React.FC<{
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: TooltipProps['placement'];
  animation?: TooltipAnimation;
  trigger?: TooltipTrigger;
  interactive?: boolean;
  delay?: number;
  maxWidth?: number | string;
}> = ({
  children,
  content,
  placement = 'top',
  animation = 'fade',
  trigger = 'hover',
  interactive = false,
  delay = 500,
  maxWidth = 300,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setAnchorEl(event.currentTarget);
      setOpen(true);
    }, trigger === 'hover' ? delay : 0);
  }, [delay, trigger]);

  const handleClose = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setOpen(false);
    setAnchorEl(null);
  }, []);

  const TransitionComponent = getTransitionComponent(animation, placement);

  return (
    <>
      <Box
        component="span"
        onMouseEnter={trigger === 'hover' ? handleOpen : undefined}
        onMouseLeave={trigger === 'hover' ? handleClose : undefined}
        onClick={trigger === 'click' ? handleOpen : undefined}
      >
        {children}
      </Box>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement={placement}
        transition
        disablePortal={false}
        sx={{ zIndex: theme.zIndex.tooltip }}
      >
        {({ TransitionProps }) => (
          <TransitionComponent {...TransitionProps}>
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                boxShadow: theme.shadows[8],
                maxWidth,
                p: 2,
                animation: animation === 'bounce' 
                  ? `${keyframeAnimations.successBounce} ${timings.moderate}ms ${easingCurves.bounce}`
                  : 'none',
              }}
              onMouseEnter={interactive ? () => {} : undefined}
              onMouseLeave={interactive ? handleClose : undefined}
            >
              {content}
            </Box>
          </TransitionComponent>
        )}
      </Popper>
    </>
  );
};

// Tooltip hook for programmatic control
export const useTooltip = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const showTooltip = useCallback((element: HTMLElement) => {
    setAnchorEl(element);
    setOpen(true);
  }, []);

  const hideTooltip = useCallback(() => {
    setOpen(false);
    setAnchorEl(null);
  }, []);

  const toggleTooltip = useCallback((element: HTMLElement) => {
    if (open) {
      hideTooltip();
    } else {
      showTooltip(element);
    }
  }, [open, hideTooltip, showTooltip]);

  return {
    open,
    anchorEl,
    showTooltip,
    hideTooltip,
    toggleTooltip,
  };
};

export default {
  AnimatedTooltip,
  RichTooltipContent,
  HoverTooltip,
  ClickTooltip,
  BounceTooltip,
  SlideTooltip,
  RichTooltip,
  CustomTooltip,
  useTooltip,
};
