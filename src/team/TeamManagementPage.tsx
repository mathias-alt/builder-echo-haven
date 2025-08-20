import * as React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Divider,
  InputAdornment,
  Menu,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Alert,
  Badge,
  Fab,
} from '@mui/material';
import {
  Search,
  FilterList,
  ViewModule,
  ViewList,
  PersonAdd,
  MoreVert,
  Edit,
  Delete,
  Email,
  DownloadDone,
  Sort,
  SortByAlpha,
  Schedule,
  AdminPanelSettings,
  Person,
  Visibility,
  Clear,
  Timeline,
} from '@mui/icons-material';
import TeamMemberCard from './components/TeamMemberCard';
import InviteTeamMemberDialog from './components/InviteTeamMemberDialog';
import { TeamMember, PendingInvitation, TeamActivity, ViewMode, TeamFilters, TeamSort } from './types';

// Mock data
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'admin',
    department: 'Product',
    joinedAt: new Date('2023-01-15'),
    lastActive: new Date(),
    status: 'active',
    permissions: ['admin'],
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    role: 'member',
    department: 'Design',
    joinedAt: new Date('2023-03-20'),
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'active',
    permissions: ['canvas_edit'],
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    role: 'member',
    department: 'Business',
    joinedAt: new Date('2023-02-10'),
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'active',
    permissions: ['canvas_edit'],
  },
  {
    id: '4',
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@company.com',
    role: 'viewer',
    department: 'Marketing',
    joinedAt: new Date('2023-05-01'),
    lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'inactive',
    permissions: ['canvas_view'],
  },
];

const mockPendingInvitations: PendingInvitation[] = [
  {
    id: '1',
    email: 'john.doe@company.com',
    role: 'member',
    invitedBy: 'Sarah Johnson',
    invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'pending',
  },
  {
    id: '2',
    email: 'lisa.park@company.com',
    role: 'admin',
    invitedBy: 'Sarah Johnson',
    invitedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    status: 'pending',
  },
];

export default function TeamManagementPage() {
  const theme = useTheme();
  const [viewMode, setViewMode] = React.useState<ViewMode>('cards');
  const [selectedMembers, setSelectedMembers] = React.useState<string[]>([]);
  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false);
  const [bulkActionsAnchor, setBulkActionsAnchor] = React.useState<null | HTMLElement>(null);
  const [showActivityTimeline, setShowActivityTimeline] = React.useState(false);

  const [filters, setFilters] = React.useState<TeamFilters>({
    search: '',
    role: 'all',
    status: 'all',
    department: 'all',
  });

  const [sort, setSort] = React.useState<TeamSort>({
    field: 'name',
    order: 'asc',
  });

  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>(mockTeamMembers);
  const [pendingInvitations, setPendingInvitations] = React.useState<PendingInvitation[]>(mockPendingInvitations);

  React.useEffect(() => {
    document.title = 'Team Management - Flourishing Business Canvas';
  }, []);

  const departments = Array.from(new Set(teamMembers.map(m => m.department).filter(Boolean)));

  const filteredMembers = React.useMemo(() => {
    let filtered = teamMembers.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           member.email.toLowerCase().includes(filters.search.toLowerCase());
      const matchesRole = filters.role === 'all' || member.role === filters.role;
      const matchesStatus = filters.status === 'all' || member.status === filters.status;
      const matchesDepartment = filters.department === 'all' || member.department === filters.department;

      return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sort.field) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'role':
          aValue = a.role;
          bValue = b.role;
          break;
        case 'joinedAt':
          aValue = a.joinedAt.getTime();
          bValue = b.joinedAt.getTime();
          break;
        case 'lastActive':
          aValue = a.lastActive.getTime();
          bValue = b.lastActive.getTime();
          break;
        default:
          return 0;
      }

      if (sort.order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [teamMembers, filters, sort]);

  const handleMemberSelect = (memberId: string, selected: boolean) => {
    setSelectedMembers(prev => 
      selected 
        ? [...prev, memberId]
        : prev.filter(id => id !== memberId)
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(m => m.id));
    }
  };

  const handleInvite = () => {
    navigate('/invite');
  };

  const handleBulkDelete = () => {
    setTeamMembers(prev => prev.filter(m => !selectedMembers.includes(m.id)));
    setSelectedMembers([]);
    setBulkActionsAnchor(null);
  };

  const handleBulkRoleChange = (newRole: TeamMember['role']) => {
    setTeamMembers(prev => prev.map(m => 
      selectedMembers.includes(m.id) ? { ...m, role: newRole } : m
    ));
    setSelectedMembers([]);
    setBulkActionsAnchor(null);
  };

  const getRoleColor = (role: TeamMember['role']) => {
    switch (role) {
      case 'admin': return theme.palette.error.main;
      case 'member': return theme.palette.primary.main;
      case 'viewer': return theme.palette.grey[500];
    }
  };

  const getRoleIcon = (role: TeamMember['role']) => {
    switch (role) {
      case 'admin': return <AdminPanelSettings sx={{ fontSize: 16 }} />;
      case 'member': return <Person sx={{ fontSize: 16 }} />;
      case 'viewer': return <Visibility sx={{ fontSize: 16 }} />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Team Management
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Manage your team members, roles, and permissions
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {teamMembers.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Total Members
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {pendingInvitations.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Pending Invites
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'error.main' }}>
                  {teamMembers.filter(m => m.role === 'admin').length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Admins
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {teamMembers.filter(m => m.status === 'active').length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Active Members
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Pending Invitations */}
        {pendingInvitations.length > 0 && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Pending Invitations ({pendingInvitations.length})
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {pendingInvitations.map((invitation) => (
                  <Box
                    key={invitation.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      backgroundColor: alpha(theme.palette.warning.main, 0.05),
                      borderRadius: 1,
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Email sx={{ color: 'warning.main' }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {invitation.email}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Invited by {invitation.invitedBy} • {invitation.invitedAt.toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip
                        label={invitation.role}
                        icon={getRoleIcon(invitation.role)}
                        size="small"
                        sx={{ backgroundColor: getRoleColor(invitation.role), color: 'white' }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined">
                        Resend
                      </Button>
                      <Button size="small" variant="outlined" color="error">
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Search */}
              <TextField
                placeholder="Search members..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: filters.search && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setFilters(prev => ({ ...prev, search: '' }))}>
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 300 }}
              />

              {/* Filters */}
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={filters.role}
                  label="Role"
                  onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value as any }))}
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="member">Member</MenuItem>
                  <MenuItem value="viewer">Viewer</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>

              {departments.length > 0 && (
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={filters.department}
                    label="Department"
                    onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                  >
                    <MenuItem value="all">All Departments</MenuItem>
                    {departments.map(dept => (
                      <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <Box sx={{ flex: 1 }} />

              {/* View Toggle */}
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, newView) => newView && setViewMode(newView)}
                size="small"
              >
                <ToggleButton value="cards">
                  <ViewModule />
                </ToggleButton>
                <ToggleButton value="table">
                  <ViewList />
                </ToggleButton>
              </ToggleButtonGroup>

              {/* Bulk Actions */}
              {selectedMembers.length > 0 && (
                <Button
                  variant="outlined"
                  startIcon={<MoreVert />}
                  onClick={(e) => setBulkActionsAnchor(e.currentTarget)}
                >
                  {selectedMembers.length} Selected
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Members Grid/List */}
        <Box sx={{ mb: 3 }}>
          {selectedMembers.length > 0 && (
            <Alert
              severity="info"
              sx={{ mb: 2 }}
              action={
                <Button size="small" onClick={() => setSelectedMembers([])}>
                  Clear Selection
                </Button>
              }
            >
              {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
            </Alert>
          )}

          <Grid container spacing={3}>
            {filteredMembers.map((member) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={member.id}>
                <TeamMemberCard
                  member={member}
                  isSelected={selectedMembers.includes(member.id)}
                  onSelect={handleMemberSelect}
                  showCheckbox={true}
                  onEdit={(member) => console.log('Edit:', member)}
                  onDelete={(member) => console.log('Delete:', member)}
                  onChangeRole={(member, role) => console.log('Change role:', member, role)}
                />
              </Grid>
            ))}
          </Grid>

          {filteredMembers.length === 0 && (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No team members found
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                  Try adjusting your search or filters, or invite new team members.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  onClick={() => setInviteDialogOpen(true)}
                >
                  Invite Team Members
                </Button>
              </CardContent>
            </Card>
          )}
        </Box>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          onClick={() => setInviteDialogOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
        >
          <PersonAdd />
        </Fab>

        {/* Bulk Actions Menu */}
        <Menu
          anchorEl={bulkActionsAnchor}
          open={Boolean(bulkActionsAnchor)}
          onClose={() => setBulkActionsAnchor(null)}
        >
          <MenuItem onClick={() => handleBulkRoleChange('admin')}>
            <ListItemIcon><AdminPanelSettings /></ListItemIcon>
            <ListItemText>Make Admin</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleBulkRoleChange('member')}>
            <ListItemIcon><Person /></ListItemIcon>
            <ListItemText>Make Member</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleBulkRoleChange('viewer')}>
            <ListItemIcon><Visibility /></ListItemIcon>
            <ListItemText>Make Viewer</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleBulkDelete} sx={{ color: 'error.main' }}>
            <ListItemIcon><Delete sx={{ color: 'error.main' }} /></ListItemIcon>
            <ListItemText>Remove Members</ListItemText>
          </MenuItem>
        </Menu>

        {/* Invite Dialog */}
        <InviteTeamMemberDialog
          open={inviteDialogOpen}
          onClose={() => setInviteDialogOpen(false)}
          onInvite={handleInvite}
          departments={departments}
        />
      </Container>
    </Box>
  );
}
