import React, { useEffect, useRef } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  alpha,
  keyframes,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ArrowDownward as ArrowDownIcon,
} from '@mui/icons-material';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import { PullToRefreshConfig } from '../types';

interface PullToRefreshProps extends Partial<PullToRefreshConfig> {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  sx?: object;
  indicatorComponent?: React.ReactNode;
  messages?: {
    pullToRefresh?: string;
    releaseToRefresh?: string;
    refreshing?: string;
  };
}

const pullAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(180deg); }
`;

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  threshold = 80,
  loadingHeight = 60,
  onRefresh,
  enabled = true,
  disabled = false,
  className,
  sx,
  indicatorComponent,
  messages = {
    pullToRefresh: 'Pull to refresh',
    releaseToRefresh: 'Release to refresh',
    refreshing: 'Refreshing...',
  },
}) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    isPulling,
    pullDistance,
    isRefreshing,
    attachPullToRefresh,
  } = usePullToRefresh({
    threshold,
    loadingHeight,
    onRefresh,
    enabled,
    disabled,
  });

  useEffect(() => {
    if (!containerRef.current) return;
    return attachPullToRefresh(containerRef.current);
  }, [attachPullToRefresh]);

  const getIndicatorContent = () => {
    if (indicatorComponent) {
      return indicatorComponent;
    }

    if (isRefreshing) {
      return (
        <>
          <CircularProgress
            size={24}
            sx={{
              color: theme.palette.primary.main,
              animation: `${spinAnimation} 1s linear infinite`,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            {messages.refreshing}
          </Typography>
        </>
      );
    }

    const shouldShowRelease = pullDistance >= threshold;
    const iconRotation = Math.min((pullDistance / threshold) * 180, 180);

    return (
      <>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            border: `2px solid ${alpha(theme.palette.primary.main, shouldShowRelease ? 1 : 0.3)}`,
            transition: 'border-color 0.2s ease',
          }}
        >
          {shouldShowRelease ? (
            <RefreshIcon
              sx={{
                color: theme.palette.primary.main,
                fontSize: 20,
                animation: `${pullAnimation} 0.3s ease`,
              }}
            />
          ) : (
            <ArrowDownIcon
              sx={{
                color: theme.palette.primary.main,
                fontSize: 20,
                transform: `rotate(${iconRotation}deg)`,
                transition: 'transform 0.2s ease',
              }}
            />
          )}
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
            transition: 'color 0.2s ease',
          }}
        >
          {shouldShowRelease ? messages.releaseToRefresh : messages.pullToRefresh}
        </Typography>
      </>
    );
  };

  const indicatorOpacity = Math.min(pullDistance / 40, 1);
  const indicatorScale = Math.min(0.8 + (pullDistance / threshold) * 0.2, 1);

  return (
    <Box
      ref={containerRef}
      className={className}
      sx={{
        position: 'relative',
        height: '100%',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        ...sx,
      }}
    >
      {/* Pull to refresh indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: -loadingHeight,
          left: 0,
          right: 0,
          height: loadingHeight,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          backgroundColor: theme.palette.background.default,
          borderBottom: `1px solid ${theme.palette.divider}`,
          zIndex: 1,
          opacity: indicatorOpacity,
          transform: `translateY(${pullDistance}px) scale(${indicatorScale})`,
          transition: isRefreshing || isPulling
            ? 'none'
            : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease',
        }}
      >
        {getIndicatorContent()}
      </Box>

      {/* Content container */}
      <Box
        sx={{
          transform: `translateY(${pullDistance}px)`,
          transition: isRefreshing || isPulling
            ? 'none'
            : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

// Lightweight wrapper for existing scrollable content
export const PullToRefreshWrapper: React.FC<{
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
}> = ({ children, onRefresh, disabled = false }) => {
  return (
    <PullToRefresh
      onRefresh={onRefresh}
      disabled={disabled}
      sx={{
        '& > div:last-child': {
          minHeight: '100%',
        },
      }}
    >
      {children}
    </PullToRefresh>
  );
};

// Hook for manual trigger (useful for buttons)
export const usePullToRefreshTrigger = (onRefresh: () => Promise<void>) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const triggerRefresh = React.useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      // Handle manual refresh error
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, onRefresh]);

  return { triggerRefresh, isRefreshing };
};

export default PullToRefresh;
