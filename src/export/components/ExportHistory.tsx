import * as React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Chip,
  useTheme,
  alpha,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  TextField,
  InputAdornment,
  TablePagination,
} from '@mui/material';
import {
  Download,
  Share,
  Delete,
  MoreVert,
  History,
  Search,
  FilterList,
  Refresh,
  InsertDriveFile,
  Link,
  Email,
  Schedule,
  ArrowBack,
  Close,
  Visibility,
} from '@mui/icons-material';
import { ExportHistoryItem, ExportFormat } from '../types';

interface ExportHistoryProps {
  canvasId: string;
  onClose: () => void;
}

// Mock export history data
const mockExportHistory: ExportHistoryItem[] = [
  {
    id: 'export_1',
    canvasId: 'canvas_1',
    canvasName: 'Business Model Canvas - Q4 2024',
    format: 'pdf',
    settings: {} as any,
    exportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    downloadUrl: '/exports/download/1',
    publicUrl: 'https://share.example.com/abc123',
    shareCode: 'ABC123',
    fileName: 'Business_Model_Canvas_Q4_2024.pdf',
    fileSize: 2500000,
    downloadCount: 15,
    status: 'active',
    shareOptions: {
      isPublic: true,
      allowDownload: true,
      allowComments: false,
      passwordProtected: true,
      notifyByEmail: false,
      recipientEmails: [],
    },
  },
  {
    id: 'export_2',
    canvasId: 'canvas_1',
    canvasName: 'Business Model Canvas - Q4 2024',
    format: 'png',
    settings: {} as any,
    exportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    downloadUrl: '/exports/download/2',
    fileName: 'Business_Model_Canvas_Q4_2024.png',
    fileSize: 1200000,
    downloadCount: 8,
    status: 'active',
  },
  {
    id: 'export_3',
    canvasId: 'canvas_1',
    canvasName: 'Business Model Canvas - Q3 2024',
    format: 'pdf',
    settings: {} as any,
    exportedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    downloadUrl: '/exports/download/3',
    fileName: 'Business_Model_Canvas_Q3_2024.pdf',
    fileSize: 3100000,
    downloadCount: 23,
    status: 'expired',
  },
];

const formatIcons: Record<ExportFormat, React.ReactElement> = {
  pdf: <InsertDriveFile sx={{ color: '#d32f2f' }} />,
  png: <InsertDriveFile sx={{ color: '#1976d2' }} />,
  jpeg: <InsertDriveFile sx={{ color: '#1976d2' }} />,
  svg: <InsertDriveFile sx={{ color: '#9c27b0' }} />,
  html: <InsertDriveFile sx={{ color: '#ff9800' }} />,
  docx: <InsertDriveFile sx={{ color: '#2e7d32' }} />,
};

export default function ExportHistory({ canvasId, onClose }: ExportHistoryProps) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterFormat, setFilterFormat] = React.useState<ExportFormat | 'all'>('all');
  const [selectedItem, setSelectedItem] = React.useState<ExportHistoryItem | null>(null);
  const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [exportHistory, setExportHistory] = React.useState<ExportHistoryItem[]>(mockExportHistory);

  const filteredHistory = React.useMemo(() => {
    return exportHistory.filter(item => {
      const matchesSearch = item.canvasName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.fileName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFormat = filterFormat === 'all' || item.format === filterFormat;
      return matchesSearch && matchesFormat;
    });
  }, [exportHistory, searchQuery, filterFormat]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: ExportHistoryItem) => {
    setMenuAnchor(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedItem(null);
  };

  const handleDownload = (item: ExportHistoryItem) => {
    if (item.status === 'active') {
      // Simulate download
      const link = document.createElement('a');
      link.href = item.downloadUrl;
      link.download = item.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    handleMenuClose();
  };

  const handleShare = (item: ExportHistoryItem) => {
    if (item.publicUrl) {
      navigator.clipboard.writeText(item.publicUrl);
      // Show success toast
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedItem) {
      setExportHistory(prev => prev.filter(item => item.id !== selectedItem.id));
      setDeleteDialogOpen(false);
      handleMenuClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getStatusChip = (item: ExportHistoryItem) => {
    switch (item.status) {
      case 'active':
        return <Chip label="Active" size="small" color="success" />;
      case 'expired':
        return <Chip label="Expired" size="small" color="error" />;
      case 'deleted':
        return <Chip label="Deleted" size="small" color="default" />;
      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={onClose}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Export History
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search exports..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
        
        <TextField
          select
          label="Format"
          value={filterFormat}
          onChange={(e) => setFilterFormat(e.target.value as any)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="all">All Formats</MenuItem>
          <MenuItem value="pdf">PDF</MenuItem>
          <MenuItem value="png">PNG</MenuItem>
          <MenuItem value="jpeg">JPEG</MenuItem>
          <MenuItem value="svg">SVG</MenuItem>
          <MenuItem value="html">HTML</MenuItem>
          <MenuItem value="docx">DOCX</MenuItem>
        </TextField>
        
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => {
            setSearchQuery('');
            setFilterFormat('all');
          }}
        >
          Reset
        </Button>
      </Box>

      {/* Export List */}
      {filteredHistory.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: alpha(theme.palette.text.secondary, 0.1),
              mx: 'auto',
              mb: 2,
            }}
          >
            <History sx={{ fontSize: 40, color: 'text.secondary' }} />
          </Avatar>
          <Typography variant="h6" sx={{ mb: 1 }}>
            No Export History
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {searchQuery || filterFormat !== 'all' 
              ? 'No exports match your search criteria.'
              : 'You haven\'t exported any canvases yet.'}
          </Typography>
        </Box>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>File</TableCell>
                  <TableCell>Format</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Exported</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Downloads</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHistory
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {formatIcons[item.format]}
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {item.fileName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {item.canvasName}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={item.format.toUpperCase()}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {formatFileSize(item.fileSize)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {formatTimeAgo(item.exportedAt)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Expires: {item.expiresAt.toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        {getStatusChip(item)}
                        {item.publicUrl && (
                          <Tooltip title="Has public share link">
                            <Link sx={{ ml: 1, fontSize: 16, color: 'info.main' }} />
                          </Tooltip>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {item.downloadCount}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {item.status === 'active' && (
                            <Tooltip title="Download">
                              <IconButton
                                size="small"
                                onClick={() => handleDownload(item)}
                              >
                                <Download />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {item.publicUrl && (
                            <Tooltip title="Copy share link">
                              <IconButton
                                size="small"
                                onClick={() => handleShare(item)}
                              >
                                <Share />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, item)}
                          >
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredHistory.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Paper>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {selectedItem?.status === 'active' && (
          <MenuItem onClick={() => handleDownload(selectedItem)}>
            <Download sx={{ mr: 1 }} />
            Download
          </MenuItem>
        )}
        
        {selectedItem?.publicUrl && (
          <MenuItem onClick={() => handleShare(selectedItem)}>
            <Share sx={{ mr: 1 }} />
            Copy Share Link
          </MenuItem>
        )}
        
        <MenuItem onClick={() => {
          setDeleteDialogOpen(true);
          handleMenuClose();
        }}>
          <Delete sx={{ mr: 1, color: 'error.main' }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Export</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this export?
          </Typography>
          <Alert severity="warning">
            This action cannot be undone. The file will be permanently deleted and any public share links will stop working.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
