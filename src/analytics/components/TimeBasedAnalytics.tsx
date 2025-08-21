import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Grid,
  Paper,
  Chip
} from '@mui/material';
import {
  Timeline,
  TrendingUp,
  Group,
  StickyNote2,
  CheckCircle,
  Schedule
} from '@mui/icons-material';
import { CanvasEvolution, TimeBasedMetric, AnalyticsTimeRange } from '../types';

interface TimeBasedAnalyticsProps {
  canvasEvolution: CanvasEvolution[];
  completionTrends: TimeBasedMetric[];
  timeRange: AnalyticsTimeRange;
}

export const TimeBasedAnalytics: React.FC<TimeBasedAnalyticsProps> = ({
  canvasEvolution,
  completionTrends,
  timeRange
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const getMaxValue = (data: any[], key: string) => {
    return Math.max(...data.map(item => item[key] || 0));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const calculateGrowth = (data: any[], key: string) => {
    if (data.length < 2) return 0;
    const recent = data.slice(-7).reduce((sum, item) => sum + (item[key] || 0), 0) / 7;
    const previous = data.slice(-14, -7).reduce((sum, item) => sum + (item[key] || 0), 0) / 7;
    return previous > 0 ? ((recent - previous) / previous) * 100 : 0;
  };

  const renderChart = (data: any[], key: string, color: string, label: string) => {
    const maxValue = getMaxValue(data, key);
    const growth = calculateGrowth(data, key);
    
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
          <Chip
            label={`${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`}
            color={growth >= 0 ? 'success' : 'error'}
            size="small"
            icon={<TrendingUp />}
          />
        </Box>
        
        <Box sx={{ 
          height: 120, 
          display: 'flex', 
          alignItems: 'end', 
          gap: 1,
          px: 1,
          mb: 2
        }}>
          {data.slice(-30).map((item, index) => {
            const value = item[key] || 0;
            const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
            
            return (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  minWidth: 3,
                  height: `${Math.max(height, 2)}%`,
                  backgroundColor: alpha(color, 0.7),
                  borderRadius: '2px 2px 0 0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: color,
                    transform: 'scaleY(1.1)'
                  }
                }}
                title={`${formatDate(item.date)}: ${value}`}
              />
            );
          })}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {data.length > 30 ? formatDate(data[data.length - 30].date) : formatDate(data[0]?.date)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Today
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Card sx={{ border: 1, borderColor: 'divider' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Timeline color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Canvas Evolution Over Time
          </Typography>
        </Box>

        {/* Tab Navigation */}
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          <Tab label="Activity Overview" />
          <Tab label="Content Growth" />
          <Tab label="Team Engagement" />
          <Tab label="Progress Trends" />
        </Tabs>

        {/* Activity Overview */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                {renderChart(
                  canvasEvolution, 
                  'totalNotes', 
                  theme.palette.primary.main, 
                  'Total Notes'
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                {renderChart(
                  canvasEvolution, 
                  'activeUsers', 
                  theme.palette.success.main, 
                  'Active Users'
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Daily Activity Summary
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  height: 60,
                  alignItems: 'end',
                  overflow: 'hidden',
                  px: 1
                }}>
                  {canvasEvolution.slice(-30).map((day, index) => {
                    const intensity = (day.timeSpent / 120) * 100; // Normalize to max 2 hours
                    
                    return (
                      <Box
                        key={index}
                        sx={{
                          flex: 1,
                          minWidth: 8,
                          height: `${Math.max(intensity, 5)}%`,
                          backgroundColor: alpha(theme.palette.warning.main, 0.1 + (intensity / 100) * 0.8),
                          borderRadius: 1,
                          border: 1,
                          borderColor: alpha(theme.palette.warning.main, 0.3),
                          cursor: 'pointer'
                        }}
                        title={`${formatDate(day.date)}: ${day.timeSpent}min activity`}
                      />
                    );
                  })}
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, px: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Less active
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    More active
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Content Growth */}
        {activeTab === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                {renderChart(
                  canvasEvolution, 
                  'totalNotes', 
                  theme.palette.info.main, 
                  'Content Volume'
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                {renderChart(
                  canvasEvolution, 
                  'completedSections', 
                  theme.palette.success.main, 
                  'Completed Sections'
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 3, border: 1, borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Content Growth Metrics
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <StickyNote2 sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {canvasEvolution[canvasEvolution.length - 1]?.totalNotes || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Notes
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CheckCircle sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {canvasEvolution[canvasEvolution.length - 1]?.completedSections || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Completed Sections
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <TrendingUp sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {calculateGrowth(canvasEvolution, 'totalNotes').toFixed(1)}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Growth Rate
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Schedule sx={{ fontSize: 32, color: 'info.main', mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {Math.round(canvasEvolution.reduce((sum, day) => sum + day.timeSpent, 0) / canvasEvolution.length)}m
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Avg Daily Time
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Team Engagement */}
        {activeTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                {renderChart(
                  canvasEvolution, 
                  'activeUsers', 
                  theme.palette.secondary.main, 
                  'Daily Active Users'
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                {renderChart(
                  canvasEvolution, 
                  'timeSpent', 
                  theme.palette.error.main, 
                  'Time Spent (minutes)'
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Engagement Heatmap
                </Typography>
                
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: 1,
                  mb: 2
                }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <Typography key={day} variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                      {day}
                    </Typography>
                  ))}
                </Box>
                
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: 1
                }}>
                  {canvasEvolution.slice(-28).map((day, index) => {
                    const engagement = (day.activeUsers * day.timeSpent) / 100; // Simple engagement score
                    const intensity = Math.min(engagement / 10, 1);
                    
                    return (
                      <Box
                        key={index}
                        sx={{
                          aspectRatio: 1,
                          backgroundColor: alpha(theme.palette.primary.main, 0.1 + intensity * 0.8),
                          borderRadius: 0.5,
                          border: 1,
                          borderColor: alpha(theme.palette.primary.main, 0.2),
                          cursor: 'pointer'
                        }}
                        title={`${formatDate(day.date)}: ${day.activeUsers} users, ${day.timeSpent}min`}
                      />
                    );
                  })}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Progress Trends */}
        {activeTab === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                {renderChart(
                  completionTrends, 
                  'value', 
                  theme.palette.success.main, 
                  'Completion Progress (%)'
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Progress Insights
                </Typography>
                
                <Box sx={{ 
                  bgcolor: alpha(theme.palette.success.main, 0.05),
                  border: 1,
                  borderColor: alpha(theme.palette.success.main, 0.2),
                  borderRadius: 1,
                  p: 2
                }}>
                  <Typography variant="body2" color="text.secondary">
                    📈 Canvas completion has been steadily increasing over the selected time period. 
                    The team shows consistent progress with regular contributions across all sections.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};
