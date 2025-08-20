import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  alpha,
  Avatar,
  Divider,
  Chip,
  IconButton,
  Fade,
  Slide,
  CircularProgress,
} from '@mui/material';
import {
  Email,
  Person,
  Preview,
  Send,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  AdminPanelSettings,
  Visibility,
  Business,
  Schedule,
} from '@mui/icons-material';

interface InvitationData {
  email: string;
  role: 'admin' | 'member' | 'viewer';
  personalMessage?: string;
}

interface InvitationFormProps {
  onSend: (invitation: InvitationData) => Promise<void>;
  onCancel: () => void;
  companyName?: string;
  inviterName?: string;
}

const steps = ['Details', 'Preview', 'Send'];

const roleConfig = {
  admin: {
    label: 'Admin',
    description: 'Full access to all features and team management',
    icon: <AdminPanelSettings />,
    color: '#f44336',
    permissions: ['Manage team', 'Edit all canvases', 'View analytics', 'Billing access'],
  },
  member: {
    label: 'Member',
    description: 'Can create and edit canvases, collaborate with team',
    icon: <Person />,
    color: '#2196f3',
    permissions: ['Create canvases', 'Edit own canvases', 'Collaborate', 'Comment'],
  },
  viewer: {
    label: 'Viewer',
    description: 'Can view and comment on canvases, no editing access',
    icon: <Visibility />,
    color: '#757575',
    permissions: ['View canvases', 'Add comments', 'Export PDFs'],
  },
};

export default function InvitationForm({
  onSend,
  onCancel,
  companyName = 'Flourishing Business Canvas',
  inviterName = 'Your colleague',
}: InvitationFormProps) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<InvitationData>({
    email: '',
    role: 'member',
    personalMessage: '',
  });

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0: // Details step
        return formData.email && isValidEmail(formData.email) && formData.role;
      case 1: // Preview step
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSend();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSend = async () => {
    setLoading(true);
    try {
      await onSend(formData);
    } catch (error) {
      console.error('Failed to send invitation:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderDetailsStep = () => (
    <Fade in timeout={300}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Email Input */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Who would you like to invite?
          </Typography>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            error={formData.email !== '' && !isValidEmail(formData.email)}
            helperText={
              formData.email !== '' && !isValidEmail(formData.email)
                ? 'Please enter a valid email address'
                : 'We\'ll send them an invitation to join your team'
            }
            InputProps={{
              startAdornment: (
                <Email sx={{ mr: 1, color: 'text.secondary' }} />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Role Selection */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            What role should they have?
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
            >
              {Object.entries(roleConfig).map(([key, config]) => (
                <Card
                  key={key}
                  sx={{
                    mb: 2,
                    border: formData.role === key 
                      ? `2px solid ${config.color}` 
                      : `1px solid ${theme.palette.divider}`,
                    backgroundColor: formData.role === key 
                      ? alpha(config.color, 0.05)
                      : 'background.paper',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: config.color,
                      transform: 'translateY(-1px)',
                    },
                  }}
                  onClick={() => setFormData(prev => ({ ...prev, role: key as any }))}
                >
                  <CardContent sx={{ p: 3 }}>
                    <FormControlLabel
                      value={key}
                      control={<Radio sx={{ color: config.color }} />}
                      label={
                        <Box sx={{ ml: 2, width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Box sx={{ color: config.color }}>
                              {config.icon}
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {config.label}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                            {config.description}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {config.permissions.map((permission) => (
                              <Chip
                                key={permission}
                                label={permission}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: alpha(config.color, 0.3),
                                  color: config.color,
                                  fontSize: '0.7rem',
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      }
                      sx={{ margin: 0, width: '100%' }}
                    />
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </FormControl>
        </Box>

        {/* Personal Message */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Add a personal message (optional)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Personal Message"
            value={formData.personalMessage}
            onChange={(e) => setFormData(prev => ({ ...prev, personalMessage: e.target.value }))}
            placeholder="Hey! I'd love for you to join our team..."
            helperText="This will be included in the invitation email"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Box>
      </Box>
    </Fade>
  );

  const renderPreviewStep = () => (
    <Fade in timeout={300}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Preview Invitation
        </Typography>
        
        {/* Email Preview */}
        <Card
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            backgroundColor: 'background.paper',
          }}
        >
          <Box
            sx={{
              p: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Email Preview
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              This is what {formData.email} will receive
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 3 }}>
            {/* Email Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  width: 48,
                  height: 48,
                }}
              >
                <Business />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  You're invited to join {companyName}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {inviterName} has invited you to collaborate
                </Typography>
              </Box>
            </Box>

            {/* Personal Message */}
            {formData.personalMessage && (
              <Box
                sx={{
                  p: 2,
                  backgroundColor: alpha(theme.palette.info.main, 0.05),
                  borderLeft: `4px solid ${theme.palette.info.main}`,
                  borderRadius: 1,
                  mb: 3,
                }}
              >
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  "{formData.personalMessage}"
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                  — {inviterName}
                </Typography>
              </Box>
            )}

            {/* Role Info */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Your Role: {roleConfig[formData.role].label}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                {roleConfig[formData.role].description}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {roleConfig[formData.role].permissions.map((permission) => (
                  <Chip
                    key={permission}
                    label={permission}
                    size="small"
                    sx={{
                      backgroundColor: alpha(roleConfig[formData.role].color, 0.1),
                      color: roleConfig[formData.role].color,
                      fontSize: '0.7rem',
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* CTA Button Preview */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Join {companyName}
            </Button>

            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
                display: 'block',
                mt: 2,
              }}
            >
              This invitation will expire in 7 days
            </Typography>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card sx={{ backgroundColor: alpha(theme.palette.success.main, 0.05) }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Summary
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Invitee:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formData.email}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Role:</Typography>
              <Chip
                label={roleConfig[formData.role].label}
                size="small"
                icon={roleConfig[formData.role].icon}
                sx={{
                  backgroundColor: roleConfig[formData.role].color,
                  color: 'white',
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Expires:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderDetailsStep();
      case 1:
        return renderPreviewStep();
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      {/* Progress Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      <Box sx={{ mb: 4 }}>
        {getStepContent()}
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          onClick={activeStep === 0 ? onCancel : handleBack}
          startIcon={<ArrowBack />}
          variant="outlined"
        >
          {activeStep === 0 ? 'Cancel' : 'Back'}
        </Button>

        <Button
          onClick={handleNext}
          endIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : activeStep === steps.length - 1 ? (
              <Send />
            ) : (
              <ArrowForward />
            )
          }
          variant="contained"
          disabled={!canProceed() || loading}
        >
          {loading ? 'Sending...' : activeStep === steps.length - 1 ? 'Send Invitation' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
}
