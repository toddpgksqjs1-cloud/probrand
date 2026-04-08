export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tier: "vip" | "regular" | "inactive";
  totalVisits: number;
  totalSpent: number;
  lastVisitDate: string;
  firstVisitDate: string;
  favoriteMenus: string[];
  notes?: string;
  tags: string[];
  marketingConsent: boolean;
}

export interface CustomerStats {
  totalCustomers: number;
  vipCount: number;
  regularCount: number;
  inactiveCount: number;
  newThisMonth: number;
  returningRate: number;
  averageSpend: number;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  type: "kakao" | "sms" | "push";
  status: "draft" | "scheduled" | "sent" | "completed";
  targetAudience: "all" | "vip" | "regular" | "inactive" | "custom";
  targetCount: number;
  sentCount: number;
  openRate?: number;
  clickRate?: number;
  content: string;
  scheduledAt?: string;
  sentAt?: string;
  couponId?: string;
}

export interface Coupon {
  id: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  minimumOrder?: number;
  validFrom: string;
  validUntil: string;
  totalIssued: number;
  totalUsed: number;
  isActive: boolean;
}
