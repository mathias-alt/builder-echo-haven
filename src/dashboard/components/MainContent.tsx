import * as React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  AvatarGroup,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  useTheme,
  alpha,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Add,
  TrendingUp,
  People,
  Timeline,
  Edit,
  Visibility,
  MoreVert,
  FiberManualRecord,
  CalendarToday,
  PersonAdd,
} from '@mui/icons-material';

interface MainContentProps {
  selectedCompany: string;
}

export default function MainContent({ selectedCompany }: MainContentProps) {
  const theme = useTheme();

  const recentActivity = [
    {
      action: 'Canvas updated',
      item: 'Business Model Canvas',
      user: 'Sarah Johnson',
      time: '2 hours ago',
      type: 'edit',
    },
    {
      action: 'New canvas created',
      item: 'Customer Journey Map',
      user: 'Mike Chen',
      time: '4 hours ago',
      type: 'create',
    },
    {
      action: 'Team member added',
      item: 'Alex Rodriguez joined',
      user: 'You',
      time: '1 day ago',
      type: 'team',
    },
    {
      action: 'Canvas completed',
      item: 'Value Proposition Canvas',
      user: 'Emily Davis',
      time: '2 days ago',
      type: 'complete',
    },
  ];

  const teamMembers = [
    { name: 'Sarah Johnson', role: 'Product Manager', avatar: 'S', online: true },
    { name: 'Mike Chen', role: 'Designer', avatar: 'M', online: true },
    { name: 'Emily Davis', role: 'Business Analyst', avatar: 'E', online: false },
    { name: 'Alex Rodriguez', role: 'Developer', avatar: 'A', online: true },
    { name: 'Lisa Park', role: 'Strategist', avatar: 'L', online: false },
  ];

  const canvasProgress = [
    { name: 'Business Model Canvas', progress: 85, status: 'active' },
    { name: 'Value Proposition Canvas', progress: 100, status: 'completed' },
    { name: 'Customer Journey Map', progress: 45, status: 'active' },
    { name: 'Lean Canvas', progress: 20, status: 'draft' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'edit':
        return <Edit sx={{ fontSize: 16, color: theme.palette.primary.main }} />;
      case 'create':
        return <Add sx={{ fontSize: 16, color: theme.palette.success.main }} />;
      case 'team':
        return <PersonAdd sx={{ fontSize: 16, color: theme.palette.info.main }} />;
      case 'complete':
        return <TrendingUp sx={{ fontSize: 16, color: theme.palette.success.main }} />;
      default:
        return <FiberManualRecord sx={{ fontSize: 16 }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'completed':
        return theme.palette.primary.main;
      case 'draft':
        return theme.palette.warning.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: 1400, 
      mx: 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1,
          }}
        >
          Welcome back, Mathias
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          Here's what's happening with your business canvases at {selectedCompany}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
      }}>
        {/* Main Column */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}>
          {/* Create New Canvas - Large Prominent Card */}
          <Card
            sx={{
              p: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
              },
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              }}
            />
            <CardContent sx={{ p: 0, position: 'relative' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 3,
                    backgroundColor: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 3,
                  }}
                >
                  <Add sx={{ fontSize: 32, color: 'white' }} />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      mb: 1,
                    }}
                  >
                    Create New Canvas
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Start building your next business model
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            width: 'auto',
            alignSelf: 'stretch'
          }}>
            <Box sx={{
              gap: 2,
              display: 'flex',
              '@media (max-width: 991px)': {
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: '0px',
              },
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                lineHeight: 'normal',
                width: '50%',
                marginLeft: '0px',
                '@media (max-width: 991px)': {
                  width: '100%',
                  marginLeft: 0,
                },
              }}>
                <Card
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    textAlign: 'center',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    4
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Active Canvases
                  </Typography>
                </Card>
              </Box>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                lineHeight: 'normal',
                width: '50%',
                marginLeft: '20px',
                '@media (max-width: 991px)': {
                  width: '100%',
                  marginLeft: 0,
                },
              }}>
                <Card
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    textAlign: 'center',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                    {teamMembers.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Team Members
                  </Typography>
                </Card>
              </Box>
            </Box>
          </Box>

          {/* Team Members */}
          <Card
            sx={{
              borderRadius: 3,
              '&:hover': {
                boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
              },
              transition: 'all 0.2s ease',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Team Members
                </Typography>
                <Button
                  size="small"
                  startIcon={<PersonAdd />}
                  sx={{ textTransform: 'none' }}
                >
                  Invite
                </Button>
              </Box>
              <List sx={{ p: 0 }}>
                {teamMembers.slice(0, 4).map((member, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      px: 0,
                      py: 1,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.action.hover, 0.05),
                        borderRadius: 1,
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        mr: 2,
                        backgroundColor: theme.palette.primary.main,
                      }}
                    >
                      {member.avatar}
                    </Avatar>
                    <ListItemText
                      primary={member.name}
                      secondary={member.role}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: 500,
                      }}
                      secondaryTypographyProps={{
                        variant: 'caption',
                      }}
                    />
                    <Chip
                      size="small"
                      label={member.online ? 'Online' : 'Offline'}
                      color={member.online ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </ListItem>
                ))}
              </List>
              {teamMembers.length > 4 && (
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.primary.main,
                    textAlign: 'center',
                    mt: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  View all {teamMembers.length} members
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 3,
              '&:hover': {
                boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
              },
              transition: 'all 0.2s ease',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Activity
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <List sx={{ p: 0 }}>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      sx={{
                        px: 0,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.action.hover, 0.05),
                          borderRadius: 1,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {getActivityIcon(activity.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ fontWeight: 500 }}
                            >
                              {activity.action}
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ color: theme.palette.primary.main, ml: 1 }}
                            >
                              {activity.item}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            by {activity.user} • {activity.time}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider sx={{ my: 0.5 }} />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Canvas Progress */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              '&:hover': {
                boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
              },
              transition: 'all 0.2s ease',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Canvas Progress
              </Typography>
              <Grid container spacing={3} sx={{ 
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap'
              }}>
                {canvasProgress.map((canvas, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: alpha(getStatusColor(canvas.status), 0.05),
                        border: `1px solid ${alpha(getStatusColor(canvas.status), 0.2)}`,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: `0 4px 20px ${alpha(getStatusColor(canvas.status), 0.15)}`,
                        },
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {canvas.name}
                        </Typography>
                        <Chip
                          size="small"
                          label={canvas.status}
                          sx={{
                            backgroundColor: getStatusColor(canvas.status),
                            color: 'white',
                            fontSize: '0.6rem',
                            height: 20,
                          }}
                        />
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={canvas.progress}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: alpha(getStatusColor(canvas.status), 0.2),
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getStatusColor(canvas.status),
                            },
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: '0.75rem',
                        }}
                      >
                        {canvas.progress}% complete
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
