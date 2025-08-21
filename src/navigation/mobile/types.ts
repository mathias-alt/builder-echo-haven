import { SvgIconComponent } from '@mui/icons-material';

export interface TabItem {
  id: string;
  label: string;
  icon: SvgIconComponent;
  activeIcon?: SvgIconComponent;
  route: string;
  badge?: number;
  isActive?: boolean;
}

export interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  label: string;
  icon: SvgIconComponent;
  route?: string;
  action?: () => void;
  badge?: number;
  disabled?: boolean;
  divider?: boolean;
}

export interface SwipeGestureConfig {
  threshold: number;
  velocity: number;
  direction: 'horizontal' | 'vertical' | 'both';
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export interface MobileDropdownProps {
  anchor: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  items: MenuItem[];
  title?: string;
  maxHeight?: number;
}

export interface MobileModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  fullScreen?: boolean;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export interface OfflineState {
  isOffline: boolean;
  lastSyncTime?: Date;
  pendingActions: number;
  hasUnsavedChanges: boolean;
}

export interface PullToRefreshConfig {
  threshold: number;
  loadingHeight: number;
  onRefresh: () => Promise<void>;
  enabled: boolean;
}

export interface NavigationState {
  currentTab: string;
  history: string[];
  isMenuOpen: boolean;
  isLoading: boolean;
  offline: OfflineState;
}

export interface TouchTarget {
  minSize: number;
  recommendedSize: number;
  padding: number;
}

export interface MobileNavigationConfig {
  tabs: TabItem[];
  menuSections: MenuSection[];
  touchTargets: TouchTarget;
  swipeGestures: SwipeGestureConfig;
  pullToRefresh: PullToRefreshConfig;
}

export type NavigationDirection = 'left' | 'right' | 'up' | 'down';
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type ThumbZone = 'safe' | 'stretch' | 'unreachable';
