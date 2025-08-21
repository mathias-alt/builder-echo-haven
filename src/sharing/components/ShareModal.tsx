import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Tabs,
  Tab,
  IconButton,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Alert,
  Fade
} from '@mui/material';
import {
  Close,
  Link as LinkIcon,
  Code,
  Share,
  People,
  Settings,
  Public,
  Lock
} from '@mui/icons-material';
import {
  ShareSettings,
  ShareModalState,
  SharePermission,
  SharePrivacy
} from '../types';
import { ShareLinkGenerator } from './ShareLinkGenerator';
import { EmbedCodeGenerator } from './EmbedCodeGenerator';
import { SocialSharing } from './SocialSharing';
import { AccessManagement } from './AccessManagement';
import { ShareSettingsPanel } from './ShareSettingsPanel';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  canvasId: string;
  canvasTitle: string;
  initialSettings?: Partial<ShareSettings>;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  open,
  onClose,
  canvasId,
  canvasTitle,
  initialSettings = {}
}) => {
  const [modalState, setModalState] = useState<ShareModalState>({
    activeTab: 'link',
    linkGenerated: false,
    qrCodeVisible: false,
    passwordDialogOpen: false,
    inviteDialogOpen: false
  });

  const [shareSettings, setShareSettings] = useState<ShareSettings>({
    privacy: 'private',
    permission: 'view',
    allowComments: true,
    allowDownload: false,
    requirePassword: false,
    password: undefined,
    expiresAt: undefined,
    embedEnabled: false,
    notifyOnAccess: false,
    ...initialSettings
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setModalState(prev => ({ ...prev, activeTab: newValue as any }));
  };

  const handleSettingsChange = (newSettings: Partial<ShareSettings>) => {
    setShareSettings(prev => ({ ...prev, ...newSettings }));
    setHasChanges(true);
  };

  const handlePrivacyToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const privacy: SharePrivacy = event.target.checked ? 'public' : 'private';
    handleSettingsChange({ privacy });
  };

  const handleSaveSettings = async () => {
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasChanges(false);
      
      if (!modalState.linkGenerated) {
        setModalState(prev => ({ ...prev, linkGenerated: true }));
      }
    } catch (error) {
      console.error('Failed to save share settings:', error);
    }
  };

  const tabIndicatorProps = {
    sx: {
      backgroundColor: 'primary.main',
      height: 3,
      borderRadius: '3px 3px 0 0'
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '600px',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Share Canvas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {canvasTitle}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ color: 'text.secondary' }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Privacy Toggle Header */}
        <Box sx={{ px: 3, py: 2, bgcolor: 'grey.50' }}>
          <FormControlLabel
            control={
              <Switch
                checked={shareSettings.privacy === 'public'}
                onChange={handlePrivacyToggle}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {shareSettings.privacy === 'public' ? (
                  <>
                    <Public fontSize="small" color="primary" />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Public - Anyone with the link can access
                    </Typography>
                  </>
                ) : (
                  <>
                    <Lock fontSize="small" color="action" />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Private - Only people you choose can access
                    </Typography>
                  </>
                )}
              </Box>
            }
            sx={{ margin: 0 }}
          />
          
          {hasChanges && (
            <Fade in={hasChanges}>
              <Alert 
                severity="info" 
                sx={{ mt: 2 }}
                action={
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={handleSaveSettings}
                    sx={{ fontWeight: 500 }}
                  >
                    Save Changes
                  </Button>
                }
              >
                You have unsaved changes to your sharing settings.
              </Alert>
            </Fade>
          )}
        </Box>

        <Divider />

        {/* Tab Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={modalState.activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={tabIndicatorProps}
            sx={{ px: 3 }}
          >
            <Tab
              value="link"
              icon={<LinkIcon />}
              label="Share Link"
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
            <Tab
              value="embed"
              icon={<Code />}
              label="Embed"
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
            <Tab
              value="social"
              icon={<Share />}
              label="Social"
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
            <Tab
              value="access"
              icon={<People />}
              label="Access"
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
            <Tab
              value="settings"
              icon={<Settings />}
              label="Settings"
              iconPosition="start"
              sx={{ minHeight: 48 }}
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ minHeight: 400 }}>
          {modalState.activeTab === 'link' && (
            <ShareLinkGenerator
              canvasId={canvasId}
              settings={shareSettings}
              linkGenerated={modalState.linkGenerated}
              onSettingsChange={handleSettingsChange}
              onLinkGenerated={() => setModalState(prev => ({ ...prev, linkGenerated: true }))}
            />
          )}

          {modalState.activeTab === 'embed' && (
            <EmbedCodeGenerator
              canvasId={canvasId}
              settings={shareSettings}
              onSettingsChange={handleSettingsChange}
            />
          )}

          {modalState.activeTab === 'social' && (
            <SocialSharing
              canvasId={canvasId}
              canvasTitle={canvasTitle}
              settings={shareSettings}
            />
          )}

          {modalState.activeTab === 'access' && (
            <AccessManagement
              canvasId={canvasId}
              settings={shareSettings}
              onSettingsChange={handleSettingsChange}
            />
          )}

          {modalState.activeTab === 'settings' && (
            <ShareSettingsPanel
              settings={shareSettings}
              onSettingsChange={handleSettingsChange}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
