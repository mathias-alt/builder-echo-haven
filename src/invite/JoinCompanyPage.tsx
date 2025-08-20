import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  useTheme,
  alpha,
  Avatar,
  Fade,
  Stepper,
  Step,
  StepLabel,
  Container,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Link,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import {
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
  ArrowForward,
  ArrowBack,
  Business,
  Photo,
  Phone,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

interface JoinFormData {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  avatar?: File;
  agreedToTerms: boolean;
}

interface InvitationData {
  email: string;
  role: string;
  companyName: string;
  inviterName: string;
}

const steps = ['Create Account', 'Profile Setup', 'Welcome'];

const validatePassword = (password: string) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  return { checks, score };
};

export default function JoinCompanyPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const invitation: InvitationData = location.state?.invitation || {
    email: 'john.doe@company.com',
    role: 'member',
    companyName: 'Flourishing Business Canvas',
    inviterName: 'Sarah Johnson',
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  const [formData, setFormData] = React.useState<JoinFormData>({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreedToTerms: false,
  });

  React.useEffect(() => {
    document.title = `Join ${invitation.companyName} - Complete Registration`;
  }, [invitation.companyName]);

  const passwordValidation = validatePassword(formData.password);
  const isPasswordValid = passwordValidation.score >= 4;
  const passwordsMatch = formData.password === formData.confirmPassword;

  const canProceedStep1 = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.password &&
      isPasswordValid &&
      passwordsMatch &&
      formData.agreedToTerms
    );
  };

  const canProceedStep2 = () => {
    return true; // Profile setup is optional
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      await handleComplete();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Simulate account creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to dashboard or success page
      navigate('/dashboard', { 
        state: { 
          newUser: true,
          welcomeMessage: `Welcome to ${invitation.companyName}!` 
        }
      });
    } catch (error) {
      console.error('Failed to create account:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCreateAccountStep = () => (
    <Fade in timeout={300}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Create Your Account
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Set up your account to join {invitation.companyName}
          </Typography>
        </Box>

        {/* Name Fields */}
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            InputProps={{
              startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
          />
        </Box>

        {/* Email (Read-only) */}
        <TextField
          fullWidth
          label="Email Address"
          value={invitation.email}
          disabled
          helperText="This email was invited to join the team"
        />

        {/* Password */}
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            startAdornment={
              <InputAdornment position="start">
                <Lock sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          <FormHelperText>
            Password strength: {passwordValidation.score}/5
            {formData.password && (
              <Box sx={{ mt: 1 }}>
                {Object.entries(passwordValidation.checks).map(([key, valid]) => (
                  <Typography
                    key={key}
                    variant="caption"
                    sx={{
                      display: 'block',
                      color: valid ? 'success.main' : 'text.secondary',
                    }}
                  >
                    {valid ? '✓' : '○'} {key === 'length' ? '8+ characters' : 
                       key === 'uppercase' ? 'Uppercase letter' :
                       key === 'lowercase' ? 'Lowercase letter' :
                       key === 'number' ? 'Number' : 'Special character'}
                  </Typography>
                ))}
              </Box>
            )}
          </FormHelperText>
        </FormControl>

        {/* Confirm Password */}
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Confirm Password</InputLabel>
          <OutlinedInput
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirm Password"
            error={formData.confirmPassword && !passwordsMatch}
          />
          {formData.confirmPassword && !passwordsMatch && (
            <FormHelperText error>Passwords do not match</FormHelperText>
          )}
        </FormControl>

        {/* Terms Agreement */}
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.agreedToTerms}
              onChange={(e) => setFormData(prev => ({ ...prev, agreedToTerms: e.target.checked }))}
            />
          }
          label={
            <Typography variant="body2">
              I agree to the{' '}
              <Link href="#" color="primary">Terms of Service</Link>
              {' '}and{' '}
              <Link href="#" color="primary">Privacy Policy</Link>
            </Typography>
          }
        />
      </Box>
    </Fade>
  );

  const renderProfileSetupStep = () => (
    <Fade in timeout={300}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Set Up Your Profile
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Help your team recognize you (optional)
          </Typography>
        </Box>

        {/* Avatar Upload */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              mx: 'auto',
              mb: 2,
              backgroundColor: theme.palette.primary.main,
              fontSize: '2rem',
              fontWeight: 600,
            }}
          >
            {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
          </Avatar>
          <Button
            variant="outlined"
            startIcon={<Photo />}
            component="label"
          >
            Upload Photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData(prev => ({ ...prev, avatar: file }));
                }
              }}
            />
          </Button>
        </Box>

        {/* Phone Number */}
        <TextField
          fullWidth
          label="Phone Number (Optional)"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          InputProps={{
            startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          helperText="Your team can contact you for urgent matters"
        />

        {/* Skip Option */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            You can always update your profile later in settings
          </Typography>
        </Box>
      </Box>
    </Fade>
  );

  const renderWelcomeStep = () => (
    <Fade in timeout={300}>
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Avatar
          sx={{
            width: 120,
            height: 120,
            backgroundColor: theme.palette.success.main,
            mx: 'auto',
            mb: 3,
          }}
        >
          <CheckCircle sx={{ fontSize: 60 }} />
        </Avatar>
        
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Welcome to {invitation.companyName}!
        </Typography>
        
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, maxWidth: 400, mx: 'auto' }}>
          Your account has been created successfully. You're now part of the team and can start
          collaborating on business canvases.
        </Typography>

        <Card sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              What's Next?
            </Typography>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                ✓ Explore existing canvases
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                ✓ Create your first business model
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                ✓ Collaborate with your team
              </Typography>
              <Typography variant="body2">
                ✓ Get familiar with the tools
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
        return renderCreateAccountStep();
      case 1:
        return renderProfileSetupStep();
      case 2:
        return renderWelcomeStep();
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return canProceedStep1();
      case 1:
        return canProceedStep2();
      case 2:
        return true;
      default:
        return false;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        py: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: { xs: 60, sm: 80 },
              height: { xs: 60, sm: 80 },
              backgroundColor: theme.palette.primary.main,
              mx: 'auto',
              mb: 2,
            }}
          >
            <Business sx={{ fontSize: { xs: 30, sm: 40 } }} />
          </Avatar>
          
          <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 600, mb: 1 }}>
            Join {invitation.companyName}
          </Typography>
          
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Complete your registration to start collaborating
          </Typography>
        </Box>

        <Card sx={{ maxWidth: 600, mx: 'auto' }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {/* Progress Stepper */}
            <Stepper 
              activeStep={activeStep} 
              sx={{ mb: 4 }}
              orientation={isMobile ? 'vertical' : 'horizontal'}
            >
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
            {activeStep < steps.length - 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  startIcon={<ArrowBack />}
                  variant="outlined"
                >
                  Back
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!canProceed() || loading}
                  endIcon={<ArrowForward />}
                  variant="contained"
                >
                  {activeStep === 1 ? 'Finish' : 'Next'}
                </Button>
              </Box>
            )}

            {/* Complete Button */}
            {activeStep === steps.length - 1 && (
              <Button
                onClick={handleComplete}
                disabled={loading}
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Setting up your account...
                  </>
                ) : (
                  'Get Started'
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Help */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            Need help? Contact {invitation.inviterName}
          </Typography>
          <Button variant="text" size="small" href="mailto:support@company.com">
            support@company.com
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
