import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import {
  Schedule,
  CalendarToday,
  AccessTime
} from '@mui/icons-material';
import { ShareSettings } from '../types';

interface ExpirationSettingsProps {
  open: boolean;
  onClose: () => void;
  settings: ShareSettings;
  onSettingsChange: (settings: Partial<ShareSettings>) => void;
}

export const ExpirationSettings: React.FC<ExpirationSettingsProps> = ({
  open,
  onClose,
  settings,
  onSettingsChange
}) => {
  const [expirationType, setExpirationType] = useState<'never' | 'preset' | 'custom'>(
    settings.expiresAt ? 'preset' : 'never'
  );
  const [selectedPreset, setSelectedPreset] = useState('7days');
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');

  const presetOptions = [
    { value: '1hour', label: '1 Hour', days: 0, hours: 1 },
    { value: '24hours', label: '24 Hours', days: 1, hours: 0 },
    { value: '3days', label: '3 Days', days: 3, hours: 0 },
    { value: '7days', label: '1 Week', days: 7, hours: 0 },
    { value: '30days', label: '1 Month', days: 30, hours: 0 },
    { value: '90days', label: '3 Months', days: 90, hours: 0 }
  ];

  const handleSave = () => {
    let expiresAt: Date | undefined;

    if (expirationType === 'never') {
      expiresAt = undefined;
    } else if (expirationType === 'preset') {
      const preset = presetOptions.find(p => p.value === selectedPreset);
      if (preset) {
        const now = new Date();
        expiresAt = new Date(now.getTime() + (preset.days * 24 * 60 * 60 * 1000) + (preset.hours * 60 * 60 * 1000));
      }
    } else if (expirationType === 'custom' && customDate) {
      const dateTime = customTime ? `${customDate}T${customTime}` : `${customDate}T23:59`;
      expiresAt = new Date(dateTime);
    }

    onSettingsChange({ expiresAt });
    onClose();
  };

  const formatExpirationDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeUntilExpiration = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return 'Expired';
    }

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    }
  };

  // Set default custom date to tomorrow
  React.useEffect(() => {
    if (!customDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setCustomDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [customDate]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Schedule color="primary" />
        Link Expiration Settings
      </DialogTitle>

      <DialogContent>
        {/* Current Expiration Status */}
        {settings.expiresAt && (
          <Alert 
            severity={new Date() > settings.expiresAt ? 'error' : 'info'} 
            sx={{ mb: 3 }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Current expiration: {formatExpirationDate(settings.expiresAt)}
            </Typography>
            <Typography variant="body2">
              {new Date() > settings.expiresAt 
                ? 'This link has expired'
                : `Expires in ${getTimeUntilExpiration(settings.expiresAt)}`
              }
            </Typography>
          </Alert>
        )}

        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={expirationType}
            onChange={(e) => setExpirationType(e.target.value as any)}
          >
            {/* Never Expires */}
            <FormControlLabel
              value="never"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Never expires
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Link will remain active indefinitely
                  </Typography>
                </Box>
              }
              sx={{ mb: 2, alignItems: 'flex-start' }}
            />

            {/* Preset Durations */}
            <FormControlLabel
              value="preset"
              control={<Radio />}
              label={
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                    Set expiration duration
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Choose from common expiration times
                  </Typography>
                  
                  {expirationType === 'preset' && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', ml: 2 }}>
                      {presetOptions.map((option) => (
                        <Chip
                          key={option.value}
                          label={option.label}
                          onClick={() => setSelectedPreset(option.value)}
                          color={selectedPreset === option.value ? 'primary' : 'default'}
                          variant={selectedPreset === option.value ? 'filled' : 'outlined'}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              }
              sx={{ mb: 2, alignItems: 'flex-start' }}
            />

            {/* Custom Date/Time */}
            <FormControlLabel
              value="custom"
              control={<Radio />}
              label={
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                    Custom expiration date
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Set a specific date and time
                  </Typography>
                  
                  {expirationType === 'custom' && (
                    <Box sx={{ display: 'flex', gap: 2, ml: 2, flexWrap: 'wrap' }}>
                      <TextField
                        type="date"
                        label="Date"
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          min: new Date().toISOString().split('T')[0]
                        }}
                        sx={{ minWidth: 150 }}
                      />
                      <TextField
                        type="time"
                        label="Time"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ minWidth: 120 }}
                      />
                    </Box>
                  )}
                </Box>
              }
              sx={{ mb: 2, alignItems: 'flex-start' }}
            />
          </RadioGroup>
        </FormControl>

        <Divider sx={{ my: 3 }} />

        {/* Preview */}
        <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday fontSize="small" />
            Preview
          </Typography>
          
          {expirationType === 'never' && (
            <Typography variant="body2" color="text.secondary">
              This link will never expire and remain accessible indefinitely.
            </Typography>
          )}
          
          {expirationType === 'preset' && (
            <Typography variant="body2" color="text.secondary">
              {(() => {
                const preset = presetOptions.find(p => p.value === selectedPreset);
                if (preset) {
                  const futureDate = new Date();
                  futureDate.setTime(futureDate.getTime() + (preset.days * 24 * 60 * 60 * 1000) + (preset.hours * 60 * 60 * 1000));
                  return `Link will expire on ${formatExpirationDate(futureDate)}`;
                }
                return 'Select a duration above';
              })()}
            </Typography>
          )}
          
          {expirationType === 'custom' && customDate && (
            <Typography variant="body2" color="text.secondary">
              {(() => {
                const dateTime = customTime ? `${customDate}T${customTime}` : `${customDate}T23:59`;
                const futureDate = new Date(dateTime);
                return `Link will expire on ${formatExpirationDate(futureDate)}`;
              })()}
            </Typography>
          )}
        </Box>

        {/* Additional Info */}
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            After expiration, the link will no longer be accessible and users will see an "expired link" message.
            You can always regenerate a new link or extend the expiration time.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={expirationType === 'custom' && !customDate}
        >
          Save Settings
        </Button>
      </DialogActions>
    </Dialog>
  );
};
