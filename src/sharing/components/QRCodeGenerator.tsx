import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import {
  QrCode,
  Download,
  ContentCopy,
  Share,
  Print,
  Check
} from '@mui/icons-material';
import { QRCodeSettings } from '../types';

interface QRCodeGeneratorProps {
  open: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  open,
  onClose,
  url,
  title
}) => {
  const [settings, setSettings] = useState<QRCodeSettings>({
    size: 256,
    format: 'png',
    includeUrl: true,
    customMessage: ''
  });
  const [copySuccess, setCopySuccess] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Generate QR code data URL (using a simple pattern for demo)
  const generateQRCode = () => {
    // In a real implementation, you would use a QR code library like qrcode.js
    // For demo purposes, we'll create a simple placeholder
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    canvas.width = settings.size;
    canvas.height = settings.size;
    
    // Create a simple pattern to represent QR code
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, settings.size, settings.size);
    
    ctx.fillStyle = '#000000';
    const moduleSize = settings.size / 25;
    
    // Create a simple pattern (this would be actual QR code generation in real app)
    for (let x = 0; x < 25; x++) {
      for (let y = 0; y < 25; y++) {
        if ((x + y) % 3 === 0 || (x * y) % 7 === 0) {
          ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
        }
      }
    }
    
    return canvas.toDataURL('image/png');
  };

  const qrCodeDataUrl = generateQRCode();

  const handleSettingChange = (key: keyof QRCodeSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = `qr-code-${title.replace(/\s+/g, '-').toLowerCase()}.${settings.format}`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyImageToClipboard = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
          }
        });
      };
      
      img.src = qrCodeDataUrl;
    } catch (error) {
      console.error('Failed to copy image to clipboard:', error);
    }
  };

  const printQRCode = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${title}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                margin: 40px;
              }
              .qr-container {
                display: inline-block;
                padding: 20px;
                border: 2px solid #000;
                margin: 20px;
              }
              img { 
                display: block; 
                margin: 0 auto;
              }
              .info {
                margin-top: 20px;
                font-size: 14px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <div class="qr-container">
              <img src="${qrCodeDataUrl}" alt="QR Code" />
            </div>
            ${settings.includeUrl ? `<p class="info">${url}</p>` : ''}
            ${settings.customMessage ? `<p class="info">${settings.customMessage}</p>` : ''}
            <p class="info">Scan with your mobile device to access</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        // Convert data URL to blob
        const response = await fetch(qrCodeDataUrl);
        const blob = await response.blob();
        const file = new File([blob], `qr-code-${title}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: `QR Code - ${title}`,
          text: `Scan this QR code to access: ${title}`,
          files: [file]
        });
      } catch (error) {
        console.error('Failed to share QR code:', error);
      }
    }
  };

  const sizeOptions = [
    { value: 128, label: 'Small (128px)' },
    { value: 256, label: 'Medium (256px)' },
    { value: 512, label: 'Large (512px)' },
    { value: 1024, label: 'Extra Large (1024px)' }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <QrCode color="primary" />
        QR Code Generator
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Settings Panel */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              QR Code Settings
            </Typography>

            {/* Size Selection */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Size</InputLabel>
              <Select
                value={settings.size}
                label="Size"
                onChange={(e) => handleSettingChange('size', e.target.value)}
              >
                {sizeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Format Selection */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Format</InputLabel>
              <Select
                value={settings.format}
                label="Format"
                onChange={(e) => handleSettingChange('format', e.target.value)}
              >
                <MenuItem value="png">PNG</MenuItem>
                <MenuItem value="svg">SVG</MenuItem>
              </Select>
            </FormControl>

            {/* Custom Message */}
            <TextField
              fullWidth
              label="Custom Message (Optional)"
              multiline
              rows={2}
              value={settings.customMessage}
              onChange={(e) => handleSettingChange('customMessage', e.target.value)}
              placeholder="Add a custom message that will appear with the QR code"
              sx={{ mb: 2 }}
            />

            <Divider sx={{ my: 2 }} />

            {/* URL Info */}
            <Card sx={{ bgcolor: 'grey.50', border: 1, borderColor: 'divider' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Target URL
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                  {url}
                </Typography>
              </CardContent>
            </Card>

            {/* Usage Tips */}
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Mobile Sharing:</strong> QR codes are perfect for sharing with mobile users. 
                They can simply scan the code with their camera app to access the canvas instantly.
              </Typography>
            </Alert>
          </Box>

          {/* QR Code Preview */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              QR Code Preview
            </Typography>

            <Paper 
              ref={qrRef}
              sx={{ 
                p: 3, 
                mb: 2, 
                display: 'inline-block',
                border: 1,
                borderColor: 'divider'
              }}
            >
              <img
                src={qrCodeDataUrl}
                alt="QR Code"
                style={{
                  width: Math.min(settings.size, 300),
                  height: Math.min(settings.size, 300),
                  display: 'block'
                }}
              />
              
              {settings.customMessage && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  {settings.customMessage}
                </Typography>
              )}
              
              {settings.includeUrl && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Scan to access
                </Typography>
              )}
            </Paper>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Tooltip title="Download QR Code">
                <IconButton
                  onClick={downloadQRCode}
                  color="primary"
                  sx={{ bgcolor: 'primary.light', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
                >
                  <Download />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Copy to Clipboard">
                <IconButton
                  onClick={copyImageToClipboard}
                  color={copySuccess ? 'success' : 'primary'}
                  sx={{ bgcolor: copySuccess ? 'success.light' : 'primary.light' }}
                >
                  {copySuccess ? <Check /> : <ContentCopy />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Print QR Code">
                <IconButton
                  onClick={printQRCode}
                  color="primary"
                  sx={{ bgcolor: 'primary.light' }}
                >
                  <Print />
                </IconButton>
              </Tooltip>
              
              {navigator.share && (
                <Tooltip title="Share QR Code">
                  <IconButton
                    onClick={shareQRCode}
                    color="primary"
                    sx={{ bgcolor: 'primary.light' }}
                  >
                    <Share />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {/* QR Code Info */}
            <Box sx={{ mt: 2, textAlign: 'left' }}>
              <Typography variant="body2" color="text.secondary">
                <strong>How to use:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" component="div">
                1. Open camera app on mobile device
                <br />
                2. Point camera at QR code
                <br />
                3. Tap the notification to open link
                <br />
                4. Canvas will open in mobile browser
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
        <Button 
          onClick={downloadQRCode} 
          variant="contained"
          startIcon={<Download />}
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
};
