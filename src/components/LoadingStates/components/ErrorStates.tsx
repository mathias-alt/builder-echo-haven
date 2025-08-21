import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Chip,
  useTheme,
  alpha,
  SvgIcon,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  WifiOff as NetworkErrorIcon,
  Lock as PermissionErrorIcon,
  SearchOff as NotFoundErrorIcon,
  BugReport as BugReportIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  ContactSupport as SupportIcon,
  ExpandMore as ExpandMoreIcon,
  FileCopy as CopyIcon,
} from '@mui/icons-material';
import { ErrorStateProps } from '../types';
import { fadeInAnimation, shakeAnimation, pulseAnimation } from '../animations';

// Error type configurations
const getErrorConfig = (errorType: string, theme: any) => {
  const configs = {
    network: {
      icon: NetworkErrorIcon,
      color: theme.palette.warning.main,
      title: 'Connection Problem',
      description: 'Unable to connect to our servers. Please check your internet connection.',
      severity: 'warning' as const,
    },
    server: {
      icon: ErrorIcon,
      color: theme.palette.error.main,
      title: 'Server Error',
      description: 'Something went wrong on our end. Our team has been notified.',
      severity: 'error' as const,
    },
    client: {
      icon: BugReportIcon,
      color: theme.palette.error.main,
      title: 'Application Error',
      description: 'Something unexpected happened. Please try refreshing the page.',
      severity: 'error' as const,
    },
    permission: {
      icon: PermissionErrorIcon,
      color: theme.palette.warning.main,
      title: 'Access Denied',
      description: "You don't have permission to access this resource.",
      severity: 'warning' as const,
    },
    notFound: {
      icon: NotFoundErrorIcon,
      color: theme.palette.info.main,
      title: 'Not Found',
      description: 'The page or resource you\'re looking for doesn\'t exist.',
      severity: 'info' as const,
    },
    generic: {
      icon: ErrorIcon,
      color: theme.palette.error.main,
      title: 'Something Went Wrong',
      description: 'An unexpected error occurred. Please try again.',
      severity: 'error' as const,
    },
  };

  return configs[errorType as keyof typeof configs] || configs.generic;
};

// Animated error illustration
const ErrorIllustration: React.FC<{ 
  errorType: string; 
  size?: number; 
  animated?: boolean;
}> = ({ errorType, size = 120, animated = true }) => {
  const theme = useTheme();
  const config = getErrorConfig(errorType, theme);
  const IconComponent = config.icon;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: alpha(config.color, 0.1),
        border: `2px solid ${alpha(config.color, 0.2)}`,
        animation: animated ? `${pulseAnimation} 2s ease-in-out infinite` : 'none',
        mb: 3,
      }}
    >
      <IconComponent
        sx={{
          fontSize: size * 0.5,
          color: config.color,
          animation: animated ? `${shakeAnimation} 0.5s ease-in-out` : 'none',
        }}
      />
    </Box>
  );
};

// Error details component
const ErrorDetails: React.FC<{
  errorCode?: string | number;
  errorMessage?: string;
  stack?: string;
  timestamp?: Date;
}> = ({ errorCode, errorMessage, stack, timestamp }) => {
  const [copied, setCopied] = useState(false);

  const errorDetails = {
    code: errorCode,
    message: errorMessage,
    timestamp: timestamp?.toISOString() || new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    stack: stack,
  };

  const handleCopyDetails = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Handle copy failure silently
    }
  };

  return (
    <Accordion sx={{ mt: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="body2" color="text.secondary">
          Error Details
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<CopyIcon />}
            onClick={handleCopyDetails}
            disabled={copied}
            sx={{ mb: 2 }}
          >
            {copied ? 'Copied!' : 'Copy Details'}
          </Button>
        </Box>
        <Box
          component="pre"
          sx={{
            backgroundColor: alpha('#000', 0.05),
            p: 2,
            borderRadius: 1,
            fontSize: '0.75rem',
            overflow: 'auto',
            maxHeight: 200,
            fontFamily: 'monospace',
          }}
        >
          {JSON.stringify(errorDetails, null, 2)}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

// Main ErrorState component
export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  errorCode,
  errorType = 'generic',
  retryAction,
  primaryAction,
  supportAction,
  showErrorDetails = false,
  className,
  sx,
}) => {
  const theme = useTheme();
  const config = getErrorConfig(errorType, theme);

  const handleRetry = () => {
    if (retryAction) {
      retryAction.onClick();
    }
  };

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 4,
        minHeight: 400,
        animation: `${fadeInAnimation} 0.6s ease-out`,
        ...sx,
      }}
    >
      {/* Error illustration */}
      <ErrorIllustration errorType={errorType} />

      {/* Error code chip */}
      {errorCode && (
        <Chip
          label={`Error ${errorCode}`}
          size="small"
          color={config.severity}
          sx={{ mb: 2 }}
        />
      )}

      {/* Title */}
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: 2,
        }}
      >
        {title || config.title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          maxWidth: 400,
          lineHeight: 1.6,
          mb: 4,
        }}
      >
        {description || config.description}
      </Typography>

      {/* Actions */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          mb: showErrorDetails ? 2 : 0,
        }}
      >
        {retryAction && (
          <Button
            variant="contained"
            onClick={handleRetry}
            startIcon={<RefreshIcon />}
            sx={{
              minWidth: 140,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            {retryAction.label}
          </Button>
        )}

        {primaryAction && (
          <Button
            variant={primaryAction.variant || 'outlined'}
            onClick={primaryAction.onClick}
            startIcon={<HomeIcon />}
            sx={{
              minWidth: 140,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            {primaryAction.label}
          </Button>
        )}

        {supportAction && (
          <Button
            variant="text"
            onClick={supportAction.onClick}
            startIcon={<SupportIcon />}
            sx={{
              minWidth: 140,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              color: theme.palette.text.secondary,
            }}
          >
            {supportAction.label}
          </Button>
        )}
      </Box>

      {/* Error details */}
      {showErrorDetails && (
        <Box sx={{ width: '100%', maxWidth: 600 }}>
          <ErrorDetails
            errorCode={errorCode}
            errorMessage={description}
          />
        </Box>
      )}
    </Box>
  );
};

// Predefined error states for common scenarios
export const NetworkError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorState
    errorType="network"
    retryAction={{
      label: "Try Again",
      onClick: onRetry || (() => window.location.reload()),
    }}
    primaryAction={{
      label: "Go Offline",
      onClick: () => console.log('Switch to offline mode'),
      variant: "outlined",
    }}
  />
);

export const ServerError: React.FC<{ 
  errorCode?: string | number; 
  onRetry?: () => void;
  onContactSupport?: () => void;
}> = ({ errorCode = 500, onRetry, onContactSupport }) => (
  <ErrorState
    errorType="server"
    errorCode={errorCode}
    retryAction={{
      label: "Retry",
      onClick: onRetry || (() => window.location.reload()),
    }}
    primaryAction={{
      label: "Go Home",
      onClick: () => window.location.href = '/',
      variant: "outlined",
    }}
    supportAction={{
      label: "Contact Support",
      onClick: onContactSupport || (() => console.log('Contact support')),
    }}
    showErrorDetails={true}
  />
);

export const NotFoundError: React.FC<{ onGoHome?: () => void }> = ({ onGoHome }) => (
  <ErrorState
    errorType="notFound"
    errorCode={404}
    title="Page Not Found"
    description="The page you're looking for doesn't exist or has been moved."
    primaryAction={{
      label: "Go Home",
      onClick: onGoHome || (() => window.location.href = '/'),
      variant: "contained",
    }}
    secondaryAction={{
      label: "Go Back",
      onClick: () => window.history.back(),
      variant: "outlined",
    }}
  />
);

export const PermissionError: React.FC<{ 
  resource?: string;
  onRequestAccess?: () => void;
}> = ({ resource, onRequestAccess }) => (
  <ErrorState
    errorType="permission"
    errorCode={403}
    title="Access Denied"
    description={resource 
      ? `You don't have permission to access ${resource}.`
      : "You don't have permission to access this resource."
    }
    primaryAction={{
      label: "Request Access",
      onClick: onRequestAccess || (() => console.log('Request access')),
      variant: "contained",
    }}
    secondaryAction={{
      label: "Go Back",
      onClick: () => window.history.back(),
      variant: "outlined",
    }}
  />
);

export const ClientError: React.FC<{ 
  onReload?: () => void;
  onReportBug?: () => void;
}> = ({ onReload, onReportBug }) => (
  <ErrorState
    errorType="client"
    title="Oops! Something broke"
    description="The application encountered an unexpected error. This might be a temporary issue."
    retryAction={{
      label: "Reload Page",
      onClick: onReload || (() => window.location.reload()),
    }}
    primaryAction={{
      label: "Go Home",
      onClick: () => window.location.href = '/',
      variant: "outlined",
    }}
    supportAction={{
      label: "Report Bug",
      onClick: onReportBug || (() => console.log('Report bug')),
    }}
    showErrorDetails={true}
  />
);

// Error boundary component
export const ErrorBoundary: React.FC<{
  children: React.ReactNode;
  fallback?: React.ComponentType<any>;
}> = ({ children, fallback: Fallback = ClientError }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(new Error(event.message));
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setHasError(true);
      setError(new Error(event.reason));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    return (
      <Fallback
        onReload={() => {
          setHasError(false);
          setError(null);
          window.location.reload();
        }}
        error={error}
      />
    );
  }

  return <>{children}</>;
};

export default ErrorState;
