import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  AvatarGroup,
  Chip,
  LinearProgress,
  IconButton,
  Collapse,
  useTheme,
  alpha,
  Tooltip
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
  ExpandMore,
  ExpandLess,
  AccessTime,
  Group,
  StickyNote2,
  Nature,
  People,
  Business
} from '@mui/icons-material';
import { SectionCompletionData } from '../types';

interface SectionCompletionStatusProps {
  sections: SectionCompletionData[];
}

export const SectionCompletionStatus: React.FC<SectionCompletionStatusProps> = ({
  sections
}) => {
  const theme = useTheme();
  const [expandedCategory, setExpandedCategory] = useState<string | null>('environment');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'environment':
        return <Nature />;
      case 'society':
        return <People />;
      case 'process':
        return <Business />;
      default:
        return <Business />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'environment':
        return theme.palette.success.main;
      case 'society':
        return theme.palette.warning.main;
      case 'process':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getCompletionStatus = (percentage: number) => {
    if (percentage === 100) return { label: 'Complete', color: 'success' };
    if (percentage >= 75) return { label: 'Almost Done', color: 'warning' };
    if (percentage >= 50) return { label: 'In Progress', color: 'info' };
    if (percentage > 0) return { label: 'Started', color: 'primary' };
    return { label: 'Not Started', color: 'default' };
  };

  const formatTimeSpent = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const sectionsByCategory = sections.reduce((acc, section) => {
    if (!acc[section.category]) {
      acc[section.category] = [];
    }
    acc[section.category].push(section);
    return acc;
  }, {} as Record<string, SectionCompletionData[]>);

  const getCategoryStats = (categorySections: SectionCompletionData[]) => {
    const totalSections = categorySections.length;
    const completedSections = categorySections.filter(s => s.isCompleted).length;
    const totalNotes = categorySections.reduce((sum, s) => sum + s.notesCount, 0);
    const averageCompletion = categorySections.reduce((sum, s) => sum + s.completionPercentage, 0) / totalSections;
    
    return {
      totalSections,
      completedSections,
      totalNotes,
      averageCompletion
    };
  };

  const handleCategoryToggle = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <Card sx={{ height: '100%', border: 1, borderColor: 'divider' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <CheckCircle color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Section Completion Status
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {Object.entries(sectionsByCategory).map(([category, categorySections]) => {
            const stats = getCategoryStats(categorySections);
            const isExpanded = expandedCategory === category;
            
            return (
              <Box key={category} sx={{ mb: 2 }}>
                {/* Category Header */}
                <Card 
                  sx={{ 
                    mb: 1,
                    bgcolor: alpha(getCategoryColor(category), 0.05),
                    border: 1,
                    borderColor: alpha(getCategoryColor(category), 0.2),
                    cursor: 'pointer'
                  }}
                  onClick={() => handleCategoryToggle(category)}
                >
                  <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: getCategoryColor(category),
                            width: 32,
                            height: 32
                          }}
                        >
                          {getCategoryIcon(category)}
                        </Avatar>
                        
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                            {category}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stats.completedSections}/{stats.totalSections} sections • {stats.totalNotes} notes
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ textAlign: 'right', minWidth: 80 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {Math.round(stats.averageCompletion)}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Average
                          </Typography>
                        </Box>
                        
                        <IconButton size="small">
                          {isExpanded ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Category Progress Bar */}
                    <LinearProgress
                      variant="determinate"
                      value={stats.averageCompletion}
                      sx={{
                        mt: 2,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: alpha(getCategoryColor(category), 0.1),
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getCategoryColor(category),
                          borderRadius: 3
                        }
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Section Details */}
                <Collapse in={isExpanded}>
                  <List sx={{ pl: 2 }}>
                    {categorySections.map((section) => {
                      const status = getCompletionStatus(section.completionPercentage);
                      
                      return (
                        <ListItem 
                          key={section.sectionId}
                          sx={{
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 1,
                            mb: 1,
                            bgcolor: 'background.paper'
                          }}
                        >
                          <ListItemIcon>
                            {section.isCompleted ? (
                              <CheckCircle sx={{ color: 'success.main' }} />
                            ) : (
                              <RadioButtonUnchecked sx={{ color: 'text.secondary' }} />
                            )}
                          </ListItemIcon>
                          
                          <ListItemText
                            primary={
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {section.sectionName}
                                  </Typography>
                                  <Chip
                                    label={status.label}
                                    color={status.color as any}
                                    size="small"
                                    variant="outlined"
                                  />
                                </Box>

                                {/* Progress Bar */}
                                <LinearProgress
                                  variant="determinate"
                                  value={section.completionPercentage}
                                  sx={{
                                    mb: 1,
                                    height: 4,
                                    borderRadius: 2,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    '& .MuiLinearProgress-bar': {
                                      borderRadius: 2
                                    }
                                  }}
                                />

                                {/* Section Metrics */}
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 2,
                                  flexWrap: 'wrap'
                                }}>
                                  <Tooltip title="Notes in section">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <StickyNote2 sx={{ fontSize: 16, color: 'text.secondary' }} />
                                      <Typography variant="caption" color="text.secondary">
                                        {section.notesCount}
                                      </Typography>
                                    </Box>
                                  </Tooltip>

                                  <Tooltip title="Average time spent">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                                      <Typography variant="caption" color="text.secondary">
                                        {formatTimeSpent(section.averageTimeSpent)}
                                      </Typography>
                                    </Box>
                                  </Tooltip>

                                  {section.contributors.length > 0 && (
                                    <Tooltip title="Contributors">
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Group sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="caption" color="text.secondary">
                                          {section.contributors.length}
                                        </Typography>
                                      </Box>
                                    </Tooltip>
                                  )}

                                  <Typography variant="caption" color="text.secondary">
                                    Updated {section.lastUpdated.toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                          
                          <Box sx={{ textAlign: 'right', minWidth: 60 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {Math.round(section.completionPercentage)}%
                            </Typography>
                          </Box>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          })}
        </Box>

        {/* Summary */}
        <Box sx={{ 
          mt: 2, 
          pt: 2, 
          borderTop: 1, 
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.primary.main, 0.02),
          borderRadius: 1,
          p: 2
        }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Overall Summary
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {sections.filter(s => s.isCompleted).length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Completed
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {sections.reduce((sum, s) => sum + s.notesCount, 0)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Notes
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {formatTimeSpent(sections.reduce((sum, s) => sum + s.averageTimeSpent, 0))}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Time Spent
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
