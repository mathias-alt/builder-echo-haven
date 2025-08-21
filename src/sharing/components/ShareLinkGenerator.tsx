import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  Tooltip,
  Snackbar,
  Collapse,
  Chip
} from '@mui/material';
import {
  ContentCopy,
  Link as LinkIcon,
  Refresh,
  QrCode,
  Schedule,
  Lock,
  Visibility,
  Edit,
  Comment,
  Check
} from '@mui/icons-material';
import { ShareSettings, SharePermission } from '../types';
import { QRCodeGenerator } from './QRCodeGenerator';
import { PasswordProtection } from './PasswordProtection';
import { ExpirationSettings } from './ExpirationSettings';

interface ShareLinkGeneratorProps {
  canvasId: string;
  settings: ShareSettings;
  linkGenerated: boolean;
  onSettingsChange: (settings: Partial<ShareSettings>) => void;
  onLinkGenerated: () => void;
}

export const ShareLinkGenerator: React.FC<ShareLinkGeneratorProps> = ({
  canvasId,
  settings,
  linkGenerated,
  onSettingsChange,
  onLinkGenerated
}) => {
  const [shareLink, setShareLink] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showExpirationDialog, setShowExpirationDialog] = useState(false);

  const generateShareLink = async () => {
    setGenerating(true);
    try {
      // Simulate API call to generate share link
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const baseUrl = `${window.location.origin}/shared/canvas`;
      const linkId = Math.random().toString(36).substring(2, 15);
      const fullLink = `${baseUrl}/${linkId}`;
      const shortLink = `fbc.ly/${linkId.substring(0, 8)}`;
      
      setShareLink(fullLink);
      setShortLink(shortLink);
      onLinkGenerated();
    } catch (error) {
      console.error('Failed to generate share link:', error);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handlePermissionChange = (permission: SharePermission) => {
    onSettingsChange({ permission });
  };

  const getPermissionIcon = (permission: SharePermission) => {
    switch (permission) {
      case 'view':
        return <Visibility fontSize="small" />;
      case 'comment':
        return <Comment fontSize="small" />;
      case 'edit':
        return <Edit fontSize="small" />;
      default:
        return <Visibility fontSize="small" />;
    }
  };

  const getPermissionColor = (permission: SharePermission) => {
    switch (permission) {
      case 'view':
        return 'info';
      case 'comment':
        return 'warning';
      case 'edit':
        return 'error';
      default:
        return 'info';
    }
  };

  useEffect(() => {
    if (linkGenerated && !shareLink) {
      generateShareLink();
    }
  }, [linkGenerated, shareLink]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Permission Settings */}
      <Card sx={{ mb: 3, border: 1, borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            {getPermissionIcon(settings.permission)}
            Permission Level
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {(['view', 'comment', 'edit'] as SharePermission[]).map((permission) => (
              <Chip
                key={permission}
                label={permission.charAt(0).toUpperCase() + permission.slice(1)}
                color={settings.permission === permission ? getPermissionColor(permission) as any : 'default'}
                variant={settings.permission === permission ? 'filled' : 'outlined'}
                onClick={() => handlePermissionChange(permission)}
                icon={getPermissionIcon(permission)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: settings.permission === permission ? undefined : 'action.hover' }
                }}
              />
            ))}
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {settings.permission === 'view' && 'Recipients can only view the canvas'}
            {settings.permission === 'comment' && 'Recipients can view and add comments'}
            {settings.permission === 'edit' && 'Recipients can view, comment, and edit the canvas'}
          </Typography>
        </CardContent>
      </Card>

      {/* Link Generation */}
      {!linkGenerated ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <LinkIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Generate Share Link
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create a secure link to share your canvas with others
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={generateShareLink}
            loading={generating}
            startIcon={<LinkIcon />}
            sx={{ minWidth: 200 }}
          >
            {generating ? 'Generating...' : 'Generate Link'}
          </Button>
        </Box>
      ) : (
        <Box>
          {/* Generated Links */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Share Links
          </Typography>
          
          {/* Full Link */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Full Link
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                value={shareLink}
                variant="outlined"
                size="small"
                InputProps={{
                  readOnly: true,
                  sx: { bgcolor: 'grey.50' }
                }}
              />
              <Tooltip title="Copy full link">
                <IconButton
                  onClick={() => copyToClipboard(shareLink, 'full')}
                  color={copySuccess === 'full' ? 'success' : 'default'}
                >
                  {copySuccess === 'full' ? <Check /> : <ContentCopy />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Short Link */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Short Link
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                value={shortLink}
                variant="outlined"
                size="small"
                InputProps={{
                  readOnly: true,
                  sx: { bgcolor: 'grey.50' }
                }}
              />
              <Tooltip title="Copy short link">
                <IconButton
                  onClick={() => copyToClipboard(shortLink, 'short')}
                  color={copySuccess === 'short' ? 'success' : 'default'}
                >
                  {copySuccess === 'short' ? <Check /> : <ContentCopy />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Quick Actions */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<QrCode />}
              onClick={() => setShowQRCode(true)}
              size="small"
            >
              QR Code
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={generateShareLink}
              loading={generating}
              size="small"
            >
              Regenerate
            </Button>
            <Button
              variant="outlined"
              startIcon={<Lock />}
              onClick={() => setShowPasswordDialog(true)}
              color={settings.requirePassword ? 'primary' : 'inherit'}
              size="small"
            >
              {settings.requirePassword ? 'Password Set' : 'Add Password'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Schedule />}
              onClick={() => setShowExpirationDialog(true)}
              color={settings.expiresAt ? 'primary' : 'inherit'}
              size="small"
            >
              {settings.expiresAt ? 'Expires Set' : 'Set Expiration'}
            </Button>
          </Box>

          {/* Additional Options */}
          <Card sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Additional Options
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.allowComments}
                      onChange={(e) => onSettingsChange({ allowComments: e.target.checked })}
                    />
                  }
                  label="Allow comments"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.allowDownload}
                      onChange={(e) => onSettingsChange({ allowDownload: e.target.checked })}
                    />
                  }
                  label="Allow downloads"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifyOnAccess}
                      onChange={(e) => onSettingsChange({ notifyOnAccess: e.target.checked })}
                    />
                  }
                  label="Notify me when someone accesses"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* QR Code Dialog */}
      <QRCodeGenerator
        open={showQRCode}
        onClose={() => setShowQRCode(false)}
        url={shareLink}
        title="Share Canvas"
      />

      {/* Password Protection Dialog */}
      <PasswordProtection
        open={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        settings={settings}
        onSettingsChange={onSettingsChange}
      />

      {/* Expiration Settings Dialog */}
      <ExpirationSettings
        open={showExpirationDialog}
        onClose={() => setShowExpirationDialog(false)}
        settings={settings}
        onSettingsChange={onSettingsChange}
      />

      {/* Copy Success Snackbar */}
      <Snackbar
        open={!!copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {copySuccess === 'full' ? 'Full link' : 'Short link'} copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};
