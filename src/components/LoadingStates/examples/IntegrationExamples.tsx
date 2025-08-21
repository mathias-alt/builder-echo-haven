import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Divider,
} from '@mui/material';
import {
  LoadingSpinner,
  EmptyState,
  ErrorState,
  SuccessState,
  DashboardSkeleton,
  CanvasSkeleton,
  TeamSkeleton,
  LinearProgressWithLabel,
  ProcessProgressCard,
  FileProgressIndicator,
  useScopedLoading,
  useLoadingState,
  useFormLoading,
  SuccessToast,
  LoadingBoundary,
} from '../index';
import { ProgressStep } from '../types';

// Example 1: Basic loading integration
const BasicLoadingExample: React.FC = () => {
  const { state, isLoading, executeAsync } = useLoadingState();

  const handleAsyncOperation = () => {
    executeAsync(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      return 'Operation completed!';
    });
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Basic Loading State
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button variant="contained" onClick={handleAsyncOperation} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Start Operation'}
          </Button>
        </Box>
        
        {isLoading && <LoadingSpinner variant="circular" message="Processing your request..." />}
        {state === 'success' && <SuccessState title="Success!" description="Operation completed successfully" />}
        {state === 'error' && <ErrorState title="Error" description="Something went wrong" />}
      </CardContent>
    </Card>
  );
};

// Example 2: Scoped loading with context
const ScopedLoadingExample: React.FC = () => {
  const userLoading = useScopedLoading('user-data');
  const settingsLoading = useScopedLoading('settings-data');

  const loadUserData = () => {
    userLoading.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
    });
  };

  const loadSettings = () => {
    settingsLoading.execute(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
    });
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Scoped Loading States
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button 
              variant="outlined" 
              onClick={loadUserData} 
              disabled={userLoading.isLoading}
              fullWidth
            >
              Load User Data
            </Button>
            {userLoading.isLoading && (
              <LoadingSpinner size="small" message="Loading user..." />
            )}
          </Grid>
          <Grid item xs={6}>
            <Button 
              variant="outlined" 
              onClick={loadSettings} 
              disabled={settingsLoading.isLoading}
              fullWidth
            >
              Load Settings
            </Button>
            {settingsLoading.isLoading && (
              <LoadingSpinner size="small" message="Loading settings..." />
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Example 3: Form loading states
const FormLoadingExample: React.FC = () => {
  const {
    loadingFields,
    errors,
    executeFieldOperation,
    isFieldLoading,
    getFieldError,
  } = useFormLoading();

  const [formData, setFormData] = useState({ email: '', username: '' });

  const validateEmail = (email: string) => {
    return executeFieldOperation('email', async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!email.includes('@')) {
        throw new Error('Invalid email format');
      }
      return true;
    });
  };

  const validateUsername = (username: string) => {
    return executeFieldOperation('username', async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (username.length < 3) {
        throw new Error('Username must be at least 3 characters');
      }
      return true;
    });
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Form Loading States
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onBlur={() => validateEmail(formData.email)}
            error={!!getFieldError('email')}
            helperText={getFieldError('email')}
            disabled={isFieldLoading('email')}
            InputProps={{
              endAdornment: isFieldLoading('email') ? <LoadingSpinner size={20} /> : null,
            }}
          />
          <TextField
            label="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            onBlur={() => validateUsername(formData.username)}
            error={!!getFieldError('username')}
            helperText={getFieldError('username')}
            disabled={isFieldLoading('username')}
            InputProps={{
              endAdornment: isFieldLoading('username') ? <LoadingSpinner size={20} /> : null,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

// Example 4: Skeleton screens
const SkeletonExample: React.FC = () => {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [skeletonType, setSkeletonType] = useState<'dashboard' | 'canvas' | 'team'>('dashboard');

  const renderSkeleton = () => {
    switch (skeletonType) {
      case 'canvas':
        return <CanvasSkeleton />;
      case 'team':
        return <TeamSkeleton />;
      default:
        return <DashboardSkeleton />;
    }
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Skeleton Screens
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button 
            variant={skeletonType === 'dashboard' ? 'contained' : 'outlined'} 
            onClick={() => setSkeletonType('dashboard')}
          >
            Dashboard
          </Button>
          <Button 
            variant={skeletonType === 'canvas' ? 'contained' : 'outlined'} 
            onClick={() => setSkeletonType('canvas')}
          >
            Canvas
          </Button>
          <Button 
            variant={skeletonType === 'team' ? 'contained' : 'outlined'} 
            onClick={() => setSkeletonType('team')}
          >
            Team
          </Button>
        </Box>
        <Button 
          variant="outlined" 
          onClick={() => setShowSkeleton(!showSkeleton)}
          sx={{ mb: 2 }}
        >
          {showSkeleton ? 'Hide' : 'Show'} Skeleton
        </Button>
        
        {showSkeleton && renderSkeleton()}
      </CardContent>
    </Card>
  );
};

// Example 5: Progress indicators
const ProgressExample: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const steps: ProgressStep[] = [
    { id: '1', label: 'Preparing data', status: 'completed' },
    { id: '2', label: 'Processing files', status: 'active' },
    { id: '3', label: 'Generating report', status: 'pending' },
    { id: '4', label: 'Finalizing', status: 'pending' },
  ];

  const startProgress = () => {
    setIsRunning(true);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Progress Indicators
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Button 
            variant="contained" 
            onClick={startProgress} 
            disabled={isRunning}
            sx={{ mb: 2 }}
          >
            Start Process
          </Button>
          <LinearProgressWithLabel
            value={progress}
            label="Overall Progress"
            showPercentage={true}
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <ProcessProgressCard
          title="Multi-step Process"
          description="Processing your business canvas export"
          steps={steps}
          currentStep={1}
          estimatedTime="2 minutes"
        />
        
        <Box sx={{ mt: 2 }}>
          <FileProgressIndicator
            fileName="business-canvas-export.pdf"
            progress={progress}
            size="2.5 MB"
            speed="1.2 MB/s"
            status={progress === 100 ? 'completed' : 'uploading'}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

// Example 6: Success and error states
const StateExample: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          State Examples
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button variant="outlined" onClick={() => setShowSuccess(true)}>
            Show Success
          </Button>
          <Button variant="outlined" onClick={() => setShowError(true)}>
            Show Error
          </Button>
          <Button variant="outlined" onClick={() => setShowEmpty(true)}>
            Show Empty
          </Button>
        </Box>
        
        {showEmpty && (
          <EmptyState
            title="No data found"
            description="Start by creating your first business canvas"
            illustration="canvas"
            action={{
              label: "Create Canvas",
              onClick: () => setShowEmpty(false),
            }}
          />
        )}
      </CardContent>
      
      <SuccessToast
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Success!"
        description="Your changes have been saved successfully."
        animation="checkmark"
      />
      
      {showError && (
        <ErrorState
          errorType="network"
          retryAction={{
            label: "Try Again",
            onClick: () => setShowError(false),
          }}
        />
      )}
    </Card>
  );
};

// Main integration examples component
export const LoadingStateIntegrationExamples: React.FC = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Loading States Integration Examples
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Comprehensive examples showing how to integrate loading states throughout your application.
      </Typography>
      
      <BasicLoadingExample />
      <ScopedLoadingExample />
      <FormLoadingExample />
      <SkeletonExample />
      <ProgressExample />
      <StateExample />
      
      {/* Loading Boundary Example */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Loading Boundary Example
          </Typography>
          <LoadingBoundary loadingKey="boundary-example" showOverlay={true}>
            <Typography>
              This content is wrapped in a LoadingBoundary. It will show a loading overlay when the scoped loading state is active.
            </Typography>
          </LoadingBoundary>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoadingStateIntegrationExamples;
