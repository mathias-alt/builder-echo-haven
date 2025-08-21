import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  Slider,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Settings as SettingsIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

// Import all micro-interaction components
import {
  AnimatedButton,
  PrimaryAnimatedButton,
  LoadingAnimatedButton,
  AnimatedTextField,
  FloatingLabelInput,
  AnimatedPasswordField,
  ScrollAnimation,
  SlideUpOnScroll,
  StaggeredList,
  Parallax,
  Draggable,
  Droppable,
  SortableList,
  AnimatedTooltip,
  HoverTooltip,
  ClickTooltip,
  DropdownMenu,
  AnimatedMenu,
  StaggeredMenuItem,
  useToast,
  useQuickToast,
  useMicroInteractions,
  useOptimizedAnimation,
  useResponsiveAnimation,
} from '../index';

// Example 1: Enhanced buttons with micro-interactions
const ButtonExamples: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useQuickToast();

  const handleAsyncAction = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    success('Action completed successfully!');
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Enhanced Buttons
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <PrimaryAnimatedButton
            startIcon={<AddIcon />}
            glowEffect
            scaleOnHover
          >
            Primary Action
          </PrimaryAnimatedButton>
          
          <AnimatedButton
            variant="outlined"
            startIcon={<SettingsIcon />}
            bounceOnClick
          >
            Settings
          </AnimatedButton>
          
          <LoadingAnimatedButton
            loading={isLoading}
            onClick={handleAsyncAction}
            variant="contained"
            color="secondary"
          >
            {isLoading ? 'Processing...' : 'Start Process'}
          </LoadingAnimatedButton>
          
          <AnimatedButton
            variant="text"
            startIcon={<FavoriteIcon />}
            customAnimation="pulse 2s infinite"
            sx={{ color: 'error.main' }}
          >
            Like
          </AnimatedButton>
        </Box>
      </CardContent>
    </Card>
  );
};

// Example 2: Animated form fields
const FormExamples: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    search: '',
  });

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Animated Form Fields
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 400 }}>
          <FloatingLabelInput
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            glowEffect
            scaleOnFocus
          />
          
          <AnimatedPasswordField
            label="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            showPasswordIcon
            shakeOnError={formData.password.length > 0 && formData.password.length < 6}
            error={formData.password.length > 0 && formData.password.length < 6}
            helperText={formData.password.length > 0 && formData.password.length < 6 ? 'Password too short' : ''}
          />
          
          <AnimatedTextField
            label="Search"
            placeholder="Type to search..."
            value={formData.search}
            onChange={(e) => setFormData({ ...formData, search: e.target.value })}
            validationState={formData.search ? 'success' : 'idle'}
            borderPulse={formData.search.length > 0}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

// Example 3: Scroll animations
const ScrollAnimationExamples: React.FC = () => {
  const items = Array.from({ length: 8 }, (_, i) => `Item ${i + 1}`);

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Scroll-Triggered Animations
        </Typography>
        
        <ScrollAnimation animationType="fadeInUp" threshold={0.2}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This text fades in from below when it comes into view.
          </Typography>
        </ScrollAnimation>
        
        <Parallax speed={0.3} direction="up">
          <Box
            sx={{
              height: 200,
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              mb: 3,
            }}
          >
            Parallax Background
          </Box>
        </Parallax>
        
        <StaggeredList staggerDelay={100} animationType="fadeInLeft">
          {items.map((item, index) => (
            <Card key={index} sx={{ mb: 1, p: 2 }}>
              <Typography>{item} - Staggered animation</Typography>
            </Card>
          ))}
        </StaggeredList>
      </CardContent>
    </Card>
  );
};

// Example 4: Drag and drop
const DragDropExamples: React.FC = () => {
  const [items, setItems] = useState(['Task 1', 'Task 2', 'Task 3', 'Task 4']);
  const [droppedItems, setDroppedItems] = useState<string[]>([]);

  const handleDrop = (dragData: any) => {
    if (dragData && !droppedItems.includes(dragData)) {
      setDroppedItems(prev => [...prev, dragData]);
    }
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setItems(newItems);
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Drag and Drop Interactions
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Sortable List
            </Typography>
            <SortableList onReorder={handleReorder} direction="vertical">
              {items.map((item, index) => (
                <Card key={index} sx={{ p: 2, mb: 1, cursor: 'grab' }}>
                  <Typography>{item}</Typography>
                </Card>
              ))}
            </SortableList>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Drag to Drop Zone
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {['Item A', 'Item B', 'Item C'].map((item) => (
                <Draggable key={item} dragData={item}>
                  <Chip
                    label={item}
                    color="primary"
                    sx={{ cursor: 'grab' }}
                  />
                </Draggable>
              ))}
            </Box>
            
            <Droppable onDrop={handleDrop} highlightOnHover>
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  minHeight: 100,
                }}
              >
                <Typography color="text.secondary">
                  Drop items here
                </Typography>
                {droppedItems.map((item, index) => (
                  <Chip key={index} label={item} sx={{ m: 0.5 }} />
                ))}
              </Box>
            </Droppable>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Example 5: Tooltips and menus
const TooltipMenuExamples: React.FC = () => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Tooltips and Menus
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <HoverTooltip title="This is a hover tooltip with fade animation">
            <Button variant="outlined">Hover Tooltip</Button>
          </HoverTooltip>
          
          <ClickTooltip title="Click tooltip with zoom animation" interactive>
            <Button variant="outlined">Click Tooltip</Button>
          </ClickTooltip>
          
          <AnimatedTooltip
            title="Bounce tooltip!"
            animation="bounce"
            placement="top"
          >
            <Button variant="outlined">Bounce Tooltip</Button>
          </AnimatedTooltip>
        </Box>
        
        <DropdownMenu
          trigger={<Button variant="contained">Animated Menu</Button>}
          animation="cascade"
          placement="bottom-start"
        >
          <StaggeredMenuItem icon={<EditIcon />} delay={0}>
            Edit
          </StaggeredMenuItem>
          <StaggeredMenuItem icon={<ShareIcon />} delay={50}>
            Share
          </StaggeredMenuItem>
          <StaggeredMenuItem icon={<DeleteIcon />} delay={100} divider>
            Delete
          </StaggeredMenuItem>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
};

// Example 6: Performance controls
const PerformanceControls: React.FC = () => {
  const { config, updateConfig, isReducedMotion, isLowPerformance } = useMicroInteractions();
  const { useComplex, useParallax, isMobile } = useResponsiveAnimation();

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Performance & Settings
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Current Status
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Animations Enabled"
                  secondary={config.enabled ? 'Yes' : 'No'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Reduced Motion"
                  secondary={isReducedMotion ? 'Enabled' : 'Disabled'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Low Performance Mode"
                  secondary={isLowPerformance ? 'Active' : 'Inactive'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Mobile Device"
                  secondary={isMobile ? 'Yes' : 'No'}
                />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Settings
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={config.enabled}
                  onChange={(e) => updateConfig({ enabled: e.target.checked })}
                />
              }
              label="Enable Animations"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={config.enableComplexAnimations}
                  onChange={(e) => updateConfig({ enableComplexAnimations: e.target.checked })}
                />
              }
              label="Complex Animations"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={config.enableParallax}
                  onChange={(e) => updateConfig({ enableParallax: e.target.checked })}
                />
              }
              label="Parallax Effects"
            />
            
            <Box sx={{ mt: 2 }}>
              <Typography gutterBottom>Animation Speed: {config.animationSpeed}x</Typography>
              <Slider
                value={config.animationSpeed}
                onChange={(_, value) => updateConfig({ animationSpeed: value as number })}
                min={0.1}
                max={2}
                step={0.1}
                marks={[
                  { value: 0.5, label: '0.5x' },
                  { value: 1, label: '1x' },
                  { value: 1.5, label: '1.5x' },
                  { value: 2, label: '2x' },
                ]}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Main integration examples component
export const MicroInteractionsIntegrationExamples: React.FC = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Micro-Interactions Integration Examples
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Comprehensive examples showing how to integrate micro-interactions throughout your application
        with performance optimizations and accessibility considerations.
      </Typography>
      
      <ButtonExamples />
      <FormExamples />
      <ScrollAnimationExamples />
      <DragDropExamples />
      <TooltipMenuExamples />
      <PerformanceControls />
    </Box>
  );
};

export default MicroInteractionsIntegrationExamples;
