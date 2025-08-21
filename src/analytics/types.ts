export interface AnalyticsTimeRange {
  start: Date;
  end: Date;
  preset?: 'last7days' | 'last30days' | 'last90days' | 'lastYear' | 'allTime' | 'custom';
}

export interface CompletionData {
  canvasId: string;
  canvasName: string;
  totalSections: number;
  completedSections: number;
  completionPercentage: number;
  lastUpdated: Date;
  estimatedTimeToComplete?: number; // in hours
}

export interface SectionCompletionData {
  sectionId: string;
  sectionName: string;
  category: 'environment' | 'society' | 'process';
  isCompleted: boolean;
  completionPercentage: number;
  notesCount: number;
  lastUpdated: Date;
  contributors: string[]; // user IDs
  averageTimeSpent: number; // in minutes
}

export interface TeamMemberActivity {
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  contributionsCount: number;
  sectionsWorkedOn: string[];
  timeSpent: number; // in minutes
  lastActive: Date;
  joinedDate: Date;
}

export interface ActivityTimelineItem {
  id: string;
  type: 'note_added' | 'note_updated' | 'note_deleted' | 'section_completed' | 'canvas_shared' | 'export_created';
  userId: string;
  userName: string;
  canvasId: string;
  sectionId?: string;
  timestamp: Date;
  description: string;
  metadata?: Record<string, any>;
}

export interface TimeBasedMetric {
  date: Date;
  value: number;
  additionalData?: Record<string, number>;
}

export interface CanvasEvolution {
  date: Date;
  totalNotes: number;
  completedSections: number;
  activeUsers: number;
  timeSpent: number; // in minutes
}

export interface ExportUsageData {
  exportId: string;
  canvasId: string;
  userId: string;
  userName: string;
  format: 'pdf' | 'png' | 'svg' | 'html' | 'docx';
  exportedAt: Date;
  fileSize: number; // in bytes
  downloadCount: number;
  isShared: boolean;
}

export interface TeamEngagementMetrics {
  totalActiveUsers: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  averageSessionDuration: number; // in minutes
  collaborationScore: number; // 0-100
  engagementTrend: 'increasing' | 'stable' | 'decreasing';
}

export interface AnalyticsFilterOptions {
  timeRange: AnalyticsTimeRange;
  canvasIds?: string[];
  userIds?: string[];
  sectionIds?: string[];
  exportFormats?: string[];
  activityTypes?: string[];
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface CompletionProgressData {
  overall: CompletionData;
  sections: SectionCompletionData[];
  trends: TimeBasedMetric[];
}

export interface TeamActivityData {
  members: TeamMemberActivity[];
  timeline: ActivityTimelineItem[];
  collaborationMatrix: { [userId: string]: { [sectionId: string]: number } };
}

export interface ExportAnalyticsData {
  usageStats: ExportUsageData[];
  popularFormats: ChartDataPoint[];
  exportTrends: TimeBasedMetric[];
  userExportActivity: { [userId: string]: number };
}

export interface AnalyticsDashboardData {
  completion: CompletionProgressData;
  teamActivity: TeamActivityData;
  canvasEvolution: CanvasEvolution[];
  exportUsage: ExportAnalyticsData;
  engagement: TeamEngagementMetrics;
  lastUpdated: Date;
}

export interface AnalyticsExportFormat {
  format: 'csv' | 'xlsx' | 'json' | 'pdf';
  filename: string;
  dataType: 'completion' | 'activity' | 'exports' | 'engagement' | 'all';
}

export interface ChartConfiguration {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'progress';
  responsive: boolean;
  colors: string[];
  theme: 'light' | 'dark';
  animation: boolean;
  legend: boolean;
  labels: boolean;
}
