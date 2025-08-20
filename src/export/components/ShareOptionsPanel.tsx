import * as React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  useTheme,
  alpha,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Share,
  Lock,
  LockOpen,
  Visibility,
  VisibilityOff,
  ContentCopy,
  QrCode,
  Delete,
  Edit,
  Schedule,
  Email,
  Download,
  Comment,
  Public,
  Security,
} from '@mui/icons-material';
import { ShareOptions } from '../types';

interface ShareOptionsPanelProps {
  canvasId: string;
  canvasName: string;
}

export default function ShareOptionsPanel({
  canvasId,
  canvasName,
}: ShareOptionsPanelProps) {
  const theme = useTheme();
  const [shareOptions, setShareOptions] = React.useState<ShareOptions>({
    isPublic: false,
    allowDownload: true,
    allowComments: false,
    passwordProtected: false,
    notifyByEmail: false,
    recipientEmails: [],
  });
  
  const [showPassword, setShowPassword] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState('');
  const [shareUrl, setShareUrl] = React.useState('');
  const [qrCodeVisible, setQrCodeVisible] = React.useState(false);

  React.useEffect(() => {
    // Generate share URL when sharing is enabled
    if (shareOptions.isPublic) {
      const baseUrl = 'https://share.flourishingcanvas.com';
      const shareCode = Math.random().toString(36).substr(2, 9);
      setShareUrl(`${baseUrl}/${shareCode}`);
    } else {
      setShareUrl('');
    }
  }, [shareOptions.isPublic]);

  const handleShareOptionChange = (field: keyof ShareOptions, value: any) => {
    setShareOptions(prev => ({ ...prev, [field]: value }));
  };

  const handleAddEmail = () => {
    if (newEmail && isValidEmail(newEmail) && !shareOptions.recipientEmails.includes(newEmail)) {
      setShareOptions(prev => ({
        ...prev,
        recipientEmails: [...prev.recipientEmails, newEmail],
      }));
      setNewEmail('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    setShareOptions(prev => ({
      ...prev,
      recipientEmails: prev.recipientEmails.filter(e => e !== email),
    }));
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show success toast
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setShareOptions(prev => ({ ...prev, password }));
  };

  return (
    <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Share Options
      </Typography>

      {/* Public Sharing Toggle */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Public sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Public Sharing
              </Typography>
            </Box>
            <Switch
              checked={shareOptions.isPublic}
              onChange={(e) => handleShareOptionChange('isPublic', e.target.checked)}
            />
          </Box>
          
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            When enabled, anyone with the link can view your canvas
          </Typography>

          {shareOptions.isPublic && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Share Link
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  value={shareUrl}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => copyToClipboard(shareUrl)}>
                          <ContentCopy />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                />
                <IconButton onClick={() => setQrCodeVisible(!qrCodeVisible)}>
                  <QrCode />
                </IconButton>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {shareOptions.isPublic && (
        <>
          {/* Password Protection */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security sx={{ color: 'warning.main' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Password Protection
                  </Typography>
                </Box>
                <Switch
                  checked={shareOptions.passwordProtected}
                  onChange={(e) => handleShareOptionChange('passwordProtected', e.target.checked)}
                />
              </Box>
              
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Require a password to view the shared canvas
              </Typography>

              {shareOptions.passwordProtected && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={shareOptions.password || ''}
                    onChange={(e) => handleShareOptionChange('password', e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    size="small"
                  />
                  <Button variant="outlined" onClick={generatePassword} size="small">
                    Generate
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Access Permissions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Access Permissions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={shareOptions.allowDownload}
                      onChange={(e) => handleShareOptionChange('allowDownload', e.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2">Allow downloads</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Viewers can download the canvas in various formats
                      </Typography>
                    </Box>
                  }
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={shareOptions.allowComments}
                      onChange={(e) => handleShareOptionChange('allowComments', e.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2">Allow comments</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Viewers can add comments to the canvas
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </CardContent>
          </Card>

          {/* Expiration */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Link Expiration
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Expires on"
                    type="date"
                    value={shareOptions.expiresAt?.toISOString().split('T')[0] || ''}
                    onChange={(e) => handleShareOptionChange('expiresAt', e.target.value ? new Date(e.target.value) : undefined)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleShareOptionChange('expiresAt', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))}
                    >
                      7 Days
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleShareOptionChange('expiresAt', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))}
                    >
                      30 Days
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleShareOptionChange('expiresAt', undefined)}
                    >
                      Never
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      )}

      {/* Email Notifications */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email sx={{ color: 'info.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Email Notifications
              </Typography>
            </Box>
            <Switch
              checked={shareOptions.notifyByEmail}
              onChange={(e) => handleShareOptionChange('notifyByEmail', e.target.checked)}
            />
          </Box>
          
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Send email notifications to specific recipients
          </Typography>

          {shareOptions.notifyByEmail && (
            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
                  error={newEmail !== '' && !isValidEmail(newEmail)}
                  helperText={newEmail !== '' && !isValidEmail(newEmail) ? 'Invalid email' : ''}
                  size="small"
                />
                <Button
                  variant="outlined"
                  onClick={handleAddEmail}
                  disabled={!newEmail || !isValidEmail(newEmail)}
                >
                  Add
                </Button>
              </Box>

              {shareOptions.recipientEmails.length > 0 && (
                <List dense>
                  {shareOptions.recipientEmails.map((email, index) => (
                    <ListItem key={index} divider>
                      <ListItemIcon>
                        <Email sx={{ fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary={email} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => handleRemoveEmail(email)}>
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Custom message (optional)"
                value={shareOptions.customMessage || ''}
                onChange={(e) => handleShareOptionChange('customMessage', e.target.value)}
                placeholder="Add a personal message to include in the email..."
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Share Summary */}
      <Card sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Share Summary
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">Visibility:</Typography>
              <Chip
                label={shareOptions.isPublic ? 'Public' : 'Private'}
                size="small"
                color={shareOptions.isPublic ? 'success' : 'default'}
              />
            </Box>
            
            {shareOptions.isPublic && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">Protection:</Typography>
                  <Chip
                    label={shareOptions.passwordProtected ? 'Password Protected' : 'Open Access'}
                    size="small"
                    color={shareOptions.passwordProtected ? 'warning' : 'info'}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">Expires:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {shareOptions.expiresAt ? shareOptions.expiresAt.toLocaleDateString() : 'Never'}
                  </Typography>
                </Box>
              </>
            )}
            
            {shareOptions.notifyByEmail && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">Email Recipients:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {shareOptions.recipientEmails.length}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {shareOptions.isPublic && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Your canvas will be publicly accessible via the share link. 
            Make sure you're comfortable with the level of access you've granted.
          </Typography>
        </Alert>
      )}
    </Box>
  );
}
