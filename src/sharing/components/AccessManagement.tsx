import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Button,
  TextField,
  Menu,
  MenuItem,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Grid,
  Paper
} from '@mui/material';
import {
  MoreVert,
  PersonAdd,
  Email,
  Edit,
  Delete,
  Visibility,
  Comment,
  Schedule,
  CheckCircle,
  Cancel,
  Pending
} from '@mui/icons-material';
import { ShareSettings, ShareAccess, ShareInvitation, SharePermission } from '../types';

interface AccessManagementProps {
  canvasId: string;
  settings: ShareSettings;
  onSettingsChange: (settings: Partial<ShareSettings>) => void;
}

export const AccessManagement: React.FC<AccessManagementProps> = ({
  canvasId,
  settings,
  onSettingsChange
}) => {
  const [accessList, setAccessList] = useState<ShareAccess[]>([]);
  const [invitations, setInvitations] = useState<ShareInvitation[]>([]);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePermission, setInvitePermission] = useState<SharePermission>('view');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAccess, setSelectedAccess] = useState<ShareAccess | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    setAccessList([
      {
        id: '1',
        userId: 'user1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        userAvatar: 'https://mui.com/static/images/avatar/1.jpg',
        permission: 'edit',
        grantedAt: new Date(Date.now() - 86400000 * 2),
        grantedBy: 'current-user',
        lastAccessedAt: new Date(Date.now() - 3600000),
        accessCount: 15
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        userAvatar: 'https://mui.com/static/images/avatar/2.jpg',
        permission: 'comment',
        grantedAt: new Date(Date.now() - 86400000 * 5),
        grantedBy: 'current-user',
        lastAccessedAt: new Date(Date.now() - 86400000),
        accessCount: 8
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Mike Johnson',
        userEmail: 'mike@example.com',
        permission: 'view',
        grantedAt: new Date(Date.now() - 86400000 * 10),
        grantedBy: 'current-user',
        lastAccessedAt: new Date(Date.now() - 86400000 * 3),
        accessCount: 3
      }
    ]);

    setInvitations([
      {
        id: 'inv1',
        email: 'sarah@example.com',
        permission: 'edit',
        invitedAt: new Date(Date.now() - 86400000),
        invitedBy: 'current-user',
        status: 'pending',
        expiresAt: new Date(Date.now() + 86400000 * 6)
      },
      {
        id: 'inv2',
        email: 'bob@example.com',
        permission: 'view',
        invitedAt: new Date(Date.now() - 86400000 * 3),
        invitedBy: 'current-user',
        status: 'expired',
        expiresAt: new Date(Date.now() - 86400000)
      }
    ]);
  }, [canvasId]);

  const handleInviteUser = async () => {
    if (!inviteEmail) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newInvitation: ShareInvitation = {
        id: `inv${Date.now()}`,
        email: inviteEmail,
        permission: invitePermission,
        invitedAt: new Date(),
        invitedBy: 'current-user',
        status: 'pending',
        expiresAt: new Date(Date.now() + 86400000 * 7) // 7 days
      };

      setInvitations(prev => [newInvitation, ...prev]);
      setInviteEmail('');
      setInviteDialogOpen(false);
    } catch (error) {
      // Handle invitation send error
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, access: ShareAccess) => {
    setAnchorEl(event.currentTarget);
    setSelectedAccess(access);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAccess(null);
  };

  const handleChangePermission = (accessId: string, newPermission: SharePermission) => {
    setAccessList(prev => prev.map(access => 
      access.id === accessId ? { ...access, permission: newPermission } : access
    ));
    handleMenuClose();
  };

  const handleRemoveAccess = (accessId: string) => {
    setAccessList(prev => prev.filter(access => access.id !== accessId));
    handleMenuClose();
  };

  const handleResendInvitation = (invitationId: string) => {
    setInvitations(prev => prev.map(inv => 
      inv.id === invitationId 
        ? { ...inv, status: 'pending', invitedAt: new Date(), expiresAt: new Date(Date.now() + 86400000 * 7) }
        : inv
    ));
  };

  const handleCancelInvitation = (invitationId: string) => {
    setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
  };

  const getPermissionIcon = (permission: SharePermission) => {
    switch (permission) {
      case 'view':
        return <Visibility fontSize="small" color="info" />;
      case 'comment':
        return <Comment fontSize="small" color="warning" />;
      case 'edit':
        return <Edit fontSize="small" color="error" />;
      default:
        return <Visibility fontSize="small" />;
    }
  };

  const getPermissionColor = (permission: SharePermission) => {
    switch (permission) {
      case 'view':
        return 'info';
      case 'comment':
        return 'warning';
      case 'edit':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: ShareInvitation['status']) => {
    switch (status) {
      case 'pending':
        return <Pending fontSize="small" color="warning" />;
      case 'accepted':
        return <CheckCircle fontSize="small" color="success" />;
      case 'declined':
        return <Cancel fontSize="small" color="error" />;
      case 'expired':
        return <Schedule fontSize="small" color="disabled" />;
      default:
        return <Pending fontSize="small" />;
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Recently';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">
          Access Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setInviteDialogOpen(true)}
        >
          Invite People
        </Button>
      </Box>

      {/* Access Overview */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {accessList.length}
            </Typography>
            <Typography variant="body2">
              Active Users
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {accessList.filter(a => a.permission === 'edit').length}
            </Typography>
            <Typography variant="body2">
              Editors
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {invitations.filter(i => i.status === 'pending').length}
            </Typography>
            <Typography variant="body2">
              Pending Invites
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'info.contrastText' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {accessList.reduce((sum, a) => sum + a.accessCount, 0)}
            </Typography>
            <Typography variant="body2">
              Total Views
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Current Access List */}
      <Card sx={{ mb: 3, border: 1, borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            People with Access
          </Typography>
          
          {accessList.length === 0 ? (
            <Alert severity="info">
              No one has access to this canvas yet. Invite people to collaborate!
            </Alert>
          ) : (
            <List>
              {accessList.map((access, index) => (
                <React.Fragment key={access.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar src={access.userAvatar} alt={access.userName}>
                        {access.userName.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={access.userName}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {access.userEmail}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                            <Chip
                              icon={getPermissionIcon(access.permission)}
                              label={access.permission}
                              size="small"
                              color={getPermissionColor(access.permission) as any}
                              variant="outlined"
                            />
                            <Typography variant="caption" color="text.secondary">
                              Last active: {formatRelativeTime(access.lastAccessedAt || access.grantedAt)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {access.accessCount} views
                        </Typography>
                        <IconButton
                          onClick={(e) => handleMenuClick(e, access)}
                          size="small"
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < accessList.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card sx={{ border: 1, borderColor: 'divider' }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Pending Invitations
            </Typography>
            
            <List>
              {invitations.map((invitation, index) => (
                <React.Fragment key={invitation.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <Email />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={invitation.email}
                      secondary={
                        <Box>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                            <Chip
                              icon={getPermissionIcon(invitation.permission)}
                              label={invitation.permission}
                              size="small"
                              color={getPermissionColor(invitation.permission) as any}
                              variant="outlined"
                            />
                            <Chip
                              icon={getStatusIcon(invitation.status)}
                              label={invitation.status}
                              size="small"
                              color={invitation.status === 'pending' ? 'warning' : 'default'}
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Invited {formatRelativeTime(invitation.invitedAt)}
                            {invitation.status === 'pending' && ` • Expires ${formatRelativeTime(invitation.expiresAt)}`}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {invitation.status === 'pending' && (
                          <Button
                            size="small"
                            onClick={() => handleResendInvitation(invitation.id)}
                          >
                            Resend
                          </Button>
                        )}
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleCancelInvitation(invitation.id)}
                        >
                          {invitation.status === 'pending' ? 'Cancel' : 'Remove'}
                        </Button>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < invitations.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Access Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedAccess && handleChangePermission(selectedAccess.id, 'view')}>
          <Visibility sx={{ mr: 1 }} fontSize="small" />
          Change to View Only
        </MenuItem>
        <MenuItem onClick={() => selectedAccess && handleChangePermission(selectedAccess.id, 'comment')}>
          <Comment sx={{ mr: 1 }} fontSize="small" />
          Change to Comment
        </MenuItem>
        <MenuItem onClick={() => selectedAccess && handleChangePermission(selectedAccess.id, 'edit')}>
          <Edit sx={{ mr: 1 }} fontSize="small" />
          Change to Edit
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => selectedAccess && handleRemoveAccess(selectedAccess.id)}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} fontSize="small" />
          Remove Access
        </MenuItem>
      </Menu>

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invite People</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth>
            <InputLabel>Permission Level</InputLabel>
            <Select
              value={invitePermission}
              label="Permission Level"
              onChange={(e) => setInvitePermission(e.target.value as SharePermission)}
            >
              <MenuItem value="view">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Visibility fontSize="small" />
                  View Only
                </Box>
              </MenuItem>
              <MenuItem value="comment">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Comment fontSize="small" />
                  Can Comment
                </Box>
              </MenuItem>
              <MenuItem value="edit">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Edit fontSize="small" />
                  Can Edit
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleInviteUser} 
            variant="contained"
            disabled={!inviteEmail || loading}
          >
            {loading ? 'Sending...' : 'Send Invitation'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
