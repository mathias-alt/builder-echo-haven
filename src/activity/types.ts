export type ActivityType = 
  | 'note_created'
  | 'note_updated' 
  | 'note_deleted'
  | 'note_moved'
  | 'section_completed'
  | 'canvas_created'
  | 'canvas_shared'
  | 'team_member_added'
  | 'team_member_removed'
  | 'export_created'
  | 'comment_added'
  | 'comment_deleted';

export interface ActivityUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
}

export interface ActivityTarget {
  type: 'note' | 'section' | 'canvas' | 'user' | 'export' | 'comment';
  id: string;
  name: string;
  sectionId?: string;
  canvasId?: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  user: ActivityUser;
  target: ActivityTarget;
  timestamp: Date;
  description: string;
  metadata?: {
    oldValue?: string;
    newValue?: string;
    fromSection?: string;
    toSection?: string;
    exportFormat?: string;
    noteContent?: string;
    commentContent?: string;
    [key: string]: any;
  };
}

export interface ActivityGroup {
  id: string;
  type: ActivityType;
  user: ActivityUser;
  activities: Activity[];
  timestamp: Date;
  count: number;
  description: string;
  target?: ActivityTarget;
}

export interface ActivityFilters {
  users: string[];
  activityTypes: ActivityType[];
  dateRange: {
    start: Date;
    end: Date;
  };
  sections: string[];
  canvases: string[];
  searchQuery?: string;
}

export interface ActivityFeedState {
  activities: Activity[];
  groupedActivities: ActivityGroup[];
  filters: ActivityFilters;
  loading: boolean;
  hasMore: boolean;
  page: number;
  groupingEnabled: boolean;
  realTimeEnabled: boolean;
  showFilters: boolean;
}

export interface ActivityStats {
  totalActivities: number;
  todayActivities: number;
  activeUsers: number;
  mostActiveUser: ActivityUser;
  mostActiveSection: string;
  activityTypeCounts: Record<ActivityType, number>;
}

export interface ActivityFeedProps {
  canvasId?: string;
  sectionId?: string;
  userId?: string;
  maxHeight?: number;
  showHeader?: boolean;
  showFilters?: boolean;
  enableGrouping?: boolean;
  enableRealTime?: boolean;
  onActivityClick?: (activity: Activity) => void;
  onUserClick?: (user: ActivityUser) => void;
}

export interface ActivityNotification {
  id: string;
  activity: Activity;
  read: boolean;
  createdAt: Date;
}
