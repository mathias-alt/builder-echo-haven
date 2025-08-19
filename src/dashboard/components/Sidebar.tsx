import * as React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
  alpha,
  Collapse,
  Badge,
} from '@mui/material';
import {
  Dashboard,
  Add,
  Folder,
  People,
  Analytics,
  Settings,
  Help,
  ExpandLess,
  ExpandMore,
  FiberManualRecord,
} from '@mui/icons-material';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const DRAWER_WIDTH = 280;

export default function Sidebar({ open }: SidebarProps) {
  const theme = useTheme();
  const [canvasesOpen, setCanvasesOpen] = React.useState(true);

  const handleCanvasesToggle = () => {
    setCanvasesOpen(!canvasesOpen);
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      selected: true,
    },
    {
      text: 'Create Canvas',
      icon: <Add />,
      highlight: true,
    },
  ];

  const canvasItems = [
    { text: 'Business Model Canvas', status: 'active' },
    { text: 'Value Proposition Canvas', status: 'draft' },
    { text: 'Lean Canvas', status: 'completed' },
    { text: 'Customer Journey Map', status: 'active' },
  ];

  const otherItems = [
    { text: 'Team Members', icon: <People />, badge: 12 },
    { text: 'Analytics', icon: <Analytics /> },
    { text: 'Settings', icon: <Settings /> },
    { text: 'Help & Support', icon: <Help /> },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'draft':
        return theme.palette.warning.main;
      case 'completed':
        return theme.palette.primary.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            fontSize: '1.1rem',
          }}
        >
          Workspace
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            mt: 0.5,
          }}
        >
          Manage your business canvases
        </Typography>
      </Box>

      {/* Main Navigation */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List sx={{ px: 2, py: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={item.selected}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  backgroundColor: item.highlight
                    ? alpha(theme.palette.primary.main, 0.1)
                    : item.selected
                    ? alpha(theme.palette.primary.main, 0.12)
                    : 'transparent',
                  border: item.highlight
                    ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                    : '1px solid transparent',
                  '&:hover': {
                    backgroundColor: item.highlight
                      ? alpha(theme.palette.primary.main, 0.15)
                      : alpha(theme.palette.action.hover, 0.1),
                    transform: 'translateY(-1px)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.18),
                    },
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: item.highlight
                      ? theme.palette.primary.main
                      : item.selected
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: item.selected || item.highlight ? 600 : 500,
                    color: item.highlight
                      ? theme.palette.primary.main
                      : item.selected
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ mx: 2, my: 1 }} />

        {/* Canvases Section */}
        <List sx={{ px: 2 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleCanvasesToggle}
              sx={{
                borderRadius: 2,
                py: 1,
                px: 2,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.action.hover, 0.05),
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Folder sx={{ color: theme.palette.text.secondary }} />
              </ListItemIcon>
              <ListItemText
                primary="My Canvases"
                primaryTypographyProps={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  fontSize: '0.9rem',
                }}
              />
              {canvasesOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          
          <Collapse in={canvasesOpen} timeout="auto" unmountOnExit>
            <List sx={{ pl: 1 }}>
              {canvasItems.map((canvas) => (
                <ListItem key={canvas.text} disablePadding sx={{ mb: 0.25 }}>
                  <ListItemButton
                    sx={{
                      borderRadius: 2,
                      py: 1,
                      px: 2,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.action.hover, 0.05),
                        transform: 'translateX(4px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <FiberManualRecord
                        sx={{
                          fontSize: 8,
                          color: getStatusColor(canvas.status),
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={canvas.text}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        color: theme.palette.text.primary,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>

        <Divider sx={{ mx: 2, my: 1 }} />

        {/* Other Items */}
        <List sx={{ px: 2 }}>
          {otherItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.action.hover, 0.05),
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="primary">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: open ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          border: 'none',
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backgroundColor: theme.palette.background.paper,
        },
        transition: 'width 0.3s ease',
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
