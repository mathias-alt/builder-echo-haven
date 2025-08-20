export interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  logo?: string;
  logoFile?: File;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  memberCount: number;
  canvasCount: number;
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'canceled' | 'past_due' | 'trialing';
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
  };
}

export interface CompanyFormData {
  name: string;
  description: string;
  website: string;
  industry: string;
  size: Company['size'];
  logo?: File;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

export interface CompanyValidation {
  name?: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  logo?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

export interface BillingInfo {
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  nextInvoiceDate?: Date;
  lastPaymentDate?: Date;
  paymentMethod?: {
    type: 'card' | 'bank';
    last4: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
  usage: {
    members: number;
    canvases: number;
    storage: number; // in MB
  };
  limits: {
    members: number;
    canvases: number;
    storage: number; // in MB
  };
}

export const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Consulting',
  'Real Estate',
  'Non-profit',
  'Government',
  'Entertainment',
  'Food & Beverage',
  'Transportation',
  'Energy',
  'Other',
] as const;

export const companySizes = [
  { value: 'startup', label: 'Startup (1-10 employees)' },
  { value: 'small', label: 'Small (11-50 employees)' },
  { value: 'medium', label: 'Medium (51-200 employees)' },
  { value: 'large', label: 'Large (201-1000 employees)' },
  { value: 'enterprise', label: 'Enterprise (1000+ employees)' },
] as const;

export const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Australia',
  'Japan',
  'Norway',
  'Sweden',
  'Denmark',
  'Other',
] as const;
