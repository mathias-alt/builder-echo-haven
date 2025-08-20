import * as React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  useTheme,
  alpha,
  CircularProgress,
  Fade,
  Avatar,
} from '@mui/material';
import {
  Email,
  Delete,
  Send,
  CheckCircle,
  AttachFile,
  Link,
  Person,
  Close,
  ArrowBack,
} from '@mui/icons-material';
import { ExportSettings, EmailExportOptions } from '../types';

interface EmailExportProps {
  canvasId: string;
  canvasName: string;
  settings: ExportSettings;
  onClose: () => void;
  onSent: () => void;
}

export default function EmailExport({
  canvasId,
  canvasName,
  settings,
  onClose,
  onSent,
}: EmailExportProps) {
  const theme = useTheme();
  const [emailOptions, setEmailOptions] = React.useState<EmailExportOptions>({
    recipients: [],
    subject: `Canvas Export: ${canvasName}`,
    message: `Hi there,

I wanted to share this business canvas with you: "${canvasName}".

You can view and download it using the link or attachment in this email.

Best regards`,
    attachFile: true,
    includePublicLink: true,
    copyToSender: true,
  });
  
  const [newRecipient, setNewRecipient] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddRecipient = () => {
    if (newRecipient && isValidEmail(newRecipient) && !emailOptions.recipients.includes(newRecipient)) {
      setEmailOptions(prev => ({
        ...prev,
        recipients: [...prev.recipients, newRecipient],
      }));
      setNewRecipient('');
    }
  };

  const handleRemoveRecipient = (email: string) => {
    setEmailOptions(prev => ({
      ...prev,
      recipients: prev.recipients.filter(e => e !== email),
    }));
  };

  const handleOptionChange = (field: keyof EmailExportOptions, value: any) => {
    setEmailOptions(prev => ({ ...prev, [field]: value }));
  };

  const handleSend = async () => {
    if (emailOptions.recipients.length === 0) return;

    setSending(true);
    try {
      // Simulate sending email
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSent(true);
      
      // Auto-close after success
      setTimeout(() => {
        onSent();
      }, 2000);
    } catch (error) {
      console.error('Failed to send email:', error);
    } finally {
      setSending(false);
    }
  };

  const canSend = emailOptions.recipients.length > 0 && emailOptions.subject.trim() !== '';

  if (sent) {
    return (
      <Fade in>
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: theme.palette.success.main,
              mx: 'auto',
              mb: 3,
            }}
          >
            <CheckCircle sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Email Sent Successfully!
          </Typography>
          
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
            Your canvas has been sent to {emailOptions.recipients.length} recipient{emailOptions.recipients.length !== 1 ? 's' : ''}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 4 }}>
            {emailOptions.recipients.map((email, index) => (
              <Chip
                key={index}
                label={email}
                size="small"
                color="success"
                icon={<CheckCircle />}
              />
            ))}
          </Box>
          
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Recipients will receive the email shortly with the canvas export and share link.
          </Typography>
        </Box>
      </Fade>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={onClose}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Email Export
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
        {/* Recipients */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Recipients
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Email address"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddRecipient()}
                error={newRecipient !== '' && !isValidEmail(newRecipient)}
                helperText={newRecipient !== '' && !isValidEmail(newRecipient) ? 'Invalid email address' : ''}
                placeholder="Enter email address..."
              />
              <Button
                variant="outlined"
                onClick={handleAddRecipient}
                disabled={!newRecipient || !isValidEmail(newRecipient)}
                sx={{ minWidth: 100 }}
              >
                Add
              </Button>
            </Box>

            {emailOptions.recipients.length > 0 ? (
              <List dense>
                {emailOptions.recipients.map((email, index) => (
                  <ListItem key={index} divider={index < emailOptions.recipients.length - 1}>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText primary={email} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleRemoveRecipient(email)}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Alert severity="info">
                Add at least one recipient to send the email export.
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Email Content */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Email Content
            </Typography>
            
            <TextField
              fullWidth
              label="Subject"
              value={emailOptions.subject}
              onChange={(e) => handleOptionChange('subject', e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Message"
              value={emailOptions.message}
              onChange={(e) => handleOptionChange('message', e.target.value)}
              placeholder="Write your message here..."
            />
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Export Options
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={emailOptions.attachFile}
                    onChange={(e) => handleOptionChange('attachFile', e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachFile sx={{ fontSize: 20 }} />
                      <Typography variant="body2">Attach export file</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Include the {settings.format.toUpperCase()} file as an email attachment
                    </Typography>
                  </Box>
                }
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={emailOptions.includePublicLink}
                    onChange={(e) => handleOptionChange('includePublicLink', e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Link sx={{ fontSize: 20 }} />
                      <Typography variant="body2">Include public share link</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Add a public link to view the canvas online
                    </Typography>
                  </Box>
                }
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={emailOptions.copyToSender}
                    onChange={(e) => handleOptionChange('copyToSender', e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email sx={{ fontSize: 20 }} />
                      <Typography variant="body2">Send copy to myself</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Receive a copy of the email for your records
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </CardContent>
        </Card>

        {/* Export Summary */}
        <Card sx={{ backgroundColor: alpha(theme.palette.info.main, 0.05) }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Email Summary
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Recipients:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {emailOptions.recipients.length}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Export format:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {settings.format.toUpperCase()}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Attachments:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {emailOptions.attachFile ? 'Yes' : 'No'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Public link:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {emailOptions.includePublicLink ? 'Yes' : 'No'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} disabled={sending}>
          Cancel
        </Button>
        
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={!canSend || sending}
          startIcon={sending ? <CircularProgress size={16} color="inherit" /> : <Send />}
          size="large"
        >
          {sending ? 'Sending...' : `Send to ${emailOptions.recipients.length} recipient${emailOptions.recipients.length !== 1 ? 's' : ''}`}
        </Button>
      </Box>
    </Box>
  );
}
