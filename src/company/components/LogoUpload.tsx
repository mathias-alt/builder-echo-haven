import * as React from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  useTheme,
  alpha,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Edit,
  Business,
  Photo,
} from '@mui/icons-material';

interface LogoUploadProps {
  currentLogo?: string;
  onLogoChange: (file: File | null) => void;
  onLogoDelete?: () => void;
  error?: string;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  companyName?: string;
}

const sizeConfig = {
  small: { avatar: 80, uploadArea: 120 },
  medium: { avatar: 120, uploadArea: 180 },
  large: { avatar:160, uploadArea: 240 },
};

export default function LogoUpload({
  currentLogo,
  onLogoChange,
  onLogoDelete,
  error,
  loading = false,
  size = 'medium',
  companyName = 'Company',
}: LogoUploadProps) {
  const theme = useTheme();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);

  const { avatar: avatarSize, uploadArea: uploadAreaSize } = sizeConfig[size];

  React.useEffect(() => {
    if (currentLogo) {
      setPreview(currentLogo);
    }
  }, [currentLogo]);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Please select an image file';
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return 'File size must be less than 5MB';
    }

    // Check image dimensions (optional)
    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      onLogoChange(null);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    onLogoChange(file);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Clear input to allow same file selection
    event.target.value = '';
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDelete = () => {
    setPreview(null);
    onLogoDelete?.();
    onLogoChange(null);
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
        Company Logo
      </Typography>

      {preview || currentLogo ? (
        // Logo Preview
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={preview || currentLogo}
              sx={{
                width: avatarSize,
                height: avatarSize,
                backgroundColor: theme.palette.primary.main,
                fontSize: avatarSize * 0.3,
                fontWeight: 600,
              }}
            >
              {!preview && !currentLogo && getInitials(companyName)}
            </Avatar>
            
            {loading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: alpha(theme.palette.common.black, 0.5),
                  borderRadius: '50%',
                }}
              >
                <CircularProgress size={24} sx={{ color: 'white' }} />
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={handleEditClick}
              disabled={loading}
              size="small"
            >
              Change Logo
            </Button>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDelete}
              disabled={loading}
              size="small"
            >
              Remove
            </Button>
          </Box>
        </Box>
      ) : (
        // Upload Area
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleEditClick}
          sx={{
            width: uploadAreaSize,
            height: uploadAreaSize,
            border: dragOver 
              ? `3px dashed ${theme.palette.primary.main}`
              : error
                ? `2px dashed ${theme.palette.error.main}`
                : `2px dashed ${theme.palette.divider}`,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: dragOver 
              ? alpha(theme.palette.primary.main, 0.05)
              : error
                ? alpha(theme.palette.error.main, 0.05)
                : alpha(theme.palette.action.hover, 0.02),
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
            position: 'relative',
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              >
                <CloudUpload />
              </Avatar>
              
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}
              >
                Drop logo here or click to upload
              </Typography>
              
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', textAlign: 'center' }}
              >
                PNG, JPG up to 5MB
                <br />
                Recommended: 256x256px
              </Typography>
            </>
          )}
        </Box>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Help Text */}
      <Typography
        variant="caption"
        sx={{ color: 'text.secondary', mt: 1, display: 'block' }}
      >
        Your logo will be displayed across your canvases and team invitations.
        For best results, use a square image with your company logo or initials.
      </Typography>
    </Box>
  );
}
