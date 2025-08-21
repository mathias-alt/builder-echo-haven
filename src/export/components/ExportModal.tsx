import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Fade,
} from '@mui/material';
import {
  Close,
  PictureAsPdf,
  Image,
  Timeline,
  Code,
  Description,
  Download,
  Share,
  Print,
  Email,
  History,
  Settings as SettingsIcon,
  Preview,
} from '@mui/icons-material';
import { ExportSettings, ExportFormat, formatOptions, defaultExportSettings } from '../types';
import ExportPreview from './ExportPreview';
import ExportSettingsPanel from './ExportSettingsPanel';
import ShareOptionsPanel from './ShareOptionsPanel';
import ExportProgress from './ExportProgress';
import ExportHistory from './ExportHistory';
import EmailExport from './EmailExport';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  canvasId: string;
  canvasName: string;
  canvasData: any; // Canvas content data
  onExport: (settings: ExportSettings) => Promise<void>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <Box role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

const steps = ['Format & Settings', 'Preview', 'Export'];

const iconMap: Record<string, React.ReactElement> = {
  PictureAsPdf: <PictureAsPdf />,
  Image: <Image />,
  VectorArrange: <VectorArrange />,
  Code: <Code />,
  Description: <Description />,
};

export default function ExportModal({
  open,
  onClose,
  canvasId,
  canvasName,
  canvasData,
  onExport,
}: ExportModalProps) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState(0);
  const [settings, setSettings] = React.useState<ExportSettings>(defaultExportSettings);
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportComplete, setExportComplete] = React.useState(false);

  const handleClose = () => {
    if (!isExporting) {
      onClose();
      // Reset state
      setActiveStep(0);
      setActiveTab(0);
      setIsExporting(false);
      setExportComplete(false);
      setSettings(defaultExportSettings);
    }
  };

  const handleFormatSelect = (format: ExportFormat) => {
    setSettings(prev => ({ ...prev, format }));
    setActiveStep(1);
  };

  const handleSettingsChange = (newSettings: Partial<ExportSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    setActiveStep(2);
    
    try {
      await onExport(settings);
      setExportComplete(true);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  const renderFormatSelection = () => (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        Choose Export Format
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Select the format that best suits your needs
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
        {formatOptions.map((format) => (
          <Card
            key={format.value}
            sx={{
              cursor: 'pointer',
              border: settings.format === format.value 
                ? `2px solid ${theme.palette.primary.main}`
                : `1px solid ${theme.palette.divider}`,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
              },
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
            onClick={() => handleFormatSelect(format.value)}
          >
            {format.recommended && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: 8,
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}
              >
                Recommended
              </Box>
            )}
            
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  color: theme.palette.primary.main,
                }}
              >
                {iconMap[format.icon]}
              </Box>
              
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {format.label}
              </Typography>
              
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {format.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderFormatSelection();
      case 1:
        return (
          <Box sx={{ height: 600 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
                <Tab icon={<Preview />} label="Preview" />
                <Tab icon={<SettingsIcon />} label="Settings" />
                <Tab icon={<Share />} label="Share" />
              </Tabs>
            </Box>

            <TabPanel value={activeTab} index={0}>
              <ExportPreview
                canvasData={canvasData}
                settings={settings}
                canvasName={canvasName}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <ExportSettingsPanel
                settings={settings}
                onChange={handleSettingsChange}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              <ShareOptionsPanel
                canvasId={canvasId}
                canvasName={canvasName}
              />
            </TabPanel>
          </Box>
        );
      case 2:
        return (
          <ExportProgress
            settings={settings}
            canvasName={canvasName}
            isComplete={exportComplete}
            onComplete={() => setExportComplete(true)}
          />
        );
      default:
        return null;
    }
  };

  const getStepActions = () => {
    switch (activeStep) {
      case 0:
        return (
          <Button onClick={handleClose} disabled={isExporting}>
            Cancel
          </Button>
        );
      case 1:
        return (
          <>
            <Button onClick={() => setActiveStep(0)} disabled={isExporting}>
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleExport}
              disabled={isExporting}
              startIcon={<Download />}
            >
              Export
            </Button>
          </>
        );
      case 2:
        if (exportComplete) {
          return (
            <Button variant="contained" onClick={handleClose}>
              Close
            </Button>
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '80vh',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Export Canvas
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {canvasName}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => setActiveTab(3)}
            title="Export History"
            sx={{ mr: 1 }}
          >
            <History />
          </IconButton>
          
          <IconButton
            size="small"
            onClick={() => setActiveTab(4)}
            title="Email Export"
            sx={{ mr: 1 }}
          >
            <Email />
          </IconButton>
          
          <IconButton
            size="small"
            onClick={() => window.print()}
            title="Print"
            sx={{ mr: 1 }}
          >
            <Print />
          </IconButton>
          
          <IconButton onClick={handleClose} disabled={isExporting}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {activeTab < 3 && (
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        {/* Main Content */}
        {activeTab < 3 && (
          <Fade in timeout={300}>
            <Box>{renderStepContent()}</Box>
          </Fade>
        )}

        {/* Export History Tab */}
        {activeTab === 3 && (
          <ExportHistory
            canvasId={canvasId}
            onClose={() => setActiveTab(0)}
          />
        )}

        {/* Email Export Tab */}
        {activeTab === 4 && (
          <EmailExport
            canvasId={canvasId}
            canvasName={canvasName}
            settings={settings}
            onClose={() => setActiveTab(0)}
            onSent={() => {
              setActiveTab(0);
              handleClose();
            }}
          />
        )}
      </DialogContent>

      {activeTab < 3 && (
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Box />
            <Box sx={{ display: 'flex', gap: 1 }}>
              {getStepActions()}
            </Box>
          </Box>
        </DialogActions>
      )}
    </Dialog>
  );
}
