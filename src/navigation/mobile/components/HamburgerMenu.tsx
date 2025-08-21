import React, { useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Badge,
  useTheme,
  alpha,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandLess,
  ExpandMore,
  ChevronRight,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { MenuSection, MenuItem } from '../types';

interface HamburgerMenuProps {
  sections: MenuSection[];
  userInfo?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onItemClick?: (item: MenuItem) => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  sections,
  userInfo,
  onItemClick,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.disabled) return;

    if (item.route) {
      navigate(item.route);
    }
    
    if (item.action) {
      item.action();
    }

    onItemClick?.(item);
    setIsOpen(false);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const MenuButton = () => (
    <IconButton
      onClick={toggleMenu}
      sx={{
        minWidth: 44,
        minHeight: 44,
        padding: theme.spacing(1.5),
        color: theme.palette.text.primary,
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(8px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          borderColor: alpha(theme.palette.primary.main, 0.2),
        },
        '&:active': {
          transform: 'scale(0.95)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <MenuIcon />
    </IconButton>
  );

  return (
    <>
      <MenuButton />
      
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            backgroundColor: theme.palette.background.paper,
            backgroundImage: 'none',
          },
        }}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor: alpha(theme.palette.primary.main, 0.02),
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: userInfo ? 2 : 0,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Menu
              </Typography>
              <IconButton
                onClick={() => setIsOpen(false)}
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
            </Box>

            {/* User Info */}
            {userInfo && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Avatar
                  src={userInfo.avatar}
                  sx={{
                    width: 40,
                    height: 40,
                    fontSize: '1rem',
                  }}
                >
                  {userInfo.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {userInfo.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {userInfo.email}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Menu Sections */}
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {sections.map((section, sectionIndex) => (
              <Box key={section.id}>
                {/* Section Header */}
                <ListItem
                  disablePadding
                  sx={{
                    backgroundColor: alpha(theme.palette.text.primary, 0.02),
                  }}
                >
                  <ListItemButton
                    onClick={() => toggleSection(section.id)}
                    sx={{
                      minHeight: 48,
                      px: 2,
                      py: 1.5,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.secondary,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                          }}
                        >
                          {section.title}
                        </Typography>
                      }
                    />
                    {expandedSections.includes(section.id) ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItemButton>
                </ListItem>

                {/* Section Items */}
                <Collapse
                  in={expandedSections.includes(section.id)}
                  timeout="auto"
                  unmountOnExit
                >
                  <List disablePadding>
                    {section.items.map((item, itemIndex) => (
                      <React.Fragment key={item.id}>
                        <ListItem disablePadding>
                          <ListItemButton
                            onClick={() => handleItemClick(item)}
                            disabled={item.disabled}
                            sx={{
                              minHeight: 48,
                              px: 3,
                              py: 1.5,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                              },
                              '&:active': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                              },
                              '&.Mui-disabled': {
                                opacity: 0.5,
                              },
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 40,
                                color: item.disabled 
                                  ? theme.palette.text.disabled 
                                  : theme.palette.text.primary,
                              }}
                            >
                              <Badge
                                badgeContent={item.badge}
                                color="error"
                                variant={item.badge && item.badge > 0 ? 'standard' : 'dot'}
                                invisible={!item.badge}
                              >
                                <item.icon />
                              </Badge>
                            </ListItemIcon>
                            <ListItemText
                              primary={item.label}
                              sx={{
                                '& .MuiTypography-root': {
                                  fontWeight: 500,
                                },
                              }}
                            />
                            {item.route && <ChevronRight fontSize="small" />}
                          </ListItemButton>
                        </ListItem>
                        {item.divider && (
                          <Divider variant="inset" component="li" />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                </Collapse>

                {sectionIndex < sections.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default HamburgerMenu;
