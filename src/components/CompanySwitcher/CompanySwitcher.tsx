import * as React from 'react';
import {
  Box,
  Button,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  TextField,
  InputAdornment,
  Divider,
  Chip,
  CircularProgress,
  useTheme,
  alpha,
  Fade,
  Slide,
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Badge,
} from '@mui/material';
import {
  ExpandMore,
  Search,
  Add,
  Business,
  Check,
  Close,
  AdminPanelSettings,
  Person,
  Visibility,
  Star,
} from '@mui/icons-material';
import { UserCompany, CompanySwitcherProps, CompanySwitcherState } from './types';

const getRoleIcon = (role: UserCompany['role']) => {
  switch (role) {
    case 'owner':
    case 'admin':
      return <AdminPanelSettings sx={{ fontSize: 16 }} />;
    case 'member':
      return <Person sx={{ fontSize: 16 }} />;
    case 'viewer':
      return <Visibility sx={{ fontSize: 16 }} />;
  }
};

const getRoleColor = (role: UserCompany['role']) => {
  switch (role) {
    case 'owner':
      return '#f44336';
    case 'admin':
      return '#ff9800';
    case 'member':
      return '#2196f3';
    case 'viewer':
      return '#757575';
  }
};

const getPlanColor = (plan: UserCompany['plan']) => {
  switch (plan) {
    case 'free':
      return '#757575';
    case 'pro':
      return '#2196f3';
    case 'enterprise':
      return '#4caf50';
  }
};

export default function CompanySwitcher({
  companies,
  currentCompanyId,
  onCompanySwitch,
  onCreateCompany,
  loading = false,
  maxRecentCompanies = 3,
}: CompanySwitcherProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [state, setState] = React.useState<CompanySwitcherState>({
    open: false,
    searchQuery: '',
    switching: false,
    switchingToId: null,
  });

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const currentCompany = companies.find(c => c.id === currentCompanyId);

  // Sort companies: recent first, then alphabetical
  const sortedCompanies = React.useMemo(() => {
    const recentCompanies = companies
      .filter(c => c.lastAccessed && !c.isActive)
      .sort((a, b) => (b.lastAccessed?.getTime() || 0) - (a.lastAccessed?.getTime() || 0))
      .slice(0, maxRecentCompanies);

    const otherCompanies = companies
      .filter(c => !c.isActive && !recentCompanies.includes(c))
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      recent: recentCompanies,
      others: otherCompanies,
      current: companies.filter(c => c.isActive),
    };
  }, [companies, maxRecentCompanies]);

  // Filter companies based on search
  const filteredCompanies = React.useMemo(() => {
    if (!state.searchQuery) return sortedCompanies;

    const query = state.searchQuery.toLowerCase();
    const filterCompanies = (companyList: UserCompany[]) =>
      companyList.filter(company =>
        company.name.toLowerCase().includes(query)
      );

    return {
      recent: filterCompanies(sortedCompanies.recent),
      others: filterCompanies(sortedCompanies.others),
      current: sortedCompanies.current,
    };
  }, [sortedCompanies, state.searchQuery]);

  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setState(prev => ({ ...prev, open: !prev.open }));
  };

  const handleClose = () => {
    setAnchorEl(null);
    setState(prev => ({ ...prev, open: false, searchQuery: '' }));
  };

  const handleCompanySelect = async (companyId: string) => {
    if (companyId === currentCompanyId || state.switching) return;

    setState(prev => ({ ...prev, switching: true, switchingToId: companyId }));
    
    try {
      await onCompanySwitch(companyId);
      handleClose();
    } catch (error) {
      console.error('Failed to switch company:', error);
    } finally {
      setState(prev => ({ ...prev, switching: false, switchingToId: null }));
    }
  };

  const handleCreateCompany = () => {
    handleClose();
    onCreateCompany();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderCompanyItem = (company: UserCompany, isRecent: boolean = false) => (
    <ListItem key={company.id} disablePadding>
      <ListItemButton
        onClick={() => handleCompanySelect(company.id)}
        disabled={state.switching}
        sx={{
          borderRadius: 1,
          mx: 1,
          mb: 0.5,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
          },
          position: 'relative',
        }}
      >
        <ListItemIcon sx={{ minWidth: 48 }}>
          <Badge
            badgeContent={isRecent ? <Star sx={{ fontSize: 12 }} /> : null}
            color="warning"
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Avatar
              src={company.logo}
              sx={{
                width: 32,
                height: 32,
                backgroundColor: theme.palette.primary.main,
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {!company.logo && getInitials(company.name)}
            </Avatar>
          </Badge>
        </ListItemIcon>
        
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {company.name}
              </Typography>
              {company.isActive && (
                <Check sx={{ fontSize: 16, color: 'success.main' }} />
              )}
            </Box>
          }
          secondary={
            <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Chip
                label={company.role}
                icon={getRoleIcon(company.role)}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  backgroundColor: alpha(getRoleColor(company.role), 0.1),
                  color: getRoleColor(company.role),
                  '& .MuiChip-icon': {
                    color: getRoleColor(company.role),
                  },
                }}
              />
              <Chip
                label={company.plan}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  backgroundColor: alpha(getPlanColor(company.plan), 0.1),
                  color: getPlanColor(company.plan),
                }}
              />
              <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                {company.memberCount} members
              </Typography>
            </Box>
          }
          secondaryTypographyProps={{
            component: 'div'
          }}
        />

        {state.switching && state.switchingToId === company.id && (
          <CircularProgress size={16} sx={{ position: 'absolute', right: 16 }} />
        )}
      </ListItemButton>
    </ListItem>
  );

  const renderDesktopDropdown = () => (
    <Popover
      open={state.open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          width: 320,
          maxHeight: 400,
          borderRadius: 2,
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
        },
      }}
      TransitionComponent={Fade}
      transitionDuration={200}
    >
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Switch Company
        </Typography>
        
        {companies.length > 5 && (
          <TextField
            fullWidth
            size="small"
            placeholder="Search companies..."
            value={state.searchQuery}
            onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        )}
      </Box>

      <List sx={{ py: 0, maxHeight: 280, overflow: 'auto' }}>
        {/* Current Company */}
        {filteredCompanies.current.map(company => renderCompanyItem(company))}
        
        {/* Recent Companies */}
        {filteredCompanies.recent.length > 0 && (
          <>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Recent Companies
              </Typography>
            </Box>
            {filteredCompanies.recent.map(company => renderCompanyItem(company, true))}
          </>
        )}

        {/* Other Companies */}
        {filteredCompanies.others.length > 0 && (
          <>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                All Companies
              </Typography>
            </Box>
            {filteredCompanies.others.map(company => renderCompanyItem(company))}
          </>
        )}
      </List>

      <Divider />
      <Box sx={{ p: 1 }}>
        <ListItemButton
          onClick={handleCreateCompany}
          sx={{
            borderRadius: 1,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
          }}
        >
          <ListItemIcon>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              <Add sx={{ fontSize: 20 }} />
            </Avatar>
          </ListItemIcon>
          <ListItemText
            primary="Create New Company"
            primaryTypographyProps={{
              variant: 'body2',
              fontWeight: 500,
              color: 'primary.main',
            }}
          />
        </ListItemButton>
      </Box>
    </Popover>
  );

  const renderMobileDialog = () => (
    <Dialog
      open={state.open}
      onClose={handleClose}
      fullScreen
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' } as any}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Switch Company
        </Typography>
        <IconButton onClick={handleClose} edge="end">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ px: 0 }}>
        {companies.length > 3 && (
          <Box sx={{ px: 3, mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search companies..."
              value={state.searchQuery}
              onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        <List sx={{ pt: 0 }}>
          {/* Current Company */}
          {filteredCompanies.current.map(company => renderCompanyItem(company))}
          
          {/* Recent Companies */}
          {filteredCompanies.recent.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ px: 3, pb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Recent Companies
                </Typography>
              </Box>
              {filteredCompanies.recent.map(company => renderCompanyItem(company, true))}
            </>
          )}

          {/* Other Companies */}
          {filteredCompanies.others.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ px: 3, pb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  All Companies
                </Typography>
              </Box>
              {filteredCompanies.others.map(company => renderCompanyItem(company))}
            </>
          )}

          <Divider sx={{ my: 2 }} />
          <ListItem>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Add />}
              onClick={handleCreateCompany}
              size="large"
              sx={{
                py: 2,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Create New Company
            </Button>
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );

  if (!currentCompany) return null;

  return (
    <>
      <Button
        onClick={handleToggle}
        disabled={loading || state.switching}
        sx={{
          color: 'inherit',
          textTransform: 'none',
          borderRadius: 2,
          px: 2,
          py: 1,
          '&:hover': {
            backgroundColor: alpha(theme.palette.action.hover, 0.05),
          },
        }}
        endIcon={
          loading || state.switching ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <ExpandMore
              sx={{
                transform: state.open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          )
        }
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src={currentCompany.logo}
            sx={{
              width: 24,
              height: 24,
              backgroundColor: theme.palette.primary.main,
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            {!currentCompany.logo && getInitials(currentCompany.name)}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {currentCompany.name}
          </Typography>
        </Box>
      </Button>

      {isMobile ? renderMobileDialog() : renderDesktopDropdown()}
    </>
  );
}
