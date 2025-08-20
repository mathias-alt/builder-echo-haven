import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Chip,
  useTheme,
  alpha,
  Autocomplete,
} from '@mui/material';
import {
  Close,
  Email,
  PersonAdd,
  AdminPanelSettings,
  Person,
  Visibility,
} from '@mui/icons-material';
import { TeamMember } from '../types';

interface InviteTeamMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onInvite: (invitations: InviteData[]) => void;
  departments?: string[];
}

interface InviteData {
  email: string;
  role: TeamMember['role'];
  department?: string;
}

const roleOptions = [
  {
    value: 'admin' as const,
    label: 'Admin',
    description: 'Full access to all features and settings',
    icon: <AdminPanelSettings />,
    color: '#f44336',
  },
  {
    value: 'member' as const,
    label: 'Member',
    description: 'Can create and edit canvases, collaborate with team',
    icon: <Person />,
    color: '#2196f3',
  },
  {
    value: 'viewer' as const,
    label: 'Viewer',
    description: 'Can view canvases but cannot edit',
    icon: <Visibility />,
    color: '#757575',
  },
];

export default function InviteTeamMemberDialog({
  open,
  onClose,
  onInvite,
  departments = [],
}: InviteTeamMemberDialogProps) {
  const theme = useTheme();
  const [invitations, setInvitations] = React.useState<InviteData[]>([
    { email: '', role: 'member' }
  ]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAddInvitation = () => {
    setInvitations(prev => [...prev, { email: '', role: 'member' }]);
  };

  const handleRemoveInvitation = (index: number) => {
    setInvitations(prev => prev.filter((_, i) => i !== index));
  };

  const handleInvitationChange = (index: number, field: keyof InviteData, value: any) => {
    setInvitations(prev => prev.map((inv, i) => 
      i === index ? { ...inv, [field]: value } : inv
    ));
  };

  const handleSubmit = async () => {
    const validInvitations = invitations.filter(inv => inv.email.trim() !== '');
    if (validInvitations.length === 0) return;

    setIsLoading(true);
    try {
      await onInvite(validInvitations);
      setInvitations([{ email: '', role: 'member' }]);
      onClose();
    } catch (error) {
      console.error('Failed to send invitations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const canSubmit = invitations.some(inv => inv.email.trim() !== '' && isValidEmail(inv.email));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAdd sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Invite Team Members
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          Add team members to collaborate on your canvases and projects
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {invitations.map((invitation, index) => (
            <Box
              key={index}
              sx={{
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.default, 0.5),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={invitation.email}
                  onChange={(e) => handleInvitationChange(index, 'email', e.target.value)}
                  error={invitation.email !== '' && !isValidEmail(invitation.email)}
                  helperText={
                    invitation.email !== '' && !isValidEmail(invitation.email)
                      ? 'Please enter a valid email address'
                      : ''
                  }
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
                
                {invitations.length > 1 && (
                  <IconButton
                    onClick={() => handleRemoveInvitation(index)}
                    sx={{ mt: 1, color: 'error.main' }}
                  >
                    <Close />
                  </IconButton>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={invitation.role}
                    label="Role"
                    onChange={(e) => handleInvitationChange(index, 'role', e.target.value)}
                  >
                    {roleOptions.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ color: role.color }}>
                            {role.icon}
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {role.label}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {role.description}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {departments.length > 0 && (
                  <Autocomplete
                    options={departments}
                    value={invitation.department || ''}
                    onChange={(_, value) => handleInvitationChange(index, 'department', value)}
                    renderInput={(params) => (
                      <TextField {...params} label="Department (Optional)" />
                    )}
                    sx={{ minWidth: 200 }}
                    freeSolo
                  />
                )}
              </Box>
            </Box>
          ))}

          <Button
            variant="outlined"
            startIcon={<PersonAdd />}
            onClick={handleAddInvitation}
            sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
          >
            Add Another Invitation
          </Button>

          {/* Role Permissions Info */}
          <Box
            sx={{
              p: 2,
              backgroundColor: alpha(theme.palette.info.main, 0.1),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Role Permissions
            </Typography>
            {roleOptions.map((role) => (
              <Box key={role.value} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Chip
                  label={role.label}
                  icon={role.icon}
                  size="small"
                  sx={{
                    backgroundColor: alpha(role.color, 0.1),
                    color: role.color,
                    minWidth: 80,
                  }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {role.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!canSubmit || isLoading}
          startIcon={<Email />}
        >
          {isLoading ? 'Sending...' : `Send ${invitations.filter(inv => inv.email).length} Invitation${invitations.filter(inv => inv.email).length !== 1 ? 's' : ''}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
