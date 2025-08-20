export interface UserCompany {
  id: string;
  name: string;
  logo?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  memberCount: number;
  plan: 'free' | 'pro' | 'enterprise';
  lastAccessed?: Date;
  isActive: boolean;
}

export interface CompanySwitcherProps {
  companies: UserCompany[];
  currentCompanyId: string;
  onCompanySwitch: (companyId: string) => Promise<void>;
  onCreateCompany: () => void;
  loading?: boolean;
  maxRecentCompanies?: number;
}

export interface CompanySwitcherState {
  open: boolean;
  searchQuery: string;
  switching: boolean;
  switchingToId: string | null;
}

export type SortOrder = 'recent' | 'alphabetical' | 'role';
