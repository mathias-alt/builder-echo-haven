import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  alpha,
  SvgIcon,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Celebration as CelebrationIcon,
  Done as DoneIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { SuccessStateProps } from '../types';
import {
  fadeInAnimation,
  scaleInAnimation,
  checkmarkAnimation,
  successPulseAnimation,
  confettiAnimation,
  elasticAnimation,
} from '../animations';

// Animated checkmark SVG
const AnimatedCheckmark: React.FC<{ size?: number; color?: string }> = ({ 
  size = 60, 
  color = '#4CAF50' 
}) => {
  return (
    <SvgIcon
      sx={{
        width: size,
        height: size,
        animation: `${scaleInAnimation} 0.5s ease-out`,
      }}
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill={alpha(color, 0.1)}
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M9 12l2 2 4-4"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="6"
        sx={{
          animation: `${checkmarkAnimation} 0.6s ease-out 0.3s both`,
        }}
      />
    </SvgIcon>
  );
};

// Confetti particles
const ConfettiParticle: React.FC<{ 
  delay?: number; 
  color?: string; 
  x?: number;
  y?: number;
}> = ({ delay = 0, color = '#4CAF50', x = 0, y = 0 }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: x,
        top: y,
        width: 8,
        height: 8,
        backgroundColor: color,
        borderRadius: '50%',
        animation: `${confettiAnimation} 2s ease-out ${delay}s both`,
        opacity: 0.8,
      }}
    />
  );
};

// Confetti animation component
const ConfettiAnimation: React.FC<{ trigger: boolean }> = ({ trigger }) => {
  const theme = useTheme();
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  if (!trigger) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: 30 }).map((_, i) => (
        <ConfettiParticle
          key={i}
          delay={i * 0.1}
          color={colors[i % colors.length]}
          x={Math.random() * 100}
          y={Math.random() * 50}
        />
      ))}
    </Box>
  );
};

// Pulse animation wrapper
const PulseAnimation: React.FC<{ 
  children: React.ReactNode;
  trigger: boolean;
  duration?: number;
}> = ({ children, trigger, duration = 1 }) => {
  return (
    <Box
      sx={{
        animation: trigger ? `${successPulseAnimation} ${duration}s ease-out` : 'none',
      }}
    >
      {children}
    </Box>
  );
};

// Scale animation wrapper
const ScaleAnimation: React.FC<{ 
  children: React.ReactNode;
  trigger: boolean;
  scale?: number;
}> = ({ children, trigger, scale = 1.1 }) => {
  return (
    <Box
      sx={{
        animation: trigger ? `${elasticAnimation} 0.6s ease-out` : 'none',
        '--elastic-scale': scale,
      }}
    >
      {children}
    </Box>
  );
};

// Main SuccessState component
export const SuccessState: React.FC<SuccessStateProps> = ({
  title,
  description,
  animation = 'checkmark',
  autoHide = false,
  duration = 3000,
  action,
  className,
  sx,
}) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(true);
  const [animationTriggered, setAnimationTriggered] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => {
      setAnimationTriggered(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (autoHide && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoHide, duration]);

  if (!visible) {
    return null;
  }

  const getAnimation = () => {
    switch (animation) {
      case 'confetti':
        return <ConfettiAnimation trigger={animationTriggered} />;
      case 'pulse':
        return (
          <PulseAnimation trigger={animationTriggered}>
            <CheckCircleIcon
              sx={{
                fontSize: 80,
                color: theme.palette.success.main,
                mb: 3,
              }}
            />
          </PulseAnimation>
        );
      case 'scale':
        return (
          <ScaleAnimation trigger={animationTriggered}>
            <CheckCircleIcon
              sx={{
                fontSize: 80,
                color: theme.palette.success.main,
                mb: 3,
              }}
            />
          </ScaleAnimation>
        );
      case 'checkmark':
      default:
        return (
          <Box sx={{ mb: 3 }}>
            <AnimatedCheckmark size={80} color={theme.palette.success.main} />
          </Box>
        );
    }
  };

  return (
    <Box
      className={className}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 6,
        px: 4,
        minHeight: 300,
        animation: `${fadeInAnimation} 0.6s ease-out`,
        ...sx,
      }}
    >
      {/* Background confetti for confetti animation */}
      {animation === 'confetti' && (
        <ConfettiAnimation trigger={animationTriggered} />
      )}

      {/* Success icon/animation */}
      {getAnimation()}

      {/* Title */}
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: 2,
          animation: animationTriggered ? `${fadeInAnimation} 0.6s ease-out 0.3s both` : 'none',
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          maxWidth: 400,
          lineHeight: 1.6,
          mb: action ? 4 : 0,
          animation: animationTriggered ? `${fadeInAnimation} 0.6s ease-out 0.5s both` : 'none',
        }}
      >
        {description}
      </Typography>

      {/* Action button */}
      {action && (
        <Box
          sx={{
            animation: animationTriggered ? `${fadeInAnimation} 0.6s ease-out 0.7s both` : 'none',
          }}
        >
          <Button
            variant={action.variant || 'contained'}
            onClick={action.onClick}
            sx={{
              minWidth: 140,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              backgroundColor: theme.palette.success.main,
              '&:hover': {
                backgroundColor: theme.palette.success.dark,
              },
            }}
          >
            {action.label}
          </Button>
        </Box>
      )}

      {/* Auto-hide close button */}
      {autoHide && (
        <Button
          onClick={() => setVisible(false)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            minWidth: 'auto',
            p: 1,
            color: theme.palette.text.secondary,
          }}
        >
          <CloseIcon />
        </Button>
      )}
    </Box>
  );
};

// Success toast/snackbar component
export const SuccessToast: React.FC<SuccessStateProps & {
  open: boolean;
  onClose?: () => void;
  position?: 'top' | 'bottom';
}> = ({
  title,
  description,
  animation = 'checkmark',
  action,
  open,
  onClose,
  position = 'top',
  autoHide = true,
  duration = 4000,
}) => {
  const theme = useTheme();
  const [animationTriggered, setAnimationTriggered] = useState(false);

  useEffect(() => {
    if (open) {
      setAnimationTriggered(true);
      
      if (autoHide && duration > 0) {
        const timer = setTimeout(() => {
          onClose?.();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }
  }, [open, autoHide, duration, onClose]);

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        [position]: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: theme.zIndex.snackbar,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: theme.shadows[8],
        p: 3,
        minWidth: 300,
        maxWidth: 500,
        border: `1px solid ${theme.palette.success.main}`,
        animation: `${fadeInAnimation} 0.4s ease-out`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        {/* Success icon */}
        <Box sx={{ flexShrink: 0, mt: 0.5 }}>
          {animation === 'checkmark' ? (
            <AnimatedCheckmark size={24} color={theme.palette.success.main} />
          ) : (
            <CheckCircleIcon
              sx={{
                fontSize: 24,
                color: theme.palette.success.main,
                animation: animationTriggered ? `${scaleInAnimation} 0.3s ease-out` : 'none',
              }}
            />
          )}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: description ? 0.5 : 0,
            }}
          >
            {title}
          </Typography>
          {description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.4 }}
            >
              {description}
            </Typography>
          )}
          {action && (
            <Button
              variant="text"
              size="small"
              onClick={action.onClick}
              sx={{
                mt: 1,
                p: 0,
                minWidth: 'auto',
                textTransform: 'none',
                fontWeight: 600,
                color: theme.palette.success.main,
              }}
            >
              {action.label}
            </Button>
          )}
        </Box>

        {/* Close button */}
        {onClose && (
          <Button
            onClick={onClose}
            sx={{
              minWidth: 'auto',
              p: 0.5,
              color: theme.palette.text.secondary,
            }}
          >
            <CloseIcon fontSize="small" />
          </Button>
        )}
      </Box>
    </Box>
  );
};

// Predefined success states for common scenarios
export const SaveSuccessState: React.FC<{ onContinue?: () => void }> = ({ onContinue }) => (
  <SuccessState
    title="Changes Saved!"
    description="Your changes have been successfully saved and synced across all devices."
    animation="checkmark"
    action={onContinue ? {
      label: "Continue",
      onClick: onContinue,
    } : undefined}
  />
);

export const InviteSentSuccess: React.FC<{ email?: string; onSendAnother?: () => void }> = ({ 
  email,
  onSendAnother 
}) => (
  <SuccessState
    title="Invitation Sent!"
    description={email 
      ? `We've sent an invitation to ${email}. They'll receive an email with instructions to join your workspace.`
      : "The invitation has been sent successfully. They'll receive an email with instructions to join your workspace."
    }
    animation="confetti"
    action={onSendAnother ? {
      label: "Send Another",
      onClick: onSendAnother,
    } : undefined}
  />
);

export const ExportCompleteSuccess: React.FC<{ onDownload?: () => void; onShare?: () => void }> = ({ 
  onDownload,
  onShare 
}) => (
  <SuccessState
    title="Export Complete!"
    description="Your business canvas has been successfully exported. You can now download or share it."
    animation="pulse"
    action={onDownload ? {
      label: "Download",
      onClick: onDownload,
    } : undefined}
  />
);

export const AccountCreatedSuccess: React.FC<{ onGetStarted?: () => void }> = ({ onGetStarted }) => (
  <SuccessState
    title="Welcome to Flourishing Business Canvas!"
    description="Your account has been created successfully. You're ready to start building amazing business models."
    animation="confetti"
    action={{
      label: "Get Started",
      onClick: onGetStarted || (() => window.location.href = '/dashboard'),
    }}
  />
);

export const PaymentSuccessState: React.FC<{ onContinue?: () => void }> = ({ onContinue }) => (
  <SuccessState
    title="Payment Successful!"
    description="Thank you for your purchase. Your account has been upgraded and all features are now available."
    animation="confetti"
    action={{
      label: "Continue to Dashboard",
      onClick: onContinue || (() => window.location.href = '/dashboard'),
    }}
  />
);

// Success modal wrapper
export const SuccessModal: React.FC<SuccessStateProps & {
  open: boolean;
  onClose?: () => void;
}> = ({ open, onClose, ...props }) => {
  const theme = useTheme();

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: theme.zIndex.modal,
        backgroundColor: alpha(theme.palette.common.black, 0.5),
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 3,
          boxShadow: theme.shadows[24],
          maxWidth: 500,
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        <SuccessState {...props} />
      </Box>
    </Box>
  );
};

export default SuccessState;
