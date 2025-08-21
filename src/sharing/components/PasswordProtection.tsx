import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Alert,
  LinearProgress,
  Chip,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Lock,
  Visibility,
  VisibilityOff,
  Refresh,
  Check,
  Warning
} from '@mui/icons-material';
import { ShareSettings } from '../types';

interface PasswordProtectionProps {
  open: boolean;
  onClose: () => void;
  settings: ShareSettings;
  onSettingsChange: (settings: Partial<ShareSettings>) => void;
}

export const PasswordProtection: React.FC<PasswordProtectionProps> = ({
  open,
  onClose,
  settings,
  onSettingsChange
}) => {
  const [enabled, setEnabled] = useState(settings.requirePassword);
  const [password, setPassword] = useState(settings.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState<string[]>([]);

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    const feedback: string[] = [];

    if (pwd.length < 8) {
      feedback.push('Use at least 8 characters');
    } else {
      strength += 25;
    }

    if (!/[a-z]/.test(pwd)) {
      feedback.push('Add lowercase letters');
    } else {
      strength += 25;
    }

    if (!/[A-Z]/.test(pwd)) {
      feedback.push('Add uppercase letters');
    } else {
      strength += 25;
    }

    if (!/[0-9]/.test(pwd)) {
      feedback.push('Add numbers');
    } else {
      strength += 25;
    }

    if (!/[^a-zA-Z0-9]/.test(pwd)) {
      feedback.push('Add special characters (!@#$%^&*)');
    } else {
      strength += 25;
    }

    // Bonus points for length
    if (pwd.length >= 12) strength += 10;
    if (pwd.length >= 16) strength += 10;

    // Cap at 100
    strength = Math.min(strength, 100);

    return { strength, feedback };
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    const { strength, feedback } = calculatePasswordStrength(newPassword);
    setPasswordStrength(strength);
    setPasswordFeedback(feedback);
  };

  const generateStrongPassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = lowercase + uppercase + numbers + symbols;
    let password = '';
    
    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    const shuffled = password.split('').sort(() => Math.random() - 0.5).join('');
    handlePasswordChange(shuffled);
  };

  const getStrengthColor = (strength: number) => {
    if (strength < 25) return 'error';
    if (strength < 50) return 'warning';
    if (strength < 75) return 'info';
    return 'success';
  };

  const getStrengthLabel = (strength: number) => {
    if (strength < 25) return 'Weak';
    if (strength < 50) return 'Fair';
    if (strength < 75) return 'Good';
    return 'Strong';
  };

  const handleSave = () => {
    onSettingsChange({
      requirePassword: enabled,
      password: enabled ? password : undefined
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Lock color="primary" />
        Password Protection
      </DialogTitle>

      <DialogContent>
        {/* Enable/Disable Toggle */}
        <FormControlLabel
          control={
            <Switch
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Require password to access
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {enabled 
                  ? 'Visitors must enter a password to view the canvas'
                  : 'Anyone with the link can access the canvas'
                }
              </Typography>
            </Box>
          }
          sx={{ mb: 3, alignItems: 'flex-start' }}
        />

        {enabled && (
          <Box>
            {/* Password Input */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {/* Generate Password Button */}
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={generateStrongPassword}
                size="small"
              >
                Generate Strong Password
              </Button>
            </Box>

            {/* Password Strength Indicator */}
            {password && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Password Strength
                  </Typography>
                  <Chip
                    label={getStrengthLabel(passwordStrength)}
                    color={getStrengthColor(passwordStrength) as any}
                    size="small"
                    icon={passwordStrength >= 75 ? <Check /> : <Warning />}
                  />
                </Box>
                
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength}
                  color={getStrengthColor(passwordStrength) as any}
                  sx={{ 
                    height: 8, 
                    borderRadius: 1,
                    bgcolor: 'grey.200'
                  }}
                />

                {/* Password Feedback */}
                {passwordFeedback.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      To improve security:
                    </Typography>
                    {passwordFeedback.map((feedback, index) => (
                      <Typography key={index} variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        • {feedback}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {/* Security Tips */}
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Security Tips:
              </Typography>
              <Typography variant="body2" component="div">
                • Use a unique password that you don't use elsewhere
                <br />
                • Consider using a password manager
                <br />
                • Share the password through a secure channel
                <br />
                • Change the password periodically for sensitive content
              </Typography>
            </Alert>

            {/* Current Status */}
            {settings.requirePassword && settings.password && (
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Password protection is currently enabled. 
                  {settings.password === password 
                    ? ' (No changes made)'
                    : ' (Password will be updated)'
                  }
                </Typography>
              </Alert>
            )}
          </Box>
        )}

        {/* Information Box */}
        <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            How it works:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {enabled 
              ? 'When someone visits your shared link, they will see a password prompt before they can access the canvas. The password is encrypted and stored securely.'
              : 'Your canvas will be accessible to anyone who has the share link. No password will be required.'
            }
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={enabled && (!password || passwordStrength < 25)}
        >
          {enabled && passwordStrength < 25 ? 'Password Too Weak' : 'Save Settings'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
