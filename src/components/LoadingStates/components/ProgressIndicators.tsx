import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  StepIcon,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as PendingIcon,
  Error as ErrorIcon,
  PlayArrow as ActiveIcon,
} from '@mui/icons-material';
import { ProgressIndicatorProps, ProgressStep } from '../types';
import { progressFillAnimation, pulseAnimation, fadeInAnimation } from '../animations';

// Custom step icon component
const CustomStepIcon: React.FC<{
  active: boolean;
  completed: boolean;
  error: boolean;
  icon?: React.ComponentType;
}> = ({ active, completed, error, icon: IconComponent }) => {
  const theme = useTheme();

  const getIcon = () => {
    if (error) return ErrorIcon;
    if (completed) return CheckCircleIcon;
    if (active) return ActiveIcon;
    return IconComponent || PendingIcon;
  };

  const getColor = () => {
    if (error) return theme.palette.error.main;
    if (completed) return theme.palette.success.main;
    if (active) return theme.palette.primary.main;
    return theme.palette.grey[400];
  };

  const Icon = getIcon();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: alpha(getColor(), 0.1),
        border: `2px solid ${getColor()}`,
        animation: active ? `${pulseAnimation} 2s ease-in-out infinite` : 'none',
      }}
    >
      <Icon
        sx={{
          fontSize: 18,
          color: getColor(),
        }}
      />
    </Box>
  );
};

// Linear progress with label
export const LinearProgressWithLabel: React.FC<ProgressIndicatorProps> = ({
  value = 0,
  variant = 'determinate',
  label,
  description,
  showPercentage = true,
  size = 'medium',
  color = 'primary',
  className,
  sx,
}) => {
  const theme = useTheme();

  const getHeight = () => {
    switch (size) {
      case 'small': return 4;
      case 'large': return 12;
      default: return 8;
    }
  };

  return (
    <Box className={className} sx={{ width: '100%', ...sx }}>
      {(label || showPercentage) && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          {label && (
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
              {label}
            </Typography>
          )}
          {showPercentage && variant === 'determinate' && (
            <Typography variant="body2" color="text.secondary">
              {Math.round(value)}%
            </Typography>
          )}
        </Box>
      )}
      
      <LinearProgress
        variant={variant}
        value={value}
        color={color}
        sx={{
          height: getHeight(),
          borderRadius: getHeight() / 2,
          backgroundColor: alpha(theme.palette.grey[300], 0.3),
          '& .MuiLinearProgress-bar': {
            borderRadius: getHeight() / 2,
            animation: variant === 'determinate' 
              ? `${progressFillAnimation} 0.8s ease-out`
              : 'none',
            '--progress-width': `${value}%`,
          },
        }}
      />
      
      {description && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {description}
        </Typography>
      )}
    </Box>
  );
};

// Circular progress with label
export const CircularProgressWithLabel: React.FC<ProgressIndicatorProps> = ({
  value = 0,
  variant = 'determinate',
  label,
  description,
  showPercentage = true,
  size = 'medium',
  color = 'primary',
  className,
  sx,
}) => {
  const theme = useTheme();

  const getSize = () => {
    switch (size) {
      case 'small': return 60;
      case 'large': return 120;
      default: return 80;
    }
  };

  const circleSize = getSize();

  return (
    <Box 
      className={className}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: 2,
        ...sx 
      }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant={variant}
          value={value}
          size={circleSize}
          thickness={4}
          color={color}
          sx={{
            animation: variant === 'indeterminate' ? 'none' : `${progressFillAnimation} 0.8s ease-out`,
          }}
        />
        {showPercentage && variant === 'determinate' && (
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
              sx={{ 
                fontSize: circleSize * 0.12,
                fontWeight: 600,
              }}
            >
              {`${Math.round(value)}%`}
            </Typography>
          </Box>
        )}
      </Box>
      
      {label && (
        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500, textAlign: 'center' }}>
          {label}
        </Typography>
      )}
      
      {description && (
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 200 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
};

// Step-by-step progress indicator
export const StepProgress: React.FC<ProgressIndicatorProps> = ({
  steps = [],
  currentStep = 0,
  variant = 'vertical',
  className,
  sx,
}) => {
  const theme = useTheme();

  if (variant === 'horizontal') {
    return (
      <Box className={className} sx={{ width: '100%', ...sx }}>
        <Stepper activeStep={currentStep} orientation="horizontal">
          {steps.map((step, index) => (
            <Step key={step.id}>
              <StepLabel
                StepIconComponent={(props) => (
                  <CustomStepIcon
                    active={props.active}
                    completed={props.completed}
                    error={step.status === 'error'}
                    icon={step.icon}
                  />
                )}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {step.label}
                </Typography>
                {step.description && (
                  <Typography variant="caption" color="text.secondary">
                    {step.description}
                  </Typography>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    );
  }

  return (
    <Box className={className} sx={{ ...sx }}>
      <Stepper activeStep={currentStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.id}>
            <StepLabel
              StepIconComponent={(props) => (
                <CustomStepIcon
                  active={props.active}
                  completed={props.completed}
                  error={step.status === 'error'}
                  icon={step.icon}
                />
              )}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {step.label}
              </Typography>
            </StepLabel>
            <StepContent>
              {step.description && (
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              )}
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

// Process progress card
export const ProcessProgressCard: React.FC<{
  title: string;
  description?: string;
  steps: ProgressStep[];
  currentStep: number;
  estimatedTime?: string;
  onCancel?: () => void;
}> = ({
  title,
  description,
  steps,
  currentStep,
  estimatedTime,
  onCancel,
}) => {
  const theme = useTheme();
  const progress = ((currentStep + 1) / steps.length) * 100;
  const activeStep = steps[currentStep];

  return (
    <Card
      sx={{
        minWidth: 350,
        animation: `${fadeInAnimation} 0.6s ease-out`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>

        {/* Progress bar */}
        <LinearProgressWithLabel
          value={progress}
          label={`Step ${currentStep + 1} of ${steps.length}`}
          showPercentage={false}
          sx={{ mb: 3 }}
        />

        {/* Current step info */}
        {activeStep && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              mb: 3,
            }}
          >
            <Box
              sx={{
                animation: `${pulseAnimation} 2s ease-in-out infinite`,
              }}
            >
              <CustomStepIcon
                active={true}
                completed={false}
                error={activeStep.status === 'error'}
                icon={activeStep.icon}
              />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {activeStep.label}
              </Typography>
              {activeStep.description && (
                <Typography variant="caption" color="text.secondary">
                  {activeStep.description}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* All steps overview */}
        <StepProgress
          steps={steps}
          currentStep={currentStep}
          variant="vertical"
          sx={{ mb: estimatedTime || onCancel ? 2 : 0 }}
        />

        {/* Footer */}
        {(estimatedTime || onCancel) && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            {estimatedTime && (
              <Typography variant="caption" color="text.secondary">
                Estimated time: {estimatedTime}
              </Typography>
            )}
            {onCancel && (
              <Typography
                variant="caption"
                color="primary"
                sx={{ cursor: 'pointer', fontWeight: 500 }}
                onClick={onCancel}
              >
                Cancel
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Upload/download progress
export const FileProgressIndicator: React.FC<{
  fileName: string;
  progress: number;
  size?: string;
  speed?: string;
  status: 'uploading' | 'downloading' | 'completed' | 'error';
  onCancel?: () => void;
  onRetry?: () => void;
}> = ({
  fileName,
  progress,
  size,
  speed,
  status,
  onCancel,
  onRetry,
}) => {
  const theme = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case 'completed': return theme.palette.success.main;
      case 'error': return theme.palette.error.main;
      default: return theme.palette.primary.main;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading': return 'Uploading...';
      case 'downloading': return 'Downloading...';
      case 'completed': return 'Completed';
      case 'error': return 'Failed';
      default: return '';
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        border: `1px solid ${alpha(getStatusColor(), 0.2)}`,
        borderRadius: 2,
        backgroundColor: alpha(getStatusColor(), 0.02),
      }}
    >
      {/* File info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, flex: 1, mr: 2 }}>
          {fileName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {size}
        </Typography>
      </Box>

      {/* Progress */}
      <LinearProgressWithLabel
        value={progress}
        showPercentage={true}
        color={status === 'error' ? 'error' : status === 'completed' ? 'success' : 'primary'}
        sx={{ mb: 1 }}
      />

      {/* Status and actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="caption" color={getStatusColor()}>
            {getStatusText()}
          </Typography>
          {speed && status !== 'completed' && status !== 'error' && (
            <Typography variant="caption" color="text.secondary">
              {speed}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {status === 'error' && onRetry && (
            <Typography
              variant="caption"
              color="primary"
              sx={{ cursor: 'pointer', fontWeight: 500 }}
              onClick={onRetry}
            >
              Retry
            </Typography>
          )}
          {(status === 'uploading' || status === 'downloading') && onCancel && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ cursor: 'pointer', fontWeight: 500 }}
              onClick={onCancel}
            >
              Cancel
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

// Animated number counter
export const AnimatedCounter: React.FC<{
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}> = ({ value, duration = 1000, suffix = '', prefix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setDisplayValue(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return (
    <Typography
      variant="h4"
      sx={{
        fontWeight: 600,
        color: 'primary.main',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </Typography>
  );
};

export default {
  LinearProgressWithLabel,
  CircularProgressWithLabel,
  StepProgress,
  ProcessProgressCard,
  FileProgressIndicator,
  AnimatedCounter,
};
