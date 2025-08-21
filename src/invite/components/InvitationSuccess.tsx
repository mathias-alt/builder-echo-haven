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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle,
  Email,
  Schedule,
  Person,
  Share,
  ContentCopy,
  Refresh,
  Dashboard,
  Send,
} from '@mui/icons-material';

interface InvitationSuccessProps {
  inviteeEmail: string;
  inviteeRole: 'admin' | 'member' | 'viewer';
  invitationLink?: string;
  onSendAnother: () => void;
  onBackToDashboard: () => void;
  companyName?: string;
}

const roleConfig = {
  admin: { label: 'Admin', color: '#f44336' },
  member: { label: 'Member', color: '#2196f3' },
  viewer: { label: 'Viewer', color: '#757575' },
};

export default function InvitationSuccess({
  inviteeEmail,
  inviteeRole,
  invitationLink,
  onSendAnother,
  onBackToDashboard,
  companyName = 'Flourishing Business Canvas',
}: InvitationSuccessProps) {
  const theme = useTheme();
  const [copied, setCopied] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleCopyLink = async () => {
    if (invitationLink) {
      try {
        await navigator.clipboard.writeText(invitationLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Handle copy link error
      }
    }
  };

  const nextSteps = [
    {
      icon: <Email sx={{ color: theme.palette.primary.main }} />,
      primary: 'Email sent successfully',
      secondary: `Invitation delivered to ${inviteeEmail}`,
    },
    {
      icon: <Schedule sx={{ color: theme.palette.warning.main }} />,
      primary: 'Waiting for response',
      secondary: 'They have 7 days to accept the invitation',
    },
    {
      icon: <Person sx={{ color: theme.palette.success.main }} />,
      primary: 'Team member joins',
      secondary: `They'll be added to your team as a ${roleConfig[inviteeRole].label}`,
    },
  ];

  return (
    <Fade in timeout={500}>
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        {/* Success Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: theme.palette.success.main,
              mx: 'auto',
              mb: 2,
            }}
          >
            <CheckCircle sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Invitation Sent!
          </Typography>
          
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
            We've sent an invitation to <strong>{inviteeEmail}</strong> to join your team.
          </Typography>

          {/* Progress Bar */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
              Sending invitation...
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.success.main, 0.2),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: theme.palette.success.main,
                },
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
              {progress === 100 ? '✓ Complete' : `${Math.round(progress)}% complete`}
            </Typography>
          </Box>
        </Box>

        {/* Invitation Details */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Invitation Details
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Invitee:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {inviteeEmail}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Role:
              </Typography>
              <Chip
                label={roleConfig[inviteeRole].label}
                size="small"
                sx={{
                  backgroundColor: roleConfig[inviteeRole].color,
                  color: 'white',
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Expires:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Status:
              </Typography>
              <Chip
                label="Pending"
                size="small"
                color="warning"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>

        {/* Share Invitation Link */}
        {invitationLink && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Share Invitation Link
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                You can also share this direct link with the invitee:
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  p: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    fontFamily: 'monospace',
                    wordBreak: 'break-all',
                    color: theme.palette.primary.main,
                  }}
                >
                  {invitationLink}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={copied ? <CheckCircle /> : <ContentCopy />}
                  onClick={handleCopyLink}
                  sx={{ flexShrink: 0 }}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </Box>
              
              <Button
                variant="outlined"
                startIcon={<Share />}
                fullWidth
                sx={{ textTransform: 'none' }}
              >
                Share via Other Apps
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              What happens next?
            </Typography>
            
            <List sx={{ p: 0 }}>
              {nextSteps.map((step, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {step.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={step.primary}
                      secondary={step.secondary}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItem>
                  {index < nextSteps.length - 1 && <Divider sx={{ my: 1 }} />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            variant="outlined"
            startIcon={<Send />}
            onClick={onSendAnother}
            fullWidth
          >
            Send Another Invitation
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Dashboard />}
            onClick={onBackToDashboard}
            fullWidth
          >
            Back to Dashboard
          </Button>
        </Box>

        {/* Additional Help */}
        <Card sx={{ mt: 3, backgroundColor: alpha(theme.palette.info.main, 0.05) }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              💡 Pro Tip
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You can track invitation status and resend expired invitations from the Team Management page.
              The invitee will receive a beautifully designed email with all the information they need to join.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
}
