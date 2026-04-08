export interface Keyword {
  id: string;
  keyword: string;
  type: "main" | "detail" | "niche" | "season" | "menu";
  searchVolume: number;
  competitionLevel: "high" | "medium" | "low";
  currentRank?: number;
  previousRank?: number;
  rankChange?: number;
  opportunity: number; // 0-100
  cpc?: number;
  relatedKeywords?: string[];
}

export interface KeywordTracking {
  keywordId: string;
  keyword: string;
  history: RankHistory[];
  targetRank: number;
  currentRank: number;
  bestRank: number;
}

export interface RankHistory {
  date: string;
  rank: number;
  searchVolume?: number;
}

export interface SEOScore {
  overall: number;
  categories: {
    placeOptimization: number;
    contentSEO: number;
    reviewScore: number;
    photoScore: number;
    competitivePosition: number;
  };
  history: { date: string; score: number }[];
}

export interface CompetitorAnalysis {
  competitorName: string;
  competitorUrl: string;
  distance: string;
  rating: number;
  reviewCount: number;
  keywords: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface ContentSuggestion {
  id: string;
  keyword: string;
  title: string;
  outline: string[];
  estimatedTraffic: number;
  difficulty: "easy" | "medium" | "hard";
  status: "draft" | "generated" | "published";
  content?: string;
  generatedAt?: string;
}

export interface SEOReport {
  type: "weekly" | "monthly";
  period: string;
  seoScore: SEOScore;
  keywordPerformance: KeywordTracking[];
  topChanges: { keyword: string; change: number }[];
  contentPerformance: { title: string; views: number; clicks: number }[];
  recommendations: string[];
  generatedAt: string;
}
