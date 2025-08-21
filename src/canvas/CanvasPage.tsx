import * as React from 'react';
import {
  Box,
  Button,
  IconButton,
  useTheme,
  alpha,
  TextField,
  Toolbar,
  AppBar,
  Container,
  Typography,
} from '@mui/material';
import {
  Save,
  Download,
  Share,
  MoreVert,
  CloudDone,
  CloudUpload,
  Undo,
  Redo,
  Print,
} from '@mui/icons-material';
import CanvasSection, { CanvasSectionData } from './components/CanvasSection';
import { StickyNoteData } from './components/StickyNote';
import { ExportModal, ExportSettings } from '../export';
import { ShareModal } from '../sharing';

const initialSections: CanvasSectionData[] = [
  // Environment sections (green)
  { id: 'sustainability', title: 'Sustainability Impact', category: 'environment', notes: [], gridArea: 'sustainability' },
  { id: 'resources', title: 'Natural Resources', category: 'environment', notes: [], gridArea: 'resources' },
  { id: 'circular', title: 'Circular Economy', category: 'environment', notes: [], gridArea: 'circular' },
  { id: 'climate', title: 'Climate Action', category: 'environment', notes: [], gridArea: 'climate' },
  { id: 'biodiversity', title: 'Biodiversity', category: 'environment', notes: [], gridArea: 'biodiversity' },

  // Society/Economy sections (yellow)
  { id: 'stakeholders', title: 'Key Stakeholders', category: 'society', notes: [], gridArea: 'stakeholders' },
  { id: 'community', title: 'Community Impact', category: 'society', notes: [], gridArea: 'community' },
  { id: 'governance', title: 'Governance', category: 'society', notes: [], gridArea: 'governance' },
  { id: 'wellbeing', title: 'Employee Wellbeing', category: 'society', notes: [], gridArea: 'wellbeing' },
  { id: 'equity', title: 'Social Equity', category: 'society', notes: [], gridArea: 'equity' },

  // Process/Value/People sections (teal)
  { id: 'value', title: 'Value Proposition', category: 'process', notes: [], gridArea: 'value' },
  { id: 'customers', title: 'Customer Segments', category: 'process', notes: [], gridArea: 'customers' },
  { id: 'channels', title: 'Channels', category: 'process', notes: [], gridArea: 'channels' },
  { id: 'revenue', title: 'Revenue Streams', category: 'process', notes: [], gridArea: 'revenue' },
  { id: 'costs', title: 'Cost Structure', category: 'process', notes: [], gridArea: 'costs' },
];

export default function CanvasPage() {
  const theme = useTheme();
  const [canvasName, setCanvasName] = React.useState('Flourishing Business Canvas');
  const [autoSaveStatus, setAutoSaveStatus] = React.useState<'saved' | 'saving' | 'error'>('saved');
  const [sections, setSections] = React.useState<CanvasSectionData[]>(initialSections);
  const [isLoading, setIsLoading] = React.useState(false);
  const [exportModalOpen, setExportModalOpen] = React.useState(false);
  const [shareModalOpen, setShareModalOpen] = React.useState(false);

  React.useEffect(() => {
    document.title = 'Canvas - Flourishing Business Canvas';
  }, []);

  const generateNoteId = () => `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleAddNote = (sectionId: string) => {
    const newNote: StickyNoteData = {
      id: generateNoteId(),
      content: '',
      color: 'yellow',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, notes: [...section.notes, newNote] }
        : section
    ));

    setAutoSaveStatus('saving');
    setTimeout(() => setAutoSaveStatus('saved'), 1000);
  };

  const handleUpdateNote = (sectionId: string, noteId: string, content: string) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? {
            ...section,
            notes: section.notes.map(note =>
              note.id === noteId
                ? { ...note, content, updatedAt: new Date() }
                : note
            )
          }
        : section
    ));

    setAutoSaveStatus('saving');
    setTimeout(() => setAutoSaveStatus('saved'), 1000);
  };

  const handleDeleteNote = (sectionId: string, noteId: string) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, notes: section.notes.filter(note => note.id !== noteId) }
        : section
    ));

    setAutoSaveStatus('saving');
    setTimeout(() => setAutoSaveStatus('saved'), 1000);
  };

  const handleExport = async (settings: ExportSettings) => {
    // Simulate export process
    console.log('Exporting canvas with settings:', settings);

    // In a real app, this would:
    // 1. Generate the export based on settings
    // 2. Upload to storage
    // 3. Return download/share URLs

    await new Promise(resolve => setTimeout(resolve, 3000));
  };

  const handlePrint = () => {
    window.print();
  };

  const AutoSaveIndicator = () => {
    const getStatusIcon = () => {
      switch (autoSaveStatus) {
        case 'saved':
          return <CloudDone sx={{ fontSize: 16, color: theme.palette.success.main }} />;
        case 'saving':
          return <CloudUpload sx={{ fontSize: 16, color: theme.palette.warning.main }} />;
        case 'error':
          return <CloudUpload sx={{ fontSize: 16, color: theme.palette.error.main }} />;
      }
    };

    const getStatusText = () => {
      switch (autoSaveStatus) {
        case 'saved':
          return 'All changes saved';
        case 'saving':
          return 'Saving...';
        case 'error':
          return 'Save failed';
      }
    };

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {getStatusIcon()}
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
          {getStatusText()}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Toolbar */}
      <AppBar 
        position="static" 
        elevation={1}
        sx={{ 
          backgroundColor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ gap: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              variant="standard"
              value={canvasName}
              onChange={(e) => setCanvasName(e.target.value)}
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                },
              }}
            />
            <AutoSaveIndicator />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" title="Undo">
              <Undo />
            </IconButton>
            <IconButton size="small" title="Redo">
              <Redo />
            </IconButton>
            <Button 
              startIcon={<Save />} 
              variant="outlined" 
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Save
            </Button>
            <Button
              startIcon={<Download />}
              variant="outlined"
              size="small"
              onClick={() => setExportModalOpen(true)}
              sx={{ textTransform: 'none' }}
            >
              Export
            </Button>
            <Button
              startIcon={<Print />}
              variant="outlined"
              size="small"
              onClick={handlePrint}
              sx={{ textTransform: 'none' }}
            >
              Print
            </Button>
            <Button
              startIcon={<Share />}
              variant="contained"
              size="small"
              onClick={() => setShareModalOpen(true)}
              sx={{ textTransform: 'none' }}
            >
              Share
            </Button>
            <IconButton size="small">
              <MoreVert />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Canvas Area */}
      <Box 
        sx={{ 
          flex: 1, 
          overflow: 'auto',
          backgroundColor: alpha(theme.palette.background.default, 0.5),
          p: 3,
        }}
      >
        <Container maxWidth={false} sx={{ height: '100%' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gridTemplateRows: 'repeat(3, 1fr)',
              gap: 2,
              height: '100%',
              minHeight: '800px',
              gridTemplateAreas: `
                "sustainability resources circular climate biodiversity"
                "stakeholders community governance wellbeing equity"
                "value customers channels revenue costs"
              `,
              '@media (max-width: 1200px)': {
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridTemplateRows: 'repeat(5, 1fr)',
                gridTemplateAreas: `
                  "sustainability resources circular"
                  "climate biodiversity stakeholders"
                  "community governance wellbeing"
                  "equity value customers"
                  "channels revenue costs"
                `,
              },
              '@media (max-width: 768px)': {
                gridTemplateColumns: '1fr',
                gridTemplateRows: 'repeat(15, 200px)',
                gridTemplateAreas: sections.map(section => `"${section.gridArea}"`).join(' '),
              },
            }}
          >
            {sections.map((section) => (
              <CanvasSection
                key={section.id}
                section={section}
                isLoading={isLoading}
                onAddNote={handleAddNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Export Modal */}
      <ExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        canvasId="canvas-1"
        onExport={handleExport}
      />

      {/* Share Modal */}
      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        canvasId="canvas-1"
        canvasTitle={canvasName}
      />
    </Box>
  );
}
