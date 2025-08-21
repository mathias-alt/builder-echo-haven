import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Avatar,
  Checkbox,
  FormControlLabel,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  FilterList,
  ExpandMore,
  Clear,
  DateRange,
  Person,
  Category
} from '@mui/icons-material';
import { ActivityFilters as Filters, ActivityType, ActivityUser } from '../types';

interface ActivityFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  availableUsers: ActivityUser[];
  availableSections: string[];
  availableCanvases: string[];
}

const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  note_created: 'Note Created',
  note_updated: 'Note Updated',
  note_deleted: 'Note Deleted',
  note_moved: 'Note Moved',
  section_completed: 'Section Completed',
  canvas_created: 'Canvas Created',
  canvas_shared: 'Canvas Shared',
  team_member_added: 'Member Added',
  team_member_removed: 'Member Removed',
  export_created: 'Export Created',
  comment_added: 'Comment Added',
  comment_deleted: 'Comment Deleted'
};

export const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  filters,
  onFiltersChange,
  availableUsers,
  availableSections,
  availableCanvases
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | false>('users');

  const handleExpandChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleUserToggle = (userId: string) => {
    const newUsers = filters.users.includes(userId)
      ? filters.users.filter(id => id !== userId)
      : [...filters.users, userId];
    
    onFiltersChange({ ...filters, users: newUsers });
  };

  const handleActivityTypeToggle = (type: ActivityType) => {
    const newTypes = filters.activityTypes.includes(type)
      ? filters.activityTypes.filter(t => t !== type)
      : [...filters.activityTypes, type];
    
    onFiltersChange({ ...filters, activityTypes: newTypes });
  };

  const handleSectionToggle = (sectionId: string) => {
    const newSections = filters.sections.includes(sectionId)
      ? filters.sections.filter(id => id !== sectionId)
      : [...filters.sections, sectionId];
    
    onFiltersChange({ ...filters, sections: newSections });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    const date = new Date(value);
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: date
      }
    });
  };

  const handleSearchChange = (query: string) => {
    onFiltersChange({ ...filters, searchQuery: query });
  };

  const clearFilters = () => {
    onFiltersChange({
      users: [],
      activityTypes: [],
      dateRange: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date()
      },
      sections: [],
      canvases: [],
      searchQuery: ''
    });
  };

  const getActiveFiltersCount = () => {
    return filters.users.length + 
           filters.activityTypes.length + 
           filters.sections.length + 
           filters.canvases.length +
           (filters.searchQuery ? 1 : 0);
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Activity Filters
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount} active`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
        
        <Button
          variant="outlined"
          size="small"
          startIcon={<Clear />}
          onClick={clearFilters}
          disabled={activeFiltersCount === 0}
        >
          Clear All
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search activities..."
        value={filters.searchQuery || ''}
        onChange={(e) => handleSearchChange(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* Date Range */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Date Range
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="From"
              value={filters.dateRange.start.toISOString().split('T')[0]}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="To"
              value={filters.dateRange.end.toISOString().split('T')[0]}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                max: new Date().toISOString().split('T')[0]
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Filter Accordions */}
      <Box>
        {/* Users Filter */}
        <Accordion 
          expanded={expanded === 'users'} 
          onChange={handleExpandChange('users')}
          sx={{ border: 1, borderColor: 'divider', mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person fontSize="small" />
              <Typography variant="subtitle2">
                Users ({filters.users.length} selected)
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
              {availableUsers.map((user) => (
                <FormControlLabel
                  key={user.id}
                  control={
                    <Checkbox
                      checked={filters.users.includes(user.id)}
                      onChange={() => handleUserToggle(user.id)}
                      size="small"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={user.avatar} sx={{ width: 24, height: 24 }}>
                        {user.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">{user.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.role}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0, py: 0.5 }}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Activity Types Filter */}
        <Accordion 
          expanded={expanded === 'types'} 
          onChange={handleExpandChange('types')}
          sx={{ border: 1, borderColor: 'divider', mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Category fontSize="small" />
              <Typography variant="subtitle2">
                Activity Types ({filters.activityTypes.length} selected)
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1}>
              {Object.entries(ACTIVITY_TYPE_LABELS).map(([type, label]) => (
                <Grid item xs={12} sm={6} key={type}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filters.activityTypes.includes(type as ActivityType)}
                        onChange={() => handleActivityTypeToggle(type as ActivityType)}
                        size="small"
                      />
                    }
                    label={<Typography variant="body2">{label}</Typography>}
                    sx={{ m: 0 }}
                  />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Sections Filter */}
        <Accordion 
          expanded={expanded === 'sections'} 
          onChange={handleExpandChange('sections')}
          sx={{ border: 1, borderColor: 'divider', mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle2">
              Sections ({filters.sections.length} selected)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
              {availableSections.map((section) => (
                <FormControlLabel
                  key={section}
                  control={
                    <Checkbox
                      checked={filters.sections.includes(section)}
                      onChange={() => handleSectionToggle(section)}
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {section.replace('_', ' ')}
                    </Typography>
                  }
                  sx={{ width: '100%', m: 0, py: 0.5 }}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Active Filters
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {filters.users.map(userId => {
              const user = availableUsers.find(u => u.id === userId);
              return user ? (
                <Chip
                  key={userId}
                  label={user.name}
                  size="small"
                  onDelete={() => handleUserToggle(userId)}
                  avatar={<Avatar src={user.avatar} sx={{ width: 16, height: 16 }} />}
                />
              ) : null;
            })}
            
            {filters.activityTypes.map(type => (
              <Chip
                key={type}
                label={ACTIVITY_TYPE_LABELS[type]}
                size="small"
                onDelete={() => handleActivityTypeToggle(type)}
                color="info"
                variant="outlined"
              />
            ))}
            
            {filters.sections.map(section => (
              <Chip
                key={section}
                label={section.replace('_', ' ')}
                size="small"
                onDelete={() => handleSectionToggle(section)}
                color="secondary"
                variant="outlined"
              />
            ))}
            
            {filters.searchQuery && (
              <Chip
                label={`"${filters.searchQuery}"`}
                size="small"
                onDelete={() => handleSearchChange('')}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};
