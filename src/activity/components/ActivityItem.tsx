import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  StickyNote2,
  Edit,
  Delete,
  DriveFileMove,
  CheckCircle,
  Dashboard,
  Share,
  PersonAdd,
  PersonRemove,
  Download,
  Comment,
  MoreVert
} from '@mui/icons-material';
import { Activity, ActivityType } from '../types';

interface ActivityItemProps {
  activity: Activity;
  onClick?: (activity: Activity) => void;
  onUserClick?: (userId: string) => void;
  showCard?: boolean;
  compact?: boolean;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  onClick,
  onUserClick,
  showCard = true,
  compact = false
}) => {
  const theme = useTheme();

  const getActivityIcon = (type: ActivityType) => {
    const iconProps = { fontSize: 'small' as const };
    
    switch (type) {
      case 'note_created':
        return <StickyNote2 {...iconProps} sx={{ color: 'success.main' }} />;
      case 'note_updated':
        return <Edit {...iconProps} sx={{ color: 'info.main' }} />;
      case 'note_deleted':
        return <Delete {...iconProps} sx={{ color: 'error.main' }} />;
      case 'note_moved':
        return <DriveFileMove {...iconProps} sx={{ color: 'warning.main' }} />;
      case 'section_completed':
        return <CheckCircle {...iconProps} sx={{ color: 'success.main' }} />;
      case 'canvas_created':
        return <Canvas {...iconProps} sx={{ color: 'primary.main' }} />;
      case 'canvas_shared':
        return <Share {...iconProps} sx={{ color: 'info.main' }} />;
      case 'team_member_added':
        return <PersonAdd {...iconProps} sx={{ color: 'success.main' }} />;
      case 'team_member_removed':
        return <PersonRemove {...iconProps} sx={{ color: 'error.main' }} />;
      case 'export_created':
        return <Download {...iconProps} sx={{ color: 'secondary.main' }} />;
      case 'comment_added':
        return <Comment {...iconProps} sx={{ color: 'info.main' }} />;
      case 'comment_deleted':
        return <Comment {...iconProps} sx={{ color: 'error.main' }} />;
      default:
        return <StickyNote2 {...iconProps} sx={{ color: 'text.secondary' }} />;
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case 'note_created':
      case 'section_completed':
      case 'team_member_added':
        return theme.palette.success.main;
      case 'note_updated':
      case 'canvas_shared':
      case 'comment_added':
        return theme.palette.info.main;
      case 'note_deleted':
      case 'team_member_removed':
      case 'comment_deleted':
        return theme.palette.error.main;
      case 'note_moved':
        return theme.palette.warning.main;
      case 'canvas_created':
        return theme.palette.primary.main;
      case 'export_created':
        return theme.palette.secondary.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return timestamp.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      ...(timestamp.getFullYear() !== now.getFullYear() && { year: 'numeric' })
    });
  };

  const handleClick = () => {
    if (onClick) {
      onClick(activity);
    }
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUserClick) {
      onUserClick(activity.user.id);
    }
  };

  const getTargetText = () => {
    const { target, metadata } = activity;
    
    switch (target.type) {
      case 'note':
        return (
          <Box component="span" sx={{ fontWeight: 500, color: 'primary.main' }}>
            "{target.name}"
          </Box>
        );
      case 'section':
        return (
          <Box component="span" sx={{ fontWeight: 500, color: 'info.main' }}>
            {target.name}
          </Box>
        );
      case 'canvas':
        return (
          <Box component="span" sx={{ fontWeight: 500, color: 'secondary.main' }}>
            {target.name}
          </Box>
        );
      default:
        return target.name;
    }
  };

  const renderActivityDescription = () => {
    const { type, user, target, metadata } = activity;
    
    switch (type) {
      case 'note_created':
        return (
          <>
            <strong>{user.name}</strong> created a note {getTargetText()}
            {target.sectionId && (
              <>
                {' '}in{' '}
                <Box component="span" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  {target.sectionId}
                </Box>
              </>
            )}
          </>
        );
      case 'note_updated':
        return (
          <>
            <strong>{user.name}</strong> updated note {getTargetText()}
          </>
        );
      case 'note_deleted':
        return (
          <>
            <strong>{user.name}</strong> deleted note {getTargetText()}
          </>
        );
      case 'note_moved':
        return (
          <>
            <strong>{user.name}</strong> moved {getTargetText()}
            {metadata?.fromSection && metadata?.toSection && (
              <>
                {' '}from{' '}
                <Box component="span" sx={{ fontWeight: 500 }}>
                  {metadata.fromSection}
                </Box>
                {' '}to{' '}
                <Box component="span" sx={{ fontWeight: 500 }}>
                  {metadata.toSection}
                </Box>
              </>
            )}
          </>
        );
      case 'section_completed':
        return (
          <>
            <strong>{user.name}</strong> completed section {getTargetText()}
          </>
        );
      case 'canvas_shared':
        return (
          <>
            <strong>{user.name}</strong> shared canvas {getTargetText()}
          </>
        );
      case 'export_created':
        return (
          <>
            <strong>{user.name}</strong> exported canvas as{' '}
            <Chip 
              label={metadata?.exportFormat?.toUpperCase() || 'Unknown'} 
              size="small" 
              variant="outlined"
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          </>
        );
      default:
        return activity.description;
    }
  };

  const content = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          bgcolor: alpha(theme.palette.primary.main, 0.02)
        } : {}
      }}
      onClick={handleClick}
    >
      {/* Timeline indicator */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.5 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            border: 2,
            borderColor: getActivityColor(activity.type),
            cursor: 'pointer'
          }}
          src={activity.user.avatar}
          onClick={handleUserClick}
        >
          {activity.user.name.charAt(0)}
        </Avatar>
        
        {!compact && (
          <Box
            sx={{
              width: 2,
              height: 24,
              bgcolor: alpha(getActivityColor(activity.type), 0.3),
              mt: 1
            }}
          />
        )}
      </Box>

      {/* Activity content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          {getActivityIcon(activity.type)}
          <Typography variant="body2" sx={{ flex: 1 }}>
            {renderActivityDescription()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatTimestamp(activity.timestamp)}
          </Typography>
        </Box>

        {/* Additional metadata */}
        {activity.metadata?.noteContent && (
          <Box sx={{ 
            bgcolor: alpha(theme.palette.grey[500], 0.1),
            borderRadius: 1,
            p: 1,
            mt: 1,
            borderLeft: 3,
            borderColor: getActivityColor(activity.type)
          }}>
            <Typography variant="caption" color="text.secondary">
              "{activity.metadata.noteContent}"
            </Typography>
          </Box>
        )}

        {/* User role chip */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Chip
            label={activity.user.role}
            size="small"
            variant="outlined"
            sx={{
              height: 18,
              fontSize: '0.65rem',
              '& .MuiChip-label': { px: 1 }
            }}
          />
          
          {activity.target.sectionId && (
            <Chip
              label={activity.target.sectionId}
              size="small"
              variant="filled"
              sx={{
                height: 18,
                fontSize: '0.65rem',
                bgcolor: alpha(getActivityColor(activity.type), 0.1),
                color: getActivityColor(activity.type),
                '& .MuiChip-label': { px: 1 }
              }}
            />
          )}
        </Box>
      </Box>

      {/* Actions */}
      <IconButton size="small" sx={{ opacity: 0.7 }}>
        <MoreVert fontSize="small" />
      </IconButton>
    </Box>
  );

  if (!showCard) {
    return <Box sx={{ py: 1 }}>{content}</Box>;
  }

  return (
    <Card 
      sx={{ 
        border: 1, 
        borderColor: 'divider',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: getActivityColor(activity.type),
          boxShadow: `0 2px 8px ${alpha(getActivityColor(activity.type), 0.1)}`
        }
      }}
    >
      <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
        {content}
      </CardContent>
    </Card>
  );
};
