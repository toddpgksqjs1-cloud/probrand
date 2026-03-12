// ===== Hyun Analysis Engine =====
// Generates marketing scores, SEO keywords, review replies, and business descriptions

// ===== Types =====

export interface AnalysisInput {
  businessName: string;
  category: string;
  location: string;
  naverPlaceUrl?: string;
}

export interface CategoryScore {
  score: number;
  max: number;
  grade: string;
  details: { label: string; score: number; max: number; tip: string }[];
}

export interface AnalysisResult {
  totalScore: number;
  grade: string;
  breakdown: {
    review: CategoryScore;
    photo: CategoryScore;
    basicInfo: CategoryScore;
    keyword: CategoryScore;
    menu: CategoryScore;
    hours: CategoryScore;
  };
  improvements: ImprovementAction[];
  competitors: CompetitorData[];
  previousScore: number | null;
}

export interface ImprovementAction {
  id: string;
  title: string;
  category: string;
  impact: number;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  priority: number;
}

export interface CompetitorData {
  name: string;
  score: number;
  grade: string;
  strengths: string[];
}

export interface SeoKeyword {
  keyword: string;
  volume: number;
  competition: 'low' | 'medium' | 'high';
  difficulty: number;
  myRank: number | null;
  recommended: boolean;
}

export interface SeoResult {
  keywords: SeoKeyword[];
  blogTitles: string[];
  contentGuide: { topic: string; tips: string[] }[];
}

// ===== Seed-based random =====

function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    return h / 0x7fffffff;
  };
}

function getGrade(score: number): string {
  if (score >= 90) return 'S';
  if (score >= 75) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  return 'D';
}

function getCategoryGrade(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 90) return 'S';
  if (pct >= 75) return 'A';
  if (pct >= 60) return 'B';
  if (pct >= 40) return 'C';
  return 'D';
}

// ===== Category-specific detail generators =====

const CATEGORY_TEMPLATES: Record<string, { labels: string[]; maxes: number[]; tips: string[] }> = {
  review: {
    labels: ['리뷰 수', '평균 평점', '리뷰 답변율', '최근 리뷰 빈도', '긍정 키워드'],
    maxes: [5, 5, 5, 5, 5],
    tips: [
      '리뷰 수를 50개 이상으로 늘리세요',
      '평점 4.5 이상을 유지하세요',
      '모든 리뷰에 24시간 내 답변하세요',
      '주 5개 이상 신규 리뷰를 유도하세요',
      '긍정 키워드가 포함된 리뷰를 유도하세요',
    ],
  },
  photo: {
    labels: ['대표 사진 품질', '사진 수량', '최신 사진', '메뉴 사진', '매장 내부 사진'],
    maxes: [4, 4, 4, 4, 4],
    tips: [
      '전문 촬영 대표사진을 등록하세요',
      '최소 15장 이상 사진을 올리세요',
      '월 1회 최신 사진을 업데이트하세요',
      '모든 메뉴에 사진을 추가하세요',
      '매장 내부 분위기를 보여주세요',
    ],
  },
  basicInfo: {
    labels: ['상호명 최적화', '주소 정확성', '전화번호', '카테고리 설정', '소개글'],
    maxes: [3, 3, 3, 3, 3],
    tips: [
      '키워드가 포함된 상호명을 사용하세요',
      '정확한 도로명 주소를 입력하세요',
      '연락 가능한 전화번호를 등록하세요',
      '관련 카테고리를 모두 설정하세요',
      'SEO에 최적화된 소개글을 작성하세요',
    ],
  },
  keyword: {
    labels: ['소개글 키워드', '메뉴명 키워드', '태그 활용', '블로그 연동', '키워드 다양성'],
    maxes: [3, 3, 3, 3, 3],
    tips: [
      '주요 키워드를 소개글에 자연스럽게 포함하세요',
      '검색 키워드를 메뉴명에 반영하세요',
      '관련 태그를 최대한 활용하세요',
      '블로그와 플레이스를 연동하세요',
      '다양한 검색 의도를 커버하세요',
    ],
  },
  menu: {
    labels: ['메뉴 등록 수', '가격 표시', '메뉴 사진', '메뉴 설명', '인기메뉴 설정'],
    maxes: [3, 3, 3, 3, 3],
    tips: [
      '모든 메뉴를 빠짐없이 등록하세요',
      '정확한 가격을 표시하세요',
      '각 메뉴에 먹음직스러운 사진을 추가하세요',
      '재료와 특징을 설명에 포함하세요',
      '인기메뉴를 설정하여 고객을 유도하세요',
    ],
  },
  hours: {
    labels: ['영업시간 등록', '휴무일 표시', '편의시설 정보', '주차 정보', '예약 설정'],
    maxes: [2, 2, 2, 2, 2],
    tips: [
      '정확한 영업시간을 등록하세요',
      '정기 휴무일을 명시하세요',
      'WiFi, 콘센트 등 편의시설을 표시하세요',
      '주차 가능 여부를 안내하세요',
      '네이버 예약을 활성화하세요',
    ],
  },
};

// ===== Main Analysis Function =====

export function generateAnalysis(input: AnalysisInput): AnalysisResult {
  const seed = `${input.businessName}-${input.category}-${input.location}`;
  const rand = seededRandom(seed);

  const generateCategory = (
    key: string,
    maxTotal: number
  ): CategoryScore => {
    const template = CATEGORY_TEMPLATES[key];
    const details = template.labels.map((label, i) => {
      const max = template.maxes[i];
      const score = Math.round(rand() * max * 10) / 10;
      return {
        label,
        score: Math.min(score, max),
        max,
        tip: template.tips[i],
      };
    });

    const totalScore = details.reduce((sum, d) => sum + d.score, 0);
    const adjustedScore = Math.round((totalScore / details.reduce((sum, d) => sum + d.max, 0)) * maxTotal);

    return {
      score: Math.min(adjustedScore, maxTotal),
      max: maxTotal,
      grade: getCategoryGrade(adjustedScore, maxTotal),
      details,
    };
  };

  const breakdown = {
    review: generateCategory('review', 25),
    photo: generateCategory('photo', 20),
    basicInfo: generateCategory('basicInfo', 15),
    keyword: generateCategory('keyword', 15),
    menu: generateCategory('menu', 15),
    hours: generateCategory('hours', 10),
  };

  const totalScore = Object.values(breakdown).reduce((sum, cat) => sum + cat.score, 0);
  const grade = getGrade(totalScore);

  // Generate improvement actions
  const improvements: ImprovementAction[] = [];
  let actionId = 0;

  Object.entries(breakdown).forEach(([catKey, cat]) => {
    const categoryNames: Record<string, string> = {
      review: '리뷰 관리',
      photo: '사진',
      basicInfo: '기본정보',
      keyword: '키워드 최적화',
      menu: '메뉴/상품',
      hours: '영업시간/편의',
    };

    cat.details
      .filter((d) => d.score < d.max * 0.7)
      .forEach((d) => {
        actionId++;
        improvements.push({
          id: `action_${actionId}`,
          title: d.tip,
          category: categoryNames[catKey] || catKey,
          impact: Math.round((d.max - d.score) * (cat.max / 25) * 3),
          difficulty: d.score < d.max * 0.3 ? 'easy' : d.score < d.max * 0.5 ? 'medium' : 'hard',
          description: d.tip,
          priority: Math.round((d.max - d.score) / d.max * 100),
        });
      });
  });

  // Sort by priority
  improvements.sort((a, b) => b.priority - a.priority);

  // Generate competitor data
  const competitorNames = getCompetitorNames(input.category, input.location);
  const competitors: CompetitorData[] = competitorNames.map((name) => {
    const cScore = Math.round(40 + rand() * 50);
    return {
      name,
      score: cScore,
      grade: getGrade(cScore),
      strengths: getRandomStrengths(rand),
    };
  });

  const previousScore = Math.max(30, totalScore - Math.round(rand() * 15) + 3);

  return {
    totalScore,
    grade,
    breakdown,
    improvements: improvements.slice(0, 8),
    competitors,
    previousScore,
  };
}

function getCompetitorNames(category: string, location: string): string[] {
  const loc = location.split(' ').pop() || location;
  const templates: Record<string, string[]> = {
    '카페/디저트': [`${loc} 모던카페`, `${loc} 디저트하우스`, `${loc} 커피로스터스`],
    '한식': [`${loc} 한정식`, `${loc} 국밥집`, `${loc} 찌개마을`],
    '일식': [`${loc} 스시오마카세`, `${loc} 라멘집`, `${loc} 이자카야`],
    '중식': [`${loc} 짬뽕집`, `${loc} 중화반점`, `${loc} 마라탕`],
    '양식': [`${loc} 파스타`, `${loc} 스테이크하우스`, `${loc} 브런치카페`],
    '미용/뷰티': [`${loc} 헤어살롱`, `${loc} 네일아트`, `${loc} 뷰티샵`],
    '헬스/피트니스': [`${loc} 피트니스`, `${loc} 요가원`, `${loc} 필라테스`],
  };
  return templates[category] || [`${loc} 경쟁매장A`, `${loc} 경쟁매장B`, `${loc} 경쟁매장C`];
}

function getRandomStrengths(rand: () => number): string[] {
  const allStrengths = [
    '리뷰 관리 우수', '사진 품질 높음', '키워드 최적화', '메뉴 정보 충실',
    '블로그 마케팅 활발', '소셜미디어 연동', '예약 시스템 활용', '이벤트 운영',
  ];
  const count = 2 + Math.floor(rand() * 2);
  const shuffled = [...allStrengths].sort(() => rand() - 0.5);
  return shuffled.slice(0, count);
}

// ===== SEO Keywords =====

export function generateSeoKeywords(input: AnalysisInput): SeoResult {
  const seed = `seo-${input.businessName}-${input.category}-${input.location}`;
  const rand = seededRandom(seed);

  const loc = input.location || '강남';
  const cat = input.category || '카페';
  const locShort = loc.split(' ').pop() || loc;

  const keywordTemplates = [
    `${locShort} ${cat}`,
    `${locShort} ${cat} 맛집`,
    `${locShort} ${cat} 추천`,
    `${locShort}역 ${cat}`,
    `${locShort} 인스타 ${cat}`,
    `${locShort} 데이트 ${cat}`,
    `${locShort} 분위기 좋은 ${cat}`,
    `${locShort} 가성비 ${cat}`,
    `${locShort} 혼밥 ${cat}`,
    `${locShort} 단체 ${cat}`,
    `${input.businessName || locShort + ' ' + cat}`,
    `${locShort} 신상 ${cat}`,
  ];

  const keywords: SeoKeyword[] = keywordTemplates.map((kw) => {
    const vol = Math.round(500 + rand() * 9500);
    const comp = rand() < 0.3 ? 'low' : rand() < 0.7 ? 'medium' : 'high';
    const diff = Math.round(20 + rand() * 70);
    const hasRank = rand() > 0.4;
    return {
      keyword: kw,
      volume: vol,
      competition: comp,
      difficulty: diff,
      myRank: hasRank ? Math.round(1 + rand() * 49) : null,
      recommended: diff < 50 && vol > 2000,
    };
  });

  // Sort by recommended, then volume
  keywords.sort((a, b) => {
    if (a.recommended !== b.recommended) return a.recommended ? -1 : 1;
    return b.volume - a.volume;
  });

  const blogTitles = [
    `${locShort}에서 꼭 가봐야 할 ${cat} BEST 5`,
    `${input.businessName || cat} 솔직 후기 | ${locShort} ${cat} 추천`,
    `${locShort} 데이트 코스 추천 | ${input.businessName || cat}`,
    `요즘 핫한 ${locShort} ${cat}, 직접 가봤습니다`,
    `${locShort} ${cat} 완벽 가이드 | 메뉴부터 분위기까지`,
    `주말 나들이 ${locShort} ${cat} 추천 리스트`,
  ];

  const contentGuide = [
    {
      topic: '매장 소개 글 작성',
      tips: [
        `핵심 키워드 "${locShort} ${cat}"를 자연스럽게 포함`,
        '매장의 특별한 점을 3가지 이상 언급',
        '고객 리뷰에서 자주 언급되는 긍정 키워드 활용',
        '200자 이상, 500자 이내로 작성',
      ],
    },
    {
      topic: '블로그 포스팅 전략',
      tips: [
        '주 1~2회 꾸준히 포스팅',
        '사진은 최소 10장 이상 포함',
        '제목에 "위치+업종" 키워드 포함',
        '체험단/리뷰어 섭외 활용',
      ],
    },
    {
      topic: '리뷰 마케팅',
      tips: [
        '영수증 리뷰 이벤트 진행',
        '리뷰 작성 시 음료 서비스 제공',
        '네거티브 리뷰에 정중히 답변',
        '포토 리뷰 비율 높이기',
      ],
    },
  ];

  return { keywords, blogTitles, contentGuide };
}

// ===== Review Reply Generator =====

export function generateReviewReply(
  review: string,
  rating: number,
  tone: 'formal' | 'friendly' | 'casual' = 'friendly',
  businessName?: string
): string {
  const storeName = businessName || '저희 매장';

  if (rating >= 4) {
    const positiveReplies: Record<string, string[]> = {
      formal: [
        `안녕하세요, ${storeName}입니다. 소중한 리뷰를 남겨주셔서 진심으로 감사드립니다. 고객님의 만족이 저희에게 큰 힘이 됩니다. 다음에도 좋은 경험을 드릴 수 있도록 최선을 다하겠습니다. 감사합니다.`,
        `${storeName}을 방문해 주시고 좋은 리뷰까지 남겨주셔서 깊이 감사드립니다. 앞으로도 더 나은 서비스와 맛으로 보답하겠습니다. 또 뵙겠습니다.`,
        `소중한 시간을 내어 리뷰를 작성해 주신 점 감사합니다. ${storeName}은 고객님의 피드백을 바탕으로 계속 발전하겠습니다. 다음 방문도 기대해 주세요.`,
      ],
      friendly: [
        `와~ 이렇게 좋은 리뷰 감사합니다! 😊 ${storeName}에서 좋은 시간 보내셨다니 정말 기쁘네요. 다음에 오시면 더 좋은 모습으로 보답할게요! 또 놀러 오세요~`,
        `리뷰 감사합니다! 💕 맛있게 드셨다니 보람을 느끼네요 ㅎㅎ ${storeName}은 항상 고객님을 생각하며 준비하고 있어요. 다음에도 꼭 와주세요!`,
        `이런 따뜻한 리뷰 정말 감사해요! ${storeName} 팀 모두가 힘이 나는 하루입니다 😄 더 맛있는 메뉴 준비해서 기다릴게요~`,
      ],
      casual: [
        `리뷰 감사합니다~ 맛있게 드셨다니 다행이에요! 다음에 또 오세요 ㅎㅎ`,
        `감사합니다! 좋아해주시니 저희도 기분이 좋네요~ 또 놀러오세요!`,
        `리뷰 고마워요~ 다음에 오시면 더 좋은 경험 드릴게요!`,
      ],
    };
    const replies = positiveReplies[tone];
    return replies[Math.floor(Math.random() * replies.length)];
  } else if (rating >= 3) {
    const neutralReplies: Record<string, string[]> = {
      formal: [
        `안녕하세요, ${storeName}입니다. 리뷰를 남겨주셔서 감사합니다. 말씀해주신 부분을 개선하여 다음에는 더 만족스러운 경험을 드리겠습니다. 다시 방문해 주실 기회를 주시면 감사하겠습니다.`,
      ],
      friendly: [
        `리뷰 감사합니다! 아쉬운 점이 있으셨군요 😢 말씀해주신 부분 꼭 개선할게요. 다음에 오시면 달라진 모습 보여드릴게요!`,
      ],
      casual: [
        `리뷰 감사합니다~ 아쉬운 점은 꼭 개선할게요! 다음에 또 와주세요 ㅎㅎ`,
      ],
    };
    return neutralReplies[tone][0];
  } else {
    const negativeReplies: Record<string, string[]> = {
      formal: [
        `안녕하세요, ${storeName}입니다. 불편한 경험을 드려 진심으로 죄송합니다. 말씀해주신 사항을 내부적으로 검토하고 즉시 개선 조치를 취하겠습니다. 다시 한번 방문 기회를 주시면 반드시 만족스러운 경험을 드리겠습니다.`,
      ],
      friendly: [
        `불편을 드려서 정말 죄송합니다 🙏 말씀해주신 부분 바로 개선하겠습니다. 다음에 오시면 확 달라진 모습 보여드릴게요! 한 번 더 기회를 주시면 감사하겠습니다.`,
      ],
      casual: [
        `죄송합니다 ㅠㅠ 말씀해주신 부분 바로 개선할게요. 다음에 오시면 더 잘해드릴게요!`,
      ],
    };
    return negativeReplies[tone][0];
  }
}

// ===== Business Description Generator =====

export function generateBusinessDescription(input: {
  businessName: string;
  category: string;
  location: string;
  specialties?: string[];
  atmosphere?: string;
  targetCustomer?: string;
}): string {
  const { businessName, category, location, specialties, atmosphere, targetCustomer } = input;
  const locShort = location.split(' ').pop() || location;

  const specialtyText = specialties && specialties.length > 0
    ? `${specialties.join(', ')} 등 다양한 메뉴를 선보이고 있습니다.`
    : `정성스럽게 준비한 다양한 메뉴를 선보이고 있습니다.`;

  const atmosphereText = atmosphere
    ? `${atmosphere} 분위기의 공간에서`
    : '편안하고 아늑한 분위기에서';

  const targetText = targetCustomer
    ? `${targetCustomer}에게 특히 사랑받는`
    : '남녀노소 누구나 좋아하는';

  return `${locShort}에 위치한 ${businessName}은(는) ${targetText} ${category}입니다. ${atmosphereText} ${specialtyText} ${locShort} ${category}를 찾으신다면 ${businessName}을(를) 방문해 보세요. 정성껏 준비한 메뉴와 따뜻한 서비스로 특별한 시간을 만들어 드리겠습니다. 네이버 예약으로 편리하게 방문하실 수 있습니다.`;
}

// ===== Score History Generator =====

export function generateScoreHistory(currentScore: number, weeks: number = 8): { week: string; score: number }[] {
  const history: { week: string; score: number }[] = [];
  let score = Math.max(30, currentScore - Math.round(Math.random() * 20) - 10);

  for (let i = weeks; i >= 1; i--) {
    history.push({ week: `${i}주 전`, score: Math.min(100, Math.max(0, score)) });
    score += Math.round(Math.random() * 6) - 1;
  }

  history.push({ week: '이번 주', score: currentScore });
  return history;
}

// ===== Marketing Stats Generator =====

export function generateMarketingStats(input: AnalysisInput) {
  const seed = `mkt-${input.businessName}-${input.category}`;
  const rand = seededRandom(seed);

  const loc = (input.location || '강남').split(' ').pop() || '강남';
  const cat = input.category || '카페';

  const keywordRankings = [
    { keyword: `${loc} ${cat}`, rank: Math.round(3 + rand() * 20), change: Math.round(rand() * 6) - 2, bestRank: Math.round(1 + rand() * 5), volume: Math.round(5000 + rand() * 15000) },
    { keyword: `${loc} ${cat} 맛집`, rank: Math.round(5 + rand() * 25), change: Math.round(rand() * 8) - 3, bestRank: Math.round(2 + rand() * 8), volume: Math.round(3000 + rand() * 10000) },
    { keyword: `${loc}역 ${cat}`, rank: Math.round(2 + rand() * 15), change: Math.round(rand() * 5) - 1, bestRank: Math.round(1 + rand() * 3), volume: Math.round(2000 + rand() * 8000) },
    { keyword: `${loc} ${cat} 추천`, rank: Math.round(8 + rand() * 30), change: Math.round(rand() * 4) - 2, bestRank: Math.round(3 + rand() * 10), volume: Math.round(1500 + rand() * 6000) },
    { keyword: `${loc} 데이트 ${cat}`, rank: Math.round(4 + rand() * 20), change: Math.round(rand() * 7) - 2, bestRank: Math.round(1 + rand() * 6), volume: Math.round(1000 + rand() * 5000) },
    { keyword: `${loc} 분위기 좋은 ${cat}`, rank: Math.round(6 + rand() * 18), change: Math.round(rand() * 5) - 1, bestRank: Math.round(2 + rand() * 7), volume: Math.round(800 + rand() * 4000) },
  ];

  const weeklyTrend = Array.from({ length: 8 }, (_, i) => ({
    week: `${8 - i}주 전`,
    impressions: Math.round(800 + rand() * 1200),
    clicks: Math.round(150 + rand() * 300),
    calls: Math.round(10 + rand() * 40),
    saves: Math.round(20 + rand() * 60),
  }));
  weeklyTrend[weeklyTrend.length - 1].week = '이번 주';

  return {
    summary: {
      impressions: Math.round(1200 + rand() * 3000),
      clicks: Math.round(200 + rand() * 500),
      calls: Math.round(15 + rand() * 45),
      saves: Math.round(30 + rand() * 80),
      impressionsChange: Math.round(rand() * 30) - 5,
      clicksChange: Math.round(rand() * 25) - 3,
      callsChange: Math.round(rand() * 20) - 5,
      savesChange: Math.round(rand() * 15) - 2,
    },
    keywordRankings,
    weeklyTrend,
  };
}
