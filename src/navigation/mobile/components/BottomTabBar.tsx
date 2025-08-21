import React from 'react';
import {
  Box,
  Paper,
  Tab,
  Tabs,
  Badge,
  useTheme,
  alpha,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { TabItem } from '../types';

interface BottomTabBarProps {
  tabs: TabItem[];
  onTabChange?: (tabId: string) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  tabs,
  onTabChange,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab based on current route
  const activeTab = tabs.find(tab => 
    location.pathname.startsWith(tab.route)
  )?.id || tabs[0]?.id;

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    const tab = tabs.find(t => t.id === newValue);
    if (tab) {
      navigate(tab.route);
      onTabChange?.(newValue);
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        borderRadius: 0,
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        backdropFilter: 'blur(8px)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          zIndex: -1,
        },
      }}
      elevation={8}
    >
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        sx={{
          minHeight: 64,
          '& .MuiTab-root': {
            minHeight: 64,
            minWidth: 44,
            padding: theme.spacing(1),
            fontSize: '0.75rem',
            fontWeight: 500,
            textTransform: 'none',
            color: theme.palette.text.secondary,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              color: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            },
            '&.Mui-selected': {
              color: theme.palette.primary.main,
              fontWeight: 600,
            },
            '& .MuiSvgIcon-root': {
              fontSize: '1.5rem',
              marginBottom: theme.spacing(0.5),
              transition: 'transform 0.2s ease-in-out',
            },
            '&.Mui-selected .MuiSvgIcon-root': {
              transform: 'scale(1.1)',
            },
          },
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          },
        }}
      >
        {tabs.map((tab) => {
          const IconComponent = activeTab === tab.id && tab.activeIcon ? tab.activeIcon : tab.icon;
          
          return (
            <Tab
              key={tab.id}
              value={tab.id}
              label={
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    minHeight: 44,
                    justifyContent: 'center',
                  }}
                >
                  <Badge
                    badgeContent={tab.badge}
                    color="error"
                    variant="dot"
                    invisible={!tab.badge}
                    sx={{
                      '& .MuiBadge-dot': {
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                      },
                      '& .MuiBadge-standard': {
                        fontSize: '0.625rem',
                        minWidth: 16,
                        height: 16,
                        padding: 0,
                      },
                    }}
                  >
                    <IconComponent />
                  </Badge>
                  <Box
                    component="span"
                    sx={{
                      fontSize: '0.75rem',
                      lineHeight: 1,
                      textAlign: 'center',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tab.label}
                  </Box>
                </Box>
              }
              sx={{
                '&:active': {
                  transform: 'scale(0.95)',
                  transition: 'transform 0.1s ease-in-out',
                },
              }}
            />
          );
        })}
      </Tabs>
      
      {/* Safe area bottom padding for devices with home indicator */}
      <Box
        sx={{
          height: 'env(safe-area-inset-bottom)',
          backgroundColor: 'inherit',
        }}
      />
    </Paper>
  );
};

export default BottomTabBar;
