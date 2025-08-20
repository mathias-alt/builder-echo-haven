import * as React from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  useTheme,
  alpha,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Business,
  ArrowForward,
  ArrowBack,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LogoUpload from './components/LogoUpload';
import { CompanyFormData, CompanyValidation, industries, companySizes, countries } from './types';

const steps = ['Basic Information', 'Company Details', 'Address & Logo'];

export default function CreateCompanyPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<CompanyValidation>({});

  const [formData, setFormData] = React.useState<CompanyFormData>({
    name: '',
    description: '',
    website: '',
    industry: '',
    size: 'startup',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
  });

  React.useEffect(() => {
    document.title = 'Create Company - Flourishing Business Canvas';
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: CompanyValidation = {};

    switch (step) {
      case 0: // Basic Information
        if (!formData.name.trim()) {
          newErrors.name = 'Company name is required';
        }
        if (formData.website && !isValidUrl(formData.website)) {
          newErrors.website = 'Please enter a valid website URL';
        }
        break;

      case 1: // Company Details
        if (!formData.industry) {
          newErrors.industry = 'Please select an industry';
        }
        if (!formData.size) {
          newErrors.size = 'Please select company size';
        }
        break;

      case 2: // Address & Logo (all optional)
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to company settings or dashboard
      navigate('/company/settings', { 
        state: { 
          newCompany: true, 
          companyName: formData.name 
        }
      });
    } catch (error) {
      console.error('Failed to create company:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBasicInformation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Let's start with the basics
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Company Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          error={!!errors.name}
          helperText={errors.name || 'This will be displayed on your canvases and invitations'}
          required
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Company Description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          error={!!errors.description}
          helperText={errors.description || 'Brief description of what your company does (optional)'}
          placeholder="We help businesses create innovative solutions..."
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Website"
          value={formData.website}
          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
          error={!!errors.website}
          helperText={errors.website || 'Your company website (optional)'}
          placeholder="www.yourcompany.com"
        />
      </Grid>
    </Grid>
  );

  const renderCompanyDetails = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Tell us more about your company
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth error={!!errors.industry}>
          <InputLabel>Industry</InputLabel>
          <Select
            value={formData.industry}
            label="Industry"
            onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
          >
            {industries.map((industry) => (
              <MenuItem key={industry} value={industry}>
                {industry}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth error={!!errors.size}>
          <InputLabel>Company Size</InputLabel>
          <Select
            value={formData.size}
            label="Company Size"
            onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value as any }))}
          >
            {companySizes.map((size) => (
              <MenuItem key={size.value} value={size.value}>
                {size.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  const renderAddressAndLogo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Company address and branding
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          All fields in this section are optional and can be updated later
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <LogoUpload
          onLogoChange={(file) => setFormData(prev => ({ ...prev, logo: file || undefined }))}
          companyName={formData.name}
          size="large"
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Street Address"
          value={formData.address.street}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            address: { ...prev.address, street: e.target.value }
          }))}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="City"
          value={formData.address.city}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            address: { ...prev.address, city: e.target.value }
          }))}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="State/Province"
          value={formData.address.state}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            address: { ...prev.address, state: e.target.value }
          }))}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Country</InputLabel>
          <Select
            value={formData.address.country}
            label="Country"
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              address: { ...prev.address, country: e.target.value }
            }))}
          >
            {countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Postal Code"
          value={formData.address.postalCode}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            address: { ...prev.address, postalCode: e.target.value }
          }))}
        />
      </Grid>
    </Grid>
  );

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderBasicInformation();
      case 1:
        return renderCompanyDetails();
      case 2:
        return renderAddressAndLogo();
      default:
        return null;
    }
  };

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
            <Business sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Create Your Company
          </Typography>
          
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Set up your company profile to start collaborating with your team
          </Typography>
        </Box>

        <Card sx={{ maxWidth: 800, mx: 'auto' }}>
          <CardContent sx={{ p: 4 }}>
            {/* Progress Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Error Alert */}
            {Object.keys(errors).length > 0 && (
              <Alert severity="error" sx={{ mb: 3 }}>
                Please fix the errors below before continuing.
              </Alert>
            )}

            {/* Step Content */}
            <Box sx={{ mb: 4 }}>
              {getStepContent()}
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                onClick={activeStep === 0 ? () => navigate('/dashboard') : handleBack}
                startIcon={<ArrowBack />}
                variant="outlined"
                disabled={loading}
              >
                {activeStep === 0 ? 'Cancel' : 'Back'}
              </Button>

              <Button
                onClick={handleNext}
                endIcon={
                  loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : activeStep === steps.length - 1 ? (
                    <CheckCircle />
                  ) : (
                    <ArrowForward />
                  )
                }
                variant="contained"
                disabled={loading}
              >
                {loading ? 'Creating...' : activeStep === steps.length - 1 ? 'Create Company' : 'Next'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Help Text */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            You can always update your company information later in settings
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
