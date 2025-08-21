export type ExportFormat = 'pdf' | 'png' | 'jpeg' | 'svg' | 'html' | 'docx';

export type PageSize = 'A4' | 'A3' | 'Letter' | 'Legal' | 'Tabloid' | 'Custom';

export type PageOrientation = 'portrait' | 'landscape';

export type ExportQuality = 'low' | 'medium' | 'high' | 'ultra';

export interface ExportSettings {
  format: ExportFormat;
  pageSize: PageSize;
  orientation: PageOrientation;
  quality: ExportQuality;
  includeNotes: boolean;
  includeComments: boolean;
  includeMetadata: boolean;
  includeGrid: boolean;
  includeWatermark: boolean;
  customWidth?: number;
  customHeight?: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  scale: number;
  backgroundColor: string;
  transparentBackground: boolean;
}

export interface ExportProgress {
  stage: 'preparing' | 'rendering' | 'generating' | 'uploading' | 'complete' | 'error';
  progress: number; // 0-100
  message: string;
  estimatedTimeRemaining?: number; // in seconds
}

export interface ExportResult {
  id: string;
  downloadUrl: string;
  publicUrl?: string;
  shareCode?: string;
  fileName: string;
  fileSize: number;
  expiresAt: Date;
  settings: ExportSettings;
}

export interface ShareOptions {
  isPublic: boolean;
  allowDownload: boolean;
  allowComments: boolean;
  passwordProtected: boolean;
  password?: string;
  expiresAt?: Date;
  customMessage?: string;
  notifyByEmail: boolean;
  recipientEmails: string[];
}

export interface ExportHistoryItem {
  id: string;
  canvasId: string;
  canvasName: string;
  format: ExportFormat;
  settings: ExportSettings;
  shareOptions?: ShareOptions;
  exportedAt: Date;
  expiresAt: Date;
  downloadUrl: string;
  publicUrl?: string;
  shareCode?: string;
  fileName: string;
  fileSize: number;
  downloadCount: number;
  status: 'active' | 'expired' | 'deleted';
}

export interface EmailExportOptions {
  recipients: string[];
  subject: string;
  message: string;
  attachFile: boolean;
  includePublicLink: boolean;
  copyToSender: boolean;
}

export interface PrintOptions {
  printComments: boolean;
  printGrid: boolean;
  printInColor: boolean;
  fitToPage: boolean;
  pageBreaks: boolean;
}

export const defaultExportSettings: ExportSettings = {
  format: 'pdf',
  pageSize: 'A4',
  orientation: 'landscape',
  quality: 'high',
  includeNotes: true,
  includeComments: false,
  includeMetadata: true,
  includeGrid: false,
  includeWatermark: false,
  margin: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
  scale: 1,
  backgroundColor: '#ffffff',
  transparentBackground: false,
};

export const formatOptions: Array<{
  value: ExportFormat;
  label: string;
  description: string;
  icon: string;
  recommended?: boolean;
}> = [
  {
    value: 'pdf',
    label: 'PDF',
    description: 'Best for printing and sharing documents',
    icon: 'PictureAsPdf',
    recommended: true,
  },
  {
    value: 'png',
    label: 'PNG',
    description: 'High-quality image with transparency support',
    icon: 'Image',
    recommended: true,
  },
  {
    value: 'jpeg',
    label: 'JPEG',
    description: 'Compressed image format, smaller file size',
    icon: 'Image',
  },
  {
    value: 'svg',
    label: 'SVG',
    description: 'Scalable vector format, perfect for web',
    icon: 'Timeline',
  },
  {
    value: 'html',
    label: 'HTML',
    description: 'Interactive web page format',
    icon: 'Code',
  },
  {
    value: 'docx',
    label: 'Word Document',
    description: 'Microsoft Word compatible format',
    icon: 'Description',
  },
];

export const pageSizeOptions: Array<{
  value: PageSize;
  label: string;
  dimensions: string;
  width: number;
  height: number;
}> = [
  { value: 'A4', label: 'A4', dimensions: '210 × 297 mm', width: 210, height: 297 },
  { value: 'A3', label: 'A3', dimensions: '297 × 420 mm', width: 297, height: 420 },
  { value: 'Letter', label: 'Letter', dimensions: '8.5 × 11 in', width: 216, height: 279 },
  { value: 'Legal', label: 'Legal', dimensions: '8.5 × 14 in', width: 216, height: 356 },
  { value: 'Tabloid', label: 'Tabloid', dimensions: '11 × 17 in', width: 279, height: 432 },
  { value: 'Custom', label: 'Custom', dimensions: 'Custom size', width: 0, height: 0 },
];

export const qualityOptions: Array<{
  value: ExportQuality;
  label: string;
  description: string;
  dpi: number;
}> = [
  { value: 'low', label: 'Low', description: 'Faster export, smaller file', dpi: 72 },
  { value: 'medium', label: 'Medium', description: 'Balanced quality and size', dpi: 150 },
  { value: 'high', label: 'High', description: 'Best for printing', dpi: 300 },
  { value: 'ultra', label: 'Ultra', description: 'Maximum quality', dpi: 600 },
];
