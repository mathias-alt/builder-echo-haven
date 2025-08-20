import * as React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Zoom,
  Chip,
} from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  Fullscreen,
  FullscreenExit,
  AspectRatio,
  GridOn,
  GridOff,
} from '@mui/icons-material';
import { ExportSettings } from '../types';

interface ExportPreviewProps {
  canvasData: any;
  settings: ExportSettings;
  canvasName: string;
}

export default function ExportPreview({
  canvasData,
  settings,
  canvasName,
}: ExportPreviewProps) {
  const theme = useTheme();
  const [zoom, setZoom] = React.useState(0.5);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showGrid, setShowGrid] = React.useState(settings.includeGrid);
  
  const previewRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setShowGrid(settings.includeGrid);
  }, [settings.includeGrid]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.1));
  };

  const handleFitToScreen = () => {
    setZoom(0.5);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getPageDimensions = () => {
    const { pageSize, orientation, customWidth, customHeight } = settings;
    
    let width = 210; // A4 width in mm
    let height = 297; // A4 height in mm
    
    switch (pageSize) {
      case 'A3':
        width = 297;
        height = 420;
        break;
      case 'Letter':
        width = 216;
        height = 279;
        break;
      case 'Legal':
        width = 216;
        height = 356;
        break;
      case 'Tabloid':
        width = 279;
        height = 432;
        break;
      case 'Custom':
        width = customWidth || 210;
        height = customHeight || 297;
        break;
    }
    
    if (orientation === 'landscape') {
      [width, height] = [height, width];
    }
    
    return { width, height };
  };

  const { width: pageWidth, height: pageHeight } = getPageDimensions();
  const aspectRatio = pageWidth / pageHeight;

  const previewWidth = isFullscreen ? 800 : 400;
  const previewHeight = previewWidth / aspectRatio;

  const renderCanvasPreview = () => {
    // Mock canvas content - in real implementation, this would render actual canvas data
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          backgroundColor: settings.transparentBackground ? 'transparent' : settings.backgroundColor,
          backgroundImage: showGrid ? `
            linear-gradient(${alpha(theme.palette.divider, 0.2)} 1px, transparent 1px),
            linear-gradient(90deg, ${alpha(theme.palette.divider, 0.2)} 1px, transparent 1px)
          ` : 'none',
          backgroundSize: showGrid ? '20px 20px' : 'none',
          padding: `${settings.margin.top}px ${settings.margin.right}px ${settings.margin.bottom}px ${settings.margin.left}px`,
          boxSizing: 'border-box',
        }}
      >
        {/* Mock Canvas Sections */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gridTemplateRows: 'repeat(3, 1fr)', 
          gap: 1, 
          height: '100%',
          fontSize: '8px',
        }}>
          {Array.from({ length: 15 }, (_, i) => (
            <Box
              key={i}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                p: 0.5,
                backgroundColor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '6px', mb: 0.5 }}>
                Section {i + 1}
              </Typography>
              {settings.includeNotes && (
                <Box sx={{ flex: 1, backgroundColor: alpha(theme.palette.primary.main, 0.1), borderRadius: 0.5, p: 0.5 }}>
                  <Typography variant="caption" sx={{ fontSize: '5px' }}>
                    Sample note content for preview...
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>

        {/* Watermark */}
        {settings.includeWatermark && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              opacity: 0.3,
              transform: 'rotate(-45deg)',
              transformOrigin: 'bottom right',
            }}
          >
            <Typography variant="caption" sx={{ fontSize: '8px', color: 'text.secondary' }}>
              Flourishing Business Canvas
            </Typography>
          </Box>
        )}

        {/* Metadata */}
        {settings.includeMetadata && (
          <Box
            sx={{
              position: 'absolute',
              top: settings.margin.top,
              left: settings.margin.left,
              right: settings.margin.right,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pb: 1,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
              mb: 1,
            }}
          >
            <Typography variant="caption" sx={{ fontSize: '7px', fontWeight: 600 }}>
              {canvasName}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '6px', color: 'text.secondary' }}>
              {new Date().toLocaleDateString()}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Preview Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Export Preview
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Chip label={settings.format.toUpperCase()} size="small" color="primary" />
            <Chip label={`${settings.pageSize} ${settings.orientation}`} size="small" variant="outlined" />
            <Chip label={settings.quality} size="small" variant="outlined" />
          </Box>
        </Box>

        {/* Preview Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Show/Hide Grid">
            <IconButton size="small" onClick={() => setShowGrid(!showGrid)}>
              {showGrid ? <GridOff /> : <GridOn />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Zoom Out">
            <IconButton size="small" onClick={handleZoomOut} disabled={zoom <= 0.1}>
              <ZoomOut />
            </IconButton>
          </Tooltip>
          
          <Typography variant="caption" sx={{ minWidth: 40, textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </Typography>
          
          <Tooltip title="Zoom In">
            <IconButton size="small" onClick={handleZoomIn} disabled={zoom >= 2}>
              <ZoomIn />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Fit to Screen">
            <IconButton size="small" onClick={handleFitToScreen}>
              <AspectRatio />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            <IconButton size="small" onClick={toggleFullscreen}>
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Preview Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: alpha(theme.palette.grey[100], 0.5),
          borderRadius: 2,
          p: 2,
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <Card
          ref={previewRef}
          sx={{
            width: previewWidth * zoom,
            height: previewHeight * zoom,
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}`,
            transition: 'all 0.2s ease',
            overflow: 'hidden',
            ...(isFullscreen && {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 2000,
              borderRadius: 0,
              width: '100vw',
              height: '100vh',
            }),
          }}
        >
          <CardContent sx={{ p: 0, height: '100%', '&:last-child': { pb: 0 } }}>
            {renderCanvasPreview()}
          </CardContent>
        </Card>

        {/* Preview Info */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
            borderRadius: 1,
            px: 2,
            py: 1,
            backdropFilter: 'blur(8px)',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            {pageWidth} × {pageHeight} mm
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
            • Scale: {Math.round(settings.scale * 100)}%
          </Typography>
        </Box>
      </Box>

      {/* Preview Settings Summary */}
      <Box sx={{ mt: 2, p: 2, backgroundColor: alpha(theme.palette.info.main, 0.05), borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Export Settings Summary
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {settings.includeNotes && <Chip label="Include Notes" size="small" />}
          {settings.includeComments && <Chip label="Include Comments" size="small" />}
          {settings.includeMetadata && <Chip label="Include Metadata" size="small" />}
          {settings.includeGrid && <Chip label="Show Grid" size="small" />}
          {settings.includeWatermark && <Chip label="Add Watermark" size="small" />}
          {settings.transparentBackground && <Chip label="Transparent Background" size="small" />}
        </Box>
      </Box>
    </Box>
  );
}
