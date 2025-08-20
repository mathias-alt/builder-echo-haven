import * as React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Switch,
  Slider,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
  Divider,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  ExpandMore,
  Settings,
  Palette,
  AspectRatio,
  GridOn,
  Security,
} from '@mui/icons-material';
import { ExportSettings, pageSizeOptions, qualityOptions } from '../types';

interface ExportSettingsPanelProps {
  settings: ExportSettings;
  onChange: (settings: Partial<ExportSettings>) => void;
}

export default function ExportSettingsPanel({
  settings,
  onChange,
}: ExportSettingsPanelProps) {
  const theme = useTheme();

  const handleChange = (field: keyof ExportSettings, value: any) => {
    onChange({ [field]: value });
  };

  const handleMarginChange = (side: keyof ExportSettings['margin'], value: number) => {
    onChange({
      margin: {
        ...settings.margin,
        [side]: value,
      },
    });
  };

  const selectedPageSize = pageSizeOptions.find(size => size.value === settings.pageSize);
  const selectedQuality = qualityOptions.find(quality => quality.value === settings.quality);

  return (
    <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Export Settings
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Page Settings */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AspectRatio sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Page Settings
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Page Size</InputLabel>
                  <Select
                    value={settings.pageSize}
                    label="Page Size"
                    onChange={(e) => handleChange('pageSize', e.target.value)}
                  >
                    {pageSizeOptions.map((size) => (
                      <MenuItem key={size.value} value={size.value}>
                        <Box>
                          <Typography variant="body2">{size.label}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {size.dimensions}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Orientation</InputLabel>
                  <Select
                    value={settings.orientation}
                    label="Orientation"
                    onChange={(e) => handleChange('orientation', e.target.value)}
                  >
                    <MenuItem value="portrait">Portrait</MenuItem>
                    <MenuItem value="landscape">Landscape</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {settings.pageSize === 'Custom' && (
                <>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Width"
                      type="number"
                      value={settings.customWidth || ''}
                      onChange={(e) => handleChange('customWidth', Number(e.target.value))}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">mm</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Height"
                      type="number"
                      value={settings.customHeight || ''}
                      onChange={(e) => handleChange('customHeight', Number(e.target.value))}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">mm</InputAdornment>,
                      }}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Quality</InputLabel>
                  <Select
                    value={settings.quality}
                    label="Quality"
                    onChange={(e) => handleChange('quality', e.target.value)}
                  >
                    {qualityOptions.map((quality) => (
                      <MenuItem key={quality.value} value={quality.value}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <Box>
                            <Typography variant="body2">{quality.label}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {quality.description}
                            </Typography>
                          </Box>
                          <Chip label={`${quality.dpi} DPI`} size="small" />
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Scale ({Math.round(settings.scale * 100)}%)
                </Typography>
                <Slider
                  value={settings.scale}
                  onChange={(_, value) => handleChange('scale', value)}
                  min={0.1}
                  max={2}
                  step={0.1}
                  marks={[
                    { value: 0.5, label: '50%' },
                    { value: 1, label: '100%' },
                    { value: 1.5, label: '150%' },
                    { value: 2, label: '200%' },
                  ]}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Margins */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GridOn sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Margins & Spacing
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Top"
                  type="number"
                  value={settings.margin.top}
                  onChange={(e) => handleMarginChange('top', Number(e.target.value))}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">px</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Right"
                  type="number"
                  value={settings.margin.right}
                  onChange={(e) => handleMarginChange('right', Number(e.target.value))}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">px</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Bottom"
                  type="number"
                  value={settings.margin.bottom}
                  onChange={(e) => handleMarginChange('bottom', Number(e.target.value))}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">px</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Left"
                  type="number"
                  value={settings.margin.left}
                  onChange={(e) => handleMarginChange('left', Number(e.target.value))}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">px</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Content Options */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Settings sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Content Options
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.includeNotes}
                    onChange={(e) => handleChange('includeNotes', e.target.checked)}
                  />
                }
                label="Include sticky notes content"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.includeComments}
                    onChange={(e) => handleChange('includeComments', e.target.checked)}
                  />
                }
                label="Include comments and annotations"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.includeMetadata}
                    onChange={(e) => handleChange('includeMetadata', e.target.checked)}
                  />
                }
                label="Include canvas metadata (title, date, etc.)"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.includeGrid}
                    onChange={(e) => handleChange('includeGrid', e.target.checked)}
                  />
                }
                label="Show grid lines"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.includeWatermark}
                    onChange={(e) => handleChange('includeWatermark', e.target.checked)}
                  />
                }
                label="Add watermark"
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Visual Settings */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Palette sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Visual Settings
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Background Color"
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  disabled={settings.transparentBackground}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.transparentBackground}
                      onChange={(e) => handleChange('transparentBackground', e.target.checked)}
                    />
                  }
                  label="Transparent background"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Format-specific settings */}
        {(settings.format === 'png' || settings.format === 'jpeg') && (
          <Card sx={{ backgroundColor: alpha(theme.palette.info.main, 0.05) }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Image Settings
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                For {settings.format.toUpperCase()} format, quality setting affects compression level.
                Higher quality results in larger file sizes but better image clarity.
              </Typography>
            </CardContent>
          </Card>
        )}

        {settings.format === 'pdf' && (
          <Card sx={{ backgroundColor: alpha(theme.palette.info.main, 0.05) }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                PDF Settings
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                PDF exports maintain vector quality and are perfect for printing. 
                All text remains selectable and searchable.
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Settings Summary */}
        <Card sx={{ backgroundColor: alpha(theme.palette.success.main, 0.05) }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Export Summary
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2">
                <strong>Format:</strong> {settings.format.toUpperCase()}
              </Typography>
              <Typography variant="body2">
                <strong>Page:</strong> {selectedPageSize?.label} ({settings.orientation})
              </Typography>
              <Typography variant="body2">
                <strong>Quality:</strong> {selectedQuality?.label} ({selectedQuality?.dpi} DPI)
              </Typography>
              <Typography variant="body2">
                <strong>Scale:</strong> {Math.round(settings.scale * 100)}%
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
