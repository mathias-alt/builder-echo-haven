import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  CircularProgress,
  useTheme,
  alpha,
  Chip,
  Divider
} from '@mui/material';
import {
  Timeline,
  CheckCircle,
  Schedule,
  TrendingUp
} from '@mui/icons-material';
import { CompletionProgressData, AnalyticsTimeRange } from '../types';

interface CompletionProgressProps {
  data: CompletionProgressData;
  timeRange: AnalyticsTimeRange;
}

export const CompletionProgress: React.FC<CompletionProgressProps> = ({
  data,
  timeRange
}) => {
  const theme = useTheme();

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return theme.palette.success.main;
    if (percentage >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getTimeToCompleteText = (hours?: number) => {
    if (!hours) return 'Not estimated';
    if (hours < 1) return `${Math.ceil(hours * 60)} minutes`;
    return `${hours.toFixed(1)} hours`;
  };

  const getCompletionTrend = () => {
    const trends = data.trends;
    if (trends.length < 2) return { direction: 'stable', change: 0 };
    
    const recent = trends.slice(-7).reduce((sum, t) => sum + t.value, 0) / 7;
    const previous = trends.slice(-14, -7).reduce((sum, t) => sum + t.value, 0) / 7;
    const change = ((recent - previous) / previous) * 100;
    
    return {
      direction: change > 2 ? 'increasing' : change < -2 ? 'decreasing' : 'stable',
      change: Math.abs(change)
    };
  };

  const trend = getCompletionTrend();

  return (
    <Card sx={{ height: '100%', border: 1, borderColor: 'divider' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <CheckCircle color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Canvas Completion Progress
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ flex: 1 }}>
          {/* Main Progress Ring */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                {/* Background Circle */}
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={160}
                  thickness={6}
                  sx={{
                    color: alpha(theme.palette.grey[300], 0.3),
                    position: 'absolute'
                  }}
                />
                {/* Progress Circle */}
                <CircularProgress
                  variant="determinate"
                  value={data.overall.completionPercentage}
                  size={160}
                  thickness={6}
                  sx={{
                    color: getCompletionColor(data.overall.completionPercentage),
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    }
                  }}
                />
                {/* Center Content */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: getCompletionColor(data.overall.completionPercentage)
                    }}
                  >
                    {Math.round(data.overall.completionPercentage)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complete
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                {data.overall.canvasName}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Chip
                  label={`${data.overall.completedSections}/${data.overall.totalSections} Sections`}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={getTimeToCompleteText(data.overall.estimatedTimeToComplete)}
                  icon={<Schedule />}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
          </Grid>

          {/* Progress Details */}
          <Grid item xs={12} md={6}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Section Progress Bars */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Section Progress by Category
                </Typography>
                
                {['environment', 'society', 'process'].map((category) => {
                  const categorySections = data.sections.filter(s => s.category === category);
                  const categoryCompletion = categorySections.length > 0
                    ? categorySections.reduce((sum, s) => sum + s.completionPercentage, 0) / categorySections.length
                    : 0;
                  
                  const categoryColors = {
                    environment: theme.palette.success.main,
                    society: theme.palette.warning.main,
                    process: theme.palette.info.main
                  };

                  return (
                    <Box key={category} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                          {category}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {Math.round(categoryCompletion)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={categoryCompletion}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: alpha(categoryColors[category as keyof typeof categoryColors], 0.1),
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: categoryColors[category as keyof typeof categoryColors],
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>

              <Divider />

              {/* Completion Trend */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Progress Trend
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TrendingUp 
                    sx={{ 
                      color: trend.direction === 'increasing' ? 'success.main' : 
                             trend.direction === 'decreasing' ? 'error.main' : 'text.secondary',
                      transform: trend.direction === 'decreasing' ? 'rotate(180deg)' : 'none'
                    }} 
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {trend.direction === 'increasing' && 'Improving'}
                    {trend.direction === 'decreasing' && 'Declining'} 
                    {trend.direction === 'stable' && 'Stable'}
                    {trend.change > 0 && ` (+${trend.change.toFixed(1)}%)`}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  Compared to previous week
                </Typography>
              </Box>

              {/* Last Update */}
              <Box sx={{ mt: 'auto' }}>
                <Typography variant="caption" color="text.secondary">
                  Last updated: {data.overall.lastUpdated.toLocaleDateString()} at{' '}
                  {data.overall.lastUpdated.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Mini Progress Chart */}
          <Grid item xs={12}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Progress Over Time
              </Typography>
              
              <Box sx={{ 
                height: 60, 
                display: 'flex', 
                alignItems: 'end', 
                gap: 1,
                px: 1,
                overflow: 'hidden'
              }}>
                {data.trends.slice(-30).map((trend, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: 1,
                      minWidth: 2,
                      height: `${(trend.value / 100) * 100}%`,
                      backgroundColor: alpha(theme.palette.primary.main, 0.7),
                      borderRadius: '2px 2px 0 0',
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 1,
                px: 1
              }}>
                <Typography variant="caption" color="text.secondary">
                  {data.trends[data.trends.length - 30]?.date.toLocaleDateString() || 'Start'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Today
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
