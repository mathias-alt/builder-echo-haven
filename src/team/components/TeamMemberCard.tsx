import * as React from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useTheme,
  alpha,
  Checkbox,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  MoreVert,
  AdminPanelSettings,
  Person,
  Visibility,
  Edit,
  Delete,
  Email,
  CalendarToday,
  Schedule,
  Circle,
} from '@mui/icons-material';
import { TeamMember } from '../types';

interface TeamMemberCardProps {
  member: TeamMember;
  isSelected?: boolean;
  onSelect?: (memberId: string, selected: boolean) => void;
  onEdit?: (member: TeamMember) => void;
  onDelete?: (member: TeamMember) => void;
  onChangeRole?: (member: TeamMember, newRole: TeamMember['role']) => void;
  onSendMessage?: (member: TeamMember) => void;
  showCheckbox?: boolean;
}

const getRoleConfig = (role: TeamMember['role']) => {
  switch (role) {
    case 'admin':
      return {
        label: 'Admin',
        color: 'error' as const,
        icon: <AdminPanelSettings sx={{ fontSize: 14 }} />,
      };
    case 'member':
      return {
        label: 'Member',
        color: 'primary' as const,
        icon: <Person sx={{ fontSize: 14 }} />,
      };
    case 'viewer':
      return {
        label: 'Viewer',
        color: 'default' as const,
        icon: <Visibility sx={{ fontSize: 14 }} />,
      };
  }
};

const getStatusColor = (status: TeamMember['status']) => {
  switch (status) {
    case 'active':
      return '#4caf50';
    case 'inactive':
      return '#f44336';
    case 'pending':
      return '#ff9800';
  }
};

export default function TeamMemberCard({
  member,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onChangeRole,
  onSendMessage,
  showCheckbox = false,
}: TeamMemberCardProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const roleConfig = getRoleConfig(member.role);
  const statusColor = getStatusColor(member.status);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRoleChange = (newRole: TeamMember['role']) => {
    onChangeRole?.(member, newRole);
    handleMenuClose();
  };

  const handleCardClick = () => {
    if (showCheckbox && onSelect) {
      onSelect(member.id, !isSelected);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        position: 'relative',
        cursor: showCheckbox ? 'pointer' : 'default',
        border: isSelected ? `2px solid ${theme.palette.primary.main}` : '1px solid',
        borderColor: isSelected ? theme.palette.primary.main : theme.palette.divider,
        backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
        '&:hover': {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
        },
        transition: 'all 0.2s ease',
      }}
    >
      {showCheckbox && (
        <Checkbox
          checked={isSelected}
          onChange={(e) => onSelect?.(member.id, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1,
          }}
        />
      )}

      <CardContent sx={{ p: 3, pb: '24px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Circle 
                sx={{ 
                  fontSize: 12, 
                  color: statusColor,
                  backgroundColor: 'white',
                  borderRadius: '50%',
                }} 
              />
            }
          >
            <Avatar
              src={member.avatar}
              sx={{
                width: 56,
                height: 56,
                backgroundColor: theme.palette.primary.main,
                fontSize: '1.25rem',
                fontWeight: 600,
              }}
            >
              {member.avatar ? null : getInitials(member.name)}
            </Avatar>
          </Badge>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {member.name}
              </Typography>
              <Chip
                label={roleConfig.label}
                icon={roleConfig.icon}
                size="small"
                color={roleConfig.color}
                variant="outlined"
                sx={{ height: 24, fontSize: '0.7rem' }}
              />
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {member.email}
            </Typography>

            {member.department && (
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  fontSize: '0.7rem',
                }}
              >
                {member.department}
              </Typography>
            )}
          </Box>

          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{ alignSelf: 'flex-start' }}
          >
            <MoreVert />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 2, fontSize: '0.75rem' }}>
          <Tooltip title="Joined date">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
              <CalendarToday sx={{ fontSize: 12 }} />
              <Typography variant="caption">
                {member.joinedAt.toLocaleDateString()}
              </Typography>
            </Box>
          </Tooltip>

          <Tooltip title="Last active">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
              <Schedule sx={{ fontSize: 12 }} />
              <Typography variant="caption">
                {formatLastActive(member.lastActive)}
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      </CardContent>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => { onEdit?.(member); handleMenuClose(); }}>
          <Edit sx={{ mr: 1, fontSize: 18 }} />
          Edit Profile
        </MenuItem>
        
        <MenuItem onClick={() => { onSendMessage?.(member); handleMenuClose(); }}>
          <Email sx={{ mr: 1, fontSize: 18 }} />
          Send Message
        </MenuItem>

        {/* Role Change Options */}
        {member.role !== 'admin' && (
          <MenuItem onClick={() => handleRoleChange('admin')}>
            <AdminPanelSettings sx={{ mr: 1, fontSize: 18 }} />
            Make Admin
          </MenuItem>
        )}
        
        {member.role !== 'member' && (
          <MenuItem onClick={() => handleRoleChange('member')}>
            <Person sx={{ mr: 1, fontSize: 18 }} />
            Make Member
          </MenuItem>
        )}
        
        {member.role !== 'viewer' && (
          <MenuItem onClick={() => handleRoleChange('viewer')}>
            <Visibility sx={{ mr: 1, fontSize: 18 }} />
            Make Viewer
          </MenuItem>
        )}

        <MenuItem 
          onClick={() => { onDelete?.(member); handleMenuClose(); }}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1, fontSize: 18 }} />
          Remove Member
        </MenuItem>
      </Menu>
    </Card>
  );
}
