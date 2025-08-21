import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Tooltip,
  Snackbar,
  Alert,
  Divider,
  Grid,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import {
  ContentCopy,
  Code,
  Preview,
  Check,
  Refresh
} from '@mui/icons-material';
import { ShareSettings, EmbedSettings } from '../types';

interface EmbedCodeGeneratorProps {
  canvasId: string;
  settings: ShareSettings;
  onSettingsChange: (settings: Partial<ShareSettings>) => void;
}

export const EmbedCodeGenerator: React.FC<EmbedCodeGeneratorProps> = ({
  canvasId,
  settings,
  onSettingsChange
}) => {
  const [embedSettings, setEmbedSettings] = useState<EmbedSettings>({
    width: '100%',
    height: '600px',
    showToolbar: true,
    showComments: true,
    allowInteraction: true,
    theme: 'light'
  });

  const [embedCode, setEmbedCode] = useState('');
  const [activeTab, setActiveTab] = useState('iframe');
  const [copySuccess, setCopySuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const generateEmbedCode = () => {
    const baseUrl = `${window.location.origin}/embed/canvas/${canvasId}`;
    const params = new URLSearchParams({
      theme: embedSettings.theme,
      toolbar: embedSettings.showToolbar.toString(),
      comments: embedSettings.showComments.toString(),
      interactive: embedSettings.allowInteraction.toString(),
      width: embedSettings.width,
      height: embedSettings.height
    });

    const embedUrl = `${baseUrl}?${params.toString()}`;

    let code = '';
    
    switch (activeTab) {
      case 'iframe':
        code = `<iframe
  src="${embedUrl}"
  width="${embedSettings.width}"
  height="${embedSettings.height}"
  frameborder="0"
  allowfullscreen
  title="Flourishing Business Canvas">
</iframe>`;
        break;
        
      case 'react':
        code = `import React from 'react';

const CanvasEmbed = () => {
  return (
    <iframe
      src="${embedUrl}"
      width="${embedSettings.width}"
      height="${embedSettings.height}"
      frameBorder="0"
      allowFullScreen
      title="Flourishing Business Canvas"
      style={{
        border: 'none',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    />
  );
};

export default CanvasEmbed;`;
        break;
        
      case 'javascript':
        code = `// JavaScript Embed Code
(function() {
  const iframe = document.createElement('iframe');
  iframe.src = '${embedUrl}';
  iframe.width = '${embedSettings.width}';
  iframe.height = '${embedSettings.height}';
  iframe.frameBorder = '0';
  iframe.allowFullscreen = true;
  iframe.title = 'Flourishing Business Canvas';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '8px';
  iframe.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  
  // Insert iframe into target element
  const target = document.getElementById('canvas-embed');
  if (target) {
    target.appendChild(iframe);
  }
})();

// HTML: <div id="canvas-embed"></div>`;
        break;
    }

    setEmbedCode(code);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleEmbedSettingChange = (key: keyof EmbedSettings, value: any) => {
    setEmbedSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    generateEmbedCode();
  }, [embedSettings, activeTab, canvasId]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Embed Canvas
      </Typography>

      <Grid container spacing={3}>
        {/* Settings Panel */}
        <Grid item xs={12} md={4}>
          <Card sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Embed Settings
              </Typography>

              {/* Dimensions */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Dimensions
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    label="Width"
                    value={embedSettings.width}
                    onChange={(e) => handleEmbedSettingChange('width', e.target.value)}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Height"
                    value={embedSettings.height}
                    onChange={(e) => handleEmbedSettingChange('height', e.target.value)}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Box>

              {/* Theme */}
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={embedSettings.theme}
                  label="Theme"
                  onChange={(e) => handleEmbedSettingChange('theme', e.target.value)}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="auto">Auto</MenuItem>
                </Select>
              </FormControl>

              <Divider sx={{ my: 2 }} />

              {/* Display Options */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Display Options
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={embedSettings.showToolbar}
                      onChange={(e) => handleEmbedSettingChange('showToolbar', e.target.checked)}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">Show toolbar</Typography>}
                  sx={{ margin: 0 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={embedSettings.showComments}
                      onChange={(e) => handleEmbedSettingChange('showComments', e.target.checked)}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">Show comments</Typography>}
                  sx={{ margin: 0 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={embedSettings.allowInteraction}
                      onChange={(e) => handleEmbedSettingChange('allowInteraction', e.target.checked)}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">Allow interaction</Typography>}
                  sx={{ margin: 0 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Quick Size Presets */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Quick Presets
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { label: 'Small', width: '100%', height: '400px' },
                  { label: 'Medium', width: '100%', height: '600px' },
                  { label: 'Large', width: '100%', height: '800px' },
                  { label: 'Square', width: '600px', height: '600px' }
                ].map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      handleEmbedSettingChange('width', preset.width);
                      handleEmbedSettingChange('height', preset.height);
                    }}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {preset.label} ({preset.width} × {preset.height})
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Code Panel */}
        <Grid item xs={12} md={8}>
          {/* Code Type Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab value="iframe" label="HTML/iframe" />
              <Tab value="react" label="React" />
              <Tab value="javascript" label="JavaScript" />
            </Tabs>
          </Box>

          {/* Code Display */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Embed Code
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Copy code">
                  <IconButton
                    onClick={copyToClipboard}
                    color={copySuccess ? 'success' : 'default'}
                    size="small"
                  >
                    {copySuccess ? <Check /> : <ContentCopy />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Refresh code">
                  <IconButton onClick={generateEmbedCode} size="small">
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            <Paper sx={{ p: 2, bgcolor: 'grey.50', border: 1, borderColor: 'divider' }}>
              <TextField
                fullWidth
                multiline
                rows={12}
                value={embedCode}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  sx: {
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    bgcolor: 'background.paper'
                  }
                }}
              />
            </Paper>
          </Box>

          {/* Preview */}
          <Card sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2">
                  Preview
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Preview />}
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  {previewMode ? 'Hide Preview' : 'Show Preview'}
                </Button>
              </Box>

              {previewMode && (
                <Box
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    overflow: 'hidden',
                    height: embedSettings.height,
                    minHeight: '200px'
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.100',
                      color: 'text.secondary'
                    }}
                  >
                    <Typography variant="body2">
                      Canvas preview would appear here
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Embed code copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};
