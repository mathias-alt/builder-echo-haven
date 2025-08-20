import * as React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  useTheme,
  alpha,
  Box,
  Fade,
} from '@mui/material';
import {
  Edit,
  Delete,
  DragIndicator,
  Save,
  Close,
} from '@mui/icons-material';

export interface StickyNoteData {
  id: string;
  content: string;
  color?: 'yellow' | 'blue' | 'green' | 'pink' | 'orange';
  position?: { x: number; y: number };
  createdAt: Date;
  updatedAt: Date;
}

interface StickyNoteProps {
  note: StickyNoteData;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onDragStart?: (e: React.DragEvent, noteId: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  isDragging?: boolean;
  isEditing?: boolean;
  onStartEdit?: (id: string) => void;
  onStopEdit?: () => void;
}

const noteColors = {
  yellow: { 
    main: '#FFF176', 
    light: '#FFFDE7', 
    dark: '#F9A825',
    shadow: 'rgba(255, 193, 7, 0.2)'
  },
  blue: { 
    main: '#81C784', 
    light: '#E8F5E8', 
    dark: '#388E3C',
    shadow: 'rgba(76, 175, 80, 0.2)'
  },
  green: { 
    main: '#64B5F6', 
    light: '#E3F2FD', 
    dark: '#1976D2',
    shadow: 'rgba(33, 150, 243, 0.2)'
  },
  pink: { 
    main: '#F48FB1', 
    light: '#FCE4EC', 
    dark: '#C2185B',
    shadow: 'rgba(233, 30, 99, 0.2)'
  },
  orange: { 
    main: '#FFB74D', 
    light: '#FFF3E0', 
    dark: '#F57C00',
    shadow: 'rgba(255, 152, 0, 0.2)'
  },
};

export default function StickyNote({
  note,
  onUpdate,
  onDelete,
  onDragStart,
  onDragEnd,
  isDragging = false,
  isEditing = false,
  onStartEdit,
  onStopEdit,
}: StickyNoteProps) {
  const theme = useTheme();
  const [localContent, setLocalContent] = React.useState(note.content);
  const textFieldRef = React.useRef<HTMLInputElement>(null);

  const colorScheme = noteColors[note.color || 'yellow'];

  React.useEffect(() => {
    if (isEditing && textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onUpdate(note.id, localContent);
    onStopEdit?.();
  };

  const handleCancel = () => {
    setLocalContent(note.content);
    onStopEdit?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <Fade in timeout={300}>
      <Card
        draggable={!isEditing}
        onDragStart={(e) => !isEditing && onDragStart?.(e, note.id)}
        onDragEnd={onDragEnd}
        sx={{
          width: 200,
          minHeight: 120,
          backgroundColor: colorScheme.light,
          border: `2px solid ${colorScheme.main}`,
          borderRadius: 2,
          position: 'relative',
          cursor: isDragging ? 'grabbing' : isEditing ? 'default' : 'grab',
          transform: isDragging ? 'rotate(5deg) scale(1.05)' : 'rotate(0deg) scale(1)',
          opacity: isDragging ? 0.8 : 1,
          boxShadow: isDragging 
            ? `0 8px 32px ${colorScheme.shadow}`
            : `0 4px 16px ${alpha(theme.palette.common.black, 0.1)}`,
          '&:hover': {
            transform: isEditing ? 'none' : 'translateY(-2px)',
            boxShadow: `0 8px 24px ${colorScheme.shadow}`,
          },
          transition: 'all 0.2s ease',
          overflow: 'visible',
        }}
      >
        {/* Drag Handle */}
        {!isEditing && (
          <Box
            sx={{
              position: 'absolute',
              top: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: colorScheme.dark,
              borderRadius: '4px 4px 0 0',
              px: 1,
              py: 0.5,
              display: 'flex',
              alignItems: 'center',
              opacity: 0.8,
            }}
          >
            <DragIndicator sx={{ fontSize: 14, color: 'white' }} />
          </Box>
        )}

        <CardContent sx={{ p: 2, pb: '16px !important' }}>
          {isEditing ? (
            <TextField
              ref={textFieldRef}
              multiline
              fullWidth
              variant="standard"
              value={localContent}
              onChange={(e) => setLocalContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter note content..."
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: '0.875rem',
                  lineHeight: 1.4,
                  '& .MuiInputBase-input': {
                    padding: 0,
                  },
                },
              }}
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: 'transparent',
                },
              }}
            />
          ) : (
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.875rem',
                lineHeight: 1.4,
                color: theme.palette.text.primary,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                minHeight: '1.4em',
              }}
            >
              {note.content || 'Empty note'}
            </Typography>
          )}
        </CardContent>

        {/* Action Buttons */}
        <Box
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            display: 'flex',
            gap: 0.5,
            opacity: 0,
            '&:hover': { opacity: 1 },
            '.MuiCard-root:hover &': { opacity: 1 },
            transition: 'opacity 0.2s ease',
          }}
        >
          {isEditing ? (
            <>
              <IconButton
                size="small"
                onClick={handleSave}
                sx={{
                  backgroundColor: theme.palette.success.main,
                  color: 'white',
                  width: 24,
                  height: 24,
                  '&:hover': {
                    backgroundColor: theme.palette.success.dark,
                  },
                }}
              >
                <Save sx={{ fontSize: 14 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleCancel}
                sx={{
                  backgroundColor: theme.palette.grey[500],
                  color: 'white',
                  width: 24,
                  height: 24,
                  '&:hover': {
                    backgroundColor: theme.palette.grey[700],
                  },
                }}
              >
                <Close sx={{ fontSize: 14 }} />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                size="small"
                onClick={() => onStartEdit?.(note.id)}
                sx={{
                  backgroundColor: colorScheme.dark,
                  color: 'white',
                  width: 24,
                  height: 24,
                  '&:hover': {
                    backgroundColor: alpha(colorScheme.dark, 0.8),
                  },
                }}
              >
                <Edit sx={{ fontSize: 14 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete(note.id)}
                sx={{
                  backgroundColor: theme.palette.error.main,
                  color: 'white',
                  width: 24,
                  height: 24,
                  '&:hover': {
                    backgroundColor: theme.palette.error.dark,
                  },
                }}
              >
                <Delete sx={{ fontSize: 14 }} />
              </IconButton>
            </>
          )}
        </Box>

        {/* Timestamp */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            fontSize: '0.6rem',
            color: alpha(theme.palette.text.secondary, 0.6),
          }}
        >
          {note.updatedAt.toLocaleDateString()}
        </Box>
      </Card>
    </Fade>
  );
}
