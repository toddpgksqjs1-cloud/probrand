"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Palette,
  PenTool,
  Type,
  Utensils,
  Home,
  Lightbulb,
  Sparkles,
  Plus,
  Trash2,
  ChevronRight,
  Check,
  BookOpen,
  Layers,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────
type Tab = "story" | "identity" | "menu" | "interior" | "naming";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceRange: string;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

interface BrandStoryOutput {
  mission: string;
  vision: string;
  slogan: string;
  story: string;
}

// ─── Color Palettes ──────────────────────────────────────────────────
const COLOR_PALETTES = [
  {
    name: "모던 미니멀",
    desc: "깔끔하고 세련된 현대적 감성",
    colors: ["#1A1A2E", "#F5F5F5", "#E8E8E8", "#3D3D3D", "#C4A35A"],
  },
  {
    name: "내추럴 웜",
    desc: "따뜻하고 자연친화적인 분위기",
    colors: ["#5C4033", "#DEB887", "#F5E6D3", "#8FBC8F", "#FFF8DC"],
  },
  {
    name: "빈티지 클래식",
    desc: "고풍스럽고 클래식한 매력",
    colors: ["#2F4F4F", "#CD853F", "#FFF8E7", "#8B0000", "#D4A574"],
  },
  {
    name: "프리미엄 다크",
    desc: "고급스럽고 무게감 있는 공간",
    colors: ["#0D0D0D", "#1C1C1C", "#C9A96E", "#2C2C2C", "#E8DCC8"],
  },
  {
    name: "캐주얼 팝",
    desc: "밝고 활기찬 대중적 감성",
    colors: ["#FF6B6B", "#4ECDC4", "#FFE66D", "#2C3E50", "#FFFFFF"],
  },
];

// ─── Typography Recommendations ──────────────────────────────────────
const TYPOGRAPHY_RECS = [
  {
    name: "클래식 & 모던",
    heading: "마루부리 (Maru Buri)",
    headingStyle: "세리프 / 전통적이면서 현대적인 느낌",
    body: "프리텐다드 (Pretendard)",
    bodyStyle: "산세리프 / 깔끔하고 가독성 우수",
    bestFor: "한식, 일식, 프리미엄 레스토랑",
  },
  {
    name: "모던 & 심플",
    heading: "노토 산스 KR Bold (Noto Sans KR)",
    headingStyle: "산세리프 / 안정감 있고 범용적",
    body: "노토 산스 KR Regular",
    bodyStyle: "산세리프 / 깔끔한 본문 가독성",
    bestFor: "카페, 캐주얼 다이닝, 프랜차이즈",
  },
  {
    name: "감성 & 개성",
    heading: "나눔명조 (Nanum Myeongjo)",
    headingStyle: "세리프 / 문학적이고 감성적인 느낌",
    body: "스포카 한 산스 (Spoqa Han Sans)",
    bodyStyle: "산세리프 / 세련되고 현대적",
    bestFor: "와인바, 브런치 카페, 디저트 전문점",
  },
];

// ─── Interior Styles ─────────────────────────────────────────────────
const INTERIOR_STYLES: Record<
  string,
  {
    label: string;
    colors: string[];
    colorNames: string[];
    materials: string[];
    furniture: string[];
    lighting: string[];
    budgetRange: string;
    tips: string[];
  }
> = {
  minimal: {
    label: "미니멀 모던",
    colors: ["#FFFFFF", "#F5F5F5", "#333333", "#C0C0C0", "#A0A0A0"],
    colorNames: ["화이트", "라이트그레이", "차콜", "실버", "그레이"],
    materials: [
      "대리석 또는 인조대리석 (상판, 카운터)",
      "스테인리스 스틸 (디테일, 손잡이)",
      "강화유리 (파티션, 선반)",
      "무광 페인트 (벽면)",
      "마이크로 시멘트 (바닥)",
    ],
    furniture: [
      "직선적 디자인의 우드 & 메탈 테이블",
      "패브릭 또는 가죽 미니멀 체어",
      "빌트인 벤치 시트",
      "심플한 바 스툴",
      "숨은 수납을 활용한 커스텀 가구",
    ],
    lighting: [
      "매입형 다운라이트 (3000K 전구색)",
      "선형 LED 간접 조명",
      "미니멀 펜던트 조명 (카운터/바 위)",
      "조도 조절 가능한 디머 스위치",
    ],
    budgetRange: "평당 250~400만원",
    tips: [
      "색상은 3가지 이내로 제한하여 통일감을 유지하세요",
      "소품과 장식은 최소화하고, 있다면 하나의 포인트 오브제만 배치하세요",
      "메뉴판, 사이니지도 미니멀 톤에 맞춰 디자인하세요",
      "화장실까지 동일한 컨셉을 유지하는 것이 중요합니다",
      "자연광을 최대한 활용할 수 있는 창 배치를 고려하세요",
    ],
  },
  natural: {
    label: "내추럴 우드",
    colors: ["#DEB887", "#8B7355", "#F5F0E8", "#6B8E23", "#FAEBD7"],
    colorNames: ["버터넛", "원목갈색", "아이보리", "올리브그린", "앤틱화이트"],
    materials: [
      "원목 (테이블, 선반, 벽 패널)",
      "라탄 & 위커 (의자, 바구니, 조명)",
      "리넨 & 면 (커튼, 쿠션, 테이블 매트)",
      "테라코타 타일 (바닥, 벽 포인트)",
      "자연석 (카운터, 디테일)",
    ],
    furniture: [
      "무광 원목 다이닝 테이블 (참나무, 월넛)",
      "라탄 또는 우드 체어",
      "패브릭 쿠션이 있는 원목 벤치",
      "식물 선반 겸용 디스플레이 가구",
      "핸드메이드 느낌의 불규칙한 형태 가구",
    ],
    lighting: [
      "라탄/대나무 소재 펜던트 조명",
      "따뜻한 전구색 벌브 (2700K)",
      "캔들 또는 캔들형 LED",
      "자연광 최대 활용 (큰 창, 천창)",
    ],
    budgetRange: "평당 200~350만원",
    tips: [
      "실내 식물을 적극 활용하여 생동감을 더하세요 (몬스테라, 스투키, 행잉 플랜트)",
      "나무 소재는 통일된 톤으로 맞추세요 (밝은 계열 or 어두운 계열)",
      "메뉴판을 우드 보드나 크래프트지로 제작하면 컨셉에 맞습니다",
      "계절마다 식물이나 소품을 교체하여 신선함을 유지하세요",
      "화분 받침, 냅킨홀더 등 작은 소품도 자연 소재로 통일하세요",
    ],
  },
  industrial: {
    label: "인더스트리얼",
    colors: ["#2C2C2C", "#8B8682", "#CD853F", "#696969", "#F5F5DC"],
    colorNames: ["다크그레이", "콘크리트", "코퍼", "아이언", "베이지"],
    materials: [
      "노출 콘크리트 (벽, 천장)",
      "산업용 메탈 (선반, 파이프, 조명)",
      "재생 우드 (테이블, 벽 포인트)",
      "벽돌 (노출 벽돌 또는 벽돌 타일)",
      "블랙 스틸 프레임 (파티션, 창틀)",
    ],
    furniture: [
      "메탈 프레임 + 우드 상판 테이블",
      "빈티지 메탈 스툴 & 체어",
      "가죽 소파 또는 벤치 (에이징된 느낌)",
      "파이프 선반 & 행거",
      "커스텀 용접 가구",
    ],
    lighting: [
      "에디슨 벌브 노출 전구",
      "메탈 갓 펜던트 조명",
      "트랙 조명 & 스포트라이트",
      "네온사인 포인트 조명",
    ],
    budgetRange: "평당 180~320만원",
    tips: [
      "천장 배관, 전선 등을 노출시켜 러프한 매력을 살리세요",
      "메탈 소재는 블랙 무광으로 통일하면 세련된 느낌이 납니다",
      "포인트로 따뜻한 우드나 가죽을 섞어 차가움을 완화하세요",
      "아트워크나 빈티지 포스터로 벽면을 채워 밋밋함을 방지하세요",
      "오픈키친 구조가 인더스트리얼 컨셉과 잘 어울립니다",
    ],
  },
  vintage: {
    label: "빈티지 레트로",
    colors: ["#8B4513", "#DAA520", "#FFF8DC", "#2F4F4F", "#CD5C5C"],
    colorNames: ["브라운", "골드", "크림", "다크틸", "인디안레드"],
    materials: [
      "빈티지 타일 (패턴 타일, 체크 타일)",
      "에이징 우드 (재생목, 고재)",
      "황동 & 구리 (손잡이, 조명, 디테일)",
      "벨벳 & 체크 패브릭",
      "스테인드 글라스 (포인트)",
    ],
    furniture: [
      "앤틱 우드 다이닝 테이블",
      "벨벳 쿠션 체어 또는 가죽 소파",
      "빈티지 캐비닛 & 사이드보드",
      "레트로 바 스툴",
      "플리마켓에서 구한 유니크 가구",
    ],
    lighting: [
      "황동 or 구리 소재 펜던트 조명",
      "벽걸이 빈티지 스콘스",
      "테이블 위 촛대형 조명",
      "스테인드 글라스 조명 (포인트)",
    ],
    budgetRange: "평당 220~380만원",
    tips: [
      "진짜 빈티지 소품(오래된 시계, 포스터, 식기)을 인테리어에 활용하세요",
      "패턴이 들어간 벽지나 타일로 포인트 월을 만드세요",
      "새 가구보다는 중고 마켓에서 구한 가구가 더 분위기에 맞습니다",
      "메뉴판을 칠판이나 레터보드로 제작하면 분위기가 살아납니다",
      "음악(올드 재즈, 레트로 팝)도 컨셉에 맞춰 선곡하세요",
    ],
  },
  korean: {
    label: "한국 전통 모던",
    colors: ["#F5F5DC", "#4A2C2A", "#8B0000", "#2E4A3E", "#D4A574"],
    colorNames: ["한지색", "짙은갈색", "전통적색", "송록색", "황토색"],
    materials: [
      "한지 (조명, 벽 마감, 파티션)",
      "자연석 & 화강암",
      "대나무 & 원목 (느티나무, 소나무)",
      "기와 패턴 타일 (포인트)",
      "황토 벽 또는 황토색 페인트",
    ],
    furniture: [
      "좌식 테이블 또는 모던 한옥식 테이블",
      "방석 or 낮은 의자",
      "원목 수납장 & 찬장",
      "대나무 발 & 병풍 파티션",
      "모던한 형태의 전통 문양 가구",
    ],
    lighting: [
      "한지 등 (원형, 사각형)",
      "대나무 소재 펜던트",
      "간접 조명 (따뜻한 색온도)",
      "캔들형 조명 (한옥 분위기)",
    ],
    budgetRange: "평당 280~450만원",
    tips: [
      "전통 요소를 현대적으로 재해석하는 것이 핵심입니다",
      "한복 원단 패턴을 쿠션이나 테이블 매트에 활용하세요",
      "입구에 전통 느낌의 오브제(항아리, 소반 등)를 배치하세요",
      "전통 도자기를 그릇으로 사용하면 음식 프레젠테이션이 업그레이드됩니다",
      "창호 문양을 파티션이나 벽 장식에 현대적으로 적용하세요",
    ],
  },
  cafe: {
    label: "카페 스타일",
    colors: ["#FFFFFF", "#F0E6D6", "#6F4E37", "#87CEEB", "#E8D5B7"],
    colorNames: ["화이트", "크림", "커피브라운", "스카이블루", "라떼"],
    materials: [
      "타일 (서브웨이 타일, 모자이크 타일)",
      "원목 & 합판 (밝은 톤)",
      "유리 (쇼케이스, 파티션)",
      "테라조 (카운터, 바닥)",
      "화이트 페인트 & 몰딩",
    ],
    furniture: [
      "마블탑 또는 우드 라운드 테이블",
      "파스텔톤 체어 (민트, 핑크, 옐로)",
      "소파 & 라운지 체어 (아늑한 코너)",
      "하이탑 테이블 & 바 스툴",
      "북카페형 서가 & 매거진랙",
    ],
    lighting: [
      "미니 펜던트 조명 (여러 개 군집)",
      "스트링 라이트 (테라스, 포인트)",
      "자연광 최대 활용 (대형 유리창)",
      "테이블 위 작은 조명 (분위기용)",
    ],
    budgetRange: "평당 200~350만원",
    tips: [
      "포토존을 1~2곳 만들어 SNS 바이럴을 유도하세요",
      "시즌별로 바뀌는 디스플레이 공간을 확보하세요",
      "콘센트와 Wi-Fi 환경을 충분히 갖춰 체류시간을 높이세요",
      "디저트 쇼케이스를 시선이 닿는 곳에 배치하세요",
      "외부 테라스가 있다면 그린 인테리어와 조명으로 꾸미세요",
    ],
  },
};

// ─── Business Categories ─────────────────────────────────────────────
const BUSINESS_CATEGORIES = [
  "카페/디저트",
  "한식",
  "일식",
  "중식",
  "양식",
  "치킨/피자",
  "분식",
  "베이커리",
  "주점/바",
  "기타",
];

// ─── Menu Suggestion Templates ───────────────────────────────────────
const MENU_SUGGESTIONS: Record<string, MenuCategory[]> = {
  "카페/디저트": [
    {
      id: "sig",
      name: "시그니처",
      items: [
        { id: "1", name: "시그니처 라떼", description: "직접 로스팅한 원두로 만든 대표 메뉴", priceRange: "5,500~6,500원" },
        { id: "2", name: "수제 크로플", description: "매일 아침 직접 굽는 바삭한 크로플", priceRange: "7,000~9,000원" },
        { id: "3", name: "시즌 과일 에이드", description: "제철 과일로 만든 수제 에이드", priceRange: "6,000~7,000원" },
      ],
    },
    {
      id: "coffee",
      name: "커피",
      items: [
        { id: "4", name: "아메리카노", description: "깔끔한 싱글 오리진 원두", priceRange: "4,000~4,500원" },
        { id: "5", name: "카페라떼", description: "부드러운 우유 거품의 클래식 라떼", priceRange: "4,500~5,000원" },
        { id: "6", name: "콜드브루", description: "24시간 저온 추출한 깊은 맛", priceRange: "4,500~5,500원" },
      ],
    },
    {
      id: "dessert",
      name: "디저트",
      items: [
        { id: "7", name: "바스크 치즈케이크", description: "진한 크림치즈의 시그니처 케이크", priceRange: "6,500~7,500원" },
        { id: "8", name: "수제 쿠키 세트", description: "3종 쿠키 콤보 세트", priceRange: "5,000~6,000원" },
      ],
    },
    {
      id: "beverage",
      name: "음료",
      items: [
        { id: "9", name: "유자차", description: "국내산 유자로 만든 따뜻한 차", priceRange: "5,000~5,500원" },
        { id: "10", name: "스무디", description: "신선한 과일 블렌딩 스무디", priceRange: "5,500~6,500원" },
      ],
    },
  ],
  "한식": [
    {
      id: "sig",
      name: "시그니처",
      items: [
        { id: "1", name: "대표 정식", description: "엄선된 재료로 차린 한상 정식", priceRange: "13,000~18,000원" },
        { id: "2", name: "특선 불고기", description: "한우 등심으로 만든 전통 불고기", priceRange: "18,000~25,000원" },
      ],
    },
    {
      id: "main",
      name: "메인",
      items: [
        { id: "3", name: "된장찌개", description: "국산 콩으로 직접 담근 된장", priceRange: "8,000~10,000원" },
        { id: "4", name: "김치찌개", description: "묵은지로 끓인 깊은 맛", priceRange: "8,000~10,000원" },
        { id: "5", name: "제육볶음", description: "매콤달콤 수제 양념 제육", priceRange: "10,000~12,000원" },
      ],
    },
    {
      id: "side",
      name: "사이드/반찬",
      items: [
        { id: "6", name: "계란말이", description: "촉촉한 수제 계란말이", priceRange: "5,000~7,000원" },
        { id: "7", name: "해물파전", description: "바삭한 해물 파전", priceRange: "12,000~15,000원" },
      ],
    },
    {
      id: "drink",
      name: "음료/주류",
      items: [
        { id: "8", name: "전통 매실차", description: "직접 담근 매실로 만든 차", priceRange: "3,000~4,000원" },
        { id: "9", name: "막걸리", description: "지역 양조장의 전통 막걸리", priceRange: "5,000~8,000원" },
      ],
    },
  ],
  "일식": [
    {
      id: "sig",
      name: "시그니처",
      items: [
        { id: "1", name: "오마카세 코스", description: "셰프의 추천 프리미엄 코스", priceRange: "50,000~80,000원" },
        { id: "2", name: "특선 사시미", description: "매일 공수하는 최상급 회", priceRange: "35,000~55,000원" },
      ],
    },
    {
      id: "main",
      name: "메인",
      items: [
        { id: "3", name: "초밥 세트", description: "12피스 모둠 니기리", priceRange: "25,000~35,000원" },
        { id: "4", name: "라멘", description: "12시간 우린 돈코츠 육수", priceRange: "10,000~13,000원" },
        { id: "5", name: "돈카츠", description: "두텁게 썬 등심 / 안심 카츠", priceRange: "12,000~16,000원" },
      ],
    },
    {
      id: "side",
      name: "사이드",
      items: [
        { id: "6", name: "에다마메", description: "소금에 살짝 데친 풋콩", priceRange: "5,000~6,000원" },
        { id: "7", name: "교자", description: "수제 군만두 6개입", priceRange: "7,000~9,000원" },
      ],
    },
    {
      id: "drink",
      name: "음료/주류",
      items: [
        { id: "8", name: "사케", description: "프리미엄 준마이 다이긴조", priceRange: "12,000~30,000원" },
        { id: "9", name: "하이볼", description: "위스키 소다 하이볼", priceRange: "8,000~12,000원" },
      ],
    },
  ],
  "양식": [
    {
      id: "sig",
      name: "시그니처",
      items: [
        { id: "1", name: "트러플 파스타", description: "블랙 트러플 크림 파스타", priceRange: "22,000~28,000원" },
        { id: "2", name: "립아이 스테이크", description: "프리미엄 숙성 립아이", priceRange: "35,000~55,000원" },
      ],
    },
    {
      id: "main",
      name: "메인",
      items: [
        { id: "3", name: "봉골레 파스타", description: "바지락 화이트 와인 파스타", priceRange: "14,000~18,000원" },
        { id: "4", name: "마르게리따 피자", description: "화덕에 구운 정통 나폴리 피자", priceRange: "16,000~20,000원" },
        { id: "5", name: "리조또", description: "해산물 크림 리조또", priceRange: "15,000~19,000원" },
      ],
    },
    {
      id: "side",
      name: "에피타이저",
      items: [
        { id: "6", name: "시저 샐러드", description: "로메인 & 파마산 크루통", priceRange: "10,000~13,000원" },
        { id: "7", name: "브루스게타", description: "토마토 바질 브루스게타", priceRange: "8,000~11,000원" },
      ],
    },
    {
      id: "drink",
      name: "음료/와인",
      items: [
        { id: "8", name: "하우스 와인", description: "셰프 추천 글래스 와인", priceRange: "9,000~15,000원" },
        { id: "9", name: "에이드", description: "자몽 / 레몬 / 패션프루트", priceRange: "6,000~7,000원" },
      ],
    },
  ],
};

// ─── Name Generation Templates ───────────────────────────────────────
function generateBrandNames(
  category: string,
  mood: string,
  feeling: string
): { name: string; explanation: string }[] {
  const koreanWords: Record<string, string[]> = {
    "카페/디저트": ["달빛", "하루", "봄", "꽃", "향", "숲", "별", "구름", "달", "이슬"],
    "한식": ["솥", "어머니", "고향", "정", "옛", "한", "마루", "들", "뜨락", "시골"],
    "일식": ["겐", "류", "도", "모리", "하나", "센", "이치", "카이", "유", "미즈"],
    "중식": ["룽", "메이", "홍", "진", "봉", "란", "용", "화", "금", "옥"],
    "양식": ["테이블", "키친", "가든", "팜", "하우스", "그릴", "오븐", "마켓", "데일리", "비스트로"],
    "치킨/피자": ["바삭", "황금", "불", "크런치", "딱", "한판", "굿", "팡", "펀", "빅"],
    "분식": ["분", "길", "엄마", "학교", "추억", "방앗간", "소풍", "골목", "맛", "정겨운"],
    "베이커리": ["밀", "반죽", "오븐", "버터", "곡", "빵", "누룩", "아침", "굽다", "바삭"],
    "주점/바": ["달", "밤", "술", "잔", "한잔", "야", "놀", "벗", "풍류", "취"],
    "기타": ["맛", "담", "온", "새", "참", "늘", "빛", "길", "풀", "결"],
  };

  const moodSuffixes: Record<string, string[]> = {
    "고급스러운": ["에디션", "메종", "아뜰리에", "살롱", "프리미엄"],
    "편안한": ["집", "쉼", "곁", "안", "쉼터"],
    "트렌디한": ["랩", "스튜디오", "팩토리", "클럽", "라운지"],
    "전통적인": ["당", "옥", "헌", "정", "재"],
    "캐주얼한": ["탑", "존", "플러스", "앤", "고"],
  };

  const words = koreanWords[category] || koreanWords["기타"];
  const suffixes = Object.values(moodSuffixes).flat();

  const results: { name: string; explanation: string }[] = [];
  const usedNames = new Set<string>();

  // Korean pure names
  const pureKorean = [
    { name: `${words[0]}${words[4]}`, explanation: `'${words[0]}'과 '${words[4]}'의 조합으로, ${category} 특유의 감성을 한국어로 표현한 이름입니다.` },
    { name: `${words[1]}의 ${words[2]}`, explanation: `'${words[1]}'이 가진 일상적 따뜻함과 '${words[2]}'의 설렘을 결합한 서정적인 이름입니다.` },
    { name: `작은 ${words[5]}`, explanation: `아담하고 아늑한 공간감을 주면서 ${words[5]}이 주는 자연스러운 이미지를 담았습니다.` },
  ];

  // Hanja-derived names
  const hanjaNames = [
    { name: `${words[9]}${words[3]}`, explanation: `한자어 느낌의 조합으로, 전통적이면서 격식 있는 브랜드 이미지를 전달합니다.` },
    { name: `${words[6]}${words[8]}`, explanation: `'${words[6]}'과 '${words[8]}'이 어우러져 ${mood || "고유한"} 분위기를 자아내는 이름입니다.` },
  ];

  // English-Korean hybrid
  const hybridNames = [
    { name: `${words[0]} 키친`, explanation: `한국어 '${words[0]}'에 영어 '키친'을 결합하여 모던하면서도 친근한 느낌을 줍니다.` },
    { name: `더 ${words[7]}`, explanation: `영어 관사 '더'를 붙여 세련된 느낌을 주면서 ${words[7]}이 가진 의미를 살린 이름입니다.` },
    { name: `${words[2]} 스토리`, explanation: `'${words[2]}'의 이야기를 담겠다는 브랜드 철학이 담긴 감성적인 이름입니다.` },
  ];

  // Creative combinations
  const creative = [
    { name: `${words[3]}담다`, explanation: `'${words[3]}'을 '담다'라는 동사와 결합하여, ${feeling || "정성"} 담긴 음식을 제공한다는 의미를 전달합니다.` },
    { name: `오늘, ${words[4]}`, explanation: `매일 신선하게 준비한다는 의미와 함께, ${words[4]}이 주는 ${category}만의 특별함을 표현합니다.` },
  ];

  const allNames = [...pureKorean, ...hanjaNames, ...hybridNames, ...creative];

  for (const item of allNames) {
    if (!usedNames.has(item.name) && results.length < 10) {
      usedNames.add(item.name);
      results.push(item);
    }
  }

  return results;
}

// ─── Brand Story Generator ──────────────────────────────────────────
function generateBrandStory(
  name: string,
  category: string,
  target: string,
  values: string,
  differentiator: string
): BrandStoryOutput {
  const mission = `${name}은(는) ${category} 업계에서 ${values || "최고의 맛과 서비스"}를 추구하며, ${target || "모든 고객"}에게 잊을 수 없는 미식 경험을 선사합니다. 우리는 단순한 식사를 넘어, ${differentiator || "특별한 가치"}를 통해 일상 속 작은 행복을 만들어갑니다.`;

  const vision = `${name}이(가) 그리는 미래는, ${category} 문화를 선도하며 ${target || "고객"}의 삶에 깊이 스며드는 브랜드가 되는 것입니다. 5년 내 지역을 대표하는 ${category} 브랜드로 자리매김하고, ${values || "우리만의 철학"}을 전국에 전파하는 것이 목표입니다.`;

  const slogans = [
    `"${name}, 매일의 맛있는 선택"`,
    `"당신의 하루에 ${name}을(를)"`,
    `"${differentiator ? differentiator.split(" ")[0] : "특별한"} 한 끼, ${name}"`,
  ];
  const slogan = slogans[Math.floor(Math.random() * slogans.length)];

  const story = `${name}의 이야기는 ${category}에 대한 깊은 열정에서 시작되었습니다.

우리는 "${values || "좋은 재료, 정직한 음식"}"이라는 신념 아래, ${target || "음식을 사랑하는 모든 분"}들에게 진정한 ${category}의 가치를 전달하고자 합니다.

${differentiator ? `${name}만의 차별점은 바로 ${differentiator}입니다. ` : ""}매일 아침, 엄선된 재료를 준비하고 한 그릇 한 그릇에 정성을 담습니다. 우리가 만드는 음식에는 맛뿐 아니라, 손님 한 분 한 분을 생각하는 마음이 담겨 있습니다.

${name}은(는) 단순한 식당이 아닙니다. 이곳은 ${target || "사람들"}이 모여 소중한 시간을 나누는 공간이자, ${category}을(를) 통해 새로운 경험과 감동을 선사하는 곳입니다.

앞으로도 ${name}은(는) 변하지 않는 맛과 따뜻한 서비스로, 여러분의 일상 속 특별한 순간을 함께 만들어 가겠습니다.`;

  return { mission, vision, slogan, story };
}

// ─── Logo Concept Generator ──────────────────────────────────────────
function generateLogoConcept(brandName: string, style: string): string {
  const styleGuides: Record<string, string> = {
    "미니멀": `[${brandName}] 미니멀 로고 컨셉

1. 심볼
- 브랜드명의 첫 글자 또는 핵심 키워드를 기하학적 도형으로 단순화
- 불필요한 장식 요소를 배제하고, 하나의 아이콘으로 브랜드를 상징
- 단색(모노크롬)으로도 인식 가능한 디자인

2. 워드마크
- 산세리프 계열 폰트 사용 (프리텐다드, Helvetica Neue 등)
- 자간을 넓혀 여백의 미를 살린 로고타입
- 소문자 또는 한글 자모를 활용한 깔끔한 레터링

3. 컬러 가이드
- 메인 컬러: 블랙 (#1A1A1A) 또는 다크그레이
- 서브 컬러: 화이트 + 1가지 포인트 컬러
- 배경과의 대비를 통한 명확한 가시성

4. 활용 가이드
- 최소 사용 크기: 가로 20mm 이상
- 간판, 명함, 패키지, 디지털 모두에서 일관된 사용
- 충분한 여백(클리어 스페이스) 확보`,

    "빈티지": `[${brandName}] 빈티지 로고 컨셉

1. 심볼
- 엠블럼(배지) 형태의 원형 또는 방패형 로고
- 세밀한 라인 일러스트 또는 장식적 프레임 활용
- 리본 배너에 브랜드 슬로건 배치

2. 워드마크
- 세리프 계열 폰트 (나눔명조, Playfair Display 등)
- 약간의 텍스처(에이징 효과) 적용
- 클래식한 레터링 스타일

3. 컬러 가이드
- 메인 컬러: 다크 브라운 (#3C2415) 또는 네이비
- 서브 컬러: 크림, 골드, 버건디
- 에이징된 종이 위의 스탬프 느낌

4. 활용 가이드
- 스탬프, 왁스 실링 등에 활용 가능한 디자인
- 크래프트지, 빈티지 패키지와의 조화
- 간판은 우드 각인 또는 금속 주조 형태 추천`,

    "모던": `[${brandName}] 모던 로고 컨셉

1. 심볼
- 기하학적 도형의 조합으로 현대적 감성 표현
- 그라데이션 또는 투톤 컬러 활용
- 공간감과 입체감이 느껴지는 디자인

2. 워드마크
- 기하학적 산세리프 폰트 (Montserrat, 노토산스 등)
- Bold 웨이트로 강렬한 인상
- 한글과 영문의 조화로운 배치

3. 컬러 가이드
- 메인 컬러: 다크 네이비 (#1B2838) 또는 딥 블랙
- 서브 컬러: 골드, 쿠퍼, 또는 비비드 컬러 포인트
- 그라데이션 활용 가능

4. 활용 가이드
- 디지털 환경에 최적화된 반응형 디자인
- 네온사인, LED 간판에 적합한 형태
- 모션 로고(애니메이션) 적용 가능한 구조`,

    "클래식": `[${brandName}] 클래식 로고 컨셉

1. 심볼
- 전통적인 문장(Coat of Arms) 스타일 또는 모노그램
- 격식 있는 프레임과 장식 요소
- 대칭적 구조로 안정감 표현

2. 워드마크
- 엘레강트한 세리프 폰트 (마루부리, Garamond 등)
- 적절한 자간과 행간으로 고급스러운 느낌
- 이탤릭 또는 스몰캡 변형 활용

3. 컬러 가이드
- 메인 컬러: 딥 그린 (#1B4332), 버건디 (#722F37), 또는 네이비
- 서브 컬러: 골드, 아이보리
- 포일 스탬핑(금박/은박) 적용 가능한 디자인

4. 활용 가이드
- 고급 명함, 메뉴북, 와인 리스트 등에 적합
- 엠보싱/디보싱 인쇄 적용 가능
- 패브릭 자수 또는 각인에 적합한 디테일`,

    "플레이풀": `[${brandName}] 플레이풀 로고 컨셉

1. 심볼
- 캐릭터 또는 일러스트 기반의 친근한 마스코트
- 말풍선, 별, 하트 등 장식적 요소 활용
- 손그림 느낌의 자유로운 라인

2. 워드마크
- 라운드한 산세리프 또는 핸드레터링 스타일
- 글자 크기를 다르게 하여 리듬감 부여
- 컬러풀한 글자 조합 가능

3. 컬러 가이드
- 메인 컬러: 비비드 컬러 (코럴, 민트, 옐로 등)
- 서브 컬러: 파스텔톤 + 화이트
- 3~4가지 컬러의 조화로운 조합

4. 활용 가이드
- SNS 프로필, 스티커, 굿즈에 적합
- 패키지에 캐릭터 일러스트 다양하게 활용
- 시즌별 변형 로고 제작 가능한 유연한 구조`,
  };

  return styleGuides[style] || styleGuides["모던"];
}

// ─── Component ───────────────────────────────────────────────────────
export default function BrandPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("story");

  // Brand Story state
  const [brandName, setBrandName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("카페/디저트");
  const [targetCustomer, setTargetCustomer] = useState("");
  const [coreValues, setCoreValues] = useState("");
  const [differentiator, setDifferentiator] = useState("");
  const [storyOutput, setStoryOutput] = useState<BrandStoryOutput | null>(null);

  // Brand Identity state
  const [selectedPalette, setSelectedPalette] = useState<number | null>(null);
  const [logoName, setLogoName] = useState("");
  const [logoStyle, setLogoStyle] = useState("미니멀");
  const [logoConcept, setLogoConcept] = useState("");

  // Menu Planning state
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([
    { id: "cat-1", name: "시그니처", items: [] },
    { id: "cat-2", name: "메인", items: [] },
  ]);
  const [menuBusinessCategory, setMenuBusinessCategory] = useState("카페/디저트");

  // Interior state
  const [interiorStyle, setInteriorStyle] = useState("minimal");

  // Naming state
  const [namingCategory, setNamingCategory] = useState("카페/디저트");
  const [namingMood, setNamingMood] = useState("");
  const [namingFeeling, setNamingFeeling] = useState("");
  const [generatedNames, setGeneratedNames] = useState<{ name: string; explanation: string }[]>([]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "story", label: "브랜드 스토리", icon: <BookOpen size={18} /> },
    { key: "identity", label: "브랜드 아이덴티티", icon: <Palette size={18} /> },
    { key: "menu", label: "메뉴 구성 기획", icon: <Utensils size={18} /> },
    { key: "interior", label: "인테리어 컨셉", icon: <Home size={18} /> },
    { key: "naming", label: "네이밍 & 컨셉", icon: <Sparkles size={18} /> },
  ];

  // ─── Handlers ────────────────────────────────────────────────────
  const handleGenerateStory = () => {
    if (!brandName.trim()) return;
    const output = generateBrandStory(brandName, businessCategory, targetCustomer, coreValues, differentiator);
    setStoryOutput(output);
  };

  const handleGenerateLogoConcept = () => {
    if (!logoName.trim()) return;
    const concept = generateLogoConcept(logoName, logoStyle);
    setLogoConcept(concept);
  };

  const handleAddCategory = () => {
    const newId = `cat-${Date.now()}`;
    setMenuCategories([...menuCategories, { id: newId, name: "새 카테고리", items: [] }]);
  };

  const handleRemoveCategory = (catId: string) => {
    setMenuCategories(menuCategories.filter((c) => c.id !== catId));
  };

  const handleCategoryNameChange = (catId: string, name: string) => {
    setMenuCategories(menuCategories.map((c) => (c.id === catId ? { ...c, name } : c)));
  };

  const handleAddMenuItem = (catId: string) => {
    const newItem: MenuItem = { id: `item-${Date.now()}`, name: "", description: "", priceRange: "" };
    setMenuCategories(
      menuCategories.map((c) => (c.id === catId ? { ...c, items: [...c.items, newItem] } : c))
    );
  };

  const handleRemoveMenuItem = (catId: string, itemId: string) => {
    setMenuCategories(
      menuCategories.map((c) =>
        c.id === catId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c
      )
    );
  };

  const handleMenuItemChange = (catId: string, itemId: string, field: keyof MenuItem, value: string) => {
    setMenuCategories(
      menuCategories.map((c) =>
        c.id === catId
          ? { ...c, items: c.items.map((i) => (i.id === itemId ? { ...i, [field]: value } : i)) }
          : c
      )
    );
  };

  const handleMenuSuggestion = () => {
    const suggestions = MENU_SUGGESTIONS[menuBusinessCategory] || MENU_SUGGESTIONS["카페/디저트"];
    setMenuCategories(suggestions.map((cat) => ({ ...cat, id: `cat-${Date.now()}-${cat.id}` })));
  };

  const handleGenerateNames = () => {
    const names = generateBrandNames(namingCategory, namingMood, namingFeeling);
    setGeneratedNames(names);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentInterior = INTERIOR_STYLES[interiorStyle];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">브랜드 기획 스튜디오</h1>
        <p className="text-gray-500 mt-1">브랜드 아이덴티티부터 인테리어까지, 외식 브랜드의 모든 것을 기획하세요</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 p-1.5 flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          TAB 1: Brand Story
          ════════════════════════════════════════════════════════════ */}
      {activeTab === "story" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">브랜드 스토리 생성기</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">브랜드 이름</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="예: 봄날의 식탁"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">업종</label>
                <select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">타겟 고객</label>
                <input
                  type="text"
                  value={targetCustomer}
                  onChange={(e) => setTargetCustomer(e.target.value)}
                  placeholder="예: 20~30대 직장인, 가족 단위 고객"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">핵심 가치/철학</label>
                <textarea
                  value={coreValues}
                  onChange={(e) => setCoreValues(e.target.value)}
                  placeholder="예: 정직한 재료, 정성을 담은 한 끼"
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">차별화 포인트</label>
                <textarea
                  value={differentiator}
                  onChange={(e) => setDifferentiator(e.target.value)}
                  placeholder="예: 매일 아침 직접 공수하는 유기농 식재료, 30년 전통 비법 소스"
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateStory}
              disabled={!brandName.trim()}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Sparkles size={16} />
              스토리 생성
            </button>
          </div>

          {storyOutput && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <PenTool size={20} className="text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">생성된 브랜드 스토리</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h3 className="text-sm font-bold text-blue-800 mb-2">브랜드 미션</h3>
                  <p className="text-sm text-blue-900 leading-relaxed">{storyOutput.mission}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <h3 className="text-sm font-bold text-purple-800 mb-2">브랜드 비전</h3>
                  <p className="text-sm text-purple-900 leading-relaxed">{storyOutput.vision}</p>
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <h3 className="text-sm font-bold text-amber-800 mb-2">브랜드 슬로건</h3>
                <p className="text-xl font-bold text-amber-900 text-center py-2">{storyOutput.slogan}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h3 className="text-sm font-bold text-gray-800 mb-3">브랜드 스토리 본문</h3>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {storyOutput.story}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          TAB 2: Brand Identity
          ════════════════════════════════════════════════════════════ */}
      {activeTab === "identity" && (
        <div className="space-y-6">
          {/* Color Palette */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Palette size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">컬러 팔레트</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">브랜드에 어울리는 컬러 팔레트를 선택하세요</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {COLOR_PALETTES.map((palette, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPalette(idx)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    selectedPalette === idx
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {selectedPalette === idx && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{palette.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">{palette.desc}</p>
                  <div className="flex gap-2">
                    {palette.colors.map((color, cIdx) => (
                      <div
                        key={cIdx}
                        className="w-10 h-10 rounded-full border border-gray-200 shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {selectedPalette !== null && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-bold text-gray-800 mb-3">
                  선택된 팔레트: {COLOR_PALETTES[selectedPalette].name}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {COLOR_PALETTES[selectedPalette].colors.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg border border-gray-300 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs font-mono text-gray-600">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Logo Concept */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <PenTool size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">로고 컨셉 가이드</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">브랜드명</label>
                <input
                  type="text"
                  value={logoName}
                  onChange={(e) => setLogoName(e.target.value)}
                  placeholder="브랜드 이름을 입력하세요"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">스타일</label>
                <select
                  value={logoStyle}
                  onChange={(e) => setLogoStyle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  {["미니멀", "빈티지", "모던", "클래식", "플레이풀"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateLogoConcept}
              disabled={!logoName.trim()}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Lightbulb size={16} />
              로고 컨셉 생성
            </button>

            {logoConcept && (
              <div className="mt-6 bg-gray-50 rounded-lg p-5 border border-gray-200">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {logoConcept}
                </pre>
              </div>
            )}
          </div>

          {/* Typography */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Type size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">타이포그래피 추천</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TYPOGRAPHY_RECS.map((rec, idx) => (
                <div key={idx} className="rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                    {rec.name}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">제목용 폰트</p>
                      <p className="text-sm font-bold text-gray-800">{rec.heading}</p>
                      <p className="text-xs text-gray-500">{rec.headingStyle}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">본문용 폰트</p>
                      <p className="text-sm font-bold text-gray-800">{rec.body}</p>
                      <p className="text-xs text-gray-500">{rec.bodyStyle}</p>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-blue-600 font-medium">추천 업종: {rec.bestFor}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          TAB 3: Menu Planning
          ════════════════════════════════════════════════════════════ */}
      {activeTab === "menu" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Utensils size={20} className="text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">메뉴 구성 기획</h2>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={menuBusinessCategory}
                  onChange={(e) => setMenuBusinessCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleMenuSuggestion}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles size={14} />
                  메뉴 구성 제안
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {menuCategories.map((category) => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => handleCategoryNameChange(category.id, e.target.value)}
                      className="text-base font-bold text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none px-1 py-0.5"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddMenuItem(category.id)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                      >
                        <Plus size={14} />
                        메뉴 추가
                      </button>
                      <button
                        onClick={() => handleRemoveCategory(category.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {category.items.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">
                      아직 메뉴가 없습니다. &ldquo;메뉴 추가&rdquo; 버튼을 눌러 추가하세요.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {category.items.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-start bg-gray-50 rounded-lg p-3">
                          <div className="col-span-3">
                            <label className="block text-xs text-gray-500 mb-1">메뉴명</label>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleMenuItemChange(category.id, item.id, "name", e.target.value)}
                              placeholder="메뉴 이름"
                              className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                          </div>
                          <div className="col-span-5">
                            <label className="block text-xs text-gray-500 mb-1">설명</label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handleMenuItemChange(category.id, item.id, "description", e.target.value)}
                              placeholder="메뉴 설명"
                              className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                          </div>
                          <div className="col-span-3">
                            <label className="block text-xs text-gray-500 mb-1">가격대</label>
                            <input
                              type="text"
                              value={item.priceRange}
                              onChange={(e) => handleMenuItemChange(category.id, item.id, "priceRange", e.target.value)}
                              placeholder="예: 8,000~12,000원"
                              className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                          </div>
                          <div className="col-span-1 flex items-end justify-center pb-1">
                            <button
                              onClick={() => handleRemoveMenuItem(category.id, item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors mt-5"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={handleAddCategory}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                카테고리 추가
              </button>
            </div>
          </div>

          {/* Menu Preview */}
          {menuCategories.some((c) => c.items.length > 0) && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Layers size={20} className="text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">메뉴 미리보기</h2>
              </div>

              <div className="max-w-lg mx-auto bg-gray-50 rounded-xl p-8 border border-gray-200">
                <h3 className="text-center text-xl font-bold text-gray-900 mb-1 tracking-wider">
                  {brandName || "MENU"}
                </h3>
                <div className="w-12 h-0.5 bg-gray-400 mx-auto mb-6" />

                {menuCategories
                  .filter((c) => c.items.length > 0)
                  .map((category, catIdx) => (
                    <div key={category.id} className={catIdx > 0 ? "mt-6" : ""}>
                      <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-3 pb-1 border-b border-gray-300">
                        {category.name}
                      </h4>
                      <div className="space-y-2.5">
                        {category.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{item.name || "메뉴명"}</div>
                              {item.description && (
                                <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                              )}
                            </div>
                            {item.priceRange && (
                              <div className="text-sm text-gray-700 font-medium ml-4 whitespace-nowrap">
                                {item.priceRange}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          TAB 4: Interior Concept
          ════════════════════════════════════════════════════════════ */}
      {activeTab === "interior" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Home size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">인테리어 컨셉 가이드</h2>
            </div>

            {/* Style Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {Object.entries(INTERIOR_STYLES).map(([key, style]) => (
                <button
                  key={key}
                  onClick={() => setInteriorStyle(key)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    interiorStyle === key
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-center gap-1 mb-2">
                    {style.colors.slice(0, 3).map((c, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${interiorStyle === key ? "text-blue-700" : "text-gray-700"}`}>
                    {style.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Style Details */}
            <div className="space-y-6">
              {/* Color Scheme */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Palette size={16} className="text-blue-600" />
                  추천 컬러 스킴
                </h3>
                <div className="flex flex-wrap gap-3">
                  {currentInterior.colors.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-lg border border-gray-300 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <div>
                        <p className="text-xs font-medium text-gray-700">{currentInterior.colorNames[idx]}</p>
                        <p className="text-xs font-mono text-gray-400">{color}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Materials */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">주요 자재</h3>
                  <ul className="space-y-2">
                    {currentInterior.materials.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <ChevronRight size={14} className="text-blue-500 mt-0.5 shrink-0" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Furniture */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">가구 스타일</h3>
                  <ul className="space-y-2">
                    {currentInterior.furniture.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <ChevronRight size={14} className="text-blue-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lighting */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">조명 추천</h3>
                  <ul className="space-y-2">
                    {currentInterior.lighting.map((l, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <ChevronRight size={14} className="text-blue-500 mt-0.5 shrink-0" />
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Budget */}
                <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                  <h3 className="text-sm font-bold text-blue-800 mb-2">예상 비용 범위</h3>
                  <p className="text-2xl font-bold text-blue-900">{currentInterior.budgetRange}</p>
                  <p className="text-xs text-blue-600 mt-1">* 기본 인테리어 기준, 주방설비 별도</p>
                </div>
              </div>

              {/* Design Tips */}
              <div className="bg-amber-50 rounded-lg p-5 border border-amber-100">
                <h3 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
                  <Lightbulb size={16} className="text-amber-600" />
                  디자인 팁
                </h3>
                <ol className="space-y-2">
                  {currentInterior.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-amber-900">
                      <span className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center text-xs font-bold text-amber-800 shrink-0">
                        {idx + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          TAB 5: Naming & Concept
          ════════════════════════════════════════════════════════════ */}
      {activeTab === "naming" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">네이밍 & 컨셉</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">업종</label>
                <select
                  value={namingCategory}
                  onChange={(e) => setNamingCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">분위기/키워드</label>
                <input
                  type="text"
                  value={namingMood}
                  onChange={(e) => setNamingMood(e.target.value)}
                  placeholder="예: 따뜻한, 모던한, 감성적인"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">원하는 느낌</label>
                <input
                  type="text"
                  value={namingFeeling}
                  onChange={(e) => setNamingFeeling(e.target.value)}
                  placeholder="예: 고급스러운, 친근한, 유니크한"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateNames}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Sparkles size={16} />
              이름 생성하기
            </button>
          </div>

          {generatedNames.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb size={20} className="text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">추천 브랜드 이름</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedNames.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-blue-200 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm font-bold text-blue-700 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
