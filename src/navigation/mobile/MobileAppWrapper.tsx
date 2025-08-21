import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';
import { MobileNavigationLayout } from './MobileNavigationLayout';

interface MobileAppWrapperProps {
  children: React.ReactNode;
}

// Routes that should not have mobile navigation
const EXCLUDED_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/invite/',
];

// Routes that should have pull-to-refresh
const REFRESH_ENABLED_ROUTES = [
  '/dashboard',
  '/canvas',
  '/team',
  '/analytics',
];

export const MobileAppWrapper: React.FC<MobileAppWrapperProps> = ({ children }) => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const shouldShowMobileNav = React.useMemo(() => {
    if (!isMobile) return false;
    
    return !EXCLUDED_ROUTES.some(route => 
      location.pathname === route || 
      (route.endsWith('/') && location.pathname.startsWith(route))
    );
  }, [isMobile, location.pathname]);

  const shouldEnablePullToRefresh = React.useMemo(() => {
    return REFRESH_ENABLED_ROUTES.some(route => 
      location.pathname.startsWith(route)
    );
  }, [location.pathname]);

  // Handle page-specific refresh logic
  const handleRefresh = React.useCallback(async () => {
    const currentPath = location.pathname;
    
    if (currentPath.startsWith('/dashboard')) {
      // Refresh dashboard data
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else if (currentPath.startsWith('/canvas')) {
      // Refresh canvas data
      await new Promise(resolve => setTimeout(resolve, 1200));
    } else if (currentPath.startsWith('/team')) {
      // Refresh team data
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else if (currentPath.startsWith('/analytics')) {
      // Refresh analytics data
      console.log('Refreshing analytics...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      // Default refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }, [location.pathname]);

  if (!shouldShowMobileNav) {
    return <>{children}</>;
  }

  return (
    <MobileNavigationLayout
      enablePullToRefresh={shouldEnablePullToRefresh}
      enableSwipeNavigation={true}
      onRefresh={shouldEnablePullToRefresh ? handleRefresh : undefined}
    >
      {children}
    </MobileNavigationLayout>
  );
};

export default MobileAppWrapper;
