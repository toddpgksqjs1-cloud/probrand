export interface StoreInfo {
  id?: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  businessHours: string;
  description: string;
  rating: number;
  reviewCount: number;
  blogReviewCount: number;
  visitorReviewCount: number;
  menuItems: MenuItem[];
  photos: StorePhoto[];
  facilities: string[];
  naverPlaceUrl: string;
  googleMapUrl?: string;
  kakaoMapUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  category?: string;
  isPopular?: boolean;
  isRecommended?: boolean;
}

export interface StorePhoto {
  id: string;
  url: string;
  category: "food" | "interior" | "exterior" | "menu" | "other";
  description?: string;
}

export interface Review {
  id: string;
  platform: "naver" | "google" | "baemin" | "yogiyo" | "kakao";
  author: string;
  rating: number;
  content: string;
  date: string;
  sentiment?: "positive" | "neutral" | "negative";
  keywords?: string[];
  reply?: string;
  replyDate?: string;
  aiReplyDraft?: string;
}

export interface DiagnosticReport {
  storeInfo: StoreInfo;
  overallScore: number;
  sections: ReportSection[];
  topRecommendations: string[];
  detailedActions: ActionItem[];
  generatedAt: string;
}

export interface ReportSection {
  id: string;
  title: string;
  icon: string;
  score: number;
  maxScore: number;
  status: "good" | "warning" | "critical";
  items: ReportItem[];
  isLocked?: boolean;
}

export interface ReportItem {
  label: string;
  value: string;
  status: "good" | "warning" | "critical";
  suggestion?: string;
}

export interface ActionItem {
  id: string;
  priority: "high" | "medium" | "low";
  category: string;
  title: string;
  description: string;
  estimatedImpact: string;
  isCompleted: boolean;
}
