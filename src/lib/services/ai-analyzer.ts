import { StoreInfo, DiagnosticReport, ReportSection, ReportItem, ActionItem } from "@/lib/types";

/**
 * AI Analysis Engine
 * TODO: Integrate with Claude API for real AI analysis
 * Currently uses rule-based analysis for development
 */
export async function generateDiagnosticReport(store: StoreInfo): Promise<DiagnosticReport> {
  const sections: ReportSection[] = [
    analyzeBasicInfo(store),
    analyzeMenu(store),
    analyzeReviews(store),
    analyzePhotos(store),
    generateLockedSEOSection(),
  ];

  const overallScore = Math.round(
    sections.filter((s) => !s.isLocked).reduce((sum, s) => sum + s.score, 0) /
      sections.filter((s) => !s.isLocked).length
  );

  const actions = generateActionItems(store, sections);
  const topRecommendations = actions.slice(0, 3).map((a) => a.description);

  return {
    storeInfo: store,
    overallScore,
    sections,
    topRecommendations,
    detailedActions: actions,
    generatedAt: new Date().toISOString(),
  };
}

function analyzeBasicInfo(store: StoreInfo): ReportSection {
  const items: ReportItem[] = [];
  let score = 100;

  if (store.name && store.address && store.phone) {
    items.push({ label: "가게명, 주소, 전화번호", value: "정상 등록", status: "good" });
  } else {
    items.push({ label: "기본 정보", value: "누락 항목 있음", status: "critical" });
    score -= 25;
  }

  if (store.businessHours) {
    items.push({ label: "영업시간", value: "등록됨", status: "good" });
  } else {
    items.push({ label: "영업시간", value: "미등록", status: "critical" });
    score -= 15;
  }

  const descLength = store.description?.length || 0;
  if (descLength >= 150) {
    items.push({ label: "가게 소개", value: `${descLength}자 (양호)`, status: "good" });
  } else if (descLength > 0) {
    items.push({
      label: "가게 소개",
      value: `${descLength}자 (권장 150자 이상)`,
      status: "warning",
      suggestion: "키워드를 포함한 상세한 가게 소개글을 작성하세요",
    });
    score -= 10;
  } else {
    items.push({ label: "가게 소개", value: "미등록", status: "critical" });
    score -= 20;
  }

  const facilityCount = store.facilities?.length || 0;
  if (facilityCount >= 5) {
    items.push({ label: "편의시설 정보", value: `${facilityCount}개 등록`, status: "good" });
  } else if (facilityCount > 0) {
    items.push({
      label: "편의시설 정보",
      value: `${facilityCount}개 등록 (추가 등록 권장)`,
      status: "warning",
      suggestion: "주차, 예약, 포장 가능 여부 등을 추가하세요",
    });
    score -= 5;
  } else {
    items.push({ label: "편의시설 정보", value: "미등록", status: "critical" });
    score -= 10;
  }

  return {
    id: "basic-info",
    title: "기본 정보 완성도",
    icon: "ClipboardList",
    score: Math.max(0, score),
    maxScore: 100,
    status: score >= 80 ? "good" : score >= 60 ? "warning" : "critical",
    items,
  };
}

function analyzeMenu(store: StoreInfo): ReportSection {
  const items: ReportItem[] = [];
  let score = 100;
  const menus = store.menuItems || [];

  items.push({ label: "등록 메뉴 수", value: `${menus.length}개`, status: menus.length >= 5 ? "good" : "warning" });

  const noPhoto = menus.filter((m) => !m.imageUrl).length;
  const photoRate = menus.length > 0 ? Math.round(((menus.length - noPhoto) / menus.length) * 100) : 0;
  if (noPhoto > 0) {
    items.push({
      label: "사진 없는 메뉴",
      value: `${noPhoto}개 (${100 - photoRate}%)`,
      status: noPhoto > menus.length / 2 ? "critical" : "warning",
      suggestion: "모든 메뉴에 사진을 등록하면 클릭률 40% 향상",
    });
    score -= Math.min(30, noPhoto * 5);
  } else {
    items.push({ label: "메뉴 사진", value: "모든 메뉴에 사진 등록됨", status: "good" });
  }

  const noDesc = menus.filter((m) => !m.description || m.description.length < 5).length;
  if (noDesc > 0) {
    items.push({
      label: "설명 없는 메뉴",
      value: `${noDesc}개 (${Math.round((noDesc / menus.length) * 100)}%)`,
      status: "warning",
      suggestion: "메뉴 설명을 추가하면 주문 전환율이 높아집니다",
    });
    score -= Math.min(20, noDesc * 3);
  }

  return {
    id: "menu",
    title: "메뉴 경쟁력",
    icon: "UtensilsCrossed",
    score: Math.max(0, score),
    maxScore: 100,
    status: score >= 80 ? "good" : score >= 60 ? "warning" : "critical",
    items,
  };
}

function analyzeReviews(store: StoreInfo): ReportSection {
  const items: ReportItem[] = [];
  let score = 100;

  if (store.rating >= 4.5) {
    items.push({ label: "평점", value: `${store.rating} / 5.0`, status: "good" });
  } else if (store.rating >= 4.0) {
    items.push({ label: "평점", value: `${store.rating} / 5.0`, status: "good" });
    score -= 5;
  } else {
    items.push({ label: "평점", value: `${store.rating} / 5.0 (개선 필요)`, status: "warning" });
    score -= 15;
  }

  items.push({
    label: "총 리뷰",
    value: `${store.reviewCount}개 (방문자 ${store.visitorReviewCount} + 블로그 ${store.blogReviewCount})`,
    status: store.reviewCount >= 100 ? "good" : "warning",
  });

  // Mock recent review count
  items.push({
    label: "최근 30일 리뷰",
    value: "8개 (경쟁 매장 평균 18개)",
    status: "critical",
    suggestion: "리뷰 이벤트나 방문 후 리뷰 요청으로 리뷰 수를 늘려보세요",
  });
  score -= 20;

  items.push({
    label: "사장님 답글 비율",
    value: "12% (권장 80% 이상)",
    status: "critical",
    suggestion: "리뷰 답글을 적극적으로 달면 재방문율이 25% 상승합니다",
  });
  score -= 20;

  return {
    id: "reviews",
    title: "리뷰 현황",
    icon: "Star",
    score: Math.max(0, score),
    maxScore: 100,
    status: score >= 80 ? "good" : score >= 60 ? "warning" : "critical",
    items,
  };
}

function analyzePhotos(store: StoreInfo): ReportSection {
  const items: ReportItem[] = [];
  let score = 100;
  const photos = store.photos || [];

  items.push({ label: "총 사진 수", value: `${photos.length}장`, status: photos.length >= 10 ? "good" : "warning" });

  const foodPhotos = photos.filter((p) => p.category === "food").length;
  items.push({ label: "음식 사진", value: `${foodPhotos}장${foodPhotos >= 5 ? " (충분)" : ""}`, status: foodPhotos >= 5 ? "good" : "warning" });

  const interiorPhotos = photos.filter((p) => p.category === "interior").length;
  if (interiorPhotos < 5) {
    items.push({
      label: "매장 내부 사진",
      value: `${interiorPhotos}장 (권장 5장 이상)`,
      status: "warning",
      suggestion: "분위기를 보여주는 내부 사진을 추가하세요",
    });
    score -= 15;
  }

  const exteriorPhotos = photos.filter((p) => p.category === "exterior").length;
  if (exteriorPhotos === 0) {
    items.push({
      label: "매장 외부 사진",
      value: "없음",
      status: "critical",
      suggestion: "찾아오기 쉽도록 외부 사진을 등록하세요",
    });
    score -= 15;
  }

  return {
    id: "photos",
    title: "사진 / 비주얼",
    icon: "Camera",
    score: Math.max(0, score),
    maxScore: 100,
    status: score >= 80 ? "good" : score >= 60 ? "warning" : "critical",
    items,
  };
}

function generateLockedSEOSection(): ReportSection {
  return {
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
  };
}

function generateActionItems(store: StoreInfo, sections: ReportSection[]): ActionItem[] {
  const actions: ActionItem[] = [];
  let id = 1;

  for (const section of sections) {
    if (section.isLocked) continue;
    for (const item of section.items) {
      if (item.suggestion) {
        actions.push({
          id: `action-${id++}`,
          priority: item.status === "critical" ? "high" : "medium",
          category: section.title,
          title: item.label + " 개선",
          description: item.suggestion,
          estimatedImpact: item.status === "critical" ? "높음" : "보통",
          isCompleted: false,
        });
      }
    }
  }

  return actions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
