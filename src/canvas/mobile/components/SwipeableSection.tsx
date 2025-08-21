import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  alpha,
  Fade,
  Card,
  CardContent
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Add,
  MoreVert,
  Fullscreen,
  FullscreenExit
} from '@mui/icons-material';
import { SwipeDirection, TouchGesture } from '../types';
import { CanvasSectionData } from '../../components/CanvasSection';
import { MobileStickyNote } from './MobileStickyNote';

interface SwipeableSectionProps {
  section: CanvasSectionData;
  sections: CanvasSectionData[];
  activeIndex: number;
  onSwipe: (direction: 'left' | 'right') => void;
  onAddNote: (sectionId: string) => void;
  onUpdateNote: (sectionId: string, noteId: string, content: string) => void;
  onDeleteNote: (sectionId: string, noteId: string) => void;
  onNoteAction: (noteId: string, action: string) => void;
  onShowBottomSheet: (content: string) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const SwipeableSection: React.FC<SwipeableSectionProps> = ({
  section,
  sections,
  activeIndex,
  onSwipe,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onNoteAction,
  onShowBottomSheet,
  isFullscreen,
  onToggleFullscreen
}) => {
  const theme = useTheme();
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'environment':
        return theme.palette.success.main;
      case 'society':
        return theme.palette.warning.main;
      case 'process':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !isDragging) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // Only handle horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
      setDragOffset(deltaX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !isDragging) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;
    const velocity = Math.abs(deltaX) / deltaTime;

    // Determine if it's a swipe gesture
    const isSwipe = Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 2;
    const isFastSwipe = velocity > 0.5;

    if (isSwipe || isFastSwipe) {
      if (deltaX > 0 && activeIndex > 0) {
        onSwipe('left'); // Swipe right to go to previous section
      } else if (deltaX < 0 && activeIndex < sections.length - 1) {
        onSwipe('right'); // Swipe left to go to next section
      }
    }

    // Reset state
    setIsDragging(false);
    setDragOffset(0);
    touchStartRef.current = null;
  };

  const handleAddNote = () => {
    onAddNote(section.id);
  };

  const canSwipeLeft = activeIndex > 0;
  const canSwipeRight = activeIndex < sections.length - 1;

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        transform: `translateX(${dragOffset}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        touchAction: 'pan-y pinch-zoom'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Section Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: 2,
          borderColor: getCategoryColor(section.category),
          bgcolor: alpha(getCategoryColor(section.category), 0.05)
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            disabled={!canSwipeLeft}
            onClick={() => onSwipe('left')}
            sx={{ opacity: canSwipeLeft ? 1 : 0.3 }}
          >
            <ChevronLeft />
          </IconButton>
          
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: getCategoryColor(section.category) }}>
              {section.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {activeIndex + 1} of {sections.length} • {section.notes.length} notes
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={onToggleFullscreen} size="small">
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
          
          <IconButton
            disabled={!canSwipeRight}
            onClick={() => onSwipe('right')}
            sx={{ opacity: canSwipeRight ? 1 : 0.3 }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      {/* Section Navigation Dots */}
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 1, gap: 0.5 }}>
        {sections.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: index === activeIndex 
                ? getCategoryColor(section.category)
                : alpha(theme.palette.grey[400], 0.5),
              transition: 'all 0.2s ease'
            }}
          />
        ))}
      </Box>

      {/* Section Content */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflow: 'auto',
          height: 'calc(100vh - 200px)',
          pb: 8 // Space for bottom actions
        }}
      >
        {section.notes.length === 0 ? (
          <Card
            sx={{
              border: 2,
              borderStyle: 'dashed',
              borderColor: alpha(getCategoryColor(section.category), 0.3),
              bgcolor: alpha(getCategoryColor(section.category), 0.02),
              textAlign: 'center',
              py: 4,
              cursor: 'pointer'
            }}
            onClick={handleAddNote}
          >
            <CardContent>
              <Add
                sx={{
                  fontSize: 48,
                  color: alpha(getCategoryColor(section.category), 0.5),
                  mb: 2
                }}
              />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No notes yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tap here to add your first note to this section
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {section.notes.map((note) => (
              <MobileStickyNote
                key={note.id}
                note={note}
                sectionId={section.id}
                sectionColor={getCategoryColor(section.category)}
                onUpdate={(content) => onUpdateNote(section.id, note.id, content)}
                onDelete={() => onDeleteNote(section.id, note.id)}
                onAction={(action) => onNoteAction(note.id, action)}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Floating Add Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          zIndex: 1000
        }}
      >
        <IconButton
          onClick={handleAddNote}
          sx={{
            bgcolor: getCategoryColor(section.category),
            color: 'white',
            width: 56,
            height: 56,
            boxShadow: 3,
            '&:hover': {
              bgcolor: alpha(getCategoryColor(section.category), 0.8)
            }
          }}
        >
          <Add />
        </IconButton>
      </Box>

      {/* Swipe Indicators */}
      {isDragging && (
        <>
          {canSwipeLeft && dragOffset > 30 && (
            <Fade in>
              <Box
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: alpha(theme.palette.primary.main, 0.8),
                  color: 'white',
                  p: 1,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <ChevronLeft />
                <Typography variant="caption">Previous</Typography>
              </Box>
            </Fade>
          )}
          
          {canSwipeRight && dragOffset < -30 && (
            <Fade in>
              <Box
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: alpha(theme.palette.primary.main, 0.8),
                  color: 'white',
                  p: 1,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Typography variant="caption">Next</Typography>
                <ChevronRight />
              </Box>
            </Fade>
          )}
        </>
      )}
    </Box>
  );
};
