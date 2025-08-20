export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  avatar?: string;
  department?: string;
  joinedAt: Date;
  lastActive: Date;
  status: 'active' | 'inactive' | 'pending';
  permissions: string[];
}

export interface PendingInvitation {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  status: 'pending' | 'expired' | 'cancelled';
}

export interface TeamActivity {
  id: string;
  type: 'member_added' | 'member_removed' | 'role_changed' | 'invitation_sent' | 'invitation_accepted';
  actorName: string;
  targetName?: string;
  details: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export type ViewMode = 'cards' | 'table';

export type SortField = 'name' | 'role' | 'joinedAt' | 'lastActive';
export type SortOrder = 'asc' | 'desc';

export interface TeamFilters {
  search: string;
  role: 'all' | 'admin' | 'member' | 'viewer';
  status: 'all' | 'active' | 'inactive' | 'pending';
  department: 'all' | string;
}

export interface TeamSort {
  field: SortField;
  order: SortOrder;
}
