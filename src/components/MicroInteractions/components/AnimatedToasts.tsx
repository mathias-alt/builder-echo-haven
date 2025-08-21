import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import {
  Box,
  Alert,
  AlertTitle,
  Snackbar,
  IconButton,
  Typography,
  LinearProgress,
  useTheme,
  alpha,
  Portal,
  Slide,
  Fade,
  Zoom,
  Grow,
} from '@mui/material';
import {
  CheckCircle,
  Error as ErrorIcon,
  Warning,
  Info,
  Close as CloseIcon,
} from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { animationConfig, easingCurves, timings, keyframeAnimations } from '../config';

type ToastType = 'success' | 'error' | 'warning' | 'info';
type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
type ToastAnimation = 'slide' | 'fade' | 'zoom' | 'grow' | 'bounce';

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  position?: ToastPosition;
  animation?: ToastAnimation;
  persistent?: boolean;
  showProgress?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  onClose?: () => void;
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, 'id'>) => string;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
  toasts: Toast[];
}

// Toast context
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Hook to use toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Helper functions for quick toast creation
export const useQuickToast = () => {
  const { showToast } = useToast();

  return {
    success: (message: string, options?: Partial<Toast>) =>
      showToast({ type: 'success', message, ...options }),
    error: (message: string, options?: Partial<Toast>) =>
      showToast({ type: 'error', message, ...options }),
    warning: (message: string, options?: Partial<Toast>) =>
      showToast({ type: 'warning', message, ...options }),
    info: (message: string, options?: Partial<Toast>) =>
      showToast({ type: 'info', message, ...options }),
  };
};

// Toast transition components
const SlideTransition = React.forwardRef<HTMLDivElement, TransitionProps & { position?: ToastPosition }>(
  function SlideTransition(props, ref) {
    const { position = 'top-right', ...other } = props;
    
    let direction: 'up' | 'down' | 'left' | 'right' = 'up';
    
    if (position.includes('top')) direction = 'down';
    if (position.includes('bottom')) direction = 'up';
    if (position.includes('left')) direction = 'right';
    if (position.includes('right')) direction = 'left';

    return <Slide direction={direction} ref={ref} {...other} />;
  }
);

const ZoomTransition = React.forwardRef<HTMLDivElement, TransitionProps>(
  function ZoomTransition(props, ref) {
    return <Zoom ref={ref} {...props} />;
  }
);

const GrowTransition = React.forwardRef<HTMLDivElement, TransitionProps>(
  function GrowTransition(props, ref) {
    return <Grow ref={ref} {...props} />;
  }
);

const FadeTransition = React.forwardRef<HTMLDivElement, TransitionProps>(
  function FadeTransition(props, ref) {
    return <Fade ref={ref} {...props} />;
  }
);

// Individual toast component
const ToastItem: React.FC<{
  toast: Toast;
  onClose: (id: string) => void;
}> = ({ toast, onClose }) => {
  const theme = useTheme();
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide timer with progress
  useEffect(() => {
    if (toast.persistent || !toast.duration) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (toast.duration! / 100));
        if (newProgress <= 0) {
          setIsVisible(false);
          setTimeout(() => onClose(toast.id), animationConfig.toast.exit.duration);
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [toast.duration, toast.persistent, toast.id, onClose]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onClose(toast.id), animationConfig.toast.exit.duration);
    toast.onClose?.();
  }, [toast.id, toast.onClose, onClose]);

  const getToastIcon = () => {
    if (toast.icon) return toast.icon;

    const iconProps = {
      sx: {
        fontSize: 24,
        animation: toast.type === 'success' 
          ? `${keyframeAnimations.successBounce} ${timings.moderate}ms ${easingCurves.bounce}`
          : toast.type === 'error'
          ? `${keyframeAnimations.errorShake} ${timings.fast}ms ${easingCurves.sharp}`
          : 'none',
      }
    };

    switch (toast.type) {
      case 'success':
        return <CheckCircle color="success" {...iconProps} />;
      case 'error':
        return <ErrorIcon color="error" {...iconProps} />;
      case 'warning':
        return <Warning color="warning" {...iconProps} />;
      case 'info':
        return <Info color="info" {...iconProps} />;
    }
  };

  const getToastColors = () => {
    switch (toast.type) {
      case 'success':
        return {
          backgroundColor: alpha(theme.palette.success.main, 0.1),
          borderColor: theme.palette.success.main,
          color: theme.palette.success.dark,
        };
      case 'error':
        return {
          backgroundColor: alpha(theme.palette.error.main, 0.1),
          borderColor: theme.palette.error.main,
          color: theme.palette.error.dark,
        };
      case 'warning':
        return {
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
          borderColor: theme.palette.warning.main,
          color: theme.palette.warning.dark,
        };
      case 'info':
        return {
          backgroundColor: alpha(theme.palette.info.main, 0.1),
          borderColor: theme.palette.info.main,
          color: theme.palette.info.dark,
        };
    }
  };

  const getTransitionComponent = () => {
    const transitionProps = {
      in: isVisible,
      timeout: isVisible ? animationConfig.toast.enter.duration : animationConfig.toast.exit.duration,
      easing: isVisible ? easingCurves.decelerate : easingCurves.accelerate,
    };

    switch (toast.animation) {
      case 'zoom':
        return ZoomTransition;
      case 'grow':
        return GrowTransition;
      case 'fade':
        return FadeTransition;
      case 'bounce':
        return ZoomTransition; // Using zoom with bounce easing
      case 'slide':
      default:
        return (props: any) => <SlideTransition position={toast.position} {...props} />;
    }
  };

  const TransitionComponent = getTransitionComponent();
  const colors = getToastColors();

  return (
    <TransitionComponent
      in={isVisible}
      timeout={isVisible ? animationConfig.toast.enter.duration : animationConfig.toast.exit.duration}
      easing={isVisible ? easingCurves.decelerate : easingCurves.accelerate}
    >
      <Box
        sx={{
          mb: 1,
          minWidth: 300,
          maxWidth: 500,
          position: 'relative',
          backgroundColor: colors.backgroundColor,
          border: `1px solid ${colors.borderColor}`,
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: theme.shadows[8],
          backdropFilter: 'blur(8px)',
          animation: toast.animation === 'bounce' 
            ? `${keyframeAnimations.successBounce} ${timings.moderate}ms ${easingCurves.bounce}`
            : 'none',
        }}
      >
        {/* Progress bar */}
        {toast.showProgress && !toast.persistent && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: 'transparent',
              '& .MuiLinearProgress-bar': {
                backgroundColor: colors.borderColor,
              },
            }}
          />
        )}

        <Box sx={{ p: 2, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* Icon */}
          <Box sx={{ flexShrink: 0, mt: 0.5 }}>
            {getToastIcon()}
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {toast.title && (
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: colors.color,
                  mb: toast.message ? 0.5 : 0,
                }}
              >
                {toast.title}
              </Typography>
            )}
            <Typography
              variant="body2"
              sx={{
                color: colors.color,
                lineHeight: 1.4,
              }}
            >
              {toast.message}
            </Typography>

            {/* Action button */}
            {toast.action && (
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="button"
                  onClick={toast.action.onClick}
                  sx={{
                    color: colors.borderColor,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                >
                  {toast.action.label}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Close button */}
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: colors.color,
              '&:hover': {
                backgroundColor: alpha(colors.borderColor, 0.1),
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </TransitionComponent>
  );
};

// Toast container component
const ToastContainer: React.FC<{
  toasts: Toast[];
  position: ToastPosition;
  onClose: (id: string) => void;
}> = ({ toasts, position, onClose }) => {
  const theme = useTheme();

  const getPositionStyles = () => {
    const base = {
      position: 'fixed' as const,
      zIndex: theme.zIndex.snackbar,
      pointerEvents: 'none' as const,
    };

    switch (position) {
      case 'top-left':
        return { ...base, top: 24, left: 24 };
      case 'top-center':
        return { ...base, top: 24, left: '50%', transform: 'translateX(-50%)' };
      case 'top-right':
        return { ...base, top: 24, right: 24 };
      case 'bottom-left':
        return { ...base, bottom: 24, left: 24 };
      case 'bottom-center':
        return { ...base, bottom: 24, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-right':
        return { ...base, bottom: 24, right: 24 };
      default:
        return { ...base, top: 24, right: 24 };
    }
  };

  const positionedToasts = toasts.filter(toast => 
    (toast.position || 'top-right') === position
  );

  if (positionedToasts.length === 0) return null;

  return (
    <Box sx={getPositionStyles()}>
      <Box sx={{ pointerEvents: 'auto' }}>
        {positionedToasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={onClose}
          />
        ))}
      </Box>
    </Box>
  );
};

// Toast provider component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toastData: Omit<Toast, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = {
      id,
      duration: 5000,
      position: 'top-right',
      animation: 'slide',
      showProgress: true,
      ...toastData,
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const hideAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const positions: ToastPosition[] = [
    'top-left', 'top-center', 'top-right',
    'bottom-left', 'bottom-center', 'bottom-right'
  ];

  return (
    <ToastContext.Provider value={{ showToast, hideToast, hideAllToasts, toasts }}>
      {children}
      <Portal>
        {positions.map(position => (
          <ToastContainer
            key={position}
            toasts={toasts}
            position={position}
            onClose={hideToast}
          />
        ))}
      </Portal>
    </ToastContext.Provider>
  );
};

// Enhanced snackbar component
export const AnimatedSnackbar: React.FC<{
  open: boolean;
  onClose: () => void;
  message: string;
  type?: ToastType;
  action?: React.ReactNode;
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  autoHideDuration?: number;
  animation?: ToastAnimation;
}> = ({
  open,
  onClose,
  message,
  type = 'info',
  action,
  anchorOrigin = { vertical: 'bottom', horizontal: 'center' },
  autoHideDuration = 6000,
  animation = 'slide',
}) => {
  const getTransitionComponent = () => {
    switch (animation) {
      case 'fade':
        return FadeTransition;
      case 'zoom':
        return ZoomTransition;
      case 'grow':
        return GrowTransition;
      case 'slide':
      default:
        return SlideTransition;
    }
  };

  const TransitionComponent = getTransitionComponent();

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={autoHideDuration}
      anchorOrigin={anchorOrigin}
      TransitionComponent={TransitionComponent}
      sx={{
        '& .MuiSnackbarContent-root': {
          borderRadius: 2,
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      <Alert 
        onClose={onClose} 
        severity={type}
        action={action}
        sx={{
          animation: type === 'success' 
            ? `${keyframeAnimations.successBounce} ${timings.moderate}ms ${easingCurves.bounce}`
            : type === 'error'
            ? `${keyframeAnimations.errorShake} ${timings.fast}ms ${easingCurves.sharp}`
            : 'none',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

// Pre-built toast variants
export const SuccessToast: React.FC<{ message: string; onClose?: () => void }> = ({ message, onClose }) => {
  const { success } = useQuickToast();
  
  useEffect(() => {
    const id = success(message, {
      animation: 'bounce',
      showProgress: true,
      onClose,
    });
    
    return () => {
      // Cleanup if needed
    };
  }, [message, success, onClose]);

  return null;
};

export const ErrorToast: React.FC<{ message: string; onClose?: () => void; action?: Toast['action'] }> = ({ 
  message, 
  onClose,
  action 
}) => {
  const { error } = useQuickToast();
  
  useEffect(() => {
    const id = error(message, {
      animation: 'slide',
      showProgress: false,
      persistent: true,
      action,
      onClose,
    });
    
    return () => {
      // Cleanup if needed
    };
  }, [message, error, onClose, action]);

  return null;
};

export default {
  ToastProvider,
  useToast,
  useQuickToast,
  AnimatedSnackbar,
  SuccessToast,
  ErrorToast,
};
