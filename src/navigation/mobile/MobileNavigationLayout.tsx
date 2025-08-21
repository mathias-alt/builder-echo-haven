import React, { useState, useCallback } from 'react';
import {
  Box,
  useTheme,
  useMediaQuery,
  Container,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import {
  BottomTabBar,
  HamburgerMenu,
  OfflineIndicator,
  PullToRefreshWrapper,
  SwipeGestureProvider,
  useOfflineHandler,
  useSwipeNavigation,
} from './index';
import {
  navigationTabs,
  menuSections,
  defaultUserInfo,
  mobileNavigationConfig,
} from './MobileNavigationConfig';
import { NavigationState } from './types';

interface MobileNavigationLayoutProps {
  children: React.ReactNode;
  enablePullToRefresh?: boolean;
  enableSwipeNavigation?: boolean;
  onRefresh?: () => Promise<void>;
  className?: string;
  sx?: object;
}

export const MobileNavigationLayout: React.FC<MobileNavigationLayoutProps> = ({
  children,
  enablePullToRefresh = true,
  enableSwipeNavigation = true,
  onRefresh,
  className,
  sx,
}) => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentTab: navigationTabs.find(tab => 
      location.pathname.startsWith(tab.route)
    )?.id || navigationTabs[0]?.id,
    history: [location.pathname],
    isMenuOpen: false,
    isLoading: false,
    offline: {
      isOffline: false,
      pendingActions: 0,
      hasUnsavedChanges: false,
    },
  });

  const { offlineState, executeAction } = useOfflineHandler();

  // Handle tab changes with swipe navigation
  const handleTabChange = useCallback((tabId: string) => {
    setNavigationState(prev => ({
      ...prev,
      currentTab: tabId,
      history: [...prev.history.slice(-9), location.pathname], // Keep last 10 items
    }));
  }, [location.pathname]);

  // Swipe navigation between tabs
  const tabIds = navigationTabs.map(tab => tab.id);
  const { attachSwipeListeners } = useSwipeNavigation(
    tabIds,
    navigationState.currentTab,
    handleTabChange,
    {
      threshold: 60,
      velocity: 0.4,
      direction: 'horizontal',
    }
  );

  // Handle refresh with offline support
  const handleRefresh = useCallback(async () => {
    setNavigationState(prev => ({ ...prev, isLoading: true }));
    
    try {
      if (onRefresh) {
        await executeAction('refresh', onRefresh);
      } else {
        // Default refresh action
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setNavigationState(prev => ({ ...prev, isLoading: false }));
    }
  }, [onRefresh, executeAction]);

  // Handle menu item clicks
  const handleMenuItemClick = useCallback((item: any) => {
    console.log('Menu item clicked:', item.label);
  }, []);

  // Don't render mobile navigation on desktop
  if (!isMobile) {
    return <>{children}</>;
  }

  const ContentWrapper = enableSwipeNavigation ? SwipeGestureProvider : Box;
  const RefreshWrapper = enablePullToRefresh ? PullToRefreshWrapper : Box;

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.default,
        ...sx,
      }}
    >
      {/* Offline Indicator */}
      <OfflineIndicator
        position="top"
        variant="banner"
        onRetryAll={async () => {
          // Retry all pending offline actions
          console.log('Retrying offline actions...');
        }}
      />

      {/* Top Navigation Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          pt: `calc(${theme.spacing(2)} + env(safe-area-inset-top))`,
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          zIndex: theme.zIndex.appBar,
        }}
      >
        {/* Hamburger Menu */}
        <HamburgerMenu
          sections={menuSections}
          userInfo={defaultUserInfo}
          onItemClick={handleMenuItemClick}
        />

        {/* Page Title */}
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          {/* Page title would be determined by current route */}
        </Box>

        {/* Additional actions could go here */}
        <Box sx={{ width: 44 }} /> {/* Spacer for symmetry */}
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <ContentWrapper
          config={enableSwipeNavigation ? mobileNavigationConfig.swipeGestures : undefined}
          sx={{
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <RefreshWrapper
            onRefresh={enablePullToRefresh ? handleRefresh : undefined}
            disabled={!enablePullToRefresh || navigationState.isLoading}
          >
            <Container
              maxWidth={false}
              sx={{
                height: '100%',
                p: 0,
                overflow: 'auto',
                WebkitOverflowScrolling: 'touch',
                // Account for bottom tab bar
                pb: `calc(64px + env(safe-area-inset-bottom))`,
              }}
            >
              {children}
            </Container>
          </RefreshWrapper>
        </ContentWrapper>
      </Box>

      {/* Bottom Tab Bar */}
      <BottomTabBar
        tabs={navigationTabs}
        onTabChange={handleTabChange}
      />
    </Box>
  );
};

// Provider component for mobile navigation context
export const MobileNavigationProvider: React.FC<{
  children: React.ReactNode;
  config?: Partial<typeof mobileNavigationConfig>;
}> = ({ children, config }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Merge custom config with defaults
  const finalConfig = { ...mobileNavigationConfig, ...config };

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <MobileNavigationLayout
      enablePullToRefresh={finalConfig.pullToRefresh.enabled}
      enableSwipeNavigation={true}
      onRefresh={finalConfig.pullToRefresh.onRefresh}
    >
      {children}
    </MobileNavigationLayout>
  );
};

export default MobileNavigationLayout;
