import React, { useState, useEffect } from 'react';
import {
  Box,
  useTheme,
  useMediaQuery,
  Fab,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Menu as MenuIcon,
  Navigation,
  Add
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { MobileToolbar } from './components/MobileToolbar';
import { SwipeableSection } from './components/SwipeableSection';
import { MobileBottomSheet } from './components/MobileBottomSheet';
import { MobileCanvasProps, MobileCanvasState } from './types';
import { CanvasSectionData } from '../components/CanvasSection';

export const MobileCanvas: React.FC<MobileCanvasProps> = ({
  sections,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onMoveNote,
  canvasName,
  onCanvasNameChange,
  autoSaveStatus
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [state, setState] = useState<MobileCanvasState>({
    activeSection: sections[0]?.id || '',
    isFullscreen: false,
    showBottomSheet: false,
    bottomSheetContent: null,
    selectedNote: null,
    isSwipeEnabled: true,
    gestureMode: false
  });

  const [notification, setNotification] = useState<{
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  } | null>(null);

  const activeIndex = sections.findIndex(s => s.id === state.activeSection);
  const activeSection = sections[activeIndex];

  useEffect(() => {
    // Enable/disable fullscreen on state change
    if (state.isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [state.isFullscreen]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!state.isSwipeEnabled) return;

    let newIndex = activeIndex;
    
    if (direction === 'left' && activeIndex > 0) {
      newIndex = activeIndex - 1;
    } else if (direction === 'right' && activeIndex < sections.length - 1) {
      newIndex = activeIndex + 1;
    }

    if (newIndex !== activeIndex) {
      setState(prev => ({ ...prev, activeSection: sections[newIndex].id }));
      
      // Haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
  };

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case 'save':
        setNotification({ message: 'Canvas saved successfully', severity: 'success' });
        break;
      
      case 'export':
        // Navigate to export functionality
        setNotification({ message: 'Opening export options...', severity: 'info' });
        break;
      
      case 'fullscreen':
        setState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
        break;
      
      case 'dashboard':
        navigate('/dashboard');
        break;
      
      case 'analytics':
        navigate('/analytics');
        break;
      
      case 'team':
        navigate('/team');
        break;
      
      case 'editNote':
        handleAddNote(state.activeSection);
        break;
      
      default:
        console.log('Action:', actionId);
    }
  };

  const handleNoteAction = (noteId: string, action: string) => {
    if (action.startsWith('changeColor:')) {
      const color = action.split(':')[1];
      setNotification({ message: `Note color changed to ${color}`, severity: 'info' });
    }
  };

  const handleMenuClick = () => {
    setState(prev => ({
      ...prev,
      showBottomSheet: true,
      bottomSheetContent: 'actions'
    }));
  };

  const handleNavigationClick = () => {
    setState(prev => ({
      ...prev,
      showBottomSheet: true,
      bottomSheetContent: 'navigation'
    }));
  };

  const handleShareClick = () => {
    // In a real implementation, this would open share modal
    setNotification({ message: 'Share functionality coming soon', severity: 'info' });
  };

  const handleCloseBottomSheet = () => {
    setState(prev => ({
      ...prev,
      showBottomSheet: false,
      bottomSheetContent: null
    }));
  };

  const handleToggleFullscreen = () => {
    setState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  };

  const handleSectionChange = (sectionId: string) => {
    setState(prev => ({ ...prev, activeSection: sectionId }));
  };

  // Don't render mobile canvas on desktop
  if (!isMobile) {
    return null;
  }

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden',
      bgcolor: 'background.default'
    }}>
      {/* Mobile Toolbar */}
      <MobileToolbar
        canvasName={canvasName}
        autoSaveStatus={autoSaveStatus}
        onMenuClick={handleMenuClick}
        onShareClick={handleShareClick}
        isFullscreen={state.isFullscreen}
      />

      {/* Main Canvas Area */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {activeSection && (
          <SwipeableSection
            section={activeSection}
            sections={sections}
            activeIndex={activeIndex}
            onSwipe={handleSwipe}
            onAddNote={onAddNote}
            onUpdateNote={onUpdateNote}
            onDeleteNote={onDeleteNote}
            onNoteAction={handleNoteAction}
            onShowBottomSheet={(content) => setState(prev => ({ 
              ...prev, 
              showBottomSheet: true, 
              bottomSheetContent: content as any 
            }))}
            isFullscreen={state.isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
          />
        )}
      </Box>

      {/* Floating Action Buttons */}
      {!state.isFullscreen && (
        <Box sx={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          zIndex: 1000
        }}>
          <Fab
            size="medium"
            onClick={handleNavigationClick}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.9),
              color: 'white',
              boxShadow: 3
            }}
          >
            <Navigation />
          </Fab>
        </Box>
      )}

      {/* Bottom Sheet */}
      <MobileBottomSheet
        open={state.showBottomSheet}
        onClose={handleCloseBottomSheet}
        content={state.bottomSheetContent}
        sections={sections}
        activeSection={state.activeSection}
        onSectionChange={handleSectionChange}
        onAction={handleAction}
        isFullscreen={state.isFullscreen}
      />

      {/* Notifications */}
      <Snackbar
        open={!!notification}
        autoHideDuration={3000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {notification && (
          <Alert 
            severity={notification.severity} 
            onClose={() => setNotification(null)}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};
