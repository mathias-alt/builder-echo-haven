import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  alpha,
  Fade,
  Collapse
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  DragHandle,
  Check,
  Close,
  ColorLens
} from '@mui/icons-material';
import { StickyNoteData } from '../../components/StickyNote';
import { useMobileNoteEditor } from '../hooks/useMobileKeyboard';
import { HapticFeedback } from '../utils/gestures';

interface MobileStickyNoteProps {
  note: StickyNoteData;
  sectionId: string;
  sectionColor: string;
  onUpdate: (content: string) => void;
  onDelete: () => void;
  onAction: (action: string) => void;
}

const NOTE_COLORS = [
  { name: 'yellow', color: '#fff475' },
  { name: 'orange', color: '#ffcc80' },
  { name: 'pink', color: '#f8bbd9' },
  { name: 'purple', color: '#e1bee7' },
  { name: 'blue', color: '#bbdefb' },
  { name: 'green', color: '#c8e6c9' },
  { name: 'gray', color: '#eeeeee' }
];

export const MobileStickyNote: React.FC<MobileStickyNoteProps> = ({
  note,
  sectionId,
  sectionColor,
  onUpdate,
  onDelete,
  onAction
}) => {
  const theme = useTheme();
  const keyboard = useMobileNoteEditor();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleSave = () => {
    if (keyboard.content.trim() !== note.content) {
      onUpdate(keyboard.content.trim());
      HapticFeedback.success();
    }
    keyboard.stopEditing();
  };

  const handleCancel = () => {
    keyboard.setContent(note.content);
    keyboard.stopEditing();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete();
    handleMenuClose();
  };

  const handleColorChange = (colorName: string) => {
    // In a real implementation, this would update the note color
    onAction(`changeColor:${colorName}`);
    setShowColorPicker(false);
    handleMenuClose();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    // Start long press timer
    const timer = setTimeout(() => {
      if (!isDragging) {
        handleMenuClick(e as any);
        // Haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }, 500);

    setLongPressTimer(timer);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

    // If moved too much, cancel long press
    if (deltaX > 10 || deltaY > 10) {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
      setIsDragging(true);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    if (!isDragging && touchStartRef.current) {
      const deltaTime = Date.now() - touchStartRef.current.time;
      // Quick tap to edit
      if (deltaTime < 200 && !isEditing) {
        setIsEditing(true);
      }
    }

    setIsDragging(false);
    touchStartRef.current = null;
  };

  const getNoteColor = () => {
    const colorConfig = NOTE_COLORS.find(c => c.name === note.color);
    return colorConfig ? colorConfig.color : NOTE_COLORS[0].color;
  };

  const isEmpty = !note.content.trim();

  return (
    <Card
      sx={{
        bgcolor: getNoteColor(),
        border: 1,
        borderColor: alpha(theme.palette.grey[400], 0.3),
        boxShadow: 2,
        transition: 'all 0.2s ease',
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        '&:hover': {
          boxShadow: 4
        },
        position: 'relative',
        minHeight: 80
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {isEditing ? (
          <Box>
            <TextField
              ref={textFieldRef}
              fullWidth
              multiline
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Enter your note here..."
              variant="standard"
              InputProps={{
                disableUnderline: true,
                style: {
                  fontSize: '0.9rem',
                  lineHeight: 1.4,
                  fontFamily: theme.typography.body2.fontFamily
                }
              }}
              sx={{
                '& .MuiInputBase-root': {
                  bgcolor: 'transparent'
                }
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
              <IconButton size="small" onClick={handleCancel}>
                <Close fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={handleSave}
                sx={{ 
                  bgcolor: theme.palette.success.main,
                  color: 'white',
                  '&:hover': { bgcolor: theme.palette.success.dark }
                }}
              >
                <Check fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography
                variant="body2"
                sx={{
                  flex: 1,
                  minHeight: 40,
                  color: isEmpty ? 'text.secondary' : 'text.primary',
                  fontStyle: isEmpty ? 'italic' : 'normal',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {note.content || 'Tap to add content...'}
              </Typography>
              
              <IconButton
                size="small"
                onClick={handleMenuClick}
                sx={{ 
                  opacity: 0.7,
                  ml: 1,
                  '&:hover': { opacity: 1 }
                }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>

            {/* Note metadata */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: 1,
              opacity: 0.7
            }}>
              <Typography variant="caption" color="text.secondary">
                {note.updatedAt.toLocaleDateString()}
              </Typography>
              
              <DragHandle 
                fontSize="small" 
                sx={{ 
                  color: 'text.secondary',
                  cursor: 'grab',
                  '&:active': { cursor: 'grabbing' }
                }} 
              />
            </Box>
          </Box>
        )}
      </CardContent>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit Note
        </MenuItem>
        
        <MenuItem onClick={() => setShowColorPicker(!showColorPicker)}>
          <ColorLens fontSize="small" sx={{ mr: 1 }} />
          Change Color
        </MenuItem>
        
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete Note
        </MenuItem>
      </Menu>

      {/* Color Picker */}
      <Collapse in={showColorPicker}>
        <Box sx={{ 
          position: 'absolute',
          top: '100%',
          right: 0,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          p: 1,
          boxShadow: 2,
          zIndex: 1000,
          display: 'flex',
          gap: 0.5
        }}>
          {NOTE_COLORS.map((color) => (
            <Box
              key={color.name}
              onClick={() => handleColorChange(color.name)}
              sx={{
                width: 24,
                height: 24,
                bgcolor: color.color,
                borderRadius: '50%',
                border: 2,
                borderColor: note.color === color.name ? theme.palette.primary.main : 'transparent',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}
            />
          ))}
        </Box>
      </Collapse>
    </Card>
  );
};
