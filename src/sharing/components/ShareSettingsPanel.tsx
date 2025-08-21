import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
  Chip,
  Grid,
  Paper
} from '@mui/material';
import {
  Security,
  Notifications,
  Download,
  Comment,
  Analytics,
  Link,
  Schedule,
  Lock
} from '@mui/icons-material';
import { ShareSettings } from '../types';

interface ShareSettingsPanelProps {
  settings: ShareSettings;
  onSettingsChange: (settings: Partial<ShareSettings>) => void;
}

export const ShareSettingsPanel: React.FC<ShareSettingsPanelProps> = ({
  settings,
  onSettingsChange
}) => {
  const handleSettingChange = (key: keyof ShareSettings, value: any) => {
    onSettingsChange({ [key]: value });
  };

  const getSettingsSummary = () => {
    const summary = [];
    
    if (settings.privacy === 'public') {
      summary.push({ label: 'Public Access', color: 'success', icon: <Link /> });
    } else {
      summary.push({ label: 'Private Access', color: 'warning', icon: <Lock /> });
    }
    
    if (settings.requirePassword) {
      summary.push({ label: 'Password Protected', color: 'error', icon: <Security /> });
    }
    
    if (settings.expiresAt) {
      summary.push({ label: 'Link Expires', color: 'info', icon: <Schedule /> });
    }
    
    if (settings.allowComments) {
      summary.push({ label: 'Comments Enabled', color: 'primary', icon: <Comment /> });
    }
    
    if (settings.allowDownload) {
      summary.push({ label: 'Downloads Allowed', color: 'primary', icon: <Download /> });
    }

    return summary;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Sharing Settings
      </Typography>

      {/* Settings Summary */}
      <Card sx={{ mb: 3, border: 1, borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Current Configuration
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {getSettingsSummary().map((item, index) => (
              <Chip
                key={index}
                icon={item.icon}
                label={item.label}
                color={item.color as any}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Access & Security Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security color="primary" />
                Access & Security
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.allowComments}
                      onChange={(e) => handleSettingChange('allowComments', e.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Allow comments
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Let viewers add comments to the canvas
                      </Typography>
                    </Box>
                  }
                  sx={{ margin: 0, alignItems: 'flex-start' }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.allowDownload}
                      onChange={(e) => handleSettingChange('allowDownload', e.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Allow downloads
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Let viewers export and download the canvas
                      </Typography>
                    </Box>
                  }
                  sx={{ margin: 0, alignItems: 'flex-start' }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.embedEnabled}
                      onChange={(e) => handleSettingChange('embedEnabled', e.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Enable embedding
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Allow this canvas to be embedded in websites
                      </Typography>
                    </Box>
                  }
                  sx={{ margin: 0, alignItems: 'flex-start' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications & Analytics */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Notifications color="primary" />
                Notifications & Analytics
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifyOnAccess}
                      onChange={(e) => handleSettingChange('notifyOnAccess', e.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Notify on access
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Get notified when someone views your canvas
                      </Typography>
                    </Box>
                  }
                  sx={{ margin: 0, alignItems: 'flex-start' }}
                />

                <Box sx={{ 
                  bgcolor: 'grey.50', 
                  p: 2, 
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'divider'
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Analytics fontSize="small" />
                    Analytics Preview
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Track views, unique visitors, and engagement metrics for your shared canvas.
                    Detailed analytics are available in the Access tab.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Advanced Settings Information */}
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Advanced Security Options
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: settings.requirePassword ? 'success.light' : 'grey.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Lock fontSize="small" color={settings.requirePassword ? 'success' : 'disabled'} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Password Protection
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {settings.requirePassword 
                  ? 'Password protection is enabled'
                  : 'Configure in the Share Link tab'
                }
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: settings.expiresAt ? 'warning.light' : 'grey.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Schedule fontSize="small" color={settings.expiresAt ? 'warning' : 'disabled'} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Link Expiration
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {settings.expiresAt 
                  ? `Expires on ${settings.expiresAt.toLocaleDateString()}`
                  : 'Configure in the Share Link tab'
                }
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Security Recommendations */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
          Security Recommendations:
        </Typography>
        <Typography variant="body2" component="div">
          • Use password protection for sensitive business information
          <br />
          • Set expiration dates for temporary sharing
          <br />
          • Monitor access through the Access Management tab
          <br />
          • Disable downloads if you want to maintain control over content
        </Typography>
      </Alert>

      {/* Privacy Notice */}
      <Alert severity="warning" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Privacy Notice:</strong> When sharing publicly, your canvas may be accessible to search engines. 
          Use private sharing for confidential business information.
        </Typography>
      </Alert>
    </Box>
  );
};
