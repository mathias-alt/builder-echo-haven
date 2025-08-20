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
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Snackbar,
} from '@mui/material';
import {
  Business,
  Save,
  Edit,
  Delete,
  Warning,
  CheckCircle,
  CreditCard,
  People,
  Settings,
  Info,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoUpload from './components/LogoUpload';
import { Company, CompanyFormData, CompanyValidation, industries, companySizes, countries, BillingInfo } from './types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <Box role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </Box>
  );
}

// Mock company data
const mockCompany: Company = {
  id: '1',
  name: 'Flourishing Business Canvas',
  description: 'We help businesses create innovative solutions through collaborative canvas tools',
  website: 'www.flourishingcanvas.com',
  industry: 'Technology',
  size: 'startup',
  logo: undefined,
  address: {
    street: '123 Innovation Street',
    city: 'San Francisco',
    state: 'CA',
    country: 'United States',
    postalCode: '94105',
  },
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date(),
  ownerId: 'user-1',
  memberCount: 12,
  canvasCount: 8,
  subscription: {
    plan: 'pro',
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    cancelAtPeriodEnd: false,
  },
};

const mockBillingInfo: BillingInfo = {
  plan: 'pro',
  status: 'active',
  currentPeriodStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  currentPeriodEnd: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
  cancelAtPeriodEnd: false,
  nextInvoiceDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
  lastPaymentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  paymentMethod: {
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2026,
  },
  usage: {
    members: 12,
    canvases: 8,
    storage: 256,
  },
  limits: {
    members: 50,
    canvases: 100,
    storage: 5000,
  },
};

export default function CompanySettingsPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState(0);
  const [loading, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<CompanyValidation>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  
  const [company, setCompany] = React.useState<Company>(mockCompany);
  const [billingInfo] = React.useState<BillingInfo>(mockBillingInfo);
  const [hasChanges, setHasChanges] = React.useState(false);

  React.useEffect(() => {
    document.title = 'Company Settings - Flourishing Business Canvas';
    
    // Show welcome message for new companies
    if (location.state?.newCompany) {
      setSuccessMessage(`Welcome! ${location.state.companyName} has been created successfully.`);
    }
  }, [location.state]);

  const validateForm = (): boolean => {
    const newErrors: CompanyValidation = {};

    if (!company.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    if (company.website && !isValidUrl(company.website)) {
      newErrors.website = 'Please enter a valid website URL';
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

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setHasChanges(false);
      setSuccessMessage('Company settings saved successfully!');
    } catch (error) {
      console.error('Failed to save company:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCompanyChange = (field: keyof Company, value: any) => {
    setCompany(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleAddressChange = (field: keyof Company['address'], value: string) => {
    setCompany(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
    setHasChanges(true);
  };

  const handleDeleteCompany = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      navigate('/dashboard', { 
        state: { 
          message: 'Company deleted successfully' 
        }
      });
    } catch (error) {
      console.error('Failed to delete company:', error);
    } finally {
      setSaving(false);
      setDeleteDialogOpen(false);
    }
  };

  const renderGeneralSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Company Information
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Update your company's basic information and branding
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <LogoUpload
          currentLogo={company.logo}
          onLogoChange={(file) => handleCompanyChange('logoFile', file)}
          companyName={company.name}
          size="medium"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
              Created
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {company.createdAt.toLocaleDateString()}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
              Members
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {company.memberCount} team members
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
              Canvases
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {company.canvasCount} active canvases
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Company Name"
          value={company.name}
          onChange={(e) => handleCompanyChange('name', e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          required
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description"
          value={company.description || ''}
          onChange={(e) => handleCompanyChange('description', e.target.value)}
          helperText="Brief description of what your company does"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Website"
          value={company.website || ''}
          onChange={(e) => handleCompanyChange('website', e.target.value)}
          error={!!errors.website}
          helperText={errors.website || 'Your company website'}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Industry</InputLabel>
          <Select
            value={company.industry || ''}
            label="Industry"
            onChange={(e) => handleCompanyChange('industry', e.target.value)}
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
        <FormControl fullWidth>
          <InputLabel>Company Size</InputLabel>
          <Select
            value={company.size || ''}
            label="Company Size"
            onChange={(e) => handleCompanyChange('size', e.target.value)}
          >
            {companySizes.map((size) => (
              <MenuItem key={size.value} value={size.value}>
                {size.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Address Information
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Street Address"
          value={company.address?.street || ''}
          onChange={(e) => handleAddressChange('street', e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="City"
          value={company.address?.city || ''}
          onChange={(e) => handleAddressChange('city', e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="State/Province"
          value={company.address?.state || ''}
          onChange={(e) => handleAddressChange('state', e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Country</InputLabel>
          <Select
            value={company.address?.country || ''}
            label="Country"
            onChange={(e) => handleAddressChange('country', e.target.value)}
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
          value={company.address?.postalCode || ''}
          onChange={(e) => handleAddressChange('postalCode', e.target.value)}
        />
      </Grid>
    </Grid>
  );

  const renderBillingSettings = () => (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        Billing & Subscription
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Manage your subscription and billing information
      </Typography>

      {/* Current Plan */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Current Plan
              </Typography>
              <Chip
                label={billingInfo.plan.toUpperCase()}
                color="primary"
                variant="filled"
              />
            </Box>
            <Button variant="outlined" size="small">
              Upgrade Plan
            </Button>
          </Box>
          
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Status: <Chip label={billingInfo.status} color="success" size="small" />
          </Typography>
          
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Next billing date: {billingInfo.nextInvoiceDate?.toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Usage
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Team Members
                </Typography>
                <Typography variant="h6">
                  {billingInfo.usage.members} / {billingInfo.limits.members}
                </Typography>
                <Box sx={{ 
                  width: '100%', 
                  height: 4, 
                  backgroundColor: 'grey.300', 
                  borderRadius: 2, 
                  mt: 1 
                }}>
                  <Box sx={{ 
                    width: `${(billingInfo.usage.members / billingInfo.limits.members) * 100}%`,
                    height: '100%',
                    backgroundColor: 'primary.main',
                    borderRadius: 2,
                  }} />
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Canvases
                </Typography>
                <Typography variant="h6">
                  {billingInfo.usage.canvases} / {billingInfo.limits.canvases}
                </Typography>
                <Box sx={{ 
                  width: '100%', 
                  height: 4, 
                  backgroundColor: 'grey.300', 
                  borderRadius: 2, 
                  mt: 1 
                }}>
                  <Box sx={{ 
                    width: `${(billingInfo.usage.canvases / billingInfo.limits.canvases) * 100}%`,
                    height: '100%',
                    backgroundColor: 'success.main',
                    borderRadius: 2,
                  }} />
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Storage
                </Typography>
                <Typography variant="h6">
                  {billingInfo.usage.storage} MB / {billingInfo.limits.storage} MB
                </Typography>
                <Box sx={{ 
                  width: '100%', 
                  height: 4, 
                  backgroundColor: 'grey.300', 
                  borderRadius: 2, 
                  mt: 1 
                }}>
                  <Box sx={{ 
                    width: `${(billingInfo.usage.storage / billingInfo.limits.storage) * 100}%`,
                    height: '100%',
                    backgroundColor: 'info.main',
                    borderRadius: 2,
                  }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Payment Method
            </Typography>
            <Button variant="outlined" size="small" startIcon={<Edit />}>
              Update
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CreditCard />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {billingInfo.paymentMethod?.brand} ending in {billingInfo.paymentMethod?.last4}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Expires {billingInfo.paymentMethod?.expiryMonth}/{billingInfo.paymentMethod?.expiryYear}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  const renderDangerZone = () => (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'error.main' }}>
        Danger Zone
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Irreversible and destructive actions
      </Typography>

      <Card sx={{ border: `1px solid ${theme.palette.error.main}` }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Warning sx={{ color: 'error.main', mt: 0.5 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Delete Company
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Permanently delete this company and all associated data. This action cannot be undone.
                All team members will lose access, and all canvases will be permanently deleted.
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete Company
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              src={company.logo}
              sx={{
                width: 64,
                height: 64,
                backgroundColor: theme.palette.primary.main,
                fontSize: '1.5rem',
                fontWeight: 600,
              }}
            >
              {!company.logo && company.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {company.name}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Company Settings
              </Typography>
            </Box>
          </Box>
        </Box>

        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab icon={<Info />} label="General" />
              <Tab icon={<CreditCard />} label="Billing" />
              <Tab icon={<Settings />} label="Advanced" />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <TabPanel value={activeTab} index={0}>
              {renderGeneralSettings()}
            </TabPanel>
            
            <TabPanel value={activeTab} index={1}>
              {renderBillingSettings()}
            </TabPanel>
            
            <TabPanel value={activeTab} index={2}>
              {renderDangerZone()}
            </TabPanel>
          </CardContent>

          {/* Save Button - Only show on General tab */}
          {activeTab === 0 && (
            <Box sx={{ p: 3, pt: 0 }}>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {hasChanges ? 'You have unsaved changes' : 'All changes saved'}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Save />}
                  onClick={handleSave}
                  disabled={!hasChanges || loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          )}
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ color: 'error.main' }}>
            Delete Company
          </DialogTitle>
          <DialogContent>
            <Alert severity="error" sx={{ mb: 2 }}>
              This action cannot be undone!
            </Alert>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to delete <strong>{company.name}</strong>?
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              This will permanently delete:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 2 }}>
              <li>All company data and settings</li>
              <li>All team members and their access</li>
              <li>All canvases and their content</li>
              <li>All billing and subscription data</li>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleDeleteCompany}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Delete />}
            >
              {loading ? 'Deleting...' : 'Delete Company'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSuccessMessage('')} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
