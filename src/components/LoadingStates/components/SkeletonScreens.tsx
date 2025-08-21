import React from 'react';
import {
  Box,
  Skeleton,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import { SkeletonConfig } from '../types';
import { skeletonShimmer, animationConfig } from '../animations';

interface SkeletonScreenProps {
  config?: SkeletonConfig;
  className?: string;
  sx?: object;
}

// Base animated skeleton with enhanced shimmer effect
export const AnimatedSkeleton: React.FC<SkeletonScreenProps> = ({
  config = { variant: 'rectangular', animation: 'wave' },
  className,
  sx,
}) => {
  const theme = useTheme();

  return (
    <Skeleton
      variant={config.variant}
      width={config.width}
      height={config.height}
      animation={config.animation}
      className={className}
      sx={{
        bgcolor: alpha(theme.palette.grey[300], 0.3),
        '&::after': {
          background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.common.white, 0.4)}, transparent)`,
          animation: config.animation === 'wave' ? `${skeletonShimmer} 1.6s ease-in-out 0.5s infinite` : 'none',
        },
        borderRadius: config.variant === 'rounded' ? 2 : 
                     config.variant === 'circular' ? '50%' : 1,
        ...sx,
      }}
    />
  );
};

// Dashboard skeleton screen
export const DashboardSkeleton: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header skeleton */}
      <Box sx={{ mb: 4 }}>
        <AnimatedSkeleton config={{ variant: 'text', width: '40%', height: 40 }} />
        <AnimatedSkeleton config={{ variant: 'text', width: '60%', height: 20 }} sx={{ mt: 1 }} />
      </Box>

      {/* Stats cards skeleton */}
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', mb: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <AnimatedSkeleton config={{ variant: 'circular', width: 40, height: 40 }} />
              <AnimatedSkeleton config={{ variant: 'text', width: 60, height: 24 }} />
            </Box>
            <AnimatedSkeleton config={{ variant: 'text', width: '80%', height: 20 }} />
            <AnimatedSkeleton config={{ variant: 'text', width: '60%', height: 16 }} sx={{ mt: 1 }} />
          </Card>
        ))}
      </Box>

      {/* Chart skeleton */}
      <Card sx={{ p: 3, mb: 4 }}>
        <AnimatedSkeleton config={{ variant: 'text', width: '30%', height: 24 }} sx={{ mb: 2 }} />
        <AnimatedSkeleton config={{ variant: 'rectangular', width: '100%', height: 300 }} />
      </Card>

      {/* Activity list skeleton */}
      <Card sx={{ p: 3 }}>
        <AnimatedSkeleton config={{ variant: 'text', width: '25%', height: 24 }} sx={{ mb: 3 }} />
        {[1, 2, 3, 4, 5].map((i) => (
          <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <AnimatedSkeleton config={{ variant: 'circular', width: 48, height: 48 }} />
            <Box sx={{ flex: 1 }}>
              <AnimatedSkeleton config={{ variant: 'text', width: '70%', height: 20 }} />
              <AnimatedSkeleton config={{ variant: 'text', width: '50%', height: 16 }} />
            </Box>
            <AnimatedSkeleton config={{ variant: 'text', width: 80, height: 16 }} />
          </Box>
        ))}
      </Card>
    </Box>
  );
};

// Canvas skeleton screen
export const CanvasSkeleton: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 2 }}>
      {/* Toolbar skeleton */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <AnimatedSkeleton config={{ variant: 'text', width: 200, height: 32 }} />
          <AnimatedSkeleton config={{ variant: 'circular', width: 24, height: 24 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {[1, 2, 3].map((i) => (
            <AnimatedSkeleton key={i} config={{ variant: 'rectangular', width: 80, height: 36 }} />
          ))}
        </Box>
      </Box>

      {/* Canvas grid skeleton */}
      <Box sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        minHeight: 600,
      }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <Card key={i} sx={{ p: 2, minHeight: 180 }}>
            <AnimatedSkeleton config={{ variant: 'text', width: '80%', height: 20 }} sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[1, 2, 3].map((j) => (
                <AnimatedSkeleton key={j} config={{ variant: 'rectangular', width: '100%', height: 40 }} />
              ))}
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

// Team management skeleton
export const TeamSkeleton: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header with actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <AnimatedSkeleton config={{ variant: 'text', width: 200, height: 32 }} />
          <AnimatedSkeleton config={{ variant: 'text', width: 300, height: 20 }} sx={{ mt: 1 }} />
        </Box>
        <AnimatedSkeleton config={{ variant: 'rectangular', width: 120, height: 40 }} />
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <AnimatedSkeleton config={{ variant: 'rectangular', width: 200, height: 40 }} />
        <AnimatedSkeleton config={{ variant: 'rectangular', width: 150, height: 40 }} />
        <AnimatedSkeleton config={{ variant: 'rectangular', width: 100, height: 40 }} />
      </Box>

      {/* Team member cards */}
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <AnimatedSkeleton config={{ variant: 'circular', width: 64, height: 64 }} />
              <Box sx={{ flex: 1 }}>
                <AnimatedSkeleton config={{ variant: 'text', width: '80%', height: 24 }} />
                <AnimatedSkeleton config={{ variant: 'text', width: '60%', height: 20 }} />
                <AnimatedSkeleton config={{ variant: 'text', width: '40%', height: 16 }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <AnimatedSkeleton config={{ variant: 'rectangular', width: 60, height: 24 }} />
              <AnimatedSkeleton config={{ variant: 'rectangular', width: 80, height: 24 }} />
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

// Analytics skeleton screen
export const AnalyticsSkeleton: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Filter panel */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {[1, 2, 3, 4].map((i) => (
            <AnimatedSkeleton key={i} config={{ variant: 'rectangular', width: 150, height: 40 }} />
          ))}
        </Box>
      </Card>

      {/* Charts grid */}
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, mb: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} sx={{ p: 3 }}>
            <AnimatedSkeleton config={{ variant: 'text', width: '60%', height: 24 }} sx={{ mb: 2 }} />
            <AnimatedSkeleton config={{ variant: 'rectangular', width: '100%', height: 250 }} />
          </Card>
        ))}
      </Box>

      {/* Data table skeleton */}
      <Card sx={{ p: 3 }}>
        <AnimatedSkeleton config={{ variant: 'text', width: '30%', height: 24 }} sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Table header */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <AnimatedSkeleton key={i} config={{ variant: 'text', width: '80%', height: 20 }} />
            ))}
          </Box>
          {/* Table rows */}
          {Array.from({ length: 10 }).map((_, i) => (
            <Box key={i} sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, py: 1 }}>
              {[1, 2, 3, 4, 5].map((j) => (
                <AnimatedSkeleton key={j} config={{ variant: 'text', width: '70%', height: 16 }} />
              ))}
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
};

// List item skeleton
export const ListItemSkeleton: React.FC<{ showAvatar?: boolean; lines?: number }> = ({ 
  showAvatar = true, 
  lines = 2 
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, p: 2, alignItems: 'flex-start' }}>
      {showAvatar && (
        <AnimatedSkeleton config={{ variant: 'circular', width: 40, height: 40 }} />
      )}
      <Box sx={{ flex: 1 }}>
        {Array.from({ length: lines }).map((_, i) => (
          <AnimatedSkeleton 
            key={i}
            config={{ 
              variant: 'text', 
              width: i === 0 ? '80%' : '60%', 
              height: i === 0 ? 20 : 16 
            }} 
            sx={{ mb: i === lines - 1 ? 0 : 1 }}
          />
        ))}
      </Box>
    </Box>
  );
};

// Card skeleton
export const CardSkeleton: React.FC<{ 
  showHeader?: boolean; 
  showFooter?: boolean; 
  contentLines?: number;
}> = ({ 
  showHeader = true, 
  showFooter = true, 
  contentLines = 3 
}) => {
  return (
    <Card sx={{ p: 3 }}>
      {showHeader && (
        <Box sx={{ mb: 2 }}>
          <AnimatedSkeleton config={{ variant: 'text', width: '60%', height: 24 }} />
          <AnimatedSkeleton config={{ variant: 'text', width: '80%', height: 16 }} sx={{ mt: 1 }} />
        </Box>
      )}
      
      <Box sx={{ mb: showFooter ? 2 : 0 }}>
        {Array.from({ length: contentLines }).map((_, i) => (
          <AnimatedSkeleton 
            key={i}
            config={{ variant: 'text', width: `${90 - i * 10}%`, height: 16 }} 
            sx={{ mb: 1 }}
          />
        ))}
      </Box>
      
      {showFooter && (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <AnimatedSkeleton config={{ variant: 'rectangular', width: 80, height: 32 }} />
          <AnimatedSkeleton config={{ variant: 'rectangular', width: 100, height: 32 }} />
        </Box>
      )}
    </Card>
  );
};

export default {
  AnimatedSkeleton,
  DashboardSkeleton,
  CanvasSkeleton,
  TeamSkeleton,
  AnalyticsSkeleton,
  ListItemSkeleton,
  CardSkeleton,
};
