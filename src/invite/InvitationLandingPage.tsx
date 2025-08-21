import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  alpha,
  Avatar,
  Fade,
  Chip,
  Divider,
  Container,
  CircularProgress,
  useMediaQuery,
} from '@mui/material';
import {
  Business,
  Person,
  CheckCircle,
  Schedule,
  Security,
  Group,
  AdminPanelSettings,
  Visibility,
  Email,
  Phone,
  Error,
  Warning,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

interface InvitationData {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  inviterName: string;
  inviterEmail: string;
  companyName: string;
  companyLogo?: string;
  expiresAt: Date;
  status: 'valid' | 'expired' | 'used' | 'invalid';
  personalMessage?: string;
}

const roleConfig = {
  admin: {
    label: 'Admin',
    description: 'Full access to all features and team management',
    icon: <AdminPanelSettings />,
    color: '#f44336',
    permissions: ['Manage team members', 'Edit all canvases', 'View analytics', 'Billing access'],
  },
  member: {
    label: 'Member',
    description: 'Can create and edit canvases, collaborate with team',
    icon: <Person />,
    color: '#2196f3',
    permissions: ['Create canvases', 'Edit own canvases', 'Collaborate with team', 'Add comments'],
  },
  viewer: {
    label: 'Viewer',
    description: 'Can view and comment on canvases, no editing access',
    icon: <Visibility />,
    color: '#757575',
    permissions: ['View all canvases', 'Add comments', 'Export PDFs', 'Join meetings'],
  },
};

// Mock function to fetch invitation data
const fetchInvitationData = async (token: string): Promise<InvitationData | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data - in real app, this would come from your backend
  if (token === 'valid-token') {
    return {
      id: '1',
      email: 'john.doe@company.com',
      role: 'member',
      inviterName: 'Sarah Johnson',
      inviterEmail: 'sarah.johnson@company.com',
      companyName: 'Flourishing Business Canvas',
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 'valid',
      personalMessage: 'Hey John! I\'d love for you to join our team and help us with our business canvas projects. Looking forward to collaborating!',
    };
  }
  
  if (token === 'expired-token') {
    return {
      id: '2',
      email: 'expired@company.com',
      role: 'member',
      inviterName: 'Sarah Johnson',
      inviterEmail: 'sarah.johnson@company.com',
      companyName: 'Flourishing Business Canvas',
      expiresAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'expired',
    };
  }
  
  return null;
};

export default function InvitationLandingPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [loading, setLoading] = React.useState(true);
  const [invitation, setInvitation] = React.useState<InvitationData | null>(null);
  const [accepting, setAccepting] = React.useState(false);

  React.useEffect(() => {
    const loadInvitation = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const data = await fetchInvitationData(token);
        setInvitation(data);
      } catch (error) {
        // Handle invitation load error
      } finally {
        setLoading(false);
      }
    };

    loadInvitation();
  }, [token]);

  React.useEffect(() => {
    document.title = invitation 
      ? `Join ${invitation.companyName} - Invitation`
      : 'Team Invitation';
  }, [invitation]);

  const handleAcceptInvitation = async () => {
    if (!invitation) return;
    
    setAccepting(true);
    try {
      // Simulate accepting invitation
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/invite/join', { state: { invitation } });
    } catch (error) {
      // Handle invitation accept error
    } finally {
      setAccepting(false);
    }
  };

  const isExpiringSoon = invitation && 
    new Date(invitation.expiresAt).getTime() - Date.now() < 24 * 60 * 60 * 1000;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.default',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!invitation) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.default',
          p: 3,
        }}
      >
        <Card sx={{ maxWidth: 400, textAlign: 'center' }}>
          <CardContent sx={{ p: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                backgroundColor: theme.palette.error.main,
                mx: 'auto',
                mb: 2,
              }}
            >
              <Error sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Invalid Invitation
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
              This invitation link is not valid or has been removed.
            </Typography>
            <Button variant="contained" fullWidth>
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (invitation.status === 'expired') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.default',
          p: 3,
        }}
      >
        <Card sx={{ maxWidth: 400, textAlign: 'center' }}>
          <CardContent sx={{ p: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                backgroundColor: theme.palette.warning.main,
                mx: 'auto',
                mb: 2,
              }}
            >
              <Schedule sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Invitation Expired
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
              This invitation expired on {invitation.expiresAt.toLocaleDateString()}.
              Please contact {invitation.inviterName} for a new invitation.
            </Typography>
            <Button 
              variant="contained" 
              fullWidth
              startIcon={<Email />}
              href={`mailto:${invitation.inviterEmail}?subject=New invitation request&body=Hi ${invitation.inviterName}, my invitation to join ${invitation.companyName} has expired. Could you please send me a new one?`}
            >
              Request New Invitation
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const roleInfo = roleConfig[invitation.role];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        py: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="md">
        <Fade in timeout={500}>
          <Box>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: { xs: 80, sm: 100 },
                  height: { xs: 80, sm: 100 },
                  backgroundColor: theme.palette.primary.main,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Business sx={{ fontSize: { xs: 40, sm: 50 } }} />
              </Avatar>
              
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                sx={{ fontWeight: 700, mb: 1 }}
              >
                You're invited to join
              </Typography>
              
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                sx={{ 
                  fontWeight: 600, 
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              >
                {invitation.companyName}
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {invitation.inviterName} has invited you to collaborate
              </Typography>
            </Box>

            {/* Expiration Warning */}
            {isExpiringSoon && (
              <Card 
                sx={{ 
                  mb: 3, 
                  backgroundColor: alpha(theme.palette.warning.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Warning sx={{ color: 'warning.main' }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Invitation expires soon
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      This invitation expires on {invitation.expiresAt.toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Personal Message */}
            {invitation.personalMessage && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Personal Message
                  </Typography>
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: alpha(theme.palette.info.main, 0.05),
                      borderLeft: `4px solid ${theme.palette.info.main}`,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1 }}>
                      "{invitation.personalMessage}"
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      — {invitation.inviterName}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Role Information */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Your Role & Permissions
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar
                    sx={{
                      backgroundColor: roleInfo.color,
                      color: 'white',
                      width: 48,
                      height: 48,
                    }}
                  >
                    {roleInfo.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {roleInfo.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {roleInfo.description}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  What you'll be able to do:
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {roleInfo.permissions.map((permission) => (
                    <Chip
                      key={permission}
                      label={permission}
                      size="small"
                      icon={<CheckCircle />}
                      sx={{
                        backgroundColor: alpha(roleInfo.color, 0.1),
                        color: roleInfo.color,
                        '& .MuiChip-icon': {
                          color: roleInfo.color,
                        },
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  About {invitation.companyName}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        mx: 'auto',
                        mb: 1,
                      }}
                    >
                      <Group />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      12
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Team Members
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        backgroundColor: theme.palette.success.main,
                        mx: 'auto',
                        mb: 1,
                      }}
                    >
                      <Business />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      8
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Active Canvases
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        backgroundColor: theme.palette.info.main,
                        mx: 'auto',
                        mb: 1,
                      }}
                    >
                      <Security />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      100%
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Secure
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Join a collaborative workspace where teams create and manage business model canvases
                  to drive innovation and strategic planning.
                </Typography>
              </CardContent>
            </Card>

            {/* Accept Button */}
            <Card
              sx={{
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Ready to get started?
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                  Accept this invitation to join {invitation.companyName} and start collaborating
                </Typography>
                
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleAcceptInvitation}
                  disabled={accepting}
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  {accepting ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Joining...
                    </>
                  ) : (
                    `Accept Invitation & Join ${invitation.companyName}`
                  )}
                </Button>

                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 2, display: 'block' }}>
                  By accepting, you agree to the terms of service and privacy policy
                </Typography>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Questions about this invitation?
              </Typography>
              <Button
                variant="text"
                size="small"
                startIcon={<Email />}
                href={`mailto:${invitation.inviterEmail}`}
              >
                Contact {invitation.inviterName}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}
