import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  TextField,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha
} from '@mui/material';
import {
  FilterList,
  DateRange,
  Clear,
  CalendarToday
} from '@mui/icons-material';
import { AnalyticsFilterOptions, AnalyticsTimeRange } from '../types';

interface FilterPanelProps {
  filters: AnalyticsFilterOptions;
  onFiltersChange: (filters: AnalyticsFilterOptions) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange
}) => {
  const theme = useTheme();
  const [customDateDialogOpen, setCustomDateDialogOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');

  const timeRangePresets = [
    { value: 'last7days', label: 'Last 7 Days', days: 7 },
    { value: 'last30days', label: 'Last 30 Days', days: 30 },
    { value: 'last90days', label: 'Last 90 Days', days: 90 },
    { value: 'lastYear', label: 'Last Year', days: 365 },
    { value: 'allTime', label: 'All Time', days: null }
  ];

  const handlePresetChange = (preset: string) => {
    let start: Date;
    let end = new Date();
    
    const presetData = timeRangePresets.find(p => p.value === preset);
    
    if (preset === 'allTime') {
      start = new Date('2020-01-01'); // Default start date for all time
    } else if (presetData?.days) {
      start = new Date(Date.now() - presetData.days * 24 * 60 * 60 * 1000);
    } else {
      start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to 30 days
    }

    const newTimeRange: AnalyticsTimeRange = {
      start,
      end,
      preset: preset as any
    };

    onFiltersChange({
      ...filters,
      timeRange: newTimeRange
    });
  };

  const handleCustomDateOpen = () => {
    setTempStartDate(filters.timeRange.start.toISOString().split('T')[0]);
    setTempEndDate(filters.timeRange.end.toISOString().split('T')[0]);
    setCustomDateDialogOpen(true);
  };

  const handleCustomDateApply = () => {
    if (tempStartDate && tempEndDate) {
      const start = new Date(tempStartDate);
      const end = new Date(tempEndDate);
      end.setHours(23, 59, 59, 999); // Set to end of day

      const newTimeRange: AnalyticsTimeRange = {
        start,
        end,
        preset: 'custom'
      };

      onFiltersChange({
        ...filters,
        timeRange: newTimeRange
      });
    }
    setCustomDateDialogOpen(false);
  };

  const handleClearFilters = () => {
    onFiltersChange({
      timeRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
        preset: 'last30days'
      }
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.canvasIds?.length) count++;
    if (filters.userIds?.length) count++;
    if (filters.sectionIds?.length) count++;
    if (filters.exportFormats?.length) count++;
    if (filters.activityTypes?.length) count++;
    return count;
  };

  const formatDateRange = (timeRange: AnalyticsTimeRange) => {
    const formatOptions: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric' 
    };
    
    if (timeRange.preset === 'allTime') {
      return 'All Time';
    }
    
    if (timeRange.start.getFullYear() !== timeRange.end.getFullYear()) {
      formatOptions.year = 'numeric';
    }
    
    return `${timeRange.start.toLocaleDateString('en-US', formatOptions)} - ${timeRange.end.toLocaleDateString('en-US', formatOptions)}`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Analytics Filters
          </Typography>
          {getActiveFiltersCount() > 0 && (
            <Chip
              label={`${getActiveFiltersCount()} active`}
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
          onClick={handleClearFilters}
          disabled={getActiveFiltersCount() === 0}
        >
          Clear All
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Time Range Selection */}
        <Grid item xs={12} md={8}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Time Period
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {timeRangePresets.map((preset) => (
                <Button
                  key={preset.value}
                  variant={filters.timeRange.preset === preset.value ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => handlePresetChange(preset.value)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    minWidth: 'auto'
                  }}
                >
                  {preset.label}
                </Button>
              ))}
              
              <Button
                variant={filters.timeRange.preset === 'custom' ? 'contained' : 'outlined'}
                size="small"
                startIcon={<CalendarToday />}
                onClick={handleCustomDateOpen}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Custom Range
              </Button>
            </Box>

            <Box sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: 1,
              borderColor: alpha(theme.palette.primary.main, 0.2),
              borderRadius: 1,
              p: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DateRange sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Selected Range:
                </Typography>
                <Typography variant="body2" color="primary">
                  {formatDateRange(filters.timeRange)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Quick Insights */}
        <Grid item xs={12} md={4}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Insights
            </Typography>
            
            <Box sx={{ 
              bgcolor: alpha(theme.palette.info.main, 0.05),
              border: 1,
              borderColor: alpha(theme.palette.info.main, 0.2),
              borderRadius: 1,
              p: 2
            }}>
              <Typography variant="body2" color="text.secondary">
                {(() => {
                  const days = Math.ceil((filters.timeRange.end.getTime() - filters.timeRange.start.getTime()) / (1000 * 60 * 60 * 24));
                  
                  if (days === 1) return "Analyzing today's activity";
                  if (days <= 7) return `Analyzing ${days} days of activity`;
                  if (days <= 30) return `Analyzing ${Math.round(days / 7)} weeks of activity`;
                  if (days <= 365) return `Analyzing ${Math.round(days / 30)} months of activity`;
                  return `Analyzing ${Math.round(days / 365)} years of activity`;
                })()}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Additional Filters Row */}
        <Grid item xs={12}>
          <Box sx={{ 
            borderTop: 1, 
            borderColor: 'divider', 
            pt: 2,
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Additional filters:
            </Typography>
            
            <Chip
              label="Canvas Filter"
              variant="outlined"
              size="small"
              onClick={() => {/* TODO: Implement canvas filter */}}
              sx={{ cursor: 'pointer' }}
            />
            
            <Chip
              label="User Filter"
              variant="outlined"
              size="small"
              onClick={() => {/* TODO: Implement user filter */}}
              sx={{ cursor: 'pointer' }}
            />
            
            <Chip
              label="Section Filter"
              variant="outlined"
              size="small"
              onClick={() => {/* TODO: Implement section filter */}}
              sx={{ cursor: 'pointer' }}
            />
            
            <Typography variant="caption" color="text.secondary">
              (Coming soon)
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Custom Date Range Dialog */}
      <Dialog
        open={customDateDialogOpen}
        onClose={() => setCustomDateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Custom Date Range</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: tempEndDate || new Date().toISOString().split('T')[0]
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={tempEndDate}
                onChange={(e) => setTempEndDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: tempStartDate,
                  max: new Date().toISOString().split('T')[0]
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomDateDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCustomDateApply}
            variant="contained"
            disabled={!tempStartDate || !tempEndDate}
          >
            Apply Range
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
