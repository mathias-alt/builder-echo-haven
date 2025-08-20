import * as React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Divider,
  Select,
  FormControl,
  useTheme,
  alpha,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Business,
  AccountCircle,
  Settings,
  ExitToApp,
  KeyboardArrowDown,
  Notifications,
  Help,
} from '@mui/icons-material';
import { CompanySwitcher, UserCompany } from '../../components/CompanySwitcher';

interface TopNavigationProps {
  onSidebarToggle: () => void;
  selectedCompany: string;
  companies: UserCompany[];
  onCompanyChange: (companyId: string) => Promise<void>;
  onCreateCompany: () => void;
}

export default function TopNavigation({
  onSidebarToggle,
  selectedCompany,
  companies,
  onCompanyChange,
  onCreateCompany,
}: TopNavigationProps) {
  const theme = useTheme();
  const [userMenuAnchor, setUserMenuAnchor] = React.useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        color: theme.palette.text.primary,
        paddingLeft: '310px',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onSidebarToggle}
            sx={{
              '&:hover': {
                backgroundColor: alpha(theme.palette.action.hover, 0.1),
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Business sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              Flourishing Business Canvas
            </Typography>
          </Box>
          
          {/* Company Switcher */}
          <Box sx={{ ml: 2 }}>
            <CompanySwitcher
              companies={companies}
              currentCompanyId={selectedCompany}
              onCompanySwitch={onCompanyChange}
              onCreateCompany={onCreateCompany}
            />
          </Box>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            sx={{
              '&:hover': {
                backgroundColor: alpha(theme.palette.action.hover, 0.1),
              },
            }}
          >
            <Notifications />
          </IconButton>
          
          <IconButton
            sx={{
              '&:hover': {
                backgroundColor: alpha(theme.palette.action.hover, 0.1),
              },
            }}
          >
            <Help />
          </IconButton>
          
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          
          <Button
            onClick={handleUserMenuOpen}
            sx={{
              textTransform: 'none',
              color: theme.palette.text.primary,
              borderRadius: 2,
              px: 1,
              py: 0.5,
              '&:hover': {
                backgroundColor: alpha(theme.palette.action.hover, 0.1),
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: theme.palette.primary.main,
                }}
              >
                M
              </Avatar>
              <Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Mathias Austnes
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  Admin
                </Typography>
              </Box>
              <KeyboardArrowDown sx={{ fontSize: 18 }} />
            </Box>
          </Button>
          
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            PaperProps={{
              sx: {
                borderRadius: 2,
                minWidth: 200,
                boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.1)}`,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Mathias Austnes
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                mathias@flourishing.com
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleUserMenuClose} sx={{ gap: 1 }}>
              <AccountCircle fontSize="small" />
              Profile
            </MenuItem>
            <MenuItem onClick={handleUserMenuClose} sx={{ gap: 1 }}>
              <Settings fontSize="small" />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleUserMenuClose} sx={{ gap: 1, color: theme.palette.error.main }}>
              <ExitToApp fontSize="small" />
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
