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
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Business,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AppTheme from '../shared-theme/AppTheme';

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
            left: startIcon ? 39 : 16,
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

export default function LoginPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    email?: string;
    password?: string;
  }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      console.log('Login attempt:', { email, password });
      // Navigate to dashboard on success
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearErrors = () => {
    setErrors({});
  };

  return (
    <AppTheme>
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
                maxWidth: 440,
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
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                    <Business sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      Flourishing Business
                    </Typography>
                  </Box>
                  
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      mb: 1,
                    }}
                  >
                    Welcome back
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Sign in to your account to continue
                  </Typography>
                </Box>

                {/* Form */}
                <Box component="form" onSubmit={handleSubmit}>
                  <FloatingLabelTextField
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(value) => {
                      setEmail(value);
                      clearErrors();
                    }}
                    error={!!errors.email}
                    helperText={errors.email}
                    startIcon={<Email sx={{ fontSize: 20 }} />}
                  />

                  <FloatingLabelTextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(value) => {
                      setPassword(value);
                      clearErrors();
                    }}
                    error={!!errors.password}
                    helperText={errors.password}
                    startIcon={<Lock sx={{ fontSize: 20 }} />}
                    endIcon={showPassword ? <VisibilityOff /> : <Visibility />}
                    onEndIconClick={() => setShowPassword(!showPassword)}
                  />

                  {/* Forgot Password Link */}
                  <Box sx={{ textAlign: 'right', mb: 3 }}>
                    <Link
                      href="#"
                      variant="body2"
                      sx={{
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Box>

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
                      'Sign In'
                    )}
                  </Button>

                  {/* Sign Up Link */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      Don't have an account?{' '}
                      <Link
                        onClick={() => navigate('/signup')}
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
                        Create account
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Container>
      </Box>
    </AppTheme>
  );
}
