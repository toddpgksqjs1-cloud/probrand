export interface PlatformStore {
  id: string;
  name: string;
  category: string;
  address: string;
  ownerName: string;
  ownerEmail: string;
  phone: string;
  plan: "free" | "basic" | "pro" | "enterprise";
  status: "active" | "trial" | "churned" | "suspended";
  diagnosticScore: number;
  reviewCount: number;
  rating: number;
  monthlyOrders: number;
  monthlyBookings: number;
  monthlyRevenue: number;
  signupDate: string;
  lastActiveDate: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  storeName: string;
  storeId: string;
  role: "owner" | "manager" | "staff";
  plan: "free" | "basic" | "pro" | "enterprise";
  status: "active" | "inactive" | "suspended";
  signupDate: string;
  lastLoginDate: string;
}

export interface PlatformMetrics {
  totalStores: number;
  activeStores: number;
  totalUsers: number;
  mrr: number;
  totalOrdersThisMonth: number;
  totalBookingsThisMonth: number;
  avgDiagnosticScore: number;
  newSignupsThisWeek: number;
  churnRate: number;
  conversionRate: number;
}
