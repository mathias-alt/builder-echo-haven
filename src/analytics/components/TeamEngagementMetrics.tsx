import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  useTheme,
  alpha,
  Chip,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  People,
  TrendingUp,
  TrendingDown,
  Remove,
  Schedule,
  Handshake,
  Group
} from '@mui/icons-material';
import { TeamEngagementMetrics as TeamEngagementData } from '../types';

interface TeamEngagementMetricsProps {
  data: TeamEngagementData;
  teamSize: number;
}

export const TeamEngagementMetrics: React.FC<TeamEngagementMetricsProps> = ({
  data,
  teamSize
}) => {
  const theme = useTheme();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp sx={{ color: 'success.main' }} />;
      case 'decreasing':
        return <TrendingDown sx={{ color: 'error.main' }} />;
      default:
        return <Remove sx={{ color: 'text.secondary' }} />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return theme.palette.success.main;
      case 'decreasing':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getEngagementLevel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'success' };
    if (score >= 60) return { label: 'Good', color: 'info' };
    if (score >= 40) return { label: 'Fair', color: 'warning' };
    return { label: 'Needs Improvement', color: 'error' };
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const engagementLevel = getEngagementLevel(data.collaborationScore);
  const activePercentage = (data.dailyActiveUsers / teamSize) * 100;

  return (
    <Card sx={{ height: '100%', border: 1, borderColor: 'divider' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <People color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Team Engagement
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }}>
          {/* Collaboration Score */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={120}
                thickness={6}
                sx={{
                  color: alpha(theme.palette.grey[300], 0.3),
                  position: 'absolute'
                }}
              />
              <CircularProgress
                variant="determinate"
                value={data.collaborationScore}
                size={120}
                thickness={6}
                sx={{
                  color: getTrendColor(data.engagementTrend),
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  }
                }}
              />
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
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: getTrendColor(data.engagementTrend)
                  }}
                >
                  {data.collaborationScore}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Score
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip
                label={engagementLevel.label}
                color={engagementLevel.color as any}
                variant="outlined"
                icon={<Handshake />}
              />
              {getTrendIcon(data.engagementTrend)}
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              Team Collaboration Score
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Engagement Metrics */}
          <Grid container spacing={2}>
            {/* Daily Active Users */}
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {data.dailyActiveUsers}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Daily Active
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={activePercentage}
                  sx={{
                    mt: 1,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 2
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {Math.round(activePercentage)}% of team
                </Typography>
              </Box>
            </Grid>

            {/* Weekly Active Users */}
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'info.main' }}>
                  {data.weeklyActiveUsers}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Weekly Active
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(data.weeklyActiveUsers / teamSize) * 100}
                  color="info"
                  sx={{
                    mt: 1,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 2
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {Math.round((data.weeklyActiveUsers / teamSize) * 100)}% of team
                </Typography>
              </Box>
            </Grid>

            {/* Monthly Active Users */}
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'warning.main' }}>
                  {data.monthlyActiveUsers}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Monthly Active
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(data.monthlyActiveUsers / teamSize) * 100}
                  color="warning"
                  sx={{
                    mt: 1,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 2
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {Math.round((data.monthlyActiveUsers / teamSize) * 100)}% of team
                </Typography>
              </Box>
            </Grid>

            {/* Average Session Duration */}
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.main' }}>
                  {formatDuration(data.averageSessionDuration)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Avg Session
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                  <Schedule sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    per user
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Engagement Insights */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Insights
            </Typography>
            
            <Box sx={{ 
              bgcolor: alpha(theme.palette.info.main, 0.05),
              border: 1,
              borderColor: alpha(theme.palette.info.main, 0.2),
              borderRadius: 1,
              p: 2
            }}>
              {data.engagementTrend === 'increasing' && (
                <Typography variant="body2" color="text.secondary">
                  🎉 Team engagement is improving! Collaboration activities are trending upward with consistent daily active participation.
                </Typography>
              )}
              
              {data.engagementTrend === 'stable' && (
                <Typography variant="body2" color="text.secondary">
                  📊 Team engagement is stable. Consider introducing new collaboration features to boost activity levels.
                </Typography>
              )}
              
              {data.engagementTrend === 'decreasing' && (
                <Typography variant="body2" color="text.secondary">
                  📉 Team engagement is declining. Consider team check-ins and reviewing collaboration workflows.
                </Typography>
              )}
            </Box>

            {/* Quick Stats */}
            <Grid container spacing={1} sx={{ mt: 2 }}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {Math.round((data.dailyActiveUsers / data.monthlyActiveUsers) * 100)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Daily Retention
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {teamSize}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Team Size
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {Math.round(data.averageSessionDuration / 60 * 10) / 10}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Avg Hours
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
