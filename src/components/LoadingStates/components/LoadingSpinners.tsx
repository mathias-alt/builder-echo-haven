import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import { LoadingSpinnerProps } from '../types';
import {
  spinAnimation,
  pulseAnimation,
  dotsAnimation,
  barsAnimation,
  brandLoaderAnimation,
  animationConfig,
} from '../animations';

// Brand colors and theme integration
const getBrandColors = (theme: any) => ({
  primary: theme.palette.primary.main,
  secondary: theme.palette.secondary.main,
  gradient: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  accent: theme.palette.info.main,
});

// Circular loading spinner with brand styling
export const CircularSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  message,
  className,
  sx,
}) => {
  const theme = useTheme();
  const brandColors = getBrandColors(theme);
  
  const getSizeValue = () => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'small': return 24;
      case 'large': return 64;
      default: return 40;
    }
  };

  const sizeValue = getSizeValue();

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        ...sx,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress
          size={sizeValue}
          thickness={4}
          sx={{
            color: typeof color === 'string' && color.startsWith('#') ? color : brandColors[color as keyof typeof brandColors] || brandColors.primary,
            animation: `${spinAnimation} 1.4s linear infinite`,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        {/* Brand logo overlay for large spinners */}
        {size === 'large' && (
          <Box
            sx={{
              position: 'absolute',
              width: sizeValue * 0.4,
              height: sizeValue * 0.4,
              borderRadius: '50%',
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: `${pulseAnimation} 2s ease-in-out infinite`,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                fontSize: sizeValue * 0.15,
              }}
            >
              FBC
            </Typography>
          </Box>
        )}
      </Box>
      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            textAlign: 'center',
            maxWidth: 200,
            animation: `${pulseAnimation} 2s ease-in-out infinite`,
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

// Dots loading spinner
export const DotsSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  message,
  className,
  sx,
}) => {
  const theme = useTheme();
  const brandColors = getBrandColors(theme);
  
  const getDotSize = () => {
    if (typeof size === 'number') return size / 4;
    switch (size) {
      case 'small': return 6;
      case 'large': return 12;
      default: return 8;
    }
  };

  const dotSize = getDotSize();
  const spinnerColor = typeof color === 'string' && color.startsWith('#') 
    ? color 
    : brandColors[color as keyof typeof brandColors] || brandColors.primary;

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              backgroundColor: spinnerColor,
              animation: `${dotsAnimation} 1.4s ease-in-out infinite`,
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </Box>
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

// Bars loading spinner
export const BarsSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  message,
  className,
  sx,
}) => {
  const theme = useTheme();
  const brandColors = getBrandColors(theme);
  
  const getBarDimensions = () => {
    if (typeof size === 'number') return { width: size / 8, height: size };
    switch (size) {
      case 'small': return { width: 3, height: 24 };
      case 'large': return { width: 8, height: 64 };
      default: return { width: 4, height: 40 };
    }
  };

  const { width, height } = getBarDimensions();
  const spinnerColor = typeof color === 'string' && color.startsWith('#') 
    ? color 
    : brandColors[color as keyof typeof brandColors] || brandColors.primary;

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 0.5,
          alignItems: 'flex-end',
          height: height,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Box
            key={i}
            sx={{
              width: width,
              height: height,
              backgroundColor: spinnerColor,
              borderRadius: 0.5,
              transformOrigin: 'bottom',
              animation: `${barsAnimation} 1.2s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </Box>
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

// Brand-specific loading spinner
export const BrandSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  message,
  className,
  sx,
}) => {
  const theme = useTheme();
  const brandColors = getBrandColors(theme);
  
  const getSizeValue = () => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'small': return 32;
      case 'large': return 80;
      default: return 48;
    }
  };

  const sizeValue = getSizeValue();

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        ...sx,
      }}
    >
      <Box
        sx={{
          width: sizeValue,
          height: sizeValue,
          borderRadius: 2,
          background: brandColors.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: `${brandLoaderAnimation} 2s ease-in-out infinite`,
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontWeight: 700,
            fontSize: sizeValue * 0.25,
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          FBC
        </Typography>
      </Box>
      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            textAlign: 'center',
            maxWidth: 200,
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

// Main LoadingSpinner component with variant selection
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  variant = 'circular',
  ...props
}) => {
  switch (variant) {
    case 'dots':
      return <DotsSpinner {...props} />;
    case 'bars':
      return <BarsSpinner {...props} />;
    case 'brand':
      return <BrandSpinner {...props} />;
    case 'circular':
    default:
      return <CircularSpinner {...props} />;
  }
};

// Full-screen loading overlay
export const LoadingOverlay: React.FC<LoadingSpinnerProps & {
  backdrop?: boolean;
  fullScreen?: boolean;
}> = ({
  backdrop = true,
  fullScreen = false,
  variant = 'brand',
  message = 'Loading...',
  ...props
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: fullScreen ? 'fixed' : 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: theme.zIndex.modal,
        backgroundColor: backdrop ? alpha(theme.palette.background.default, 0.8) : 'transparent',
        backdropFilter: backdrop ? 'blur(4px)' : 'none',
      }}
    >
      <Box
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: backdrop ? theme.palette.background.paper : 'transparent',
          boxShadow: backdrop ? theme.shadows[8] : 'none',
        }}
      >
        <LoadingSpinner variant={variant} message={message} size="large" {...props} />
      </Box>
    </Box>
  );
};

// Inline loading spinner for buttons and small spaces
export const InlineSpinner: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 16, color }) => {
  const theme = useTheme();
  
  return (
    <CircularProgress
      size={size}
      thickness={4}
      sx={{
        color: color || theme.palette.primary.main,
        animation: `${spinAnimation} 1s linear infinite`,
      }}
    />
  );
};

export default LoadingSpinner;
