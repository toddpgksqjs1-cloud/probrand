import { StoreInfo, DiagnosticReport, Review, Keyword, SEOScore, Booking, Order, Customer, MarketingCampaign, Coupon, CompetitorAnalysis, ContentSuggestion } from "@/lib/types";

// Helper: relative date string (YYYY-MM-DD)
function relativeDate(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split("T")[0];
}

// Helper: relative ISO datetime
function relativeDateTime(daysOffset: number, time: string): string {
  return `${relativeDate(daysOffset)}T${time}`;
}

export const sampleStore: StoreInfo = {
  id: "store-1",
  name: "홍대 트러플 파스타",
  category: "이탈리안 레스토랑",
  address: "서울 마포구 와우산로 21",
  phone: "02-1234-5678",
  businessHours: "매일 11:00 - 22:00 (브레이크타임 15:00 - 17:00)",
  description: "홍대에서 만나는 정통 이탈리안",
  rating: 4.2,
  reviewCount: 328,
  blogReviewCount: 45,
  visitorReviewCount: 283,
  menuItems: [
    { id: "m1", name: "트러플 크림 파스타", price: 18000, description: "직접 만든 생면에 트러플 크림소스", imageUrl: "/menu/truffle.jpg", isPopular: true, isRecommended: true },
    { id: "m2", name: "감바스 알 아히요", price: 16000, description: "새우와 마늘의 환상 조합", imageUrl: "/menu/gambas.jpg", isPopular: true },
    { id: "m3", name: "마르게리타 피자", price: 15000, description: "", imageUrl: "/menu/margherita.jpg" },
    { id: "m4", name: "카르보나라", price: 14000, description: "정통 로마식 카르보나라" },
    { id: "m5", name: "봉골레 파스타", price: 15000, description: "" },
    { id: "m6", name: "티라미수", price: 8000, description: "매일 직접 만드는 수제 티라미수", imageUrl: "/menu/tiramisu.jpg" },
    { id: "m7", name: "아라비아따", price: 13000, description: "" },
    { id: "m8", name: "뇨끼", price: 14000, description: "" },
    { id: "m9", name: "리조또", price: 16000, description: "버섯 리조또" },
    { id: "m10", name: "브루스게타", price: 9000, description: "" },
    { id: "m11", name: "시저 샐러드", price: 10000, description: "" },
    { id: "m12", name: "하우스 와인 (글라스)", price: 8000, description: "" },
  ],
  photos: [
    { id: "p1", url: "/photos/food1.jpg", category: "food" },
    { id: "p2", url: "/photos/food2.jpg", category: "food" },
    { id: "p3", url: "/photos/food3.jpg", category: "food" },
    { id: "p4", url: "/photos/food4.jpg", category: "food" },
    { id: "p5", url: "/photos/food5.jpg", category: "food" },
    { id: "p6", url: "/photos/interior1.jpg", category: "interior" },
    { id: "p7", url: "/photos/interior2.jpg", category: "interior" },
    { id: "p8", url: "/photos/menu1.jpg", category: "menu" },
  ],
  facilities: ["와이파이", "단체석"],
  naverPlaceUrl: "https://naver.me/sample",
};

export const sampleDiagnosticReport: DiagnosticReport = {
  storeInfo: sampleStore,
  overallScore: 68,
  sections: [
    {
      id: "basic-info",
      title: "기본 정보 완성도",
      icon: "ClipboardList",
      score: 85,
      maxScore: 100,
      status: "good",
      items: [
        { label: "가게명, 주소, 전화번호", value: "정상 등록", status: "good" },
        { label: "영업시간", value: "등록됨", status: "good" },
        { label: "가게 소개", value: "18자 (권장 150자 이상)", status: "warning", suggestion: "키워드를 포함한 상세한 가게 소개글을 작성하세요" },
        { label: "편의시설 정보", value: "2개 등록 (주차 정보 없음)", status: "warning", suggestion: "주차, 예약, 포장 가능 여부 등을 추가하세요" },
      ],
    },
    {
      id: "menu",
      title: "메뉴 경쟁력",
      icon: "UtensilsCrossed",
      score: 62,
      maxScore: 100,
      status: "warning",
      items: [
        { label: "등록 메뉴 수", value: "12개", status: "good" },
        { label: "사진 없는 메뉴", value: "5개 (41%)", status: "warning", suggestion: "모든 메뉴에 사진을 등록하면 클릭률 40% 향상" },
        { label: "설명 없는 메뉴", value: "6개 (50%)", status: "warning", suggestion: "메뉴 설명을 추가하면 주문 전환율이 높아집니다" },
        { label: "가격 경쟁력", value: "동일 업종 평균 대비 적정", status: "good" },
      ],
    },
    {
      id: "reviews",
      title: "리뷰 현황",
      icon: "Star",
      score: 55,
      maxScore: 100,
      status: "warning",
      items: [
        { label: "평점", value: "4.2 / 5.0", status: "good" },
        { label: "총 리뷰", value: "328개 (방문자 283 + 블로그 45)", status: "good" },
        { label: "최근 30일 리뷰", value: "8개 (경쟁 매장 평균 18개)", status: "critical", suggestion: "리뷰 이벤트나 방문 후 리뷰 요청으로 리뷰 수를 늘려보세요" },
        { label: "사장님 답글 비율", value: "12% (권장 80% 이상)", status: "critical", suggestion: "리뷰 답글을 적극적으로 달면 재방문율이 25% 상승합니다" },
      ],
    },
    {
      id: "photos",
      title: "사진 / 비주얼",
      icon: "Camera",
      score: 70,
      maxScore: 100,
      status: "warning",
      items: [
        { label: "총 사진 수", value: "8장", status: "good" },
        { label: "음식 사진", value: "5장 (충분)", status: "good" },
        { label: "매장 내부 사진", value: "2장 (권장 5장 이상)", status: "warning", suggestion: "분위기를 보여주는 내부 사진을 추가하세요" },
        { label: "매장 외부 사진", value: "없음", status: "critical", suggestion: "찾아오기 쉽도록 외부 사진을 등록하세요" },
      ],
    },
    {
      id: "seo",
      title: "온라인 노출 (SEO)",
      icon: "Search",
      score: 0,
      maxScore: 100,
      status: "warning",
      isLocked: true,
      items: [
        { label: "키워드 순위 분석", value: "회원가입 후 확인", status: "warning" },
        { label: "경쟁 매장 비교", value: "회원가입 후 확인", status: "warning" },
        { label: "니치 키워드 기회", value: "회원가입 후 확인", status: "warning" },
      ],
    },
  ],
  topRecommendations: [
    "가게 소개글을 핵심 키워드 포함 150자 이상으로 다시 작성하세요",
    "메뉴 사진을 전부 등록하면 클릭률 40% 향상이 기대됩니다",
    "리뷰 답글을 꾸준히 달면 재방문율이 크게 상승합니다",
  ],
  detailedActions: [
    { id: "a1", priority: "high", category: "기본 정보", title: "가게 소개글 재작성", description: "핵심 키워드(홍대 파스타, 트러플 파스타 등)를 포함하여 150자 이상으로 작성", estimatedImpact: "검색 노출 +20%", isCompleted: false },
    { id: "a2", priority: "high", category: "메뉴", title: "메뉴 사진 전체 등록", description: "사진 없는 5개 메뉴에 고품질 사진 추가", estimatedImpact: "클릭률 +40%", isCompleted: false },
    { id: "a3", priority: "high", category: "리뷰", title: "미답글 리뷰 응답", description: "답글이 없는 리뷰에 정성스러운 답글 달기", estimatedImpact: "재방문율 +25%", isCompleted: false },
    { id: "a4", priority: "medium", category: "메뉴", title: "메뉴 설명 추가", description: "설명이 없는 6개 메뉴에 매력적인 설명문 추가", estimatedImpact: "주문 전환율 +15%", isCompleted: false },
    { id: "a5", priority: "medium", category: "사진", title: "매장 외부 사진 등록", description: "가게 외부 전경 사진 최소 2장 등록", estimatedImpact: "방문 편의성 향상", isCompleted: false },
    { id: "a6", priority: "medium", category: "사진", title: "매장 내부 사진 추가", description: "분위기를 보여주는 내부 사진 3장 이상 추가", estimatedImpact: "예약 전환율 +10%", isCompleted: false },
    { id: "a7", priority: "low", category: "기본 정보", title: "편의시설 정보 완성", description: "주차, 예약 가능 여부, 포장 가능 여부 등록", estimatedImpact: "정보 완성도 향상", isCompleted: false },
  ],
  generatedAt: new Date().toISOString(),
};

export const sampleReviews: Review[] = [
  { id: "r1", platform: "naver", author: "맛집탐험가", rating: 5, content: "트러플 크림 파스타가 진짜 맛있어요! 생면이라 식감도 좋고 트러플 향이 진하게 나서 너무 좋았습니다.", date: relativeDate(0), sentiment: "positive", keywords: ["트러플", "생면", "맛있어요"] },
  { id: "r2", platform: "naver", author: "홍대러버", rating: 4, content: "분위기 좋고 음식도 괜찮아요. 다만 브레이크타임이 있어서 시간 맞춰가야 합니다.", date: relativeDate(-1), sentiment: "positive", keywords: ["분위기", "브레이크타임"] },
  { id: "r3", platform: "naver", author: "파스타매니아", rating: 3, content: "맛은 보통이에요. 가격 대비 양이 좀 적은 편. 카르보나라는 좀 짰어요.", date: relativeDate(-4), sentiment: "neutral", keywords: ["양", "가격", "짜다"] },
  { id: "r4", platform: "naver", author: "데이트맛집", rating: 5, content: "데이트 장소로 완벽해요! 인테리어도 예쁘고 음식도 맛있고. 티라미수 강추!", date: relativeDate(-9), sentiment: "positive", keywords: ["데이트", "인테리어", "티라미수"] },
  { id: "r5", platform: "google", author: "John K.", rating: 4, content: "Good Italian restaurant in Hongdae area. Fresh pasta is great.", date: relativeDate(-11), sentiment: "positive", keywords: ["Italian", "fresh pasta"] },
  { id: "r6", platform: "naver", author: "직장인점심", rating: 2, content: "점심시간에 갔는데 너무 오래 기다렸어요. 30분 넘게 기다린 것 같아요. 맛은 괜찮은데 서비스가...", date: relativeDate(-14), sentiment: "negative", keywords: ["대기시간", "서비스"], aiReplyDraft: "안녕하세요, 방문해주셔서 감사합니다. 오래 기다리시게 해서 정말 죄송합니다. 점심 피크시간 대기 개선을 위해 사전 예약 시스템을 준비하고 있습니다. 다음 방문 시에는 더 나은 경험을 드리겠습니다." },
  { id: "r7", platform: "baemin", author: "배달고객1", rating: 4, content: "배달 시켜먹었는데 맛있네요. 포장도 깔끔하고.", date: relativeDate(-19), sentiment: "positive", keywords: ["배달", "포장"] },
  { id: "r8", platform: "naver", author: "와인러버", rating: 5, content: "하우스 와인이 가성비 좋아요. 파스타랑 같이 먹으면 최고!", date: relativeDate(-21), sentiment: "positive", keywords: ["와인", "가성비"] },
];

export const sampleKeywords: Keyword[] = [
  { id: "k1", keyword: "홍대 파스타", type: "main", searchVolume: 12000, competitionLevel: "high", currentRank: 12, previousRank: 15, rankChange: 3, opportunity: 45 },
  { id: "k2", keyword: "홍대 맛집", type: "main", searchVolume: 45000, competitionLevel: "high", currentRank: 42, previousRank: 48, rankChange: 6, opportunity: 20 },
  { id: "k3", keyword: "홍대 데이트 파스타", type: "detail", searchVolume: 3200, competitionLevel: "medium", currentRank: 5, previousRank: 8, rankChange: 3, opportunity: 75 },
  { id: "k4", keyword: "마포구 이탈리안", type: "detail", searchVolume: 2800, competitionLevel: "medium", currentRank: 7, previousRank: 7, rankChange: 0, opportunity: 70 },
  { id: "k5", keyword: "홍대 트러플 파스타", type: "niche", searchVolume: 800, competitionLevel: "low", currentRank: 2, previousRank: 3, rankChange: 1, opportunity: 95 },
  { id: "k6", keyword: "마포구 생면 파스타", type: "niche", searchVolume: 450, competitionLevel: "low", currentRank: 1, previousRank: 2, rankChange: 1, opportunity: 98 },
  { id: "k7", keyword: "홍대 혼밥 파스타", type: "niche", searchVolume: 600, competitionLevel: "low", currentRank: 8, previousRank: 12, rankChange: 4, opportunity: 88 },
  { id: "k8", keyword: "홍대 크리스마스 레스토랑", type: "season", searchVolume: 5500, competitionLevel: "medium", currentRank: 15, previousRank: 20, rankChange: 5, opportunity: 60 },
  { id: "k9", keyword: "홍대 점심 맛집", type: "detail", searchVolume: 8000, competitionLevel: "high", currentRank: 25, previousRank: 30, rankChange: 5, opportunity: 35 },
  { id: "k10", keyword: "트러플 크림 파스타", type: "menu", searchVolume: 1500, competitionLevel: "medium", currentRank: 4, previousRank: 6, rankChange: 2, opportunity: 80 },
];

export const sampleSEOScore: SEOScore = {
  overall: 72,
  categories: {
    placeOptimization: 78,
    contentSEO: 65,
    reviewScore: 70,
    photoScore: 72,
    competitivePosition: 68,
  },
  history: [
    { date: relativeDate(-63), score: 55 },
    { date: relativeDate(-56), score: 58 },
    { date: relativeDate(-49), score: 60 },
    { date: relativeDate(-42), score: 62 },
    { date: relativeDate(-35), score: 64 },
    { date: relativeDate(-28), score: 66 },
    { date: relativeDate(-21), score: 67 },
    { date: relativeDate(-14), score: 69 },
    { date: relativeDate(-7), score: 70 },
    { date: relativeDate(0), score: 72 },
  ],
};

export const sampleCompetitors: CompetitorAnalysis[] = [
  { competitorName: "홍대 파스타공방", competitorUrl: "#", distance: "200m", rating: 4.5, reviewCount: 520, keywords: ["홍대 파스타", "수제 파스타"], strengths: ["리뷰 수 많음", "사진 품질 높음"], weaknesses: ["메뉴 다양성 부족", "가격대 높음"] },
  { competitorName: "마포 이탈리아노", competitorUrl: "#", distance: "350m", rating: 4.3, reviewCount: 412, keywords: ["마포 이탈리안", "홍대 피자"], strengths: ["넓은 매장", "단체석 보유"], weaknesses: ["최근 리뷰 감소", "블로그 리뷰 적음"] },
  { competitorName: "파스타하우스 홍대", competitorUrl: "#", distance: "500m", rating: 4.0, reviewCount: 230, keywords: ["홍대 파스타 맛집", "가성비 파스타"], strengths: ["가성비 좋음", "리뷰 답글 활발"], weaknesses: ["평점 낮음", "사진 품질 개선 필요"] },
];

export const sampleContentSuggestions: ContentSuggestion[] = [
  { id: "cs1", keyword: "홍대 혼밥 파스타", title: "혼밥러를 위한 홍대 파스타 맛집 추천 - 트러플 크림 파스타의 모든 것", outline: ["혼밥하기 좋은 이유", "추천 메뉴 3가지", "방문 팁"], estimatedTraffic: 450, difficulty: "easy", status: "draft" },
  { id: "cs2", keyword: "홍대 데이트 파스타", title: "홍대 데이트 코스 완벽 가이드 - 분위기 좋은 이탈리안 레스토랑", outline: ["데이트 코스 추천", "분위기 소개", "커플 메뉴 추천"], estimatedTraffic: 800, difficulty: "medium", status: "draft" },
  { id: "cs3", keyword: "트러플 크림 파스타 맛집", title: "서울 트러플 파스타 맛집 BEST - 생면으로 만드는 정통 레시피", outline: ["트러플 파스타란?", "생면의 차이", "방문 후기"], estimatedTraffic: 600, difficulty: "easy", status: "draft" },
];

export const sampleBookings: Booking[] = [
  { id: "b1", customerName: "김민수", customerPhone: "010-1234-5678", date: relativeDate(0), time: "18:00", partySize: 2, status: "confirmed", createdAt: relativeDateTime(-2, "10:00:00Z") },
  { id: "b2", customerName: "이지은", customerPhone: "010-2345-6789", date: relativeDate(0), time: "19:00", partySize: 4, status: "confirmed", createdAt: relativeDateTime(-2, "14:00:00Z") },
  { id: "b3", customerName: "박서준", customerPhone: "010-3456-7890", date: relativeDate(0), time: "12:00", partySize: 1, status: "completed", createdAt: relativeDateTime(-1, "09:00:00Z") },
  { id: "b4", customerName: "정유미", customerPhone: "010-4567-8901", date: relativeDate(1), time: "18:30", partySize: 6, status: "pending", deposit: 30000, depositPaid: false, createdAt: relativeDateTime(-1, "16:00:00Z") },
  { id: "b5", customerName: "최현우", customerPhone: "010-5678-9012", date: relativeDate(1), time: "19:30", partySize: 2, status: "confirmed", createdAt: relativeDateTime(0, "08:00:00Z") },
];

export const sampleOrders: Order[] = [
  { id: "o1", orderNumber: `ORD-${relativeDate(0).replace(/-/g, "")}-001`, customerName: "한지민", customerPhone: "010-6789-0123", type: "delivery", customerAddress: "서울 마포구 연남동 123-4", items: [{ menuItemId: "m1", name: "트러플 크림 파스타", price: 18000, quantity: 2 }, { menuItemId: "m2", name: "감바스 알 아히요", price: 16000, quantity: 1 }], totalAmount: 55000, status: "preparing", paymentMethod: "카카오페이", paymentStatus: "paid", createdAt: relativeDateTime(0, "11:30:00Z"), deliveryFee: 3000 },
  { id: "o2", orderNumber: `ORD-${relativeDate(0).replace(/-/g, "")}-002`, customerName: "송중기", customerPhone: "010-7890-1234", type: "pickup", items: [{ menuItemId: "m4", name: "카르보나라", price: 14000, quantity: 1 }, { menuItemId: "m6", name: "티라미수", price: 8000, quantity: 1 }], totalAmount: 22000, status: "completed", paymentMethod: "토스페이", paymentStatus: "paid", createdAt: relativeDateTime(0, "12:00:00Z") },
  { id: "o3", orderNumber: `ORD-${relativeDate(0).replace(/-/g, "")}-003`, customerName: "김태리", customerPhone: "010-8901-2345", type: "delivery", customerAddress: "서울 마포구 상수동 456-7", items: [{ menuItemId: "m3", name: "마르게리타 피자", price: 15000, quantity: 1 }, { menuItemId: "m11", name: "시저 샐러드", price: 10000, quantity: 1 }], totalAmount: 28000, status: "pending", paymentMethod: "카드결제", paymentStatus: "paid", createdAt: relativeDateTime(0, "12:15:00Z"), deliveryFee: 3000 },
];

export const sampleCustomers: Customer[] = [
  { id: "c1", name: "김민수", phone: "010-1234-5678", email: "minsu@email.com", tier: "vip", totalVisits: 15, totalSpent: 350000, lastVisitDate: relativeDate(0), firstVisitDate: relativeDate(-170), favoriteMenus: ["트러플 크림 파스타", "티라미수"], tags: ["단골", "커플"], marketingConsent: true },
  { id: "c2", name: "이지은", phone: "010-2345-6789", tier: "vip", totalVisits: 12, totalSpent: 280000, lastVisitDate: relativeDate(0), firstVisitDate: relativeDate(-140), favoriteMenus: ["감바스 알 아히요"], tags: ["단골", "단체"], marketingConsent: true },
  { id: "c3", name: "박서준", phone: "010-3456-7890", tier: "regular", totalVisits: 5, totalSpent: 95000, lastVisitDate: relativeDate(0), firstVisitDate: relativeDate(-60), favoriteMenus: ["카르보나라"], tags: ["점심"], marketingConsent: true },
  { id: "c4", name: "정유미", phone: "010-4567-8901", tier: "regular", totalVisits: 3, totalSpent: 72000, lastVisitDate: relativeDate(-20), firstVisitDate: relativeDate(-45), favoriteMenus: ["마르게리타 피자"], tags: ["저녁"], marketingConsent: false },
  { id: "c5", name: "최현우", phone: "010-5678-9012", tier: "inactive", totalVisits: 2, totalSpent: 36000, lastVisitDate: relativeDate(-87), firstVisitDate: relativeDate(-112), favoriteMenus: ["봉골레 파스타"], tags: [], marketingConsent: true },
];

export const sampleCampaigns: MarketingCampaign[] = [
  { id: "mc1", name: "3월 신메뉴 출시 알림", type: "kakao", status: "sent", targetAudience: "all", targetCount: 45, sentCount: 42, openRate: 68, clickRate: 25, content: "봄맞이 신메뉴 '봄나물 파스타'가 출시되었습니다! 첫 주문 시 10% 할인!", sentAt: relativeDateTime(-11, "10:00:00Z") },
  { id: "mc2", name: "VIP 고객 감사 쿠폰", type: "kakao", status: "scheduled", targetAudience: "vip", targetCount: 12, sentCount: 0, content: "소중한 VIP 고객님께 20% 할인 쿠폰을 드립니다!", scheduledAt: relativeDateTime(5, "10:00:00Z"), couponId: "cp1" },
  { id: "mc3", name: "이탈 고객 재방문 유도", type: "sms", status: "draft", targetAudience: "inactive", targetCount: 8, sentCount: 0, content: "오랜만이에요! 다시 방문하시면 음료 서비스를 드려요." },
];

export const sampleCoupons: Coupon[] = [
  { id: "cp1", name: "VIP 20% 할인", type: "percentage", value: 20, minimumOrder: 20000, validFrom: relativeDate(5), validUntil: relativeDate(26), totalIssued: 12, totalUsed: 0, isActive: true },
  { id: "cp2", name: "첫 방문 5000원 할인", type: "fixed", value: 5000, minimumOrder: 15000, validFrom: relativeDate(-11), validUntil: relativeDate(20), totalIssued: 30, totalUsed: 8, isActive: true },
  { id: "cp3", name: "리뷰 작성 감사 쿠폰", type: "fixed", value: 3000, validFrom: relativeDate(-39), validUntil: relativeDate(50), totalIssued: 50, totalUsed: 15, isActive: true },
];
