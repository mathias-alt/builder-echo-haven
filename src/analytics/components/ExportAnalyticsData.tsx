import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import {
  GetApp,
  FileDownload,
  TableChart,
  PictureAsPdf,
  DataObject
} from '@mui/icons-material';
import { AnalyticsDashboardData, AnalyticsFilterOptions, AnalyticsExportFormat } from '../types';

interface ExportAnalyticsDataProps {
  dashboardData: AnalyticsDashboardData;
  filters: AnalyticsFilterOptions;
}

export const ExportAnalyticsData: React.FC<ExportAnalyticsDataProps> = ({
  dashboardData,
  filters
}) => {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'xlsx' | 'json' | 'pdf'>('csv');
  const [selectedDataType, setSelectedDataType] = useState<'completion' | 'activity' | 'exports' | 'engagement' | 'all'>('all');
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const exportFormats = [
    { value: 'csv', label: 'CSV', icon: <TableChart />, description: 'Comma-separated values for spreadsheets' },
    { value: 'xlsx', label: 'Excel', icon: <TableChart />, description: 'Microsoft Excel workbook' },
    { value: 'json', label: 'JSON', icon: <DataObject />, description: 'JavaScript Object Notation for developers' },
    { value: 'pdf', label: 'PDF', icon: <PictureAsPdf />, description: 'Formatted report document' }
  ];

  const dataTypes = [
    { value: 'completion', label: 'Completion Data', description: 'Canvas and section completion metrics' },
    { value: 'activity', label: 'Team Activity', description: 'User contributions and collaboration data' },
    { value: 'exports', label: 'Export Usage', description: 'Export statistics and usage patterns' },
    { value: 'engagement', label: 'Engagement Metrics', description: 'Team engagement and activity scores' },
    { value: 'all', label: 'Complete Dataset', description: 'All analytics data combined' }
  ];

  const handleExport = async () => {
    setExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const filename = generateFilename();
      const data = prepareExportData();
      
      // In a real implementation, this would:
      // 1. Process the data according to the selected format
      // 2. Generate the file
      // 3. Trigger download
      
      console.log('Exporting:', { filename, format: selectedFormat, dataType: selectedDataType, data });
      
      // Simulate file download
      downloadFile(filename, data);
      
      setExportSuccess(true);
      setTimeout(() => {
        setExportDialogOpen(false);
        setExportSuccess(false);
      }, 1500);
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const generateFilename = () => {
    const date = new Date().toISOString().split('T')[0];
    const timeRange = filters.timeRange.preset || 'custom';
    return `analytics-${selectedDataType}-${timeRange}-${date}.${selectedFormat}`;
  };

  const prepareExportData = () => {
    switch (selectedDataType) {
      case 'completion':
        return {
          overall: dashboardData.completion.overall,
          sections: dashboardData.completion.sections,
          trends: dashboardData.completion.trends
        };
      case 'activity':
        return {
          members: dashboardData.teamActivity.members,
          timeline: dashboardData.teamActivity.timeline,
          collaboration: dashboardData.teamActivity.collaborationMatrix
        };
      case 'exports':
        return dashboardData.exportUsage;
      case 'engagement':
        return dashboardData.engagement;
      case 'all':
      default:
        return dashboardData;
    }
  };

  const downloadFile = (filename: string, data: any) => {
    let content: string;
    let mimeType: string;

    switch (selectedFormat) {
      case 'csv':
        content = convertToCSV(data);
        mimeType = 'text/csv';
        break;
      case 'json':
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        break;
      case 'xlsx':
        // In a real implementation, use a library like xlsx
        content = convertToCSV(data);
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'pdf':
        // In a real implementation, use a library like jsPDF
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/pdf';
        break;
      default:
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: any): string => {
    // Simple CSV conversion for demo purposes
    // In a real implementation, this would be more sophisticated
    if (Array.isArray(data)) {
      if (data.length === 0) return '';
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(item => Object.values(item).join(','));
      return [headers, ...rows].join('\n');
    }
    
    // For complex objects, flatten them
    const flattened = flattenObject(data);
    return Object.entries(flattened).map(([key, value]) => `${key},${value}`).join('\n');
  };

  const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
    const flattened: Record<string, any> = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          Object.assign(flattened, flattenObject(obj[key], newKey));
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }
    
    return flattened;
  };

  const getEstimatedSize = () => {
    const data = prepareExportData();
    const jsonSize = JSON.stringify(data).length;
    
    switch (selectedFormat) {
      case 'csv':
        return `~${Math.round(jsonSize * 0.7 / 1024)}KB`;
      case 'xlsx':
        return `~${Math.round(jsonSize * 1.2 / 1024)}KB`;
      case 'json':
        return `~${Math.round(jsonSize / 1024)}KB`;
      case 'pdf':
        return `~${Math.round(jsonSize * 1.5 / 1024)}KB`;
      default:
        return `~${Math.round(jsonSize / 1024)}KB`;
    }
  };

  return (
    <Card sx={{ height: '100%', border: 1, borderColor: 'divider' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <GetApp color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Export Analytics Data
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Download your analytics data in various formats for further analysis or reporting.
          </Typography>

          {/* Quick Export Buttons */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<TableChart />}
                onClick={() => {
                  setSelectedFormat('csv');
                  setSelectedDataType('all');
                  setExportDialogOpen(true);
                }}
                sx={{ py: 1.5, textTransform: 'none' }}
              >
                Quick CSV Export
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PictureAsPdf />}
                onClick={() => {
                  setSelectedFormat('pdf');
                  setSelectedDataType('all');
                  setExportDialogOpen(true);
                }}
                sx={{ py: 1.5, textTransform: 'none' }}
              >
                Quick PDF Report
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Custom Export */}
          <Button
            fullWidth
            variant="contained"
            startIcon={<FileDownload />}
            onClick={() => setExportDialogOpen(true)}
            sx={{ py: 1.5, textTransform: 'none', mb: 3 }}
          >
            Custom Export Options
          </Button>

          {/* Export Info */}
          <Box sx={{ 
            bgcolor: 'grey.50',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            p: 2
          }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              What's Included
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Chip label="Canvas completion progress" size="small" variant="outlined" />
              <Chip label="Section-by-section status" size="small" variant="outlined" />
              <Chip label="Team member activities" size="small" variant="outlined" />
              <Chip label="Time-based analytics" size="small" variant="outlined" />
              <Chip label="Export usage statistics" size="small" variant="outlined" />
              <Chip label="Engagement metrics" size="small" variant="outlined" />
            </Box>
          </Box>
        </Box>

        {/* Data Summary */}
        <Box sx={{ 
          mt: 2, 
          pt: 2, 
          borderTop: 1, 
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="caption" color="text.secondary">
            Data range: {filters.timeRange.start.toLocaleDateString()} - {filters.timeRange.end.toLocaleDateString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {dashboardData.teamActivity.members.length} team members
          </Typography>
        </Box>
      </CardContent>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Export Analytics Data</DialogTitle>
        <DialogContent>
          {exportSuccess ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Export completed successfully! Your download should start automatically.
            </Alert>
          ) : (
            <>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Data Type</InputLabel>
                    <Select
                      value={selectedDataType}
                      label="Data Type"
                      onChange={(e) => setSelectedDataType(e.target.value as any)}
                    >
                      {dataTypes.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          <Box>
                            <Typography variant="body2">{type.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {type.description}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Format</InputLabel>
                    <Select
                      value={selectedFormat}
                      label="Format"
                      onChange={(e) => setSelectedFormat(e.target.value as any)}
                    >
                      {exportFormats.map(format => (
                        <MenuItem key={format.value} value={format.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {format.icon}
                            <Box>
                              <Typography variant="body2">{format.label}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {format.description}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Export Preview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Filename: {generateFilename()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Estimated size: {getEstimatedSize()}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)} disabled={exporting}>
            Cancel
          </Button>
          {!exportSuccess && (
            <Button 
              onClick={handleExport} 
              variant="contained"
              disabled={exporting}
              startIcon={exporting ? <CircularProgress size={16} /> : <FileDownload />}
            >
              {exporting ? 'Exporting...' : 'Export Data'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Card>
  );
};
