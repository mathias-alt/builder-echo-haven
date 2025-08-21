import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Divider,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Paper,
  Chip
} from '@mui/material';
import {
  Twitter,
  Facebook,
  LinkedIn,
  Email,
  ContentCopy,
  WhatsApp,
  Telegram,
  Reddit,
  Check
} from '@mui/icons-material';
import { ShareSettings, SocialPlatform } from '../types';

interface SocialSharingProps {
  canvasId: string;
  canvasTitle: string;
  settings: ShareSettings;
}

interface SocialPlatformConfig {
  name: string;
  icon: React.ReactNode;
  color: string;
  urlTemplate: string;
  description: string;
}

export const SocialSharing: React.FC<SocialSharingProps> = ({
  canvasId,
  canvasTitle,
  settings
}) => {
  const [customMessage, setCustomMessage] = useState(`Check out this business canvas: "${canvasTitle}"`);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [shareAnalytics, setShareAnalytics] = useState({
    twitter: 0,
    facebook: 0,
    linkedin: 0,
    email: 0,
    whatsapp: 0,
    telegram: 0,
    reddit: 0
  });

  const shareUrl = `${window.location.origin}/shared/canvas/${canvasId}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(canvasTitle);
  const encodedMessage = encodeURIComponent(customMessage);

  const socialPlatforms: Record<string, SocialPlatformConfig> = {
    twitter: {
      name: 'Twitter',
      icon: <Twitter />,
      color: '#1DA1F2',
      urlTemplate: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
      description: 'Share with your Twitter followers'
    },
    facebook: {
      name: 'Facebook',
      icon: <Facebook />,
      color: '#4267B2',
      urlTemplate: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`,
      description: 'Share on your Facebook timeline'
    },
    linkedin: {
      name: 'LinkedIn',
      icon: <LinkedIn />,
      color: '#0077B5',
      urlTemplate: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedMessage}`,
      description: 'Share with your professional network'
    },
    whatsapp: {
      name: 'WhatsApp',
      icon: <WhatsApp />,
      color: '#25D366',
      urlTemplate: `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`,
      description: 'Share via WhatsApp message'
    },
    telegram: {
      name: 'Telegram',
      icon: <Telegram />,
      color: '#0088CC',
      urlTemplate: `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`,
      description: 'Share in Telegram chats'
    },
    reddit: {
      name: 'Reddit',
      icon: <Reddit />,
      color: '#FF4500',
      urlTemplate: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      description: 'Post to Reddit communities'
    },
    email: {
      name: 'Email',
      icon: <Email />,
      color: '#EA4335',
      urlTemplate: `mailto:?subject=${encodedTitle}&body=${encodedMessage}%0A%0A${encodedUrl}`,
      description: 'Send via email'
    }
  };

  const handleSocialShare = (platform: string) => {
    const config = socialPlatforms[platform];
    if (config) {
      // Track analytics
      setShareAnalytics(prev => ({
        ...prev,
        [platform]: prev[platform as keyof typeof prev] + 1
      }));

      // Open share window
      window.open(
        config.urlTemplate,
        'social-share',
        'width=600,height=400,scrollbars=yes,resizable=yes'
      );
    }
  };

  const copyShareMessage = async () => {
    try {
      const fullMessage = `${customMessage}\n\n${shareUrl}`;
      await navigator.clipboard.writeText(fullMessage);
      setCopySuccess('message');
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      // Handle clipboard copy error
    }
  };

  const generateHashtags = () => {
    return ['BusinessCanvas', 'Strategy', 'Business', 'Innovation', 'Planning'];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Share on Social Media
      </Typography>

      {/* Custom Message */}
      <Card sx={{ mb: 3, border: 1, borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Customize Your Message
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Write a custom message to share with your canvas..."
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {generateHashtags().map((hashtag) => (
                <Chip
                  key={hashtag}
                  label={`#${hashtag}`}
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    const newMessage = customMessage.includes(`#${hashtag}`) 
                      ? customMessage 
                      : `${customMessage} #${hashtag}`;
                    setCustomMessage(newMessage);
                  }}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
            
            <Tooltip title="Copy message with link">
              <IconButton
                onClick={copyShareMessage}
                color={copySuccess === 'message' ? 'success' : 'default'}
              >
                {copySuccess === 'message' ? <Check /> : <ContentCopy />}
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>

      {/* Social Platform Buttons */}
      <Grid container spacing={2}>
        {Object.entries(socialPlatforms).map(([platform, config]) => (
          <Grid item xs={12} sm={6} md={4} key={platform}>
            <Card 
              sx={{ 
                border: 1, 
                borderColor: 'divider',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: config.color,
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                }
              }}
              onClick={() => handleSocialShare(platform)}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: config.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  {config.icon}
                </Box>
                
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {config.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {config.description}
                </Typography>

                {shareAnalytics[platform as keyof typeof shareAnalytics] > 0 && (
                  <Chip
                    label={`${shareAnalytics[platform as keyof typeof shareAnalytics]} shares`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Share Analytics */}
      <Card sx={{ border: 1, borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Share Analytics
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {Object.values(shareAnalytics).reduce((a, b) => a + b, 0)}
                </Typography>
                <Typography variant="body2">
                  Total Shares
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {Math.max(...Object.values(shareAnalytics))}
                </Typography>
                <Typography variant="body2">
                  Top Platform
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'info.contrastText' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {shareAnalytics.linkedin + shareAnalytics.email}
                </Typography>
                <Typography variant="body2">
                  Professional
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {shareAnalytics.whatsapp + shareAnalytics.telegram}
                </Typography>
                <Typography variant="body2">
                  Messaging
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Platform breakdown:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {Object.entries(shareAnalytics).map(([platform, count]) => (
                count > 0 && (
                  <Chip
                    key={platform}
                    label={`${socialPlatforms[platform]?.name}: ${count}`}
                    size="small"
                    variant="outlined"
                  />
                )
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ContentCopy />}
          onClick={copyShareMessage}
          color={copySuccess === 'message' ? 'success' : 'primary'}
        >
          {copySuccess === 'message' ? 'Copied!' : 'Copy Message'}
        </Button>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={!!copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Share message copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};
