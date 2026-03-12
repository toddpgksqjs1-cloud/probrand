// ===== 소상공인 대시보드 Mock Data =====

export const userStore = {
  name: "강남 디저트카페",
  owner: "이대표",
  category: "카페/디저트",
  address: "서울 강남구 역삼동 123-45",
  phone: "02-1234-5678",
  naverPlaceUrl: "https://naver.me/example",
  plan: "프로" as const,
  score: 72,
  grade: "B" as const,
  previousScore: 67,
  analysisCount: 12,
  lastAnalysis: "2026-03-12",
};

export const scoreHistory = [
  { week: "1주", score: 52 },
  { week: "2주", score: 58 },
  { week: "3주", score: 61 },
  { week: "4주", score: 65 },
  { week: "5주", score: 67 },
  { week: "6주", score: 72 },
];

export const scoreBreakdown = [
  { category: "리뷰 관리", score: 18, max: 25, color: "#f59e0b" },
  { category: "사진", score: 8, max: 20, color: "#ef4444" },
  { category: "기본정보", score: 12, max: 15, color: "#10b981" },
  { category: "키워드 최적화", score: 10, max: 15, color: "#f59e0b" },
  { category: "메뉴/상품", score: 14, max: 15, color: "#10b981" },
  { category: "영업시간/편의", score: 10, max: 10, color: "#10b981" },
];

export const improvementActions = [
  {
    id: 1,
    title: "대표사진 설정하기",
    category: "사진",
    impact: 3,
    difficulty: "쉬움",
    completed: false,
    description: "밝은 조명의 매장 전경 또는 시그니처 메뉴 사진을 대표사진으로 설정하세요.",
  },
  {
    id: 2,
    title: "리뷰 3개 답변하기",
    category: "리뷰 관리",
    impact: 2,
    difficulty: "쉬움",
    completed: false,
    description: "최근 답변하지 않은 리뷰에 정성스러운 답변을 달아보세요.",
  },
  {
    id: 3,
    title: "메뉴 사진 10장 추가",
    category: "사진",
    impact: 5,
    difficulty: "보통",
    completed: false,
    description: "인기 메뉴 3개는 반드시 포함. 자연광 촬영 사진이 클릭률 2.3배 높습니다.",
  },
  {
    id: 4,
    title: "소개글에 키워드 추가",
    category: "키워드 최적화",
    impact: 3,
    difficulty: "쉬움",
    completed: true,
    description: "'강남 디저트', '역삼역 카페' 등 핵심 키워드를 소개글에 자연스럽게 포함하세요.",
  },
  {
    id: 5,
    title: "매장 내부/외부 사진 추가",
    category: "사진",
    impact: 2,
    difficulty: "쉬움",
    completed: true,
    description: "입구, 좌석, 인테리어 포인트 각 1장씩 추가하세요.",
  },
];

export const seoKeywords = [
  { keyword: "강남역 브런치카페", volume: 2400, competition: "중", difficulty: "B", rating: 5 },
  { keyword: "강남 디저트 데이트", volume: 880, competition: "낮음", difficulty: "A", rating: 4 },
  { keyword: "신논현 카페", volume: 1200, competition: "낮음", difficulty: "A", rating: 5 },
  { keyword: "강남 케이크 맛집", volume: 640, competition: "낮음", difficulty: "A", rating: 4 },
  { keyword: "역삼역 디저트", volume: 520, competition: "매우낮음", difficulty: "S", rating: 5 },
  { keyword: "강남 애견동반 카페", volume: 320, competition: "매우낮음", difficulty: "S", rating: 3 },
  { keyword: "강남 작업하기좋은 카페", volume: 480, competition: "낮음", difficulty: "A", rating: 4 },
  { keyword: "강남 루프탑 카페", volume: 390, competition: "중", difficulty: "B", rating: 3 },
];

export const blogTitles = [
  {
    title: '"강남역 브런치 맛집 | 디저트카페 리코타 샐러드가 인생이에요"',
    keywords: ["강남역", "브런치", "맛집"],
  },
  {
    title: '"디저트카페 솔직후기 | 강남 데이트 코스로 딱인 디저트카페"',
    keywords: ["강남", "데이트", "디저트"],
  },
  {
    title: '"신논현 카페 추천 | 조용히 작업하기 좋은 디저트카페"',
    keywords: ["신논현", "카페", "추천"],
  },
];

// ===== 종합 어드민 Mock Data =====

export const adminMetrics = {
  dau: { value: 1247, change: 12 },
  newSignups: { value: 89, change: -5 },
  analyses: { value: 3420, change: 18 },
  mrr: { value: 2100000, change: 22 },
  wau: { value: 4830, change: 8 },
  mau: { value: 12400, change: 15 },
  totalUsers: { value: 18420, change: 12 },
  paidUsers: { value: 842, change: 18 },
  conversionRate: { value: 4.6, change: 0.3 },
  avgScore: { value: 64.2, change: 2.1 },
  dataCollected: { value: 286400, change: 8 },
  churnRate: { value: 3.2, change: -0.5 },
};

export const funnelData = [
  { stage: "방문", value: 8420, rate: 100 },
  { stage: "가입", value: 2840, rate: 33.7 },
  { stage: "첫 분석", value: 2130, rate: 75.0 },
  { stage: "재방문", value: 960, rate: 45.1 },
  { stage: "유료전환", value: 480, rate: 22.5 },
];

export const featureUsage = [
  { name: "플레이스 분석", usage: 82, color: "#2563eb" },
  { name: "SEO 도구", usage: 34, color: "#10b981" },
  { name: "홈페이지 빌더", usage: 21, color: "#f59e0b" },
  { name: "미니 도구", usage: 15, color: "#8b5cf6" },
];

export const categoryDistribution = [
  { name: "음식점", value: 45, color: "#2563eb" },
  { name: "카페", value: 28, color: "#10b981" },
  { name: "뷰티", value: 12, color: "#f59e0b" },
  { name: "기타", value: 15, color: "#8b5cf6" },
];

export const regionDistribution = [
  { name: "서울", value: 42 },
  { name: "경기", value: 22 },
  { name: "부산", value: 8 },
  { name: "대구", value: 6 },
  { name: "인천", value: 5 },
  { name: "광주", value: 4 },
  { name: "기타", value: 13 },
];

export const dauTrend = [
  { date: "2/10", dau: 820, wau: 3200 },
  { date: "2/17", dau: 890, wau: 3450 },
  { date: "2/24", dau: 950, wau: 3800 },
  { date: "3/3", dau: 1050, wau: 4200 },
  { date: "3/10", dau: 1180, wau: 4600 },
  { date: "3/12", dau: 1247, wau: 4830 },
];

export const cohortRetention = [
  { cohort: "2월 1주", w0: 100, w1: 42, w2: 28, w3: 22, w4: 18 },
  { cohort: "2월 2주", w0: 100, w1: 45, w2: 30, w3: 24, w4: 20 },
  { cohort: "2월 3주", w0: 100, w1: 38, w2: 25, w3: 19, w4: 16 },
  { cohort: "3월 1주", w0: 100, w1: 48, w2: 32, w3: 26, w4: null },
  { cohort: "3월 2주", w0: 100, w1: 50, w2: 35, w3: null, w4: null },
];

export const recentActivities = [
  { time: "14:32", user: "김**", action: "플레이스 분석 완료", detail: "78점 (B등급)" },
  { time: "14:30", user: "이**", action: "홈페이지 배포", detail: "카페 템플릿" },
  { time: "14:28", user: "박**", action: "유료 구독 시작", detail: "프로 플랜" },
  { time: "14:25", user: "최**", action: "회원가입 완료", detail: "카카오 로그인" },
  { time: "14:22", user: "정**", action: "SEO 키워드 검색", detail: "12개 결과" },
  { time: "14:20", user: "한**", action: "개선 액션 완료", detail: "사진 3장 추가" },
  { time: "14:18", user: "윤**", action: "리포트 다운로드", detail: "PDF 리포트" },
  { time: "14:15", user: "장**", action: "플레이스 분석 완료", detail: "65점 (B등급)" },
];

export const adminUsers = [
  {
    id: "1",
    name: "이**",
    email: "lee***@gmail.com",
    category: "카페/디저트",
    location: "서울 강남구",
    plan: "프로",
    signupDate: "2026-02-15",
    lastActive: "2026-03-12 14:20",
    analysisCount: 12,
    score: 78,
    status: "active",
  },
  {
    id: "2",
    name: "김**",
    email: "kim***@naver.com",
    category: "한식",
    location: "서울 마포구",
    plan: "무료",
    signupDate: "2026-03-01",
    lastActive: "2026-03-12 14:32",
    analysisCount: 5,
    score: 45,
    status: "active",
  },
  {
    id: "3",
    name: "박**",
    email: "park***@gmail.com",
    category: "치킨",
    location: "경기 성남시",
    plan: "비즈니스",
    signupDate: "2026-01-20",
    lastActive: "2026-03-12 14:28",
    analysisCount: 28,
    score: 85,
    status: "active",
  },
  {
    id: "4",
    name: "최**",
    email: "choi***@kakao.com",
    category: "미용실",
    location: "서울 송파구",
    plan: "무료",
    signupDate: "2026-03-12",
    lastActive: "2026-03-12 14:25",
    analysisCount: 0,
    score: 0,
    status: "new",
  },
  {
    id: "5",
    name: "정**",
    email: "jung***@gmail.com",
    category: "카페/디저트",
    location: "부산 해운대구",
    plan: "프로",
    signupDate: "2026-02-01",
    lastActive: "2026-03-11 09:30",
    analysisCount: 18,
    score: 71,
    status: "active",
  },
  {
    id: "6",
    name: "한**",
    email: "han***@naver.com",
    category: "일식",
    location: "서울 종로구",
    plan: "무료",
    signupDate: "2026-02-20",
    lastActive: "2026-03-08 16:45",
    analysisCount: 3,
    score: 58,
    status: "at_risk",
  },
  {
    id: "7",
    name: "윤**",
    email: "yoon***@gmail.com",
    category: "피트니스",
    location: "서울 서초구",
    plan: "프로",
    signupDate: "2026-01-15",
    lastActive: "2026-03-12 14:18",
    analysisCount: 22,
    score: 82,
    status: "active",
  },
  {
    id: "8",
    name: "장**",
    email: "jang***@kakao.com",
    category: "한식",
    location: "대구 중구",
    plan: "무료",
    signupDate: "2026-03-05",
    lastActive: "2026-03-12 14:15",
    analysisCount: 2,
    score: 65,
    status: "active",
  },
];

export const revenueData = [
  { month: "2025/10", mrr: 0, users: 0 },
  { month: "2025/11", mrr: 0, users: 0 },
  { month: "2025/12", mrr: 120000, users: 4 },
  { month: "2026/01", mrr: 450000, users: 15 },
  { month: "2026/02", mrr: 980000, users: 34 },
  { month: "2026/03", mrr: 2100000, users: 72 },
];

export const subscriptionBreakdown = [
  { plan: "무료", count: 17578, percentage: 95.4 },
  { plan: "프로", count: 624, percentage: 3.4 },
  { plan: "비즈니스", count: 218, percentage: 1.2 },
];

export const dataCollectionStats = {
  stores: { total: 24680, thisWeek: 1240 },
  reviews: { total: 1842000, thisWeek: 86400 },
  menus: { total: 186000, thisWeek: 8200 },
  keywords: { total: 45200, thisWeek: 3800 },
  homepages: { total: 890, thisWeek: 89 },
};

export const dataQuality = [
  { field: "업종 분류", completeness: 98, accuracy: 95 },
  { field: "위치 (동)", completeness: 96, accuracy: 92 },
  { field: "메뉴/가격", completeness: 78, accuracy: 88 },
  { field: "리뷰 데이터", completeness: 94, accuracy: 97 },
  { field: "영업시간", completeness: 72, accuracy: 85 },
  { field: "사진", completeness: 65, accuracy: 90 },
];

export const scoreDistribution = [
  { range: "0-20", count: 420 },
  { range: "21-40", count: 1860 },
  { range: "41-60", count: 4280 },
  { range: "61-80", count: 3640 },
  { range: "81-100", count: 1220 },
];
