import React from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  alpha,
  SvgIcon,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Search as SearchIcon,
  WifiOff as NetworkIcon,
  Storage as DataIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { EmptyStateProps } from '../types';
import { floatAnimation, fadeInAnimation } from '../animations';

// SVG Illustrations for different empty states
const CanvasIllustration: React.FC<{ size?: number }> = ({ size = 200 }) => {
  const theme = useTheme();
  
  return (
    <SvgIcon
      sx={{
        width: size,
        height: size,
        animation: `${floatAnimation} 3s ease-in-out infinite`,
      }}
      viewBox="0 0 200 200"
    >
      {/* Canvas grid background */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={alpha(theme.palette.primary.main, 0.1)} strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#grid)" />
      
      {/* Canvas frame */}
      <rect
        x="20"
        y="20"
        width="160"
        height="160"
        fill="none"
        stroke={theme.palette.primary.main}
        strokeWidth="3"
        rx="8"
      />
      
      {/* Empty sections */}
      {[
        { x: 30, y: 30, w: 45, h: 45 },
        { x: 80, y: 30, w: 45, h: 45 },
        { x: 130, y: 30, w: 45, h: 45 },
        { x: 30, y: 80, w: 45, h: 45 },
        { x: 80, y: 80, w: 45, h: 45 },
        { x: 130, y: 80, w: 45, h: 45 },
        { x: 30, y: 130, w: 45, h: 45 },
        { x: 80, y: 130, w: 45, h: 45 },
        { x: 130, y: 130, w: 45, h: 45 },
      ].map((section, i) => (
        <rect
          key={i}
          x={section.x}
          y={section.y}
          width={section.w}
          height={section.h}
          fill={alpha(theme.palette.grey[300], 0.3)}
          stroke={alpha(theme.palette.grey[400], 0.5)}
          strokeWidth="1"
          rx="4"
        />
      ))}
      
      {/* Plus icon in center */}
      <circle
        cx="100"
        cy="100"
        r="15"
        fill={theme.palette.primary.main}
        opacity="0.8"
      />
      <path
        d="M 95 100 L 105 100 M 100 95 L 100 105"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
};

const TeamIllustration: React.FC<{ size?: number }> = ({ size = 200 }) => {
  const theme = useTheme();
  
  return (
    <SvgIcon
      sx={{
        width: size,
        height: size,
        animation: `${floatAnimation} 3s ease-in-out infinite`,
      }}
      viewBox="0 0 200 200"
    >
      {/* Table/workspace */}
      <ellipse
        cx="100"
        cy="150"
        rx="80"
        ry="20"
        fill={alpha(theme.palette.grey[300], 0.4)}
      />
      
      {/* Empty chairs around table */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * 90 - 45) * (Math.PI / 180);
        const x = 100 + Math.cos(angle) * 60;
        const y = 130 + Math.sin(angle) * 30;
        
        return (
          <g key={i}>
            {/* Chair */}
            <rect
              x={x - 8}
              y={y - 10}
              width="16"
              height="20"
              fill={alpha(theme.palette.grey[400], 0.6)}
              rx="2"
            />
            {/* Chair back */}
            <rect
              x={x - 6}
              y={y - 15}
              width="12"
              height="8"
              fill={alpha(theme.palette.grey[500], 0.6)}
              rx="1"
            />
          </g>
        );
      })}
      
      {/* Question mark in center */}
      <circle
        cx="100"
        cy="100"
        r="25"
        fill={alpha(theme.palette.primary.main, 0.1)}
        stroke={theme.palette.primary.main}
        strokeWidth="2"
        strokeDasharray="4,4"
      />
      <text
        x="100"
        y="110"
        textAnchor="middle"
        fontSize="24"
        fill={theme.palette.primary.main}
        fontWeight="bold"
      >
        ?
      </text>
    </SvgIcon>
  );
};

const AnalyticsIllustration: React.FC<{ size?: number }> = ({ size = 200 }) => {
  const theme = useTheme();
  
  return (
    <SvgIcon
      sx={{
        width: size,
        height: size,
        animation: `${floatAnimation} 3s ease-in-out infinite`,
      }}
      viewBox="0 0 200 200"
    >
      {/* Chart background */}
      <rect
        x="30"
        y="30"
        width="140"
        height="120"
        fill={alpha(theme.palette.grey[100], 0.5)}
        stroke={alpha(theme.palette.grey[300], 0.7)}
        strokeWidth="1"
        rx="8"
      />
      
      {/* Empty chart axes */}
      <line
        x1="50"
        y1="140"
        x2="160"
        y2="140"
        stroke={alpha(theme.palette.grey[400], 0.8)}
        strokeWidth="2"
      />
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="140"
        stroke={alpha(theme.palette.grey[400], 0.8)}
        strokeWidth="2"
      />
      
      {/* Grid lines */}
      {[60, 80, 100, 120].map((y) => (
        <line
          key={y}
          x1="50"
          y1={y}
          x2="160"
          y2={y}
          stroke={alpha(theme.palette.grey[300], 0.4)}
          strokeWidth="1"
          strokeDasharray="2,2"
        />
      ))}
      
      {/* Empty data points */}
      {[70, 90, 110, 130, 150].map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy={120 - i * 5}
          r="3"
          fill={alpha(theme.palette.grey[400], 0.4)}
        />
      ))}
      
      {/* No data icon */}
      <circle
        cx="105"
        cy="95"
        r="20"
        fill={alpha(theme.palette.info.main, 0.1)}
        stroke={theme.palette.info.main}
        strokeWidth="2"
        strokeDasharray="3,3"
      />
      <path
        d="M 95 95 L 115 95 M 105 85 L 105 105"
        stroke={theme.palette.info.main}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </SvgIcon>
  );
};

const SearchIllustration: React.FC<{ size?: number }> = ({ size = 200 }) => {
  const theme = useTheme();
  
  return (
    <SvgIcon
      sx={{
        width: size,
        height: size,
        animation: `${floatAnimation} 3s ease-in-out infinite`,
      }}
      viewBox="0 0 200 200"
    >
      {/* Magnifying glass */}
      <circle
        cx="85"
        cy="85"
        r="40"
        fill="none"
        stroke={theme.palette.primary.main}
        strokeWidth="4"
      />
      <line
        x1="115"
        y1="115"
        x2="140"
        y2="140"
        stroke={theme.palette.primary.main}
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Empty results lines */}
      {[50, 70, 90, 110, 130].map((y, i) => (
        <g key={i}>
          <rect
            x="160"
            y={y}
            width={60 - i * 8}
            height="8"
            fill={alpha(theme.palette.grey[300], 0.6)}
            rx="4"
          />
        </g>
      ))}
      
      {/* No results indicator */}
      <text
        x="85"
        y="90"
        textAnchor="middle"
        fontSize="20"
        fill={alpha(theme.palette.text.secondary, 0.7)}
        fontWeight="300"
      >
        ∅
      </text>
    </SvgIcon>
  );
};

const NetworkIllustration: React.FC<{ size?: number }> = ({ size = 200 }) => {
  const theme = useTheme();
  
  return (
    <SvgIcon
      sx={{
        width: size,
        height: size,
        animation: `${floatAnimation} 3s ease-in-out infinite`,
      }}
      viewBox="0 0 200 200"
    >
      {/* Disconnected network nodes */}
      {[
        { x: 60, y: 60 },
        { x: 140, y: 60 },
        { x: 60, y: 140 },
        { x: 140, y: 140 },
        { x: 100, y: 100 },
      ].map((node, i) => (
        <g key={i}>
          <circle
            cx={node.x}
            cy={node.y}
            r="15"
            fill={alpha(theme.palette.grey[300], 0.6)}
            stroke={alpha(theme.palette.grey[400], 0.8)}
            strokeWidth="2"
          />
          {/* Broken connection lines */}
          {i < 4 && (
            <line
              x1={node.x}
              y1={node.y}
              x2={node.x + (100 - node.x) * 0.3}
              y2={node.y + (100 - node.y) * 0.3}
              stroke={alpha(theme.palette.error.main, 0.5)}
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
        </g>
      ))}
      
      {/* WiFi off icon in center */}
      <NetworkIcon
        sx={{
          position: 'absolute',
          fontSize: 30,
          color: theme.palette.error.main,
          opacity: 0.7,
        }}
        style={{
          transform: 'translate(85px, 85px)',
        }}
      />
    </SvgIcon>
  );
};

// Main EmptyState component
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  illustration = 'canvas',
  customIllustration,
  action,
  secondaryAction,
  className,
  sx,
}) => {
  const theme = useTheme();

  const getIllustration = () => {
    if (customIllustration) {
      return customIllustration;
    }

    switch (illustration) {
      case 'team':
        return <TeamIllustration />;
      case 'analytics':
        return <AnalyticsIllustration />;
      case 'search':
        return <SearchIllustration />;
      case 'network':
        return <NetworkIllustration />;
      case 'data':
        return <DataIcon sx={{ fontSize: 200, color: alpha(theme.palette.grey[400], 0.5) }} />;
      case 'canvas':
      default:
        return <CanvasIllustration />;
    }
  };

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 4,
        minHeight: 400,
        animation: `${fadeInAnimation} 0.6s ease-out`,
        ...sx,
      }}
    >
      {/* Illustration */}
      <Box
        sx={{
          mb: 4,
          opacity: 0.8,
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            opacity: 1,
          },
        }}
      >
        {getIllustration()}
      </Box>

      {/* Title */}
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: 2,
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          maxWidth: 400,
          lineHeight: 1.6,
          mb: action || secondaryAction ? 4 : 0,
        }}
      >
        {description}
      </Typography>

      {/* Actions */}
      {(action || secondaryAction) && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
          }}
        >
          {action && (
            <Button
              variant={action.variant || 'contained'}
              onClick={action.onClick}
              startIcon={action.icon ? <action.icon /> : undefined}
              sx={{
                minWidth: 140,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || 'outlined'}
              onClick={secondaryAction.onClick}
              startIcon={secondaryAction.icon ? <secondaryAction.icon /> : undefined}
              sx={{
                minWidth: 140,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              {secondaryAction.label}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

// Predefined empty states for common scenarios
export const EmptyCanvasState: React.FC<{ onCreateCanvas?: () => void }> = ({
  onCreateCanvas,
}) => (
  <EmptyState
    title="Your canvas is waiting"
    description="Start building your business model by adding sticky notes to the canvas sections. Each section represents a key component of your business strategy."
    illustration="canvas"
    action={{
      label: "Add First Note",
      onClick: onCreateCanvas || (() => {}),
      variant: "contained",
      icon: AddIcon,
    }}
  />
);

export const EmptyTeamState: React.FC<{ onInviteTeam?: () => void }> = ({
  onInviteTeam,
}) => (
  <EmptyState
    title="Build your team"
    description="Collaborate with your team members to create better business models. Invite colleagues to join your workspace and work together."
    illustration="team"
    action={{
      label: "Invite Team Members",
      onClick: onInviteTeam || (() => {}),
      variant: "contained",
      icon: PeopleIcon,
    }}
  />
);

export const EmptyAnalyticsState: React.FC<{ onRefresh?: () => void }> = ({
  onRefresh,
}) => (
  <EmptyState
    title="No data to analyze yet"
    description="Start using your business canvas to generate insights and analytics. Your activity and progress will appear here as you work."
    illustration="analytics"
    action={{
      label: "Refresh Data",
      onClick: onRefresh || (() => {}),
      variant: "contained",
      icon: RefreshIcon,
    }}
    secondaryAction={{
      label: "Go to Canvas",
      onClick: () => window.location.href = '/canvas',
      variant: "outlined",
      icon: DashboardIcon,
    }}
  />
);

export const EmptySearchState: React.FC<{ searchTerm?: string; onClearSearch?: () => void }> = ({
  searchTerm,
  onClearSearch,
}) => (
  <EmptyState
    title={`No results for "${searchTerm}"`}
    description="Try adjusting your search terms or filters. You can also browse all items or create new content."
    illustration="search"
    action={{
      label: "Clear Search",
      onClick: onClearSearch || (() => {}),
      variant: "outlined",
      icon: SearchIcon,
    }}
  />
);

export const OfflineEmptyState: React.FC<{ onRetry?: () => void }> = ({
  onRetry,
}) => (
  <EmptyState
    title="You're offline"
    description="Check your internet connection and try again. Your work is saved locally and will sync when you're back online."
    illustration="network"
    action={{
      label: "Try Again",
      onClick: onRetry || (() => {}),
      variant: "contained",
      icon: RefreshIcon,
    }}
  />
);

export default EmptyState;
