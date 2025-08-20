import * as React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  CircularProgress,
  Button,
  Card,
  CardContent,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Download,
  Share,
  Error,
  Refresh,
  CloudDownload,
  InsertDriveFile,
  GetApp,
} from '@mui/icons-material';
import { ExportSettings, ExportProgress as ExportProgressType, ExportResult } from '../types';

interface ExportProgressProps {
  settings: ExportSettings;
  canvasName: string;
  isComplete: boolean;
  onComplete: () => void;
  onRetry?: () => void;
}

export default function ExportProgress({
  settings,
  canvasName,
  isComplete,
  onComplete,
  onRetry,
}: ExportProgressProps) {
  const theme = useTheme();
  const [progress, setProgress] = React.useState<ExportProgressType>({
    stage: 'preparing',
    progress: 0,
    message: 'Initializing export...',
  });
  const [exportResult, setExportResult] = React.useState<ExportResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const stages = [
    { key: 'preparing', label: 'Preparing Canvas', duration: 1000 },
    { key: 'rendering', label: 'Rendering Content', duration: 2000 },
    { key: 'generating', label: 'Generating File', duration: 1500 },
    { key: 'uploading', label: 'Processing', duration: 1000 },
    { key: 'complete', label: 'Complete', duration: 0 },
  ];

  React.useEffect(() => {
    if (!isComplete) {
      simulateExport();
    }
  }, [isComplete]);

  const simulateExport = async () => {
    try {
      for (let i = 0; i < stages.length - 1; i++) {
        const stage = stages[i];
        setProgress({
          stage: stage.key as any,
          progress: (i / (stages.length - 1)) * 100,
          message: stage.label,
          estimatedTimeRemaining: Math.ceil((stages.length - 1 - i) * 1.5),
        });

        // Simulate stage duration
        await new Promise(resolve => setTimeout(resolve, stage.duration));
        
        // Update progress within stage
        const stageProgress = (i + 1) / (stages.length - 1) * 100;
        setProgress(prev => ({
          ...prev,
          progress: stageProgress,
        }));
      }

      // Complete export
      setProgress({
        stage: 'complete',
        progress: 100,
        message: 'Export completed successfully!',
      });

      // Generate mock export result
      const fileName = `${canvasName.replace(/\s+/g, '_')}.${settings.format}`;
      const mockResult: ExportResult = {
        id: `export_${Date.now()}`,
        downloadUrl: `/api/exports/download/${Date.now()}`,
        publicUrl: `https://share.flourishingcanvas.com/${Math.random().toString(36).substr(2, 9)}`,
        shareCode: Math.random().toString(36).substr(2, 9).toUpperCase(),
        fileName,
        fileSize: Math.floor(Math.random() * 5000000) + 100000, // 100KB to 5MB
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        settings,
      };

      setExportResult(mockResult);
      onComplete();
    } catch (err) {
      setError('Export failed. Please try again.');
      setProgress({
        stage: 'error',
        progress: 0,
        message: 'Export failed',
      });
    }
  };

  const handleDownload = () => {
    if (exportResult) {
      // In a real app, this would trigger the actual download
      const link = document.createElement('a');
      link.href = exportResult.downloadUrl;
      link.download = exportResult.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = () => {
    if (exportResult?.publicUrl) {
      navigator.clipboard.writeText(exportResult.publicUrl);
      // You could show a toast notification here
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getProgressColor = () => {
    switch (progress.stage) {
      case 'error':
        return 'error';
      case 'complete':
        return 'success';
      default:
        return 'primary';
    }
  };

  if (error) {
    return (
      <Fade in>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: theme.palette.error.main,
              mx: 'auto',
              mb: 3,
            }}
          >
            <Error sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Export Failed
          </Typography>
          
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            {error}
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={onRetry}
          >
            Try Again
          </Button>
        </Box>
      </Fade>
    );
  }

  if (progress.stage === 'complete' && exportResult) {
    return (
      <Fade in>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Zoom in timeout={500}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                backgroundColor: theme.palette.success.main,
                mx: 'auto',
                mb: 3,
              }}
            >
              <CheckCircle sx={{ fontSize: 40 }} />
            </Avatar>
          </Zoom>
          
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Export Complete!
          </Typography>
          
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            Your canvas has been exported successfully
          </Typography>

          {/* Export Details */}
          <Card sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                >
                  <InsertDriveFile />
                </Avatar>
                <Box sx={{ flex: 1, textAlign: 'left' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {exportResult.fileName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {formatFileSize(exportResult.fileSize)}
                  </Typography>
                </Box>
                <Chip
                  label={settings.format.toUpperCase()}
                  size="small"
                  color="primary"
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Share Code:
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {exportResult.shareCode}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Expires:
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {exportResult.expiresAt.toLocaleDateString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Download />}
              onClick={handleDownload}
              sx={{ minWidth: 160 }}
            >
              Download File
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<Share />}
              onClick={handleShare}
              sx={{ minWidth: 160 }}
            >
              Copy Share Link
            </Button>
          </Box>

          {/* Additional Info */}
          <Box sx={{ mt: 4, p: 2, backgroundColor: alpha(theme.palette.info.main, 0.05), borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              💡 Your export will be available for download for 7 days. 
              You can access it anytime from the Export History.
            </Typography>
          </Box>
        </Box>
      </Fade>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Avatar
        sx={{
          width: 80,
          height: 80,
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
          mx: 'auto',
          mb: 3,
        }}
      >
        <CloudDownload sx={{ fontSize: 40 }} />
      </Avatar>
      
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        Exporting Canvas
      </Typography>
      
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        {progress.message}
      </Typography>

      {/* Progress Indicator */}
      <Box sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {Math.round(progress.progress)}% Complete
          </Typography>
          {progress.estimatedTimeRemaining && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              ~{progress.estimatedTimeRemaining}s remaining
            </Typography>
          )}
        </Box>
        
        <LinearProgress
          variant="determinate"
          value={progress.progress}
          color={getProgressColor()}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
            },
          }}
        />
      </Box>

      {/* Stage Indicators */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
        {stages.slice(0, -1).map((stage, index) => {
          const isActive = stages.findIndex(s => s.key === progress.stage) === index;
          const isCompleted = stages.findIndex(s => s.key === progress.stage) > index;
          
          return (
            <Chip
              key={stage.key}
              label={stage.label}
              size="small"
              color={isCompleted ? 'success' : isActive ? 'primary' : 'default'}
              variant={isActive ? 'filled' : 'outlined'}
              icon={isCompleted ? <CheckCircle sx={{ fontSize: 16 }} /> : undefined}
            />
          );
        })}
      </Box>

      {/* Export Settings Summary */}
      <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Export Settings
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption">Format:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {settings.format.toUpperCase()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption">Page Size:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {settings.pageSize} ({settings.orientation})
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption">Quality:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {settings.quality}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
