import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  alpha,
  Chip
} from '@mui/material';
import {
  ArrowBack,
  MoreVert,
  CloudDone,
  CloudUpload,
  Share,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface MobileToolbarProps {
  canvasName: string;
  autoSaveStatus: 'saved' | 'saving' | 'error';
  onMenuClick: () => void;
  onShareClick: () => void;
  isFullscreen: boolean;
}

export const MobileToolbar: React.FC<MobileToolbarProps> = ({
  canvasName,
  autoSaveStatus,
  onMenuClick,
  onShareClick,
  isFullscreen
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const getStatusIcon = () => {
    switch (autoSaveStatus) {
      case 'saved':
        return <CloudDone sx={{ fontSize: 16, color: 'success.main' }} />;
      case 'saving':
        return <CloudUpload sx={{ fontSize: 16, color: 'warning.main' }} />;
      case 'error':
        return <CloudUpload sx={{ fontSize: 16, color: 'error.main' }} />;
    }
  };

  const getStatusText = () => {
    switch (autoSaveStatus) {
      case 'saved':
        return 'Saved';
      case 'saving':
        return 'Saving...';
      case 'error':
        return 'Save failed';
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (isFullscreen) {
    return null; // Hide toolbar in fullscreen mode
  }

  return (
    <AppBar 
      position="sticky" 
      elevation={1}
      sx={{ 
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider'
      }}
    >
      <Toolbar 
        variant="dense"
        sx={{ 
          minHeight: 56,
          px: 1,
          gap: 1
        }}
      >
        <IconButton 
          edge="start" 
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          <ArrowBack />
        </IconButton>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography 
            variant="h6" 
            noWrap
            sx={{ 
              fontSize: '1rem',
              fontWeight: 600,
              mb: 0.25
            }}
          >
            {canvasName}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {getStatusIcon()}
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontSize: '0.7rem' }}
            >
              {getStatusText()}
            </Typography>
          </Box>
        </Box>

        <IconButton 
          onClick={onShareClick}
          sx={{ 
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.2)
            }
          }}
        >
          <Share />
        </IconButton>

        <IconButton 
          edge="end" 
          onClick={onMenuClick}
        >
          <MoreVert />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
