import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  useTheme,
  alpha,
  Chip,
  Grid
} from '@mui/material';
import {
  Close,
  Save,
  Download,
  Undo,
  Redo,
  Print,
  Settings,
  Fullscreen,
  FullscreenExit,
  GridView,
  ViewList,
  Palette,
  Add,
  Navigation,
  Home,
  Analytics,
  People
} from '@mui/icons-material';
import { BottomSheetAction } from '../types';
import { CanvasSectionData } from '../../components/CanvasSection';

interface MobileBottomSheetProps {
  open: boolean;
  onClose: () => void;
  content: 'actions' | 'navigation' | 'noteActions' | null;
  sections?: CanvasSectionData[];
  activeSection?: string;
  onSectionChange?: (sectionId: string) => void;
  onAction?: (actionId: string) => void;
  isFullscreen?: boolean;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  open,
  onClose,
  content,
  sections = [],
  activeSection,
  onSectionChange,
  onAction,
  isFullscreen = false
}) => {
  const theme = useTheme();
  const [dragStartY, setDragStartY] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

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
    setDragStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setDragCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const dragDistance = dragCurrentY - dragStartY;
    if (dragDistance > 100) {
      onClose();
    }
    
    setIsDragging(false);
    setDragStartY(0);
    setDragCurrentY(0);
  };

  const handleAction = (actionId: string) => {
    onAction?.(actionId);
    onClose();
  };

  const handleSectionSelect = (sectionId: string) => {
    onSectionChange?.(sectionId);
    onClose();
  };

  const renderActionsContent = () => (
    <Box>
      <Typography variant="h6" sx={{ px: 2, py: 1, fontWeight: 600 }}>
        Canvas Actions
      </Typography>
      
      <List>
        <ListItem button onClick={() => handleAction('save')}>
          <ListItemIcon>
            <Save color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Save Canvas" 
            secondary="Save current changes"
          />
        </ListItem>
        
        <ListItem button onClick={() => handleAction('export')}>
          <ListItemIcon>
            <Download color="secondary" />
          </ListItemIcon>
          <ListItemText 
            primary="Export Canvas" 
            secondary="Download as PDF, PNG, or other formats"
          />
        </ListItem>
        
        <ListItem button onClick={() => handleAction('print')}>
          <ListItemIcon>
            <Print />
          </ListItemIcon>
          <ListItemText 
            primary="Print Canvas" 
            secondary="Print the current canvas"
          />
        </ListItem>

        <Divider />

        <ListItem button onClick={() => handleAction('undo')}>
          <ListItemIcon>
            <Undo />
          </ListItemIcon>
          <ListItemText primary="Undo" />
        </ListItem>
        
        <ListItem button onClick={() => handleAction('redo')}>
          <ListItemIcon>
            <Redo />
          </ListItemIcon>
          <ListItemText primary="Redo" />
        </ListItem>

        <Divider />

        <ListItem button onClick={() => handleAction('fullscreen')}>
          <ListItemIcon>
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </ListItemIcon>
          <ListItemText 
            primary={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'} 
            secondary="Toggle fullscreen mode"
          />
        </ListItem>
        
        <ListItem button onClick={() => handleAction('settings')}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText 
            primary="Canvas Settings" 
            secondary="Configure canvas preferences"
          />
        </ListItem>
      </List>
    </Box>
  );

  const renderNavigationContent = () => (
    <Box>
      <Typography variant="h6" sx={{ px: 2, py: 1, fontWeight: 600 }}>
        Navigate Sections
      </Typography>
      
      <Box sx={{ px: 2, pb: 2 }}>
        <Grid container spacing={1}>
          {sections.map((section) => (
            <Grid item xs={12} sm={6} key={section.id}>
              <Box
                onClick={() => handleSectionSelect(section.id)}
                sx={{
                  p: 2,
                  border: 2,
                  borderColor: section.id === activeSection 
                    ? getCategoryColor(section.category)
                    : alpha(getCategoryColor(section.category), 0.3),
                  borderRadius: 2,
                  bgcolor: section.id === activeSection
                    ? alpha(getCategoryColor(section.category), 0.1)
                    : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: alpha(getCategoryColor(section.category), 0.05)
                  }
                }}
              >
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600,
                    color: getCategoryColor(section.category),
                    mb: 0.5
                  }}
                >
                  {section.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={section.category}
                    size="small"
                    sx={{
                      bgcolor: alpha(getCategoryColor(section.category), 0.2),
                      color: getCategoryColor(section.category),
                      fontSize: '0.7rem',
                      height: 20
                    }}
                  />
                  
                  <Typography variant="caption" color="text.secondary">
                    {section.notes.length} notes
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider />

      <List>
        <ListItem button onClick={() => handleAction('dashboard')}>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        
        <ListItem button onClick={() => handleAction('analytics')}>
          <ListItemIcon>
            <Analytics />
          </ListItemIcon>
          <ListItemText primary="Analytics" />
        </ListItem>
        
        <ListItem button onClick={() => handleAction('team')}>
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText primary="Team" />
        </ListItem>
      </List>
    </Box>
  );

  const renderNoteActionsContent = () => (
    <Box>
      <Typography variant="h6" sx={{ px: 2, py: 1, fontWeight: 600 }}>
        Note Actions
      </Typography>
      
      <List>
        <ListItem button onClick={() => handleAction('editNote')}>
          <ListItemIcon>
            <Add color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Add New Note" 
            secondary="Create a new sticky note"
          />
        </ListItem>
        
        <ListItem button onClick={() => handleAction('changeColor')}>
          <ListItemIcon>
            <Palette />
          </ListItemIcon>
          <ListItemText 
            primary="Change Colors" 
            secondary="Customize note colors"
          />
        </ListItem>
        
        <ListItem button onClick={() => handleAction('viewGrid')}>
          <ListItemIcon>
            <GridView />
          </ListItemIcon>
          <ListItemText primary="Grid View" />
        </ListItem>
        
        <ListItem button onClick={() => handleAction('viewList')}>
          <ListItemIcon>
            <ViewList />
          </ListItemIcon>
          <ListItemText primary="List View" />
        </ListItem>
      </List>
    </Box>
  );

  const renderContent = () => {
    switch (content) {
      case 'actions':
        return renderActionsContent();
      case 'navigation':
        return renderNavigationContent();
      case 'noteActions':
        return renderNoteActionsContent();
      default:
        return null;
    }
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: '80vh'
        }
      }}
    >
      <Box
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          p: 1,
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' }
        }}>
          <Box sx={{
            width: 40,
            height: 4,
            bgcolor: 'grey.300',
            borderRadius: 2
          }} />
        </Box>

        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          px: 2,
          py: 1
        }}>
          <Box />
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ 
          maxHeight: 'calc(80vh - 100px)', 
          overflow: 'auto',
          pb: 2
        }}>
          {renderContent()}
        </Box>
      </Box>
    </Drawer>
  );
};
