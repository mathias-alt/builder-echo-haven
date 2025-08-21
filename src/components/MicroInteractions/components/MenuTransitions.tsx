import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Menu,
  MenuProps,
  MenuItem,
  MenuList,
  Paper,
  Grow,
  Fade,
  Slide,
  Zoom,
  Collapse,
  Box,
  useTheme,
  alpha,
  Divider,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { animationConfig, easingCurves, timings, keyframeAnimations } from '../config';

type MenuAnimation = 'fade' | 'grow' | 'slide' | 'zoom' | 'cascade' | 'flip';
type MenuDirection = 'top' | 'bottom' | 'left' | 'right';

interface AnimatedMenuProps extends Omit<MenuProps, 'TransitionComponent'> {
  animation?: MenuAnimation;
  staggerDelay?: number;
  direction?: MenuDirection;
  cascadeDirection?: 'top-to-bottom' | 'bottom-to-top' | 'left-to-right' | 'right-to-left';
  duration?: number;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

interface StaggeredMenuItemProps {
  children: React.ReactNode;
  delay?: number;
  animation?: MenuAnimation;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  divider?: boolean;
}

interface ExpandableMenuItemProps {
  title: string;
  children: React.ReactNode[];
  icon?: React.ReactNode;
  defaultExpanded?: boolean;
  animation?: MenuAnimation;
  onToggle?: (expanded: boolean) => void;
}

interface NestedMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement?: 'right' | 'left' | 'top' | 'bottom';
  animation?: MenuAnimation;
  disabled?: boolean;
}

// Custom transition components
const CascadeTransition = React.forwardRef<HTMLDivElement, TransitionProps & {
  staggerDelay?: number;
  cascadeDirection?: string;
}>(function CascadeTransition(props, ref) {
  const { in: inProp, staggerDelay = 50, cascadeDirection = 'top-to-bottom', ...other } = props;
  
  return (
    <Grow
      ref={ref}
      in={inProp}
      style={{
        transformOrigin: cascadeDirection.includes('top') ? 'center top' : 'center bottom',
      }}
      {...other}
    />
  );
});

const FlipTransition = React.forwardRef<HTMLDivElement, TransitionProps>(
  function FlipTransition(props, ref) {
    const { in: inProp, ...other } = props;
    
    return (
      <Box
        ref={ref}
        {...other}
        sx={{
          transform: inProp ? 'rotateX(0deg)' : 'rotateX(-15deg)',
          transformOrigin: 'center top',
          transition: `transform ${timings.standard}ms ${easingCurves.smooth}`,
          opacity: inProp ? 1 : 0,
        }}
      />
    );
  }
);

const SlideMenuTransition = React.forwardRef<HTMLDivElement, TransitionProps & {
  direction?: MenuDirection;
}>(function SlideMenuTransition(props, ref) {
  const { direction = 'bottom', ...other } = props;
  
  let slideDirection: 'up' | 'down' | 'left' | 'right' = 'up';
  
  switch (direction) {
    case 'top':
      slideDirection = 'down';
      break;
    case 'bottom':
      slideDirection = 'up';
      break;
    case 'left':
      slideDirection = 'right';
      break;
    case 'right':
      slideDirection = 'left';
      break;
  }

  return <Slide direction={slideDirection} ref={ref} {...other} />;
});

// Get transition component based on animation type
const getTransitionComponent = (animation: MenuAnimation, direction?: MenuDirection, staggerDelay?: number) => {
  switch (animation) {
    case 'grow':
      return Grow;
    case 'slide':
      return (props: TransitionProps) => <SlideMenuTransition direction={direction} {...props} />;
    case 'zoom':
      return Zoom;
    case 'cascade':
      return (props: TransitionProps) => <CascadeTransition staggerDelay={staggerDelay} {...props} />;
    case 'flip':
      return FlipTransition;
    case 'fade':
    default:
      return Fade;
  }
};

// Staggered menu item component
export const StaggeredMenuItem: React.FC<StaggeredMenuItemProps> = ({
  children,
  delay = 0,
  animation = 'fade',
  onClick,
  disabled = false,
  icon,
  divider = false,
}) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationStyles = () => {
    const baseStyles = {
      transition: `all ${timings.standard}ms ${easingCurves.decelerate}`,
      transitionDelay: `${delay}ms`,
    };

    if (!isVisible) {
      switch (animation) {
        case 'slide':
          return {
            ...baseStyles,
            transform: 'translateX(-20px)',
            opacity: 0,
          };
        case 'grow':
          return {
            ...baseStyles,
            transform: 'scale(0.8)',
            opacity: 0,
          };
        case 'zoom':
          return {
            ...baseStyles,
            transform: 'scale(0.5)',
            opacity: 0,
          };
        case 'fade':
        default:
          return {
            ...baseStyles,
            opacity: 0,
          };
      }
    }

    return {
      ...baseStyles,
      transform: 'none',
      opacity: 1,
    };
  };

  return (
    <>
      <MenuItem
        onClick={onClick}
        disabled={disabled}
        sx={{
          ...getAnimationStyles(),
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            transform: isVisible ? 'translateX(4px)' : 'translateX(-20px)',
          },
          '&:active': {
            transform: isVisible ? 'scale(0.98)' : 'scale(0.8)',
          },
        }}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText>{children}</ListItemText>
      </MenuItem>
      {divider && <Divider />}
    </>
  );
};

// Expandable menu item component
export const ExpandableMenuItem: React.FC<ExpandableMenuItemProps> = ({
  title,
  children,
  icon,
  defaultExpanded = false,
  animation = 'slide',
  onToggle,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggle = useCallback(() => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onToggle?.(newExpanded);
  }, [expanded, onToggle]);

  return (
    <>
      <MenuItem onClick={handleToggle}>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText>{title}</ListItemText>
        <IconButton size="small" edge="end">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </MenuItem>
      
      <Collapse
        in={expanded}
        timeout={animationConfig.menu.open.duration}
        easing={easingCurves.decelerate}
      >
        <Box sx={{ pl: 2 }}>
          {children.map((child, index) => (
            <StaggeredMenuItem
              key={index}
              delay={index * animationConfig.menu.open.stagger}
              animation={animation}
            >
              {child}
            </StaggeredMenuItem>
          ))}
        </Box>
      </Collapse>
    </>
  );
};

// Nested menu component
export const NestedMenu: React.FC<NestedMenuProps> = ({
  trigger,
  children,
  placement = 'right',
  animation = 'grow',
  disabled = false,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setAnchorEl(event.currentTarget);
    setOpen(true);
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    if (disabled) return;

    timeoutRef.current = setTimeout(() => {
      setOpen(false);
      setAnchorEl(null);
    }, 300); // Delay to allow moving to submenu
  }, [disabled]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setAnchorEl(null);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getAnchorOrigin = () => {
    switch (placement) {
      case 'left':
        return { vertical: 'top' as const, horizontal: 'left' as const };
      case 'top':
        return { vertical: 'top' as const, horizontal: 'center' as const };
      case 'bottom':
        return { vertical: 'bottom' as const, horizontal: 'center' as const };
      case 'right':
      default:
        return { vertical: 'top' as const, horizontal: 'right' as const };
    }
  };

  const getTransformOrigin = () => {
    switch (placement) {
      case 'left':
        return { vertical: 'top' as const, horizontal: 'right' as const };
      case 'top':
        return { vertical: 'bottom' as const, horizontal: 'center' as const };
      case 'bottom':
        return { vertical: 'top' as const, horizontal: 'center' as const };
      case 'right':
      default:
        return { vertical: 'top' as const, horizontal: 'left' as const };
    }
  };

  const TransitionComponent = getTransitionComponent(animation);

  return (
    <>
      <MenuItem
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={disabled}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {trigger}
        <ChevronRightIcon fontSize="small" />
      </MenuItem>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={getAnchorOrigin()}
        transformOrigin={getTransformOrigin()}
        TransitionComponent={TransitionComponent}
        TransitionProps={{
          timeout: timings.standard,
        }}
        PaperProps={{
          onMouseEnter: () => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          },
          onMouseLeave: handleMouseLeave,
          sx: {
            minWidth: 200,
          },
        }}
      >
        {children}
      </Menu>
    </>
  );
};

// Main animated menu component
export const AnimatedMenu: React.FC<AnimatedMenuProps> = ({
  children,
  animation = 'grow',
  staggerDelay = 50,
  direction = 'bottom',
  cascadeDirection = 'top-to-bottom',
  duration = timings.standard,
  onMenuOpen,
  onMenuClose,
  open,
  onClose,
  ...menuProps
}) => {
  const theme = useTheme();
  const TransitionComponent = getTransitionComponent(animation, direction, staggerDelay);

  const handleEntering = useCallback(() => {
    onMenuOpen?.();
  }, [onMenuOpen]);

  const handleExited = useCallback(() => {
    onMenuClose?.();
  }, [onMenuClose]);

  // Enhanced menu with staggered items for cascade animation
  const enhancedChildren = React.useMemo(() => {
    if (animation !== 'cascade') {
      return children;
    }

    return React.Children.map(children, (child, index) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, {
          style: {
            ...((child as React.ReactElement<any>).props.style || {}),
            animationDelay: `${index * staggerDelay}ms`,
            animation: open 
              ? `${keyframeAnimations.menuItemStagger} ${duration}ms ${easingCurves.decelerate} both`
              : 'none',
          },
        });
      }
      return child;
    });
  }, [children, animation, open, staggerDelay, duration]);

  return (
    <Menu
      open={open}
      onClose={onClose}
      TransitionComponent={TransitionComponent}
      TransitionProps={{
        timeout: duration,
        onEntering: handleEntering,
        onExited: handleExited,
      }}
      PaperProps={{
        sx: {
          minWidth: 200,
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      {...menuProps}
    >
      {enhancedChildren}
    </Menu>
  );
};

// Context menu component
export const ContextMenu: React.FC<{
  children: React.ReactNode;
  menuItems: React.ReactNode;
  animation?: MenuAnimation;
  disabled?: boolean;
}> = ({
  children,
  menuItems,
  animation = 'grow',
  disabled = false,
}) => {
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    if (disabled) return;

    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  }, [contextMenu, disabled]);

  const handleClose = useCallback(() => {
    setContextMenu(null);
  }, []);

  const TransitionComponent = getTransitionComponent(animation);

  return (
    <>
      <Box onContextMenu={handleContextMenu} sx={{ cursor: 'context-menu' }}>
        {children}
      </Box>

      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        TransitionComponent={TransitionComponent}
        TransitionProps={{
          timeout: timings.standard,
        }}
      >
        {menuItems}
      </Menu>
    </>
  );
};

// Dropdown menu with trigger button
export const DropdownMenu: React.FC<{
  trigger: React.ReactNode;
  children: React.ReactNode;
  animation?: MenuAnimation;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  disabled?: boolean;
  closeOnItemClick?: boolean;
}> = ({
  trigger,
  children,
  animation = 'grow',
  placement = 'bottom-start',
  disabled = false,
  closeOnItemClick = true,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
  }, [disabled]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleItemClick = useCallback(() => {
    if (closeOnItemClick) {
      handleClose();
    }
  }, [closeOnItemClick, handleClose]);

  const TransitionComponent = getTransitionComponent(animation);

  // Wrap menu items to handle click-to-close
  const wrappedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === MenuItem) {
      return React.cloneElement(child as React.ReactElement<any>, {
        onClick: (event: React.MouseEvent) => {
          (child as React.ReactElement<any>).props.onClick?.(event);
          handleItemClick();
        },
      });
    }
    return child;
  });

  return (
    <>
      <Box onClick={handleClick} component="span">
        {trigger}
      </Box>

      <AnimatedMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        animation={animation}
        anchorOrigin={{
          vertical: placement.startsWith('top') ? 'top' : 'bottom',
          horizontal: placement.endsWith('start') ? 'left' : 'right',
        }}
        transformOrigin={{
          vertical: placement.startsWith('top') ? 'bottom' : 'top',
          horizontal: placement.endsWith('start') ? 'left' : 'right',
        }}
      >
        {wrappedChildren}
      </AnimatedMenu>
    </>
  );
};

export default {
  AnimatedMenu,
  StaggeredMenuItem,
  ExpandableMenuItem,
  NestedMenu,
  ContextMenu,
  DropdownMenu,
};
