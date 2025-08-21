export type SharePermission = 'view' | 'comment' | 'edit';

export type SharePrivacy = 'public' | 'private';

export type SocialPlatform = 'twitter' | 'facebook' | 'linkedin' | 'email' | 'copy';

export interface ShareSettings {
  privacy: SharePrivacy;
  permission: SharePermission;
  allowComments: boolean;
  allowDownload: boolean;
  requirePassword: boolean;
  password?: string;
  expiresAt?: Date;
  embedEnabled: boolean;
  notifyOnAccess: boolean;
}

export interface ShareLink {
  id: string;
  url: string;
  shortUrl: string;
  canvasId: string;
  settings: ShareSettings;
  createdAt: Date;
  createdBy: string;
  accessCount: number;
  lastAccessedAt?: Date;
}

export interface ShareAccess {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  permission: SharePermission;
  grantedAt: Date;
  grantedBy: string;
  lastAccessedAt?: Date;
  accessCount: number;
}

export interface ShareInvitation {
  id: string;
  email: string;
  permission: SharePermission;
  invitedAt: Date;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: Date;
}

export interface EmbedSettings {
  width: string;
  height: string;
  showToolbar: boolean;
  showComments: boolean;
  allowInteraction: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export interface QRCodeSettings {
  size: number;
  format: 'png' | 'svg';
  includeUrl: boolean;
  customMessage?: string;
}

export interface ShareAnalytics {
  totalViews: number;
  uniqueViewers: number;
  countries: { [country: string]: number };
  devices: { [device: string]: number };
  referrers: { [referrer: string]: number };
  dailyViews: { [date: string]: number };
}

export interface ShareModalState {
  activeTab: 'link' | 'embed' | 'social' | 'access' | 'settings';
  linkGenerated: boolean;
  qrCodeVisible: boolean;
  passwordDialogOpen: boolean;
  inviteDialogOpen: boolean;
}
