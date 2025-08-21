import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  useTheme,
  alpha,
  Slide,
  Box,
  Fade,
  useMediaQuery,
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { MobileModalProps } from '../types';

const SlideTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FadeTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Fade ref={ref} {...props} />;
});

export const MobileModal: React.FC<MobileModalProps> = ({
  open,
  onClose,
  title,
  fullScreen = false,
  children,
  actions,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const shouldBeFullScreen = fullScreen || isMobile;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={shouldBeFullScreen ? SlideTransition : FadeTransition}
      fullScreen={shouldBeFullScreen}
      fullWidth={!shouldBeFullScreen}
      maxWidth={shouldBeFullScreen ? false : 'sm'}
      sx={{
        ...(shouldBeFullScreen
          ? {
              '& .MuiDialog-paper': {
                margin: 0,
                borderRadius: 0,
                maxHeight: '100vh',
                backgroundColor: theme.palette.background.default,
                backgroundImage: 'none',
              },
            }
          : {
              '& .MuiDialog-paper': {
                margin: theme.spacing(2),
                borderRadius: theme.spacing(2),
                maxHeight: `calc(100vh - ${theme.spacing(4)})`,
                backgroundColor: theme.palette.background.paper,
                backgroundImage: 'none',
              },
            }),
        '& .MuiBackdrop-root': {
          backgroundColor: alpha(theme.palette.common.black, 0.5),
          backdropFilter: 'blur(8px)',
        },
      }}
      PaperProps={{
        elevation: shouldBeFullScreen ? 0 : 24,
      }}
    >
      {title && (
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            pb: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: shouldBeFullScreen 
              ? theme.palette.background.paper 
              : 'transparent',
            position: shouldBeFullScreen ? 'sticky' : 'relative',
            top: 0,
            zIndex: 1,
            // Safe area top padding for full screen
            ...(shouldBeFullScreen && {
              pt: `calc(${theme.spacing(2)} + env(safe-area-inset-top))`,
            }),
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {shouldBeFullScreen && (
              <IconButton
                onClick={onClose}
                edge="start"
                sx={{
                  minWidth: 44,
                  minHeight: 44,
                  mr: 1,
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            >
              {title}
            </Typography>
          </Box>
          
          {!shouldBeFullScreen && (
            <IconButton
              onClick={onClose}
              sx={{
                minWidth: 44,
                minHeight: 44,
                '&:active': {
                  transform: 'scale(0.95)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}

      <DialogContent
        sx={{
          p: shouldBeFullScreen ? 2 : 3,
          flex: shouldBeFullScreen ? 1 : 'none',
          display: shouldBeFullScreen ? 'flex' : 'block',
          flexDirection: shouldBeFullScreen ? 'column' : 'row',
          overflowY: 'auto',
          // Better scrolling on iOS
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </DialogContent>

      {actions && (
        <DialogActions
          sx={{
            p: shouldBeFullScreen ? 2 : 3,
            pt: 1,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: shouldBeFullScreen 
              ? theme.palette.background.paper 
              : 'transparent',
            position: shouldBeFullScreen ? 'sticky' : 'relative',
            bottom: 0,
            zIndex: 1,
            // Safe area bottom padding for full screen
            ...(shouldBeFullScreen && {
              pb: `calc(${theme.spacing(2)} + env(safe-area-inset-bottom))`,
            }),
            '& > *': {
              minHeight: 44,
              minWidth: 44,
            },
            '& .MuiButton-root': {
              minHeight: 48,
              borderRadius: 3,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              px: 3,
            },
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

// Bottom Sheet Modal variant
export const MobileBottomSheet: React.FC<MobileModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={SlideTransition}
      sx={{
        '& .MuiDialog-paper': {
          margin: 0,
          marginTop: 'auto',
          borderRadius: `${theme.spacing(3)} ${theme.spacing(3)} 0 0`,
          maxHeight: '85vh',
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
          width: '100%',
          position: 'relative',
        },
        '& .MuiBackdrop-root': {
          backgroundColor: alpha(theme.palette.common.black, 0.3),
          backdropFilter: 'blur(4px)',
        },
      }}
      PaperProps={{
        elevation: 24,
      }}
    >
      {/* Drag Handle */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          pt: 1.5,
          pb: 0.5,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: theme.palette.divider,
          }}
        />
      </Box>

      {title && (
        <DialogTitle
          sx={{
            textAlign: 'center',
            pb: 1,
            pt: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </DialogTitle>
      )}

      <DialogContent
        sx={{
          p: 3,
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </DialogContent>

      {actions && (
        <DialogActions
          sx={{
            p: 3,
            pt: 1,
            borderTop: `1px solid ${theme.palette.divider}`,
            pb: `calc(${theme.spacing(3)} + env(safe-area-inset-bottom))`,
            '& > *': {
              minHeight: 44,
              minWidth: 44,
            },
            '& .MuiButton-root': {
              minHeight: 48,
              borderRadius: 3,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              px: 3,
            },
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default MobileModal;
