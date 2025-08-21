import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Collapse,
  IconButton,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
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
  Comment
} from '@mui/icons-material';
import { ActivityGroup, Activity, ActivityType } from '../types';
import { ActivityItem } from './ActivityItem';

interface ActivityGroupItemProps {
  group: ActivityGroup;
  onActivityClick?: (activity: Activity) => void;
  onUserClick?: (userId: string) => void;
}

export const ActivityGroupItem: React.FC<ActivityGroupItemProps> = ({
  group,
  onActivityClick,
  onUserClick
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

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

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUserClick) {
      onUserClick(group.user.id);
    }
  };

  const getGroupDescription = () => {
    const { count, type, user } = group;
    
    if (count === 1) {
      return group.description;
    }

    switch (type) {
      case 'note_created':
        return `${user.name} created ${count} notes`;
      case 'note_updated':
        return `${user.name} updated ${count} notes`;
      case 'note_deleted':
        return `${user.name} deleted ${count} notes`;
      case 'note_moved':
        return `${user.name} moved ${count} notes`;
      case 'comment_added':
        return `${user.name} added ${count} comments`;
      case 'export_created':
        return `${user.name} created ${count} exports`;
      default:
        return `${user.name} performed ${count} ${type.replace('_', ' ')} actions`;
    }
  };

  const getUniqueTargets = () => {
    const targets = new Set();
    group.activities.forEach(activity => {
      if (activity.target.sectionId) {
        targets.add(activity.target.sectionId);
      }
    });
    return Array.from(targets) as string[];
  };

  const uniqueTargets = getUniqueTargets();

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
          cursor: group.count > 1 ? 'pointer' : 'default',
          p: 1,
          borderRadius: 1,
          '&:hover': group.count > 1 ? {
            bgcolor: alpha(theme.palette.primary.main, 0.02)
          } : {},
          border: group.count > 1 ? 1 : 0,
          borderColor: group.count > 1 ? alpha(getActivityColor(group.type), 0.2) : 'transparent'
        }}
        onClick={() => group.count > 1 && setExpanded(!expanded)}
      >
        {/* Timeline indicator */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.5 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              border: 2,
              borderColor: getActivityColor(group.type),
              cursor: 'pointer'
            }}
            src={group.user.avatar}
            onClick={handleUserClick}
          >
            {group.user.name.charAt(0)}
          </Avatar>
          
          <Box
            sx={{
              width: 2,
              height: 24,
              bgcolor: alpha(getActivityColor(group.type), 0.3),
              mt: 1
            }}
          />
        </Box>

        {/* Group content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            {getActivityIcon(group.type)}
            <Typography variant="body2" sx={{ flex: 1, fontWeight: group.count > 1 ? 500 : 400 }}>
              {getGroupDescription()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTimestamp(group.timestamp)}
            </Typography>
            {group.count > 1 && (
              <IconButton size="small">
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
          </Box>

          {/* Count and targets */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            {group.count > 1 && (
              <Chip
                label={`${group.count} activities`}
                size="small"
                variant="filled"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  bgcolor: alpha(getActivityColor(group.type), 0.1),
                  color: getActivityColor(group.type)
                }}
              />
            )}
            
            <Chip
              label={group.user.role}
              size="small"
              variant="outlined"
              sx={{
                height: 18,
                fontSize: '0.65rem',
                '& .MuiChip-label': { px: 1 }
              }}
            />
            
            {uniqueTargets.map(target => (
              <Chip
                key={target}
                label={target}
                size="small"
                variant="outlined"
                sx={{
                  height: 18,
                  fontSize: '0.65rem',
                  '& .MuiChip-label': { px: 1 }
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Expanded activities */}
      {group.count > 1 && (
        <Collapse in={expanded}>
          <Box sx={{ ml: 6, mt: 1, pl: 2, borderLeft: 2, borderColor: alpha(getActivityColor(group.type), 0.2) }}>
            {group.activities.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                onClick={onActivityClick}
                onUserClick={onUserClick}
                showCard={false}
                compact={index === group.activities.length - 1}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};
