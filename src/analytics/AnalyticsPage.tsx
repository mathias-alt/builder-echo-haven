import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Fab,
  useMediaQuery
} from '@mui/material';
import {
  Analytics,
  Download,
  Refresh
} from '@mui/icons-material';
import {
  AnalyticsDashboardData,
  AnalyticsFilterOptions,
  AnalyticsTimeRange
} from './types';
import { CompletionProgress } from './components/CompletionProgress';
import { SectionCompletionStatus } from './components/SectionCompletionStatus';
import { TeamActivityChart } from './components/TeamActivityChart';
import { TimeBasedAnalytics } from './components/TimeBasedAnalytics';
import { ExportUsageStats } from './components/ExportUsageStats';
import { TeamEngagementMetrics } from './components/TeamEngagementMetrics';
import { FilterPanel } from './components/FilterPanel';
import { ExportAnalyticsData } from './components/ExportAnalyticsData';

export default function AnalyticsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsDashboardData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const [filters, setFilters] = useState<AnalyticsFilterOptions>({
    timeRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      end: new Date(),
      preset: 'last30days'
    }
  });

  // Mock data generation
  const generateMockData = (): AnalyticsDashboardData => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      completion: {
        overall: {
          canvasId: 'canvas-1',
          canvasName: 'Flourishing Business Canvas',
          totalSections: 15,
          completedSections: 12,
          completionPercentage: 80,
          lastUpdated: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          estimatedTimeToComplete: 2.5
        },
        sections: [
          {
            sectionId: 'sustainability',
            sectionName: 'Sustainability Impact',
            category: 'environment',
            isCompleted: true,
            completionPercentage: 100,
            notesCount: 8,
            lastUpdated: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
            contributors: ['user1', 'user2'],
            averageTimeSpent: 45
          },
          {
            sectionId: 'resources',
            sectionName: 'Natural Resources',
            category: 'environment',
            isCompleted: true,
            completionPercentage: 90,
            notesCount: 6,
            lastUpdated: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
            contributors: ['user1', 'user3'],
            averageTimeSpent: 35
          },
          {
            sectionId: 'stakeholders',
            sectionName: 'Key Stakeholders',
            category: 'society',
            isCompleted: false,
            completionPercentage: 60,
            notesCount: 4,
            lastUpdated: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
            contributors: ['user2'],
            averageTimeSpent: 25
          }
        ],
        trends: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000),
          value: Math.min(100, 20 + i * 2 + Math.random() * 10)
        }))
      },
      teamActivity: {
        members: [
          {
            userId: 'user1',
            userName: 'John Doe',
            userEmail: 'john@example.com',
            userAvatar: 'https://mui.com/static/images/avatar/1.jpg',
            role: 'owner',
            contributionsCount: 45,
            sectionsWorkedOn: ['sustainability', 'resources', 'value'],
            timeSpent: 180,
            lastActive: new Date(now.getTime() - 1 * 60 * 60 * 1000),
            joinedDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          },
          {
            userId: 'user2',
            userName: 'Jane Smith',
            userEmail: 'jane@example.com',
            userAvatar: 'https://mui.com/static/images/avatar/2.jpg',
            role: 'admin',
            contributionsCount: 32,
            sectionsWorkedOn: ['stakeholders', 'community', 'channels'],
            timeSpent: 140,
            lastActive: new Date(now.getTime() - 3 * 60 * 60 * 1000),
            joinedDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000)
          },
          {
            userId: 'user3',
            userName: 'Mike Johnson',
            userEmail: 'mike@example.com',
            role: 'member',
            contributionsCount: 18,
            sectionsWorkedOn: ['resources', 'circular'],
            timeSpent: 90,
            lastActive: new Date(now.getTime() - 24 * 60 * 60 * 1000),
            joinedDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000)
          }
        ],
        timeline: [
          {
            id: '1',
            type: 'note_added',
            userId: 'user1',
            userName: 'John Doe',
            canvasId: 'canvas-1',
            sectionId: 'sustainability',
            timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
            description: 'Added note about renewable energy initiatives'
          },
          {
            id: '2',
            type: 'section_completed',
            userId: 'user2',
            userName: 'Jane Smith',
            canvasId: 'canvas-1',
            sectionId: 'stakeholders',
            timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000),
            description: 'Completed stakeholders section'
          }
        ],
        collaborationMatrix: {
          'user1': { 'sustainability': 8, 'resources': 5, 'value': 6 },
          'user2': { 'stakeholders': 7, 'community': 4, 'channels': 5 },
          'user3': { 'resources': 3, 'circular': 4 }
        }
      },
      canvasEvolution: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000),
        totalNotes: Math.floor(10 + i * 1.5 + Math.random() * 5),
        completedSections: Math.floor(Math.min(15, i / 3 + Math.random() * 2)),
        activeUsers: Math.floor(1 + Math.random() * 3),
        timeSpent: Math.floor(30 + Math.random() * 60)
      })),
      exportUsage: {
        usageStats: [
          {
            exportId: 'exp1',
            canvasId: 'canvas-1',
            userId: 'user1',
            userName: 'John Doe',
            format: 'pdf',
            exportedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
            fileSize: 2048576,
            downloadCount: 5,
            isShared: true
          },
          {
            exportId: 'exp2',
            canvasId: 'canvas-1',
            userId: 'user2',
            userName: 'Jane Smith',
            format: 'png',
            exportedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
            fileSize: 1024768,
            downloadCount: 2,
            isShared: false
          }
        ],
        popularFormats: [
          { label: 'PDF', value: 45, color: '#f44336' },
          { label: 'PNG', value: 30, color: '#2196f3' },
          { label: 'SVG', value: 15, color: '#4caf50' },
          { label: 'HTML', value: 10, color: '#ff9800' }
        ],
        exportTrends: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000),
          value: Math.floor(Math.random() * 10)
        })),
        userExportActivity: {
          'user1': 12,
          'user2': 8,
          'user3': 3
        }
      },
      engagement: {
        totalActiveUsers: 3,
        dailyActiveUsers: 2,
        weeklyActiveUsers: 3,
        monthlyActiveUsers: 3,
        averageSessionDuration: 85,
        collaborationScore: 78,
        engagementTrend: 'increasing'
      },
      lastUpdated: now
    };
  };

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData = generateMockData();
      setData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
  };

  const handleFilterChange = async (newFilters: AnalyticsFilterOptions) => {
    setFilters(newFilters);
    await fetchAnalyticsData();
  };

  useEffect(() => {
    document.title = 'Analytics - Flourishing Business Canvas';
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="h6" color="text.secondary">
          Loading Analytics...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!data) return null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          py: 3
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Analytics sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Analytics Dashboard
            </Typography>
          </Box>
          
          <Typography variant="body1" color="text.secondary">
            Track your canvas progress, team collaboration, and engagement metrics
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Last updated: {data.lastUpdated.toLocaleString()}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Filters */}
        <Card sx={{ mb: 3, border: 1, borderColor: 'divider' }}>
          <CardContent>
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFilterChange}
            />
          </CardContent>
        </Card>

        {/* Main Analytics Grid */}
        <Grid container spacing={3}>
          {/* Completion Progress */}
          <Grid item xs={12} lg={8}>
            <CompletionProgress
              data={data.completion}
              timeRange={filters.timeRange}
            />
          </Grid>

          {/* Team Engagement Metrics */}
          <Grid item xs={12} lg={4}>
            <TeamEngagementMetrics
              data={data.engagement}
              teamSize={data.teamActivity.members.length}
            />
          </Grid>

          {/* Section Completion Status */}
          <Grid item xs={12} md={6}>
            <SectionCompletionStatus
              sections={data.completion.sections}
            />
          </Grid>

          {/* Team Activity Chart */}
          <Grid item xs={12} md={6}>
            <TeamActivityChart
              data={data.teamActivity}
              timeRange={filters.timeRange}
            />
          </Grid>

          {/* Time-based Analytics */}
          <Grid item xs={12}>
            <TimeBasedAnalytics
              canvasEvolution={data.canvasEvolution}
              completionTrends={data.completion.trends}
              timeRange={filters.timeRange}
            />
          </Grid>

          {/* Export Usage Stats */}
          <Grid item xs={12} md={6}>
            <ExportUsageStats
              data={data.exportUsage}
              timeRange={filters.timeRange}
            />
          </Grid>

          {/* Export Analytics Data */}
          <Grid item xs={12} md={6}>
            <ExportAnalyticsData
              dashboardData={data}
              filters={filters}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Floating Action Buttons */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        <Fab
          color="primary"
          onClick={handleRefresh}
          disabled={refreshing}
          size={isMobile ? 'medium' : 'large'}
        >
          <Refresh sx={{ 
            animation: refreshing ? 'spin 1s linear infinite' : 'none',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }} />
        </Fab>
      </Box>
    </Box>
  );
}
