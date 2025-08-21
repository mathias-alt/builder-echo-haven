import React, { useState } from 'react';
import {
  Box,
  Snackbar,
  Alert,
  AlertTitle,
  Button,
  IconButton,
  Typography,
  Chip,
  useTheme,
  alpha,
  Fade,
  Collapse,
} from '@mui/material';
import {
  WifiOff as WifiOffIcon,
  Wifi as WifiIcon,
  Sync as SyncIcon,
  SyncDisabled as SyncDisabledIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CloudOff as CloudOffIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useOfflineHandler } from '../hooks/useOfflineHandler';
import { OfflineState } from '../types';

interface OfflineIndicatorProps {
  position?: 'top' | 'bottom';
  variant?: 'snackbar' | 'banner' | 'floating';
  onRetryAll?: () => Promise<void>;
  showDetails?: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  position = 'top',
  variant = 'banner',
  onRetryAll,
  showDetails = true,
}) => {
  const theme = useTheme();
  const {
    offlineState,
    retryPendingActions,
    clearPendingActions,
    getPendingActions,
  } = useOfflineHandler();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetryAll = async () => {
    if (!onRetryAll) return;

    setIsRetrying(true);
    try {
      await onRetryAll();
    } catch (error) {
      console.error('Failed to retry actions:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (variant === 'snackbar') {
    return (
      <Snackbar
        open={offlineState.isOffline}
        anchorOrigin={{ vertical: position, horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            borderRadius: 2,
            minWidth: 300,
          },
        }}
      >
        <Alert
          severity="warning"
          icon={<WifiOffIcon />}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleRetryAll}
              disabled={isRetrying}
              startIcon={isRetrying ? <SyncIcon /> : undefined}
            >
              {isRetrying ? 'Retrying...' : 'Retry'}
            </Button>
          }
        >
          <AlertTitle>You're offline</AlertTitle>
          {offlineState.pendingActions > 0 && (
            <Typography variant="body2">
              {offlineState.pendingActions} action(s) queued
            </Typography>
          )}
        </Alert>
      </Snackbar>
    );
  }

  if (variant === 'floating') {
    return (
      <Fade in={offlineState.isOffline || offlineState.pendingActions > 0}>
        <Box
          sx={{
            position: 'fixed',
            [position]: 16,
            right: 16,
            zIndex: theme.zIndex.snackbar,
            backgroundColor: offlineState.isOffline
              ? alpha(theme.palette.warning.main, 0.9)
              : alpha(theme.palette.info.main, 0.9),
            color: theme.palette.warning.contrastText,
            borderRadius: 3,
            p: 2,
            minWidth: 200,
            backdropFilter: 'blur(8px)',
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {offlineState.isOffline ? <WifiOffIcon /> : <SyncIcon />}
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {offlineState.isOffline ? 'Offline' : 'Syncing'}
            </Typography>
          </Box>
          {offlineState.pendingActions > 0 && (
            <Typography variant="caption">
              {offlineState.pendingActions} pending
            </Typography>
          )}
        </Box>
      </Fade>
    );
  }

  // Banner variant (default)
  if (!offlineState.isOffline && offlineState.pendingActions === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'sticky',
        [position]: 0,
        zIndex: theme.zIndex.appBar - 1,
        backgroundColor: offlineState.isOffline
          ? theme.palette.warning.main
          : theme.palette.info.main,
        color: offlineState.isOffline
          ? theme.palette.warning.contrastText
          : theme.palette.info.contrastText,
        borderBottom: position === 'top' ? `1px solid ${alpha(theme.palette.common.white, 0.1)}` : 'none',
        borderTop: position === 'bottom' ? `1px solid ${alpha(theme.palette.common.white, 0.1)}` : 'none',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          cursor: showDetails ? 'pointer' : 'default',
        }}
        onClick={showDetails ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {offlineState.isOffline ? (
              <CloudOffIcon fontSize="small" />
            ) : (
              <SyncIcon
                fontSize="small"
                sx={{
                  animation: 'spin 2s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
            )}
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {offlineState.isOffline ? 'You\'re offline' : 'Syncing changes'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {offlineState.pendingActions > 0 && (
              <Chip
                label={`${offlineState.pendingActions} pending`}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.common.white, 0.2),
                  color: 'inherit',
                  fontSize: '0.75rem',
                }}
              />
            )}
            
            {offlineState.lastSyncTime && (
              <Chip
                icon={<ScheduleIcon />}
                label={`Last sync: ${formatLastSync(offlineState.lastSyncTime)}`}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.common.white, 0.2),
                  color: 'inherit',
                  fontSize: '0.75rem',
                }}
              />
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {onRetryAll && (
            <Button
              variant="outlined"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleRetryAll();
              }}
              disabled={isRetrying}
              startIcon={isRetrying ? <SyncIcon /> : undefined}
              sx={{
                color: 'inherit',
                borderColor: alpha(theme.palette.common.white, 0.3),
                '&:hover': {
                  borderColor: alpha(theme.palette.common.white, 0.5),
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                },
              }}
            >
              {isRetrying ? 'Retrying...' : 'Retry All'}
            </Button>
          )}

          {showDetails && (
            <IconButton
              size="small"
              sx={{ color: 'inherit' }}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
        </Box>
      </Box>

      {showDetails && (
        <Collapse in={isExpanded}>
          <Box
            sx={{
              px: 2,
              pb: 2,
              borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            }}
          >
            <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
              {offlineState.isOffline
                ? 'Your changes are saved locally and will sync when you\'re back online.'
                : 'Your changes are being synced to the server.'}
            </Typography>

            {offlineState.pendingActions > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" sx={{ opacity: 0.8, mb: 1, display: 'block' }}>
                  Pending Actions:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {getPendingActions().slice(0, 5).map((action) => (
                    <Chip
                      key={action.id}
                      label={action.type}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: alpha(theme.palette.common.white, 0.3),
                        color: 'inherit',
                        fontSize: '0.7rem',
                      }}
                    />
                  ))}
                  {getPendingActions().length > 5 && (
                    <Chip
                      label={`+${getPendingActions().length - 5} more`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: alpha(theme.palette.common.white, 0.3),
                        color: 'inherit',
                        fontSize: '0.7rem',
                      }}
                    />
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

export default OfflineIndicator;
