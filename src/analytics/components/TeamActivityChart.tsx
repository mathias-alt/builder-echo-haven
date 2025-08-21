import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Grid,
  Paper,
  Tooltip
} from '@mui/material';
import {
  Group,
  TrendingUp,
  Schedule,
  Edit,
  Visibility,
  Comment,
  Person,
  AdminPanelSettings
} from '@mui/icons-material';
import { TeamActivityData, AnalyticsTimeRange } from '../types';

interface TeamActivityChartProps {
  data: TeamActivityData;
  timeRange: AnalyticsTimeRange;
}

export const TeamActivityChart: React.FC<TeamActivityChartProps> = ({
  data,
  timeRange
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
      case 'admin':
        return <AdminPanelSettings sx={{ fontSize: 16 }} />;
      case 'member':
        return <Person sx={{ fontSize: 16 }} />;
      case 'viewer':
        return <Visibility sx={{ fontSize: 16 }} />;
      default:
        return <Person sx={{ fontSize: 16 }} />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return theme.palette.error.main;
      case 'admin':
        return theme.palette.warning.main;
      case 'member':
        return theme.palette.info.main;
      case 'viewer':
        return theme.palette.grey[500];
      default:
        return theme.palette.grey[500];
    }
  };

  const formatTimeSpent = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getActivityLevel = (contributions: number) => {
    if (contributions >= 30) return { label: 'Very Active', color: 'success' };
    if (contributions >= 15) return { label: 'Active', color: 'info' };
    if (contributions >= 5) return { label: 'Moderate', color: 'warning' };
    return { label: 'Low Activity', color: 'error' };
  };

  const sortedMembers = [...data.members].sort((a, b) => {
    switch (activeTab) {
      case 0: // By Contributions
        return b.contributionsCount - a.contributionsCount;
      case 1: // By Time Spent
        return b.timeSpent - a.timeSpent;
      case 2: // By Recent Activity
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      default:
        return 0;
    }
  });

  const getCollaborationHeatmap = () => {
    const sectionIds = Array.from(new Set(
      Object.values(data.collaborationMatrix).flatMap(userSections => Object.keys(userSections))
    ));
    
    return sectionIds.map(sectionId => {
      const contributors = Object.entries(data.collaborationMatrix)
        .filter(([_, sections]) => sections[sectionId])
        .map(([userId, sections]) => ({
          userId,
          contributions: sections[sectionId],
          user: data.members.find(m => m.userId === userId)
        }))
        .sort((a, b) => b.contributions - a.contributions);
      
      return {
        sectionId,
        contributors,
        totalContributions: contributors.reduce((sum, c) => sum + c.contributions, 0)
      };
    });
  };

  const collaborationData = getCollaborationHeatmap();

  return (
    <Card sx={{ height: '100%', border: 1, borderColor: 'divider' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Group color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Team Activity
          </Typography>
        </Box>

        {/* Tab Navigation */}
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab label="Contributors" />
          <Tab label="Time Spent" />
          <Tab label="Collaboration" />
        </Tabs>

        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {/* Contributors Tab */}
          {activeTab === 0 && (
            <List sx={{ py: 0 }}>
              {sortedMembers.map((member, index) => {
                const activity = getActivityLevel(member.contributionsCount);
                const isTopContributor = index < 3;
                
                return (
                  <ListItem
                    key={member.userId}
                    sx={{
                      border: 1,
                      borderColor: isTopContributor ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: isTopContributor ? alpha(theme.palette.primary.main, 0.02) : 'background.paper'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={member.userAvatar}
                        sx={{
                          border: isTopContributor ? 2 : 0,
                          borderColor: 'primary.main'
                        }}
                      >
                        {member.userName.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {member.userName}
                          </Typography>
                          {isTopContributor && (
                            <Chip
                              label={`#${index + 1}`}
                              color="primary"
                              size="small"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Chip
                            icon={getRoleIcon(member.role)}
                            label={member.role}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              backgroundColor: alpha(getRoleColor(member.role), 0.1),
                              color: getRoleColor(member.role)
                            }}
                          />
                          <Chip
                            label={activity.label}
                            color={activity.color as any}
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        </Box>
                      }
                    />
                    
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {member.contributionsCount}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        contributions
                      </Typography>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          )}

          {/* Time Spent Tab */}
          {activeTab === 1 && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {sortedMembers.map((member) => (
                  <Grid item xs={12} sm={6} key={member.userId}>
                    <Paper sx={{ p: 2, textAlign: 'center', border: 1, borderColor: 'divider' }}>
                      <Avatar
                        src={member.userAvatar}
                        sx={{ width: 40, height: 40, mx: 'auto', mb: 1 }}
                      >
                        {member.userName.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {member.userName}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                        {formatTimeSpent(member.timeSpent)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {member.sectionsWorkedOn.length} sections
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              
              {/* Time Distribution Chart */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Time Distribution
                </Typography>
                <Box sx={{ display: 'flex', height: 40, borderRadius: 1, overflow: 'hidden' }}>
                  {sortedMembers.map((member, index) => {
                    const totalTime = data.members.reduce((sum, m) => sum + m.timeSpent, 0);
                    const percentage = (member.timeSpent / totalTime) * 100;
                    const colors = [
                      theme.palette.primary.main,
                      theme.palette.secondary.main,
                      theme.palette.info.main,
                      theme.palette.warning.main
                    ];
                    
                    return (
                      <Tooltip
                        key={member.userId}
                        title={`${member.userName}: ${formatTimeSpent(member.timeSpent)} (${percentage.toFixed(1)}%)`}
                      >
                        <Box
                          sx={{
                            width: `${percentage}%`,
                            backgroundColor: colors[index % colors.length],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}
                        >
                          {percentage > 10 && `${percentage.toFixed(0)}%`}
                        </Box>
                      </Tooltip>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          )}

          {/* Collaboration Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Section Collaboration Matrix
              </Typography>
              
              {collaborationData.map((section) => (
                <Card key={section.sectionId} sx={{ mb: 2, border: 1, borderColor: 'divider' }}>
                  <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {section.sectionId.charAt(0).toUpperCase() + section.sectionId.slice(1)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {section.totalContributions} total contributions
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {section.contributors.map((contributor) => (
                        <Tooltip
                          key={contributor.userId}
                          title={`${contributor.user?.userName}: ${contributor.contributions} contributions`}
                        >
                          <Chip
                            avatar={
                              <Avatar
                                src={contributor.user?.userAvatar}
                                sx={{ width: 24, height: 24 }}
                              >
                                {contributor.user?.userName?.charAt(0)}
                              </Avatar>
                            }
                            label={contributor.contributions}
                            size="small"
                            variant="outlined"
                            sx={{
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              borderColor: theme.palette.primary.main
                            }}
                          />
                        </Tooltip>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        {/* Quick Stats */}
        <Box sx={{ 
          mt: 2, 
          pt: 2, 
          borderTop: 1, 
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-around',
          bgcolor: alpha(theme.palette.primary.main, 0.02),
          borderRadius: 1,
          p: 2
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {data.members.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Team Members
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {data.members.reduce((sum, m) => sum + m.contributionsCount, 0)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Contributions
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {formatTimeSpent(data.members.reduce((sum, m) => sum + m.timeSpent, 0))}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Time
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
