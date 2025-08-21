import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  IconButton,
  Collapse,
  useTheme,
  alpha,
  Fab
} from '@mui/material';
import {
  Timeline,
  FilterList,
  Refresh,
  Group,
  ExpandMore,
  ExpandLess,
  PlayArrow,
  Pause
} from '@mui/icons-material';
import { ActivityItem } from './ActivityItem';
import { ActivityFilters } from './ActivityFilters';
import { ActivityGroupItem } from './ActivityGroupItem';
import { 
  Activity, 
  ActivityGroup, 
  ActivityFilters as Filters, 
  ActivityFeedProps, 
  ActivityUser,
  ActivityType
} from '../types';

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  canvasId,
  sectionId,
  userId,
  maxHeight = 600,
  showHeader = true,
  showFilters = true,
  enableGrouping = true,
  enableRealTime = true,
  onActivityClick,
  onUserClick
}) => {
  const theme = useTheme();
  const feedRef = useRef<HTMLDivElement>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [groupedActivities, setGroupedActivities] = useState<ActivityGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [groupingEnabled, setGroupingEnabled] = useState(enableGrouping);
  const [realTimeEnabled, setRealTimeEnabled] = useState(enableRealTime);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const [filters, setFilters] = useState<Filters>({
    users: [],
    activityTypes: [],
    dateRange: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date()
    },
    sections: sectionId ? [sectionId] : [],
    canvases: canvasId ? [canvasId] : [],
    searchQuery: ''
  });

  // Mock data for demonstration
  const generateMockActivities = (count: number, startPage: number = 1): Activity[] => {
    const users: ActivityUser[] = [
      { id: 'user1', name: 'John Doe', email: 'john@example.com', role: 'owner', avatar: 'https://mui.com/static/images/avatar/1.jpg' },
      { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin', avatar: 'https://mui.com/static/images/avatar/2.jpg' },
      { id: 'user3', name: 'Mike Johnson', email: 'mike@example.com', role: 'member' },
      { id: 'user4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'member', avatar: 'https://mui.com/static/images/avatar/4.jpg' }
    ];

    const activityTypes: ActivityType[] = [
      'note_created', 'note_updated', 'note_deleted', 'note_moved',
      'section_completed', 'canvas_shared', 'export_created', 'comment_added'
    ];

    const sections = ['sustainability', 'resources', 'stakeholders', 'value', 'customers'];
    const noteContents = [
      'Focus on renewable energy sources',
      'Implement circular economy principles',
      'Partner with local suppliers',
      'Develop sustainable packaging',
      'Create employee wellness program'
    ];

    return Array.from({ length: count }, (_, i) => {
      const user = users[Math.floor(Math.random() * users.length)];
      const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const sectionId = sections[Math.floor(Math.random() * sections.length)];
      const timestamp = new Date(Date.now() - (startPage - 1) * count * 30000 - i * 30000);

      return {
        id: `activity_${startPage}_${i}`,
        type,
        user,
        target: {
          type: 'note',
          id: `note_${i}`,
          name: noteContents[Math.floor(Math.random() * noteContents.length)],
          sectionId,
          canvasId: canvasId || 'canvas_1'
        },
        timestamp,
        description: `${user.name} ${type.replace('_', ' ')} a note`,
        metadata: {
          noteContent: type === 'note_created' ? noteContents[Math.floor(Math.random() * noteContents.length)] : undefined,
          exportFormat: type === 'export_created' ? ['pdf', 'png', 'svg'][Math.floor(Math.random() * 3)] : undefined,
          fromSection: type === 'note_moved' ? sections[Math.floor(Math.random() * sections.length)] : undefined,
          toSection: type === 'note_moved' ? sections[Math.floor(Math.random() * sections.length)] : undefined
        }
      };
    });
  };

  const groupActivities = (activities: Activity[]): ActivityGroup[] => {
    const groups: { [key: string]: ActivityGroup } = {};
    
    activities.forEach(activity => {
      const dateKey = activity.timestamp.toDateString();
      const groupKey = `${dateKey}_${activity.user.id}_${activity.type}`;
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          id: groupKey,
          type: activity.type,
          user: activity.user,
          activities: [],
          timestamp: activity.timestamp,
          count: 0,
          description: '',
          target: activity.target
        };
      }
      
      groups[groupKey].activities.push(activity);
      groups[groupKey].count = groups[groupKey].activities.length;
      
      // Update description based on count
      if (groups[groupKey].count === 1) {
        groups[groupKey].description = activity.description;
      } else {
        groups[groupKey].description = `${activity.user.name} ${activity.type.replace('_', ' ')} ${groups[groupKey].count} items`;
      }
    });
    
    return Object.values(groups).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const loadActivities = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newActivities = generateMockActivities(20, pageNum);
      
      if (append) {
        setActivities(prev => [...prev, ...newActivities]);
      } else {
        setActivities(newActivities);
      }
      
      setHasMore(pageNum < 5); // Simulate finite data
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      loadActivities(page + 1, true);
    }
  };

  const handleRefresh = () => {
    setLastUpdate(new Date());
    loadActivities(1, false);
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    if (scrollHeight - scrollTop <= clientHeight * 1.2 && hasMore && !loading) {
      loadMore();
    }
  }, [hasMore, loading, loadMore]);

  // Real-time updates simulation
  useEffect(() => {
    if (!realTimeEnabled) return;

    const interval = setInterval(() => {
      const newActivity = generateMockActivities(1, 0)[0];
      newActivity.id = `realtime_${Date.now()}`;
      newActivity.timestamp = new Date();
      
      setActivities(prev => [newActivity, ...prev.slice(0, 99)]); // Keep max 100 activities
    }, 15000); // New activity every 15 seconds

    return () => clearInterval(interval);
  }, [realTimeEnabled]);

  // Update grouped activities when activities change
  useEffect(() => {
    if (groupingEnabled) {
      setGroupedActivities(groupActivities(activities));
    }
  }, [activities, groupingEnabled]);

  // Filter activities based on current filters
  const filteredActivities = activities.filter(activity => {
    if (filters.users.length > 0 && !filters.users.includes(activity.user.id)) {
      return false;
    }
    
    if (filters.activityTypes.length > 0 && !filters.activityTypes.includes(activity.type)) {
      return false;
    }
    
    if (filters.sections.length > 0 && activity.target.sectionId && !filters.sections.includes(activity.target.sectionId)) {
      return false;
    }
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchText = `${activity.user.name} ${activity.description} ${activity.target.name}`.toLowerCase();
      if (!searchText.includes(query)) {
        return false;
      }
    }
    
    return activity.timestamp >= filters.dateRange.start && activity.timestamp <= filters.dateRange.end;
  });

  const filteredGroupedActivities = groupActivities(filteredActivities);

  const displayActivities = groupingEnabled ? filteredGroupedActivities : filteredActivities;
  const isEmpty = displayActivities.length === 0;

  // Mock data for filters
  const availableUsers: ActivityUser[] = [
    { id: 'user1', name: 'John Doe', email: 'john@example.com', role: 'owner', avatar: 'https://mui.com/static/images/avatar/1.jpg' },
    { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin', avatar: 'https://mui.com/static/images/avatar/2.jpg' },
    { id: 'user3', name: 'Mike Johnson', email: 'mike@example.com', role: 'member' },
    { id: 'user4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'member', avatar: 'https://mui.com/static/images/avatar/4.jpg' }
  ];

  const availableSections = ['sustainability', 'resources', 'stakeholders', 'value', 'customers'];

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return (
    <Card sx={{ height: '100%', border: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
      {showHeader && (
        <CardContent sx={{ borderBottom: 1, borderColor: 'divider', pb: 2, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Timeline color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Activity Feed
              </Typography>
              {realTimeEnabled && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      animation: 'pulse 2s infinite'
                    }}
                  />
                  <Typography variant="caption" color="success.main">
                    Live
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={handleRefresh} size="small" disabled={loading}>
                <Refresh />
              </IconButton>
              
              {showFilters && (
                <IconButton
                  onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                  size="small"
                  color={showFiltersPanel ? 'primary' : 'default'}
                >
                  <FilterList />
                </IconButton>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={groupingEnabled}
                  onChange={(e) => setGroupingEnabled(e.target.checked)}
                  size="small"
                />
              }
              label="Group activities"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={realTimeEnabled}
                  onChange={(e) => setRealTimeEnabled(e.target.checked)}
                  size="small"
                />
              }
              label="Real-time updates"
            />
          </Box>

          <Typography variant="caption" color="text.secondary">
            Showing {displayActivities.length} {groupingEnabled ? 'groups' : 'activities'} • Last updated: {lastUpdate.toLocaleTimeString()}
          </Typography>
        </CardContent>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <Collapse in={showFiltersPanel}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <CardContent>
              <ActivityFilters
                filters={filters}
                onFiltersChange={setFilters}
                availableUsers={availableUsers}
                availableSections={availableSections}
                availableCanvases={[]}
              />
            </CardContent>
          </Box>
        </Collapse>
      )}

      {/* Activity List */}
      <Box
        ref={feedRef}
        sx={{
          flex: 1,
          overflow: 'auto',
          maxHeight: showHeader ? maxHeight - 150 : maxHeight
        }}
        onScroll={handleScroll}
      >
        <CardContent sx={{ p: 2 }}>
          {isEmpty ? (
            <Alert severity="info" sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                {filters.users.length > 0 || filters.activityTypes.length > 0 || filters.searchQuery
                  ? 'No activities match your current filters'
                  : 'No activity yet. Start collaborating to see updates here!'
                }
              </Typography>
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {groupingEnabled
                ? filteredGroupedActivities.map((group) => (
                    <ActivityGroupItem
                      key={group.id}
                      group={group}
                      onActivityClick={onActivityClick}
                      onUserClick={onUserClick}
                    />
                  ))
                : filteredActivities.map((activity, index) => (
                    <ActivityItem
                      key={activity.id}
                      activity={activity}
                      onClick={onActivityClick}
                      onUserClick={onUserClick}
                      showCard={false}
                      compact={index === filteredActivities.length - 1}
                    />
                  ))
              }
              
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
              
              {hasMore && !loading && (
                <Button
                  variant="outlined"
                  onClick={loadMore}
                  sx={{ alignSelf: 'center', mt: 2 }}
                >
                  Load More Activities
                </Button>
              )}
            </Box>
          )}
        </CardContent>
      </Box>
    </Card>
  );
};
