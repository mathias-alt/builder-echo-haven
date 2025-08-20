import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  useTheme,
  alpha,
  Fade,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import {
  Add,
  Edit,
  Energy as Eco,
  Forest as Nature,
  Recycling,
  Thermostat as ThermostatAuto,
  Pets,
  Groups,
  LocationCity,
  AccountBalance,
  LocalHospital as HealthAndSafety,
  Balance,
  TrendingUp,
  Person as PersonPin,
  Share,
  AttachMoney,
  Money as CurrencyExchange,
  MoreVert,
} from '@mui/icons-material';
import StickyNote, { StickyNoteData } from './StickyNote';

export interface CanvasSectionData {
  id: string;
  title: string;
  category: 'environment' | 'society' | 'process';
  notes: StickyNoteData[];
  gridArea: string;
}

interface CanvasSectionProps {
  section: CanvasSectionData;
  isLoading?: boolean;
  onAddNote: (sectionId: string) => void;
  onUpdateNote: (sectionId: string, noteId: string, content: string) => void;
  onDeleteNote: (sectionId: string, noteId: string) => void;
  onEditTitle?: (sectionId: string, newTitle: string) => void;
  className?: string;
}

const sectionIcons: Record<string, React.ReactElement> = {
  // Environment icons (green)
  sustainability: <Eco />,
  resources: <Nature />,
  circular: <Recycling />,
  climate: <ThermostatAuto />,
  biodiversity: <Pets />,
  
  // Society icons (yellow)
  stakeholders: <Groups />,
  community: <LocationCity />,
  governance: <AccountBalance />,
  wellbeing: <HealthAndSafety />,
  equity: <Balance />,
  
  // Process icons (teal)
  value: <TrendingUp />,
  customers: <PersonPin />,
  channels: <Share />,
  revenue: <AttachMoney />,
  costs: <CurrencyExchange />,
};

const sectionDescriptions: Record<string, string> = {
  sustainability: "Track environmental impact and sustainability initiatives",
  resources: "Identify natural resources usage and dependencies",
  circular: "Plan circular economy strategies and waste reduction",
  climate: "Address climate change actions and carbon footprint",
  biodiversity: "Consider biodiversity impact and conservation efforts",
  stakeholders: "Map key stakeholders and their interests",
  community: "Define community engagement and local impact",
  governance: "Establish governance structures and decision-making",
  wellbeing: "Focus on employee health, safety, and wellbeing",
  equity: "Ensure social equity and fair practices",
  value: "Define your unique value proposition",
  customers: "Identify and segment target customers",
  channels: "Map distribution and communication channels",
  revenue: "Design revenue streams and pricing models",
  costs: "Analyze cost structure and key expenses",
};

export default function CanvasSection({
  section,
  isLoading = false,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onEditTitle,
  className,
}: CanvasSectionProps) {
  const theme = useTheme();
  const [dragOver, setDragOver] = React.useState(false);
  const [editingNote, setEditingNote] = React.useState<string | null>(null);
  const [draggingNote, setDraggingNote] = React.useState<string | null>(null);

  const getCategoryColor = (category: CanvasSectionData['category']) => {
    switch (category) {
      case 'environment':
        return {
          main: theme.palette.success.main,
          light: alpha(theme.palette.success.main, 0.1),
          border: alpha(theme.palette.success.main, 0.3),
          dark: theme.palette.success.dark,
        };
      case 'society':
        return {
          main: theme.palette.warning.main,
          light: alpha(theme.palette.warning.main, 0.1),
          border: alpha(theme.palette.warning.main, 0.3),
          dark: theme.palette.warning.dark,
        };
      case 'process':
        return {
          main: theme.palette.info.main,
          light: alpha(theme.palette.info.main, 0.1),
          border: alpha(theme.palette.info.main, 0.3),
          dark: theme.palette.info.dark,
        };
    }
  };

  const colors = getCategoryColor(section.category);
  const icon = sectionIcons[section.id] || <Edit />;
  const description = sectionDescriptions[section.id] || "Add your ideas and insights here";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Handle note reordering/moving between sections
  };

  const handleNoteDragStart = (e: React.DragEvent, noteId: string) => {
    setDraggingNote(noteId);
    e.dataTransfer.setData('noteId', noteId);
    e.dataTransfer.setData('sectionId', section.id);
  };

  const handleNoteDragEnd = () => {
    setDraggingNote(null);
  };

  const isEmpty = section.notes.length === 0;

  return (
    <Card
      className={className}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        gridArea: section.gridArea,
        backgroundColor: 'background.paper',
        border: dragOver 
          ? `3px dashed ${colors.main}` 
          : isEmpty 
            ? `2px dashed ${alpha(colors.border, 0.5)}`
            : `2px solid ${alpha(colors.border, 0.3)}`,
        borderRadius: 3,
        minHeight: isEmpty ? 300 : 'auto',
        height: 'fit-content',
        '&:hover': {
          borderColor: colors.border,
          boxShadow: `0 4px 20px ${alpha(colors.main, 0.15)}`,
        },
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        ...(dragOver && {
          backgroundColor: alpha(colors.light, 0.5),
          transform: 'scale(1.02)',
        }),
      }}
    >
      {/* Section Header */}
      <Box
        sx={{
          backgroundColor: colors.main,
          color: 'white',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderRadius: '12px 12px 0 0',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            backgroundColor: alpha(theme.palette.common.white, 0.2),
            borderRadius: 1,
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: 20 } })}
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            {section.title}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
            {section.notes.length} {section.notes.length === 1 ? 'note' : 'notes'}
          </Typography>
        </Box>

        <IconButton
          size="small"
          onClick={() => onAddNote(section.id)}
          sx={{
            color: 'white',
            backgroundColor: alpha(theme.palette.common.white, 0.2),
            '&:hover': {
              backgroundColor: alpha(theme.palette.common.white, 0.3),
            },
          }}
        >
          <Add sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Section Content */}
      <CardContent 
        sx={{ 
          flex: 1, 
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          minHeight: isEmpty ? 200 : 'auto',
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Skeleton variant="rectangular" width="100%" height={100} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width="80%" height={100} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width="60%" height={100} sx={{ borderRadius: 1 }} />
          </Box>
        ) : isEmpty ? (
          <Fade in timeout={300}>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: 2,
                color: theme.palette.text.secondary,
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: alpha(colors.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1,
                }}
              >
                {React.cloneElement(icon, { 
                  sx: { fontSize: 32, color: colors.main } 
                })}
              </Box>
              
              <Typography variant="body2" sx={{ mb: 1, maxWidth: 200 }}>
                {description}
              </Typography>
              
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => onAddNote(section.id)}
                sx={{
                  borderColor: colors.border,
                  color: colors.main,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: colors.main,
                    backgroundColor: colors.light,
                  },
                }}
              >
                Add Note
              </Button>
            </Box>
          </Fade>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              minHeight: 0,
            }}
          >
            {section.notes.map((note) => (
              <StickyNote
                key={note.id}
                note={note}
                onUpdate={(noteId, content) => onUpdateNote(section.id, noteId, content)}
                onDelete={(noteId) => onDeleteNote(section.id, noteId)}
                onDragStart={handleNoteDragStart}
                onDragEnd={handleNoteDragEnd}
                isDragging={draggingNote === note.id}
                isEditing={editingNote === note.id}
                onStartEdit={setEditingNote}
                onStopEdit={() => setEditingNote(null)}
              />
            ))}
            
            {/* Add Note Button at Bottom */}
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => onAddNote(section.id)}
              sx={{
                borderStyle: 'dashed',
                borderColor: alpha(colors.border, 0.5),
                color: colors.main,
                textTransform: 'none',
                py: 1.5,
                '&:hover': {
                  borderColor: colors.main,
                  backgroundColor: colors.light,
                  borderStyle: 'solid',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Add Another Note
            </Button>
          </Box>
        )}
      </CardContent>

      {/* Drop Zone Indicator */}
      {dragOver && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: alpha(colors.main, 0.1),
            border: `3px dashed ${colors.main}`,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: colors.main,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Add /> Drop note here
          </Typography>
        </Box>
      )}
    </Card>
  );
}
