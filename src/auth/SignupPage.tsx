import * as React from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  IconButton,
  useTheme,
  alpha,
  CircularProgress,
  Fade,
  FormHelperText,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  ArrowBack,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

interface FloatingLabelTextFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onEndIconClick?: () => void;
}

function FloatingLabelTextField({
  label,
  type = 'text',
  value,
  onChange,
  error = false,
  helperText,
  startIcon,
  endIcon,
  onEndIconClick,
}: FloatingLabelTextFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = React.useState(false);
  const hasValue = value.length > 0;
  const shouldFloat = focused || hasValue;

  return (
    <Box sx={{ position: 'relative', mb: 3 }}>
      <Box
        sx={{
          position: 'relative',
          '& .MuiTextField-root': {
            width: '100%',
          },
        }}
      >
        <TextField
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          error={error}
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: startIcon && (
              <InputAdornment position="start">
                <Box sx={{ color: error ? theme.palette.error.main : theme.palette.text.secondary }}>
                  {startIcon}
                </Box>
              </InputAdornment>
            ),
            endAdornment: endIcon && (
              <InputAdornment position="end">
                {onEndIconClick ? (
                  <IconButton
                    onClick={onEndIconClick}
                    edge="end"
                    sx={{
                      borderRadius: 2,
                      border: '1px solid transparent',
                      overflow: 'hidden',
                    }}
                  >
                    {endIcon}
                  </IconButton>
                ) : (
                  <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                    {endIcon}
                  </Box>
                )}
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              '& fieldset': {
                borderColor: error 
                  ? theme.palette.error.main 
                  : focused 
                    ? theme.palette.primary.main 
                    : alpha(theme.palette.divider, 0.3),
                borderWidth: focused ? 2 : 1,
                transition: 'all 0.2s ease',
              },
              '&:hover fieldset': {
                borderColor: error 
                  ? theme.palette.error.main 
                  : theme.palette.primary.main,
              },
              '&.Mui-focused fieldset': {
                borderColor: error 
                  ? theme.palette.error.main 
                  : theme.palette.primary.main,
              },
            },
          }}
          sx={{
            '& .MuiInputLabel-root': {
              display: 'none',
            },
          }}
        />
        
        {/* Floating Label */}
        <Box
          component="label"
          sx={{
            position: 'absolute',
            left: startIcon ? 35 : 16,
            top: shouldFloat ? -10 : 8,
            fontSize: shouldFloat ? '0.75rem' : '1rem',
            fontWeight: shouldFloat ? 500 : 400,
            color: error
              ? theme.palette.error.main
              : shouldFloat && focused
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
            backgroundColor: shouldFloat ? theme.palette.background.default : 'transparent',
            px: shouldFloat ? 1 : 0,
            borderRadius: shouldFloat ? 2 : 0,
            overflow: shouldFloat ? 'hidden' : 'visible',
            pointerEvents: 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            transformOrigin: 'left center',
            zIndex: 1,
          }}
        >
          {label}
        </Box>
      </Box>
      
      {helperText && (
        <FormHelperText 
          error={error}
          sx={{ 
            ml: 1, 
            mt: 0.5,
            fontSize: '0.75rem',
            color: error ? theme.palette.error.main : theme.palette.success.main,
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
}

function PasswordStrengthIndicator({ password }: { password: string }) {
  const theme = useTheme();
  
  const getStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength(password);
  const percentage = (strength / 5) * 100;
  
  const getColor = () => {
    if (strength <= 2) return theme.palette.error.main;
    if (strength <= 3) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  const getLabel = () => {
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  if (!password) return null;

  return (
    <Box sx={{ mt: 1, mb: 2 }}>
      <Box
        sx={{
          height: 4,
          backgroundColor: alpha(theme.palette.divider, 0.2),
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: getColor(),
            transition: 'all 0.3s ease',
          }}
        />
      </Box>
      <Typography
        variant="caption"
        sx={{
          color: getColor(),
          fontWeight: 500,
          fontSize: '0.75rem',
        }}
      >
        Password strength: {getLabel()}
      </Typography>
    </Box>
  );
}

export default function SignupPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = 'Sign Up - Business Canvas';
  }, []);
  
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Navigate to dashboard on success
      navigate('/dashboard');
    } catch (error) {
      // Handle signup error
      setErrors({ email: 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  return (
    <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Fade in={true} timeout={800}>
            <Card
              sx={{
                maxWidth: 480,
                mx: 'auto',
                borderRadius: 4,
                boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.1)}`,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(20px)',
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <IconButton
                    onClick={() => navigate('/')}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.action.hover, 0.1),
                      },
                    }}
                  >
                    <ArrowBack />
                  </IconButton>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Logo
                      size="large"
                      color={theme.palette.primary.main}
                      text="Business Canvas"
                    />
                  </Box>
                  
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      mb: 1,
                    }}
                  >
                    Create your account
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Start building your business canvas today
                  </Typography>
                </Box>

                {/* Form */}
                <Box component="form" onSubmit={handleSubmit}>
                  {/* Name Fields */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 0 }}>
                    <Box sx={{ flex: 1 }}>
                      <FloatingLabelTextField
                        label="First name"
                        value={formData.firstName}
                        onChange={updateFormData('firstName')}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        startIcon={<Person sx={{ fontSize: 20 }} />}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <FloatingLabelTextField
                        label="Last name"
                        value={formData.lastName}
                        onChange={updateFormData('lastName')}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                      />
                    </Box>
                  </Box>

                  <FloatingLabelTextField
                    label="Email address"
                    type="email"
                    value={formData.email}
                    onChange={updateFormData('email')}
                    error={!!errors.email}
                    helperText={errors.email}
                    startIcon={<Email sx={{ fontSize: 20 }} />}
                  />

                  <FloatingLabelTextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={updateFormData('password')}
                    error={!!errors.password}
                    helperText={errors.password}
                    startIcon={<Lock sx={{ fontSize: 20 }} />}
                    endIcon={showPassword ? <VisibilityOff /> : <Visibility />}
                    onEndIconClick={() => setShowPassword(!showPassword)}
                  />

                  <PasswordStrengthIndicator password={formData.password} />

                  <FloatingLabelTextField
                    label="Confirm password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={updateFormData('confirmPassword')}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword || (formData.confirmPassword && formData.password === formData.confirmPassword ? 'Passwords match' : '')}
                    startIcon={<Lock sx={{ fontSize: 20 }} />}
                    endIcon={
                      formData.confirmPassword && formData.password === formData.confirmPassword ? (
                        <CheckCircle sx={{ color: theme.palette.success.main }} />
                      ) : (
                        showConfirmPassword ? <VisibilityOff /> : <Visibility />
                      )
                    }
                    onEndIconClick={
                      formData.confirmPassword && formData.password === formData.confirmPassword
                        ? undefined
                        : () => setShowConfirmPassword(!showConfirmPassword)
                    }
                  />

                  {/* Terms and Conditions */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agreeToTerms}
                        onChange={(e) => {
                          setAgreeToTerms(e.target.checked);
                          setErrors(prev => ({ ...prev, terms: undefined }));
                        }}
                        sx={{
                          color: errors.terms ? theme.palette.error.main : theme.palette.primary.main,
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        I agree to the{' '}
                        <Link
                          href="#"
                          sx={{
                            color: theme.palette.primary.main,
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link
                          href="#"
                          sx={{
                            color: theme.palette.primary.main,
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          Privacy Policy
                        </Link>
                      </Typography>
                    }
                    sx={{ mb: errors.terms ? 1 : 2 }}
                  />

                  {errors.terms && (
                    <FormHelperText error sx={{ ml: 1, mb: 2, fontSize: '0.75rem' }}>
                      {errors.terms}
                    </FormHelperText>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                      },
                      '&:disabled': {
                        backgroundColor: alpha(theme.palette.action.disabled, 0.12),
                        color: theme.palette.action.disabled,
                      },
                      transition: 'all 0.2s ease',
                      mb: 3,
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Create Account'
                    )}
                  </Button>

                  {/* Sign In Link */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      Already have an account?{' '}
                      <Link
                        onClick={() => navigate('/login')}
                        sx={{
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                          fontWeight: 600,
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Sign in
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Container>
    </Box>
  );
}
