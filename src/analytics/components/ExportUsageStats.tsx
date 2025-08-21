import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  useTheme,
  alpha,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Download,
  PictureAsPdf,
  Image,
  Code,
  Description,
  Share,
  TrendingUp
} from '@mui/icons-material';
import { ExportAnalyticsData, AnalyticsTimeRange } from '../types';

interface ExportUsageStatsProps {
  data: ExportAnalyticsData;
  timeRange: AnalyticsTimeRange;
}

export const ExportUsageStats: React.FC<ExportUsageStatsProps> = ({
  data,
  timeRange
}) => {
  const theme = useTheme();

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf':
        return <PictureAsPdf sx={{ color: '#f44336' }} />;
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <Image sx={{ color: '#2196f3' }} />;
      case 'svg':
        return <Code sx={{ color: '#4caf50' }} />;
      case 'html':
        return <Code sx={{ color: '#ff9800' }} />;
      case 'docx':
        return <Description sx={{ color: '#1976d2' }} />;
      default:
        return <Download sx={{ color: 'text.secondary' }} />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getTotalExports = () => data.usageStats.length;
  const getTotalDownloads = () => data.usageStats.reduce((sum, exp) => sum + exp.downloadCount, 0);
  const getSharedExports = () => data.usageStats.filter(exp => exp.isShared).length;
  const getTotalSize = () => data.usageStats.reduce((sum, exp) => sum + exp.fileSize, 0);

  const getTopExporter = () => {
    const userCounts = Object.entries(data.userExportActivity);
    if (userCounts.length === 0) return null;
    return userCounts.reduce((top, [userId, count]) => 
      count > top[1] ? [userId, count] : top
    );
  };

  const getGrowthTrend = () => {
    if (data.exportTrends.length < 2) return 0;
    const recent = data.exportTrends.slice(-7).reduce((sum, t) => sum + t.value, 0);
    const previous = data.exportTrends.slice(-14, -7).reduce((sum, t) => sum + t.value, 0);
    return previous > 0 ? ((recent - previous) / previous) * 100 : 0;
  };

  const topExporter = getTopExporter();
  const growthTrend = getGrowthTrend();

  return (
    <Card sx={{ height: '100%', border: 1, borderColor: 'divider' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Download color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Export Usage Statistics
          </Typography>
        </Box>

        {/* Key Metrics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {getTotalExports()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Exports
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha(theme.palette.success.main, 0.05), borderRadius: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                {getTotalDownloads()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Downloads
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Popular Formats */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Popular Formats
          </Typography>
          
          {data.popularFormats.map((format, index) => {
            const percentage = (format.value / data.popularFormats.reduce((sum, f) => sum + f.value, 0)) * 100;
            
            return (
              <Box key={format.label} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getFormatIcon(format.label)}
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {format.label}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {format.value} ({percentage.toFixed(0)}%)
                  </Typography>
                </Box>
                
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: alpha(format.color || theme.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: format.color || theme.palette.primary.main,
                      borderRadius: 3
                    }
                  }}
                />
              </Box>
            );
          })}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Recent Exports */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Recent Export Activity
          </Typography>
          
          <List sx={{ py: 0 }}>
            {data.usageStats.slice(-5).reverse().map((export_) => (
              <ListItem
                key={export_.exportId}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: 'background.paper'
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                    {getFormatIcon(export_.format)}
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {export_.userName}
                      </Typography>
                      <Chip
                        label={export_.format.toUpperCase()}
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                      {export_.isShared && (
                        <Share sx={{ fontSize: 16, color: 'info.main' }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(export_.fileSize)} • {export_.downloadCount} downloads
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        {export_.exportedAt.toLocaleDateString()} at {export_.exportedAt.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Export Insights */}
        <Box sx={{ 
          mt: 2, 
          pt: 2, 
          borderTop: 1, 
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.info.main, 0.02),
          borderRadius: 1,
          p: 2
        }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Export Insights
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Growth trend:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUp 
                sx={{ 
                  fontSize: 16,
                  color: growthTrend >= 0 ? 'success.main' : 'error.main',
                  transform: growthTrend < 0 ? 'rotate(180deg)' : 'none'
                }} 
              />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {growthTrend >= 0 ? '+' : ''}{growthTrend.toFixed(1)}%
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            {getSharedExports()} of {getTotalExports()} exports were shared publicly
          </Typography>
          
          {topExporter && (
            <Typography variant="body2" color="text.secondary">
              Most active exporter: User {topExporter[0]} ({topExporter[1]} exports)
            </Typography>
          )}
          
          <Typography variant="body2" color="text.secondary">
            Total storage used: {formatFileSize(getTotalSize())}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
