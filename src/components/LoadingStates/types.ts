import { SvgIconComponent } from '@mui/icons-material';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export interface LoadingConfig {
  showDelay?: number;
  minDuration?: number;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface SkeletonConfig {
  variant: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | false;
  count?: number;
}

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large' | number;
  color?: 'primary' | 'secondary' | 'inherit' | string;
  variant?: 'circular' | 'dots' | 'bars' | 'brand';
  message?: string;
  className?: string;
  sx?: object;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  illustration?: 'canvas' | 'team' | 'analytics' | 'search' | 'network' | 'data' | 'custom';
  customIllustration?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'contained' | 'outlined' | 'text';
    icon?: SvgIconComponent;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'contained' | 'outlined' | 'text';
    icon?: SvgIconComponent;
  };
  className?: string;
  sx?: object;
}

export interface ErrorStateProps {
  title: string;
  description: string;
  errorCode?: string | number;
  errorType?: 'network' | 'server' | 'client' | 'permission' | 'notFound' | 'generic';
  retryAction?: {
    label: string;
    onClick: () => void;
  };
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'contained' | 'outlined' | 'text';
  };
  supportAction?: {
    label: string;
    onClick: () => void;
  };
  showErrorDetails?: boolean;
  className?: string;
  sx?: object;
}

export interface SuccessStateProps {
  title: string;
  description: string;
  animation?: 'checkmark' | 'confetti' | 'pulse' | 'scale' | 'none';
  autoHide?: boolean;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'contained' | 'outlined' | 'text';
  };
  className?: string;
  sx?: object;
}

export interface ProgressIndicatorProps {
  value?: number;
  variant?: 'determinate' | 'indeterminate';
  label?: string;
  description?: string;
  showPercentage?: boolean;
  steps?: ProgressStep[];
  currentStep?: number;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
  sx?: object;
}

export interface ProgressStep {
  id: string;
  label: string;
  description?: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  icon?: SvgIconComponent;
}

export interface LoadingStateContextValue {
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
  showLoadingDelay: (key: string, delay?: number) => void;
  hideLoading: (key: string) => void;
  loadingStates: Record<string, boolean>;
  executeWithLoading: <T>(
    key: string,
    asyncFn: () => Promise<T>,
    config?: LoadingConfig
  ) => Promise<T>;
}

export interface AnimationConfig {
  duration: {
    shortest: number;
    shorter: number;
    short: number;
    standard: number;
    complex: number;
    enteringScreen: number;
    leavingScreen: number;
  };
  easing: {
    easeInOut: string;
    easeOut: string;
    easeIn: string;
    sharp: string;
  };
}

export interface StateTransition {
  from: LoadingState;
  to: LoadingState;
  animation?: string;
  duration?: number;
}

// Network-aware loading configuration
export interface NetworkAwareConfig {
  slowConnection: {
    threshold: number; // ms
    showImprovedSkeleton: boolean;
    simplifyAnimations: boolean;
  };
  offline: {
    showOfflineMessage: boolean;
    enableCache: boolean;
  };
  lowData: {
    reduceAnimations: boolean;
    useSimpleSkeletons: boolean;
  };
}
