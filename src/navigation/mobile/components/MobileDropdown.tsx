import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Badge,
  useTheme,
  alpha,
  Slide,
  Box,
} from '@mui/material';
import {
  Close as CloseIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { MobileDropdownProps, MenuItem } from '../types';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const MobileDropdown: React.FC<MobileDropdownProps> = ({
  anchor,
  open,
  onClose,
  items,
  title,
  maxHeight = 400,
}) => {
  const theme = useTheme();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setSelectedItem(null);
    }
  }, [open]);

  const handleItemClick = (item: MenuItem) => {
    if (item.disabled) return;

    setSelectedItem(item.id);

    // Execute action with slight delay for visual feedback
    setTimeout(() => {
      if (item.action) {
        item.action();
      }
      onClose();
    }, 150);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="sm"
      sx={{
        '& .MuiDialog-paper': {
          margin: theme.spacing(2),
          marginTop: 'auto',
          marginBottom: theme.spacing(2),
          borderRadius: theme.spacing(2),
          maxHeight: `calc(100vh - ${theme.spacing(4)})`,
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
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
      {title && (
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
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
        </DialogTitle>
      )}

      <DialogContent sx={{ p: 0 }}>
        <List
          sx={{
            maxHeight: maxHeight,
            overflowY: 'auto',
            py: 1,
          }}
        >
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  sx={{
                    minHeight: 56,
                    px: 3,
                    py: 1.5,
                    backgroundColor: selectedItem === item.id 
                      ? alpha(theme.palette.primary.main, 0.08)
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                    '&:active': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      transform: 'scale(0.98)',
                    },
                    '&.Mui-disabled': {
                      opacity: 0.5,
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 48,
                      color: item.disabled 
                        ? theme.palette.text.disabled 
                        : selectedItem === item.id
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                    }}
                  >
                    <Badge
                      badgeContent={item.badge}
                      color="error"
                      variant={item.badge && item.badge > 0 ? 'standard' : 'dot'}
                      invisible={!item.badge}
                      sx={{
                        '& .MuiBadge-standard': {
                          fontSize: '0.75rem',
                          minWidth: 18,
                          height: 18,
                        },
                      }}
                    >
                      <item.icon />
                    </Badge>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={item.label}
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: selectedItem === item.id ? 600 : 500,
                        fontSize: '1rem',
                      },
                    }}
                  />

                  {selectedItem === item.id && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: theme.palette.primary.main,
                      }}
                    >
                      <CheckIcon fontSize="small" />
                    </Box>
                  )}
                </ListItemButton>
              </ListItem>

              {item.divider && index < items.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      </DialogContent>

      {/* Safe area bottom padding */}
      <Box
        sx={{
          height: 'env(safe-area-inset-bottom)',
          backgroundColor: 'inherit',
        }}
      />
    </Dialog>
  );
};

export default MobileDropdown;
