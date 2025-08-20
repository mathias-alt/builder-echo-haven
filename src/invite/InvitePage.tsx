import * as React from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  Avatar,
} from '@mui/material';
import {
  Email,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import InvitationForm from './components/InvitationForm';
import InvitationSuccess from './components/InvitationSuccess';

interface InvitationData {
  email: string;
  role: 'admin' | 'member' | 'viewer';
  personalMessage?: string;
}

export default function InvitePage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [step, setStep] = React.useState<'form' | 'success'>('form');
  const [sentInvitation, setSentInvitation] = React.useState<InvitationData | null>(null);

  React.useEffect(() => {
    document.title = 'Send Team Invitation - Flourishing Business Canvas';
  }, []);

  const handleSendInvitation = async (invitation: InvitationData) => {
    // Simulate sending invitation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store invitation data and show success
    setSentInvitation(invitation);
    setStep('success');
  };

  const handleSendAnother = () => {
    setStep('form');
    setSentInvitation(null);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleCancel = () => {
    navigate('/team');
  };

  // Generate mock invitation link
  const invitationLink = sentInvitation 
    ? `${window.location.origin}/invite/valid-token`
    : undefined;

  if (step === 'success' && sentInvitation) {
    return (
      <InvitationSuccess
        inviteeEmail={sentInvitation.email}
        inviteeRole={sentInvitation.role}
        invitationLink={invitationLink}
        onSendAnother={handleSendAnother}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: theme.palette.primary.main,
              mx: 'auto',
              mb: 2,
            }}
          >
            <Email sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Invite Team Member
          </Typography>
          
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Send a personalized invitation to join your team
          </Typography>
        </Box>

        {/* Invitation Form */}
        <InvitationForm
          onSend={handleSendInvitation}
          onCancel={handleCancel}
          companyName="Flourishing Business Canvas"
          inviterName="You"
        />
      </Container>
    </Box>
  );
}
