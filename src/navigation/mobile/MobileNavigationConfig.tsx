import React from 'react';
import {
  Dashboard as DashboardIcon,
  DashboardOutlined as DashboardOutlinedIcon,
  Dashboard as CanvasIcon,
  People as PeopleIcon,
  PeopleOutlined as PeopleOutlinedIcon,
  Analytics as AnalyticsIcon,
  AnalyticsOutlined as AnalyticsOutlinedIcon,
  Settings as SettingsIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  AccountCircle as AccountCircleIcon,
  Business as BusinessIcon,
  Share as ShareIcon,
  GetApp as ExportIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  History as HistoryIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Brightness6 as ThemeIcon,
} from '@mui/icons-material';
import { TabItem, MenuSection, MobileNavigationConfig } from './types';

// Main navigation tabs configuration
export const navigationTabs: TabItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: DashboardOutlinedIcon,
    activeIcon: DashboardIcon,
    route: '/dashboard',
  },
  {
    id: 'canvas',
    label: 'Canvas',
    icon: CanvasIcon,
    route: '/canvas',
  },
  {
    id: 'team',
    label: 'Team',
    icon: PeopleOutlinedIcon,
    activeIcon: PeopleIcon,
    route: '/team',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: AnalyticsOutlinedIcon,
    activeIcon: AnalyticsIcon,
    route: '/analytics',
  },
];

// Hamburger menu sections configuration
export const menuSections: MenuSection[] = [
  {
    id: 'workspace',
    title: 'Workspace',
    items: [
      {
        id: 'company-settings',
        label: 'Company Settings',
        icon: BusinessIcon,
        route: '/company/settings',
      },
      {
        id: 'invite-team',
        label: 'Invite Team Members',
        icon: PeopleIcon,
        route: '/invite',
        badge: 2, // Example: pending invitations
      },
      {
        id: 'export-data',
        label: 'Export Data',
        icon: ExportIcon,
        action: () => {
          // Handle export action
        },
      },
      {
        id: 'share-workspace',
        label: 'Share Workspace',
        icon: ShareIcon,
        action: () => {
          // Handle share action
        },
      },
    ],
  },
  {
    id: 'account',
    title: 'Account',
    items: [
      {
        id: 'profile',
        label: 'Profile Settings',
        icon: AccountCircleIcon,
        route: '/profile',
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: NotificationsIcon,
        route: '/notifications',
        badge: 5, // Example: unread notifications
      },
      {
        id: 'activity-history',
        label: 'Activity History',
        icon: HistoryIcon,
        route: '/activity',
      },
      {
        id: 'security',
        label: 'Security & Privacy',
        icon: SecurityIcon,
        route: '/security',
      },
      {
        id: 'divider-1',
        label: '',
        icon: SettingsIcon,
        divider: true,
        disabled: true,
      },
    ],
  },
  {
    id: 'preferences',
    title: 'Preferences',
    items: [
      {
        id: 'app-settings',
        label: 'App Settings',
        icon: SettingsOutlinedIcon,
        route: '/settings',
      },
      {
        id: 'theme',
        label: 'Theme',
        icon: ThemeIcon,
        action: () => {
          // Handle theme toggle
        },
      },
      {
        id: 'language',
        label: 'Language',
        icon: LanguageIcon,
        action: () => {
          // Handle language selection
          console.log('Change language');
        },
      },
      {
        id: 'help',
        label: 'Help & Support',
        icon: HelpIcon,
        route: '/help',
      },
      {
        id: 'divider-2',
        label: '',
        icon: SettingsIcon,
        divider: true,
        disabled: true,
      },
      {
        id: 'logout',
        label: 'Sign Out',
        icon: LogoutIcon,
        action: () => {
          // Handle logout
          console.log('Sign out');
        },
      },
    ],
  },
];

// Complete mobile navigation configuration
export const mobileNavigationConfig: MobileNavigationConfig = {
  tabs: navigationTabs,
  menuSections,
  touchTargets: {
    minSize: 44,
    recommendedSize: 48,
    padding: 8,
  },
  swipeGestures: {
    threshold: 50,
    velocity: 0.3,
    direction: 'horizontal',
  },
  pullToRefresh: {
    threshold: 80,
    loadingHeight: 60,
    onRefresh: async () => {
      // Default refresh handler
      await new Promise(resolve => setTimeout(resolve, 1500));
    },
    enabled: true,
  },
};

// User info configuration (would typically come from context/state)
export const defaultUserInfo = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: undefined, // Would be user's avatar URL
};

export default mobileNavigationConfig;
