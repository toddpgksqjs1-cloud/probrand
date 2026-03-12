"use client";

import { useState } from "react";
import {
  BookOpen,
  FileText,
  Calculator,
  Building2,
  Receipt,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Circle,
  AlertTriangle,
  Info,
  DollarSign,
  ClipboardList,
  Users,
  Megaphone,
  Hammer,
  MapPin,
  Lightbulb,
  Shield,
  Scale,
  BadgeCheck,
  Clock,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { PieLabelRenderProps } from "recharts";

// ============================================================
// Types
// ============================================================
type TabId = "procedure" | "documents" | "calculator" | "franchise" | "tax";

interface AccordionItem {
  title: string;
  duration?: string;
  content: React.ReactNode;
}

interface ChecklistItem {
  id: string;
  label: string;
  detail?: React.ReactNode;
}

interface DocumentItem {
  id: string;
  name: string;
  agency: string;
  required: string;
  duration: string;
  cost: string;
  notes: string;
}

// ============================================================
// Tab definitions
// ============================================================
const tabs: { id: TabId; label: string; icon: typeof BookOpen }[] = [
  { id: "procedure", label: "창업 절차 가이드", icon: BookOpen },
  { id: "documents", label: "행정 서류 가이드", icon: FileText },
  { id: "calculator", label: "비용 계산기", icon: Calculator },
  { id: "franchise", label: "프랜차이즈 가이드", icon: Building2 },
  { id: "tax", label: "세금/노무 가이드", icon: Receipt },
];

// ============================================================
// Cost calculator multipliers
// ============================================================
const businessTypes = [
  { value: "korean", label: "한식당" },
  { value: "western", label: "양식당" },
  { value: "japanese", label: "일식당" },
  { value: "chinese", label: "중식당" },
  { value: "cafe", label: "카페/디저트" },
  { value: "bakery", label: "베이커리" },
  { value: "chicken", label: "치킨/호프" },
  { value: "fastfood", label: "분식/패스트푸드" },
  { value: "bar", label: "주점/바" },
  { value: "bbq", label: "고기/BBQ" },
];

const regionMultipliers: Record<string, { deposit: number; rent: number; premium: number; label: string }> = {
  seoul: { deposit: 1.0, rent: 1.0, premium: 1.0, label: "서울" },
  gyeonggi: { deposit: 0.7, rent: 0.7, premium: 0.6, label: "경기" },
  metro: { deposit: 0.6, rent: 0.6, premium: 0.5, label: "광역시" },
  other: { deposit: 0.4, rent: 0.4, premium: 0.3, label: "기타 지방" },
};

const interiorCostPerPyeong: Record<string, Record<string, number>> = {
  korean: { basic: 180, mid: 280, premium: 420 },
  western: { basic: 220, mid: 350, premium: 500 },
  japanese: { basic: 250, mid: 380, premium: 550 },
  chinese: { basic: 170, mid: 260, premium: 380 },
  cafe: { basic: 200, mid: 320, premium: 480 },
  bakery: { basic: 230, mid: 350, premium: 520 },
  chicken: { basic: 150, mid: 230, premium: 350 },
  fastfood: { basic: 140, mid: 220, premium: 330 },
  bar: { basic: 200, mid: 320, premium: 480 },
  bbq: { basic: 200, mid: 300, premium: 450 },
};

const kitchenEquipCost: Record<string, number> = {
  korean: 2500, western: 3000, japanese: 3500, chinese: 2800,
  cafe: 3000, bakery: 4000, chicken: 2200, fastfood: 1800,
  bar: 1500, bbq: 2800,
};

const PIE_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#f97316", "#6366f1", "#14b8a6",
  "#84cc16", "#e11d48",
];

// ============================================================
// Accordion Component
// ============================================================
function Accordion({ items, stepLabels }: { items: AccordionItem[]; stepLabels?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full flex items-center gap-3 p-5 text-left hover:bg-gray-50 transition"
            >
              {stepLabels && (
                <span className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  {item.duration && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                      {item.duration}
                    </span>
                  )}
                </div>
              </div>
              {isOpen ? (
                <ChevronDown size={18} className="text-gray-400 shrink-0" />
              ) : (
                <ChevronRight size={18} className="text-gray-400 shrink-0" />
              )}
            </button>
            {isOpen && (
              <div className="px-5 pb-5 border-t border-gray-100">
                <div className="pt-4">{item.content}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Interactive Checklist Component
// ============================================================
function InteractiveChecklist({ items }: { items: ChecklistItem[] }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const progress = items.length > 0 ? Math.round((checked.size / items.length) * 100) : 0;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-500">{checked.size}/{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const done = checked.has(item.id);
          const expanded = expandedId === item.id;
          return (
            <div key={item.id} className="rounded-lg border border-gray-100 overflow-hidden">
              <div
                className={`flex items-center gap-3 p-3 cursor-pointer transition ${
                  done ? "bg-green-50" : "hover:bg-gray-50"
                }`}
              >
                <button onClick={() => toggle(item.id)} className="shrink-0">
                  {done ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : (
                    <Circle size={20} className="text-gray-300" />
                  )}
                </button>
                <span
                  className={`flex-1 text-sm ${done ? "line-through text-gray-400" : "text-gray-700"}`}
                  onClick={() => toggle(item.id)}
                >
                  {item.label}
                </span>
                {item.detail && (
                  <button
                    onClick={() => setExpandedId(expanded ? null : item.id)}
                    className="text-gray-400 hover:text-gray-600 shrink-0"
                  >
                    {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                )}
              </div>
              {expanded && item.detail && (
                <div className="px-11 pb-3 text-sm text-gray-600 border-t border-gray-50">
                  <div className="pt-2">{item.detail}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Tip Box Component
// ============================================================
function TipBox({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "warning" | "tip" }) {
  const styles = {
    info: { bg: "bg-blue-50", border: "border-blue-200", icon: <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />, text: "text-blue-800" },
    warning: { bg: "bg-amber-50", border: "border-amber-200", icon: <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />, text: "text-amber-800" },
    tip: { bg: "bg-green-50", border: "border-green-200", icon: <Lightbulb size={16} className="text-green-500 shrink-0 mt-0.5" />, text: "text-green-800" },
  };
  const s = styles[type];
  return (
    <div className={`${s.bg} border ${s.border} rounded-lg p-3 flex items-start gap-2 my-3`}>
      {s.icon}
      <div className={`text-sm ${s.text}`}>{children}</div>
    </div>
  );
}

// ============================================================
// Sub-section heading
// ============================================================
function SubHeading({ icon: Icon, children }: { icon: typeof BookOpen; children: React.ReactNode }) {
  return (
    <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-3 mt-1">
      <Icon size={16} className="text-blue-600" />
      {children}
    </h4>
  );
}

// ============================================================
// Main Page
// ============================================================
export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<TabId>("procedure");

  return (
    <div className="max-w-5xl mx-auto">
      <p className="text-gray-500 mb-6">
        외식업 창업에 필요한 모든 정보를 한 곳에서 확인하세요
      </p>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1.5 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "procedure" && <ProcedureTab />}
      {activeTab === "documents" && <DocumentsTab />}
      {activeTab === "calculator" && <CalculatorTab />}
      {activeTab === "franchise" && <FranchiseTab />}
      {activeTab === "tax" && <TaxTab />}
    </div>
  );
}

// ============================================================
// Tab 1: 창업 절차 가이드
// ============================================================
function ProcedureTab() {
  const steps: AccordionItem[] = [
    {
      title: "사업 기획",
      duration: "1-2개월",
      content: (
        <div className="space-y-4">
          <SubHeading icon={Lightbulb}>핵심 체크리스트</SubHeading>
          <InteractiveChecklist
            items={[
              {
                id: "p1-1",
                label: "업종 및 컨셉 결정",
                detail: (
                  <div>
                    <p>트렌드보다 본인의 강점과 시장 수요의 교차점을 찾으세요.</p>
                    <ul className="list-disc pl-4 mt-1 space-y-1">
                      <li>목표 고객층 명확히 정의</li>
                      <li>차별화 포인트 3가지 이상 도출</li>
                      <li>유사 업종 성공/실패 사례 분석</li>
                    </ul>
                  </div>
                ),
              },
              {
                id: "p1-2",
                label: "사업계획서 작성",
                detail: (
                  <div>
                    <p className="font-medium mb-1">사업계획서 필수 항목:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>사업 개요 (업종, 컨셉, 타겟)</li>
                      <li>시장 분석 (상권, 경쟁, 트렌드)</li>
                      <li>메뉴 구성 및 가격 전략</li>
                      <li>마케팅 전략</li>
                      <li>재무 계획 (초기 투자금, 월 운영비, 손익분기점)</li>
                      <li>인력 운영 계획</li>
                    </ul>
                  </div>
                ),
              },
              {
                id: "p1-3",
                label: "초기 투자금 산정",
                detail: (
                  <div>
                    <p>보증금 + 인테리어 + 장비 + 운전자금(최소 3개월) + 예비비(10%)</p>
                    <TipBox type="warning">
                      투자금은 반드시 자기자본 50% 이상 확보 후 진행하세요. 과도한 대출은 창업 실패의 주요 원인입니다.
                    </TipBox>
                  </div>
                ),
              },
              {
                id: "p1-4",
                label: "상권 분석",
                detail: (
                  <div>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>소상공인시장진흥공단 &ldquo;상권정보&rdquo; 시스템 활용 (무료)</li>
                      <li>네이버 지도로 경쟁업체 파악</li>
                      <li>직접 현장 방문 (평일/주말, 점심/저녁 시간대별)</li>
                      <li>배달 수요 확인 (배달앱 해당 지역 조회)</li>
                    </ul>
                  </div>
                ),
              },
            ]}
          />
          <TipBox type="tip">
            소상공인시장진흥공단의 &lsquo;창업교육&rsquo;을 수강하면 정책자금 신청 시 가점을 받을 수 있습니다.
          </TipBox>
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-sm font-bold text-gray-700 mb-2">예상 비용</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>- 상권 분석 보고서 (전문업체): 50~200만원</li>
              <li>- 사업계획서 컨설팅: 100~300만원</li>
              <li>- 직접 작성 시: 0원 (소진공 무료 양식 활용)</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "입지 선정",
      duration: "1-2개월",
      content: (
        <div className="space-y-4">
          <SubHeading icon={MapPin}>상권 분석 방법</SubHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-bold text-sm text-blue-800 mb-2">유동인구</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>- 시간대별 측정 (최소 3일)</li>
                <li>- 통계청 SGIS 활용</li>
                <li>- 연령/성별 분포 확인</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h5 className="font-bold text-sm text-green-800 mb-2">경쟁업체</h5>
              <ul className="text-sm text-green-700 space-y-1">
                <li>- 반경 500m 내 동종 업종 수</li>
                <li>- 리뷰 수/평점 파악</li>
                <li>- 메뉴/가격대 비교</li>
              </ul>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <h5 className="font-bold text-sm text-amber-800 mb-2">접근성</h5>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>- 대중교통 거리 (도보 5분 이내)</li>
                <li>- 주차 가능 여부</li>
                <li>- 가시성 (1층/코너)</li>
              </ul>
            </div>
          </div>

          <SubHeading icon={ClipboardList}>임대차 계약 체크리스트</SubHeading>
          <InteractiveChecklist
            items={[
              { id: "p2-1", label: "등기부등본 확인 (근저당, 가압류 등)", detail: <p>대법원 인터넷등기소에서 발급 가능합니다. 근저당 설정액이 건물 시가의 70%를 넘으면 위험합니다.</p> },
              { id: "p2-2", label: "건축물대장 확인 (용도 일치 여부)", detail: <p>영업하려는 업종이 해당 건물의 허가된 용도에 포함되는지 반드시 확인하세요. 위반 시 영업허가 불가합니다.</p> },
              { id: "p2-3", label: "임대인 신원 확인 (실제 소유자 여부)", detail: <p>등기부등본 상 소유자와 계약 당사자가 일치하는지 확인하세요. 대리인이면 위임장과 인감증명서를 받으세요.</p> },
              { id: "p2-4", label: "특약사항 꼼꼼히 작성", detail: <p>원상복구 범위, 인테리어 철거 비용 부담, 재계약 조건, 임대료 인상률 상한 등을 명시하세요.</p> },
              { id: "p2-5", label: "확정일자 받기 (관할 주민센터)", detail: <p>임대차계약서에 확정일자를 받으면 건물이 경매에 넘어가더라도 보증금 우선변제를 받을 수 있습니다.</p> },
              { id: "p2-6", label: "권리금 계약서 별도 작성", detail: <p>2015년부터 상가임대차보호법으로 권리금이 보호됩니다. 바닥·시설·영업·거래처 권리금을 구분하여 작성하세요.</p> },
            ]}
          />
          <TipBox type="warning">
            적정 임대료는 예상 매출의 10~15%를 넘지 않아야 합니다. 월매출 3,000만원이면 임대료 300~450만원이 적정선입니다.
          </TipBox>
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-sm font-bold text-gray-700 mb-2">권리금 이해하기</h5>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div><span className="font-medium">바닥 권리금:</span> 입지/상권 가치</div>
              <div><span className="font-medium">시설 권리금:</span> 인테리어/설비 가치</div>
              <div><span className="font-medium">영업 권리금:</span> 매출/단골 가치</div>
              <div><span className="font-medium">거래처 권리금:</span> 납품처/거래처 가치</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "인허가/행정",
      duration: "2-4주",
      content: (
        <div className="space-y-4">
          <SubHeading icon={FileText}>필수 행정 절차</SubHeading>
          <InteractiveChecklist
            items={[
              {
                id: "p3-1",
                label: "사업자등록 (관할 세무서)",
                detail: (
                  <div>
                    <p className="mb-1">사업 개시일로부터 20일 이내 신청</p>
                    <p><strong>준비물:</strong> 신분증, 임대차계약서, 사업자등록신청서</p>
                    <p><strong>소요시간:</strong> 당일~3일</p>
                    <p><strong>비용:</strong> 무료</p>
                    <TipBox type="tip">홈택스에서 온라인 신청도 가능합니다.</TipBox>
                  </div>
                ),
              },
              {
                id: "p3-2",
                label: "식품위생교육 이수",
                detail: (
                  <div>
                    <p>영업 시작 전 반드시 이수해야 합니다.</p>
                    <p><strong>교육기관:</strong> 한국외식산업협회, 한국식품산업협회</p>
                    <p><strong>교육시간:</strong> 8시간 (온라인 가능)</p>
                    <p><strong>비용:</strong> 약 4만원</p>
                    <p><strong>유효기간:</strong> 3년 (이후 갱신교육 3시간)</p>
                  </div>
                ),
              },
              {
                id: "p3-3",
                label: "영업신고 (구청 위생과)",
                detail: (
                  <div>
                    <p><strong>준비물:</strong> 사업자등록증, 위생교육 이수증, 건강진단서, 영업신고서</p>
                    <p><strong>소요시간:</strong> 3~7일 (현장 점검 후 발급)</p>
                    <p><strong>비용:</strong> 무료~2만8천원 (지자체별 상이)</p>
                    <TipBox type="warning">시설 기준 미충족 시 보완 후 재신청 필요. 주방 면적, 환기시설, 화장실 등을 사전에 확인하세요.</TipBox>
                  </div>
                ),
              },
              {
                id: "p3-4",
                label: "소방안전교육 이수",
                detail: (
                  <div>
                    <p><strong>대상:</strong> 영업장 면적 100m2 이상</p>
                    <p><strong>교육기관:</strong> 한국소방안전원</p>
                    <p><strong>교육시간:</strong> 4시간</p>
                    <p><strong>비용:</strong> 약 2만원</p>
                  </div>
                ),
              },
              {
                id: "p3-5",
                label: "건강진단서 발급",
                detail: (
                  <div>
                    <p><strong>발급처:</strong> 보건소 또는 종합병원</p>
                    <p><strong>검사항목:</strong> 장티푸스, 폐결핵 등</p>
                    <p><strong>비용:</strong> 보건소 3천원 / 병원 1~3만원</p>
                    <p><strong>유효기간:</strong> 1년</p>
                  </div>
                ),
              },
              {
                id: "p3-6",
                label: "통신판매업 신고 (배달/온라인 판매 시)",
                detail: (
                  <div>
                    <p>배달앱 입점 또는 자사 온라인 판매 시 필수</p>
                    <p><strong>신고처:</strong> 관할 시/군/구청</p>
                    <p><strong>비용:</strong> 무료</p>
                    <p><strong>준비물:</strong> 사업자등록증, 신분증</p>
                  </div>
                ),
              },
            ]}
          />
          <TipBox type="info">
            행정 순서: 식품위생교육 &rarr; 건강진단서 &rarr; 사업자등록 &rarr; 영업신고 순으로 진행하면 효율적입니다.
          </TipBox>
        </div>
      ),
    },
    {
      title: "인테리어 & 시설",
      duration: "1-3개월",
      content: (
        <div className="space-y-4">
          <SubHeading icon={Hammer}>인테리어 업체 선정 기준</SubHeading>
          <InteractiveChecklist
            items={[
              { id: "p4-1", label: "최소 3곳 이상 견적 비교", detail: <p>동일 조건으로 견적을 받되, 너무 저렴한 곳은 주의하세요. 시장가 대비 20% 이상 저렴하면 자재 품질을 의심해야 합니다.</p> },
              { id: "p4-2", label: "포트폴리오 및 레퍼런스 확인", detail: <p>동일 업종 시공 경험이 있는 업체를 우선 선택하세요. 실제 시공 매장을 직접 방문해 보는 것이 가장 좋습니다.</p> },
              { id: "p4-3", label: "공사 계약서 작성 (공사 범위, 금액, 일정, A/S 조건)", detail: <p>구두 약속이 아닌 서면 계약이 필수입니다. 중도금/잔금 지급 조건을 명확히 하세요.</p> },
              { id: "p4-4", label: "필수 시설 기준 확인 (주방, 화장실, 환기)", detail: <p>영업신고 전 시설 기준을 미리 확인하세요. 조리장과 객석 분리, 환기시설, 방충망 등이 필수입니다.</p> },
              { id: "p4-5", label: "간판 제작 (규격/밝기 지자체 규정 확인)", detail: <p>가로 간판은 1개만 허용되는 지역이 많습니다. 옥외광고물 관리법을 확인하세요. 비용: 50~300만원</p> },
              { id: "p4-6", label: "가구/집기 구매 및 배치", detail: <p>좌석 간격은 최소 60cm 이상 확보하세요. 동선을 고려한 배치가 중요합니다.</p> },
            ]}
          />
          <h5 className="text-sm font-bold text-gray-700 mb-2">업종별 평당 인테리어 비용 가이드 (만원)</h5>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">업종</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">기본</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">중급</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">고급</th>
                </tr>
              </thead>
              <tbody>
                {businessTypes.map((bt) => (
                  <tr key={bt.value} className="border-b border-gray-100">
                    <td className="py-2 px-3 text-gray-700">{bt.label}</td>
                    <td className="py-2 px-3 text-right text-gray-600">{interiorCostPerPyeong[bt.value].basic}</td>
                    <td className="py-2 px-3 text-right text-gray-600">{interiorCostPerPyeong[bt.value].mid}</td>
                    <td className="py-2 px-3 text-right text-gray-600">{interiorCostPerPyeong[bt.value].premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TipBox type="tip">
            인테리어 비용의 30%는 철거/기초 공사에 들어갑니다. 기존 시설을 최대한 활용하면 비용을 절감할 수 있습니다.
          </TipBox>
        </div>
      ),
    },
    {
      title: "메뉴 & 운영 준비",
      duration: "2-4주",
      content: (
        <div className="space-y-4">
          <SubHeading icon={ClipboardList}>핵심 준비사항</SubHeading>
          <InteractiveChecklist
            items={[
              {
                id: "p5-1",
                label: "메뉴 개발 및 원가 계산",
                detail: (
                  <div>
                    <p className="mb-1">식재료 원가율 기준:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>한식: 35~40%</li>
                      <li>양식: 30~35%</li>
                      <li>카페: 20~30%</li>
                      <li>치킨/호프: 35~40%</li>
                    </ul>
                    <TipBox type="tip">메뉴 가격 = 식재료 원가 / 목표 원가율. 원가 5,000원, 목표 원가율 33%이면 판매가 15,000원</TipBox>
                  </div>
                ),
              },
              {
                id: "p5-2",
                label: "식자재 거래처 확보",
                detail: (
                  <div>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>농산물: 가락시장/지역 도매시장 직접 매입</li>
                      <li>수산물: 노량진수산시장, 지역 수산시장</li>
                      <li>정육: 축산물 도매시장, 정육 전문 납품업체</li>
                      <li>공산품: 식자재마트 (메트로, 팁코스 등)</li>
                    </ul>
                    <TipBox type="info">최소 2개 이상의 거래처를 확보하면 가격 협상력이 높아집니다.</TipBox>
                  </div>
                ),
              },
              {
                id: "p5-3",
                label: "POS 시스템 설치",
                detail: (
                  <div>
                    <p>주요 POS 시스템: 키오스크 겸용 추천</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>포스뱅크, 아임유, 배민오더 등</li>
                      <li>월 이용료: 3~10만원</li>
                      <li>키오스크 렌탈: 월 5~15만원</li>
                      <li>카드단말기: 보통 무료 설치 (수수료 계약)</li>
                    </ul>
                  </div>
                ),
              },
              {
                id: "p5-4",
                label: "직원 채용 및 교육",
                detail: (
                  <div>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>4대보험 가입 필수 (사업주 부담 약 9.5%)</li>
                      <li>2026년 최저임금: 10,030원</li>
                      <li>주 15시간 이상 근무 시 주휴수당 발생</li>
                      <li>근로계약서 반드시 서면 작성 (미작성 시 과태료 500만원)</li>
                    </ul>
                  </div>
                ),
              },
              {
                id: "p5-5",
                label: "운영 매뉴얼 작성",
                detail: (
                  <div>
                    <p>오픈/마감 체크리스트, 레시피북, 위생관리, 컴플레인 대응 등 표준화된 매뉴얼을 만들어두면 직원 교육과 품질 유지에 큰 도움이 됩니다.</p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      ),
    },
    {
      title: "마케팅 & 오픈",
      duration: "2주",
      content: (
        <div className="space-y-4">
          <SubHeading icon={Megaphone}>오픈 마케팅 전략</SubHeading>
          <InteractiveChecklist
            items={[
              {
                id: "p6-1",
                label: "네이버 플레이스 등록",
                detail: (
                  <div>
                    <p className="mb-1">무료로 등록 가능한 필수 마케팅 채널</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>사업자등록증으로 스마트플레이스 가입</li>
                      <li>매장 사진 최소 10장 등록</li>
                      <li>메뉴/가격 정보 정확히 입력</li>
                      <li>영업시간, 주차 정보 등 상세 기입</li>
                      <li>네이버 예약 연동 (선택)</li>
                    </ul>
                  </div>
                ),
              },
              {
                id: "p6-2",
                label: "SNS 채널 개설 (인스타그램 필수)",
                detail: (
                  <div>
                    <p>인스타그램 비즈니스 계정 + 네이버 블로그 조합 추천</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>인스타그램: 감성 사진, 릴스 (신메뉴/조리 과정)</li>
                      <li>블로그: 매장 스토리, 메뉴 소개 (SEO 효과)</li>
                      <li>오픈 전 2주부터 카운트다운 콘텐츠</li>
                    </ul>
                  </div>
                ),
              },
              {
                id: "p6-3",
                label: "오픈 이벤트 기획",
                detail: (
                  <div>
                    <p>효과적인 오픈 이벤트:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>오픈 기념 할인 (3~7일간 20~30%)</li>
                      <li>SNS 팔로우 이벤트 (음료 서비스 등)</li>
                      <li>리뷰 이벤트 (네이버/구글 리뷰 작성 시 혜택)</li>
                      <li>프리오픈 (지인 초대 시식회)</li>
                    </ul>
                    <TipBox type="tip">프리오픈 기간(2~3일)을 두면 실전 운영 경험을 쌓고 문제점을 미리 파악할 수 있습니다.</TipBox>
                  </div>
                ),
              },
              {
                id: "p6-4",
                label: "배달앱 입점 (배민/쿠팡이츠/요기요)",
                detail: (
                  <div>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>사업자등록증 + 영업신고증 필요</li>
                      <li>수수료: 중개 6.8~15%, 배달 수수료 별도</li>
                      <li>사진/메뉴 설명 정성스럽게 등록</li>
                      <li>초기 광고(울트라콜/오픈리스트) 활용 검토</li>
                    </ul>
                  </div>
                ),
              },
              {
                id: "p6-5",
                label: "전단지/배너/현수막 준비",
                detail: (
                  <div>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>전단지: 1,000장 약 5~10만원</li>
                      <li>현수막: 1장 약 2~5만원</li>
                      <li>반경 500m 내 주요 동선에 배포</li>
                      <li>QR코드 삽입 (네이버 플레이스/메뉴판 연결)</li>
                    </ul>
                  </div>
                ),
              },
            ]}
          />
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-sm font-bold text-gray-700 mb-2">오픈 초기 마케팅 예산 가이드</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>- 네이버 플레이스 등록: 무료</li>
              <li>- SNS 채널 개설: 무료</li>
              <li>- 전단지/현수막: 10~30만원</li>
              <li>- 오픈 이벤트 비용: 50~100만원</li>
              <li>- 배달앱 초기 광고: 30~50만원/월</li>
              <li>- 블로그 체험단: 30~50만원 (3~5명)</li>
              <li className="font-medium mt-2">총 예상: 120~330만원</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">외식업 창업 전체 로드맵</h2>
        <p className="text-sm text-gray-500 mb-4">
          총 예상 기간: 3~6개월 | 각 단계를 클릭하면 상세 내용과 체크리스트를 확인할 수 있습니다
        </p>
        {/* Timeline bar */}
        <div className="flex items-center gap-1 mb-2 overflow-x-auto pb-2">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {idx + 1}
                </div>
                <span className="text-xs text-gray-500 mt-1 whitespace-nowrap">{step.title}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className="w-8 md:w-12 h-0.5 bg-blue-200 mt-[-12px]" />
              )}
            </div>
          ))}
        </div>
      </div>
      <Accordion items={steps} stepLabels />
    </div>
  );
}

// ============================================================
// Tab 2: 행정 서류 가이드
// ============================================================
function DocumentsTab() {
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set());

  const toggleDoc = (id: string) => {
    setCheckedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const categories: { title: string; icon: typeof FileText; color: string; items: DocumentItem[] }[] = [
    {
      title: "사업자등록 관련",
      icon: FileText,
      color: "blue",
      items: [
        {
          id: "d1-1",
          name: "사업자등록증",
          agency: "관할 세무서 / 홈택스",
          required: "신분증, 임대차계약서, 사업자등록신청서",
          duration: "당일 ~ 3영업일",
          cost: "무료",
          notes: "사업 개시일로부터 20일 이내 신청. 업종코드는 '음식점업(5621)'이 기본. 간이과세 또는 일반과세 선택 필요 (연매출 8,000만원 기준).",
        },
        {
          id: "d1-2",
          name: "업종코드 선택",
          agency: "세무서 (사업자등록 시 선택)",
          required: "해당 없음",
          duration: "즉시",
          cost: "무료",
          notes: "한식(5621), 서양식(5622), 일식(5623), 중식(5624), 기타외식(5629), 비알코올 음료점(5631), 주점(5632). 복수 업종 등록 가능.",
        },
      ],
    },
    {
      title: "위생/보건 관련",
      icon: Shield,
      color: "green",
      items: [
        {
          id: "d2-1",
          name: "영업신고증 (일반음식점)",
          agency: "관할 구청 위생과",
          required: "사업자등록증, 위생교육이수증, 건강진단서, 영업신고서, 시설평면도",
          duration: "3~7영업일 (현장 점검 포함)",
          cost: "무료 ~ 28,000원 (지자체별 상이)",
          notes: "시설 기준: 조리장(환기·방충·세척시설), 객석(환기·조명), 화장실(수세식). 기준 미달 시 보완 후 재신청.",
        },
        {
          id: "d2-2",
          name: "식품위생교육 이수증",
          agency: "한국외식산업협회 / 한국식품산업협회",
          required: "신분증",
          duration: "교육 8시간 (온라인 가능)",
          cost: "약 40,000원",
          notes: "영업 시작 전 반드시 이수. 유효기간 3년, 이후 갱신교육 3시간. 온라인 교육은 한국외식산업협회 홈페이지에서 신청.",
        },
        {
          id: "d2-3",
          name: "건강진단서 (구 보건증)",
          agency: "보건소 / 종합병원",
          required: "신분증, 증명사진 1매",
          duration: "3~5영업일",
          cost: "보건소 3,000원 / 병원 10,000~30,000원",
          notes: "검사 항목: 장티푸스, 폐결핵, 전염성 피부질환 등. 유효기간 1년. 직원 전원 필수.",
        },
      ],
    },
    {
      title: "소방/안전 관련",
      icon: AlertTriangle,
      color: "amber",
      items: [
        {
          id: "d3-1",
          name: "소방안전교육 이수증",
          agency: "한국소방안전원",
          required: "신분증",
          duration: "교육 4시간",
          cost: "약 20,000원",
          notes: "영업장 100m2 이상 시 필수. 소방시설(소화기, 감지기, 유도등) 설치 기준도 확인.",
        },
        {
          id: "d3-2",
          name: "소방시설 완공검사",
          agency: "관할 소방서",
          required: "소방시설 설계도서, 시공 사진",
          duration: "7~14영업일",
          cost: "무료 (시설 설치 비용 별도)",
          notes: "영업장 규모에 따라 소화기, 자동화재탐지설비, 스프링클러 등 설치 필요. 인테리어 전 소방서 사전 상담 추천.",
        },
      ],
    },
    {
      title: "세금 관련",
      icon: Receipt,
      color: "purple",
      items: [
        {
          id: "d4-1",
          name: "부가가치세 신고",
          agency: "관할 세무서 / 홈택스",
          required: "매출·매입 증빙자료, 세금계산서",
          duration: "연 2회 (1월, 7월) / 간이과세 연 1회 (1월)",
          cost: "세무사 수수료: 월 10~20만원",
          notes: "일반과세: 매출의 10% 부가세 징수, 매입세액 공제 가능. 간이과세: 업종별 부가가치율 적용, 세금계산서 발행 불가.",
        },
        {
          id: "d4-2",
          name: "종합소득세 신고",
          agency: "관할 세무서 / 홈택스",
          required: "수입·지출 증빙, 장부",
          duration: "연 1회 (5월)",
          cost: "세무사 수수료: 30~50만원/건",
          notes: "세율 6~45% (누진과세). 간편장부 또는 복식부기 의무. 경비(임대료, 인건비, 재료비 등) 철저히 증빙하면 절세 가능.",
        },
        {
          id: "d4-3",
          name: "4대보험 가입",
          agency: "국민건강보험공단 / 근로복지공단",
          required: "사업자등록증, 근로계약서, 직원 신분증",
          duration: "채용 후 14일 이내 신고",
          cost: "사업주 부담 약 9.5% (건강 3.545%, 국민연금 4.5%, 고용 0.9%, 산재 업종별)",
          notes: "직원 1인 이상 고용 시 필수. 미가입 시 과태료 부과. 두루누리 사회보험료 지원 확인 (10인 미만 사업장).",
        },
      ],
    },
    {
      title: "보험/노무 관련",
      icon: Scale,
      color: "indigo",
      items: [
        {
          id: "d5-1",
          name: "화재보험 (의무)",
          agency: "보험사",
          required: "사업자등록증, 건축물대장",
          duration: "즉시 가입 가능",
          cost: "연 10~50만원 (면적/구조별)",
          notes: "다중이용업소는 의무 가입. 미가입 시 과태료 300만원. 화재배상책임보험 포함 여부 확인.",
        },
        {
          id: "d5-2",
          name: "영업배상책임보험 (권장)",
          agency: "보험사",
          required: "사업자등록증",
          duration: "즉시 가입 가능",
          cost: "연 15~40만원",
          notes: "식중독, 고객 부상 등 영업 중 발생하는 배상책임을 보장. 가입을 강력 권장합니다.",
        },
        {
          id: "d5-3",
          name: "근로계약서",
          agency: "자체 작성",
          required: "사업자 정보, 근로자 정보",
          duration: "즉시",
          cost: "무료 (고용노동부 표준양식 활용)",
          notes: "임금, 근로시간, 휴일, 업무내용 등 필수 기재. 미작성 시 과태료 500만원. 반드시 2부 작성 후 1부는 근로자에게 교부.",
        },
      ],
    },
    {
      title: "배달/온라인 관련",
      icon: Megaphone,
      color: "pink",
      items: [
        {
          id: "d6-1",
          name: "통신판매업 신고",
          agency: "관할 시/군/구청",
          required: "사업자등록증, 신분증",
          duration: "즉시 ~ 3영업일",
          cost: "무료",
          notes: "배달앱 입점 또는 자사 온라인 판매 시 필수. 미신고 시 과태료. 정부24에서 온라인 신청 가능.",
        },
        {
          id: "d6-2",
          name: "배달앱 입점 서류",
          agency: "배민/쿠팡이츠/요기요",
          required: "사업자등록증, 영업신고증, 통신판매업 신고증, 통장 사본",
          duration: "3~7영업일",
          cost: "가입비 무료 (수수료 별도: 6.8~15%)",
          notes: "메뉴 사진은 전문 촬영 권장. 초기 광고비 월 30~50만원 예상. 배달 포장 용기 비용도 원가에 포함하여 메뉴가 설정.",
        },
      ],
    },
  ];

  const colorMap: Record<string, string> = {
    blue: "border-l-blue-500",
    green: "border-l-green-500",
    amber: "border-l-amber-500",
    purple: "border-l-purple-500",
    indigo: "border-l-indigo-500",
    pink: "border-l-pink-500",
  };

  const iconBgMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
    indigo: "bg-indigo-50 text-indigo-600",
    pink: "bg-pink-50 text-pink-600",
  };

  const allItems = categories.flatMap((c) => c.items);
  const totalDocs = allItems.length;
  const checkedCount = checkedDocs.size;
  const overallProgress = totalDocs > 0 ? Math.round((checkedCount / totalDocs) * 100) : 0;

  return (
    <div>
      {/* Overall progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">서류 준비 현황</h2>
          <span className="text-sm font-medium text-gray-500">{checkedCount} / {totalDocs} 완료</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        {overallProgress === 100 && (
          <p className="text-sm text-green-600 font-medium mt-2">모든 서류가 준비되었습니다!</p>
        )}
      </div>

      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.title}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBgMap[cat.color]}`}>
                <cat.icon size={16} />
              </div>
              <h3 className="font-bold text-gray-900">{cat.title}</h3>
              <span className="text-xs text-gray-400 ml-auto">
                {cat.items.filter((i) => checkedDocs.has(i.id)).length}/{cat.items.length}
              </span>
            </div>
            <div className="space-y-2">
              {cat.items.map((item) => {
                const done = checkedDocs.has(item.id);
                const expanded = expandedDoc === item.id;
                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-xl border border-gray-200 border-l-4 ${colorMap[cat.color]} overflow-hidden`}
                  >
                    <div className="flex items-center gap-3 p-4">
                      <button onClick={() => toggleDoc(item.id)} className="shrink-0">
                        {done ? (
                          <CheckCircle size={20} className="text-green-500" />
                        ) : (
                          <Circle size={20} className="text-gray-300" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm ${done ? "line-through text-gray-400" : "text-gray-800"}`}>
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">{item.agency} | {item.duration} | {item.cost}</p>
                      </div>
                      <button
                        onClick={() => setExpandedDoc(expanded ? null : item.id)}
                        className="text-gray-400 hover:text-gray-600 shrink-0"
                      >
                        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                    </div>
                    {expanded && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        <div className="pt-3 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <span className="text-xs font-medium text-gray-400 uppercase">발급 기관</span>
                              <p className="text-sm text-gray-700 mt-0.5">{item.agency}</p>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-gray-400 uppercase">소요 시간</span>
                              <p className="text-sm text-gray-700 mt-0.5">{item.duration}</p>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-gray-400 uppercase">비용</span>
                              <p className="text-sm text-gray-700 mt-0.5">{item.cost}</p>
                            </div>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-400 uppercase">필요 서류</span>
                            <p className="text-sm text-gray-700 mt-0.5">{item.required}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-400 uppercase">주의사항</span>
                            <p className="text-sm text-gray-700 mt-0.5">{item.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Tab 3: 비용 계산기
// ============================================================
function CalculatorTab() {
  const [businessType, setBusinessType] = useState("korean");
  const [area, setArea] = useState("");
  const [region, setRegion] = useState("seoul");
  const [interiorGrade, setInteriorGrade] = useState("mid");
  const [calculated, setCalculated] = useState(false);

  const areaNum = parseInt(area) || 0;
  const regionData = regionMultipliers[region];

  // Base costs (Seoul, mid-range, reference)
  const baseDeposit = 3000; // 만원 per pyeong
  const baseRent = 15; // 만원 per pyeong/month
  const basePremium = 2000; // 만원 total base

  const depositEst = Math.round(areaNum * baseDeposit * regionData.deposit * 0.3);
  const rentEst = Math.round(areaNum * baseRent * regionData.rent);
  const premiumEst = Math.round(basePremium * regionData.premium * (areaNum / 15));

  const gradeKey = interiorGrade as "basic" | "mid" | "premium";
  const interiorPerPyeong = interiorCostPerPyeong[businessType]?.[gradeKey] || 250;
  const interiorEst = interiorPerPyeong * areaNum;

  const kitchenEst = kitchenEquipCost[businessType] || 2500;
  const furnitureEst = Math.round(areaNum * 40);
  const signageEst = 150;
  const initialSuppliesEst = Math.round(300 + areaNum * 5);
  const permitCost = 15;
  const marketingInitial = 200;
  const posEquipment = 150;
  const contingency = Math.round(
    (depositEst + premiumEst + interiorEst + kitchenEst + furnitureEst + signageEst + initialSuppliesEst + permitCost + marketingInitial + posEquipment) * 0.1
  );
  const totalStartup =
    depositEst + premiumEst + interiorEst + kitchenEst + furnitureEst + signageEst + initialSuppliesEst + permitCost + marketingInitial + posEquipment + contingency;

  const monthlyFixed = rentEst + Math.round(areaNum * 3) + Math.round(areaNum * 1.5) + 30; // rent + utilities + misc + insurance

  const costBreakdown = [
    { name: "보증금", value: depositEst },
    { name: "권리금", value: premiumEst },
    { name: "인테리어", value: interiorEst },
    { name: "주방 설비", value: kitchenEst },
    { name: "가구/집기", value: furnitureEst },
    { name: "간판", value: signageEst },
    { name: "초기 식자재", value: initialSuppliesEst },
    { name: "인허가", value: permitCost },
    { name: "마케팅", value: marketingInitial },
    { name: "POS/장비", value: posEquipment },
    { name: "예비비(10%)", value: contingency },
  ];

  const handleCalculate = () => {
    if (areaNum > 0) setCalculated(true);
  };

  return (
    <div>
      {/* Input Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calculator size={20} className="text-blue-600" />
          창업 비용 계산기
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1.5 font-medium">업종 선택</label>
            <div className="relative">
              <select
                value={businessType}
                onChange={(e) => { setBusinessType(e.target.value); setCalculated(false); }}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 appearance-none bg-white"
              >
                {businessTypes.map((bt) => (
                  <option key={bt.value} value={bt.value}>{bt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5 font-medium">매장 크기 (평)</label>
            <input
              type="number"
              value={area}
              onChange={(e) => { setArea(e.target.value); setCalculated(false); }}
              placeholder="예: 20"
              min={1}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5 font-medium">지역 선택</label>
            <div className="relative">
              <select
                value={region}
                onChange={(e) => { setRegion(e.target.value); setCalculated(false); }}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 appearance-none bg-white"
              >
                {Object.entries(regionMultipliers).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1.5 font-medium">인테리어 등급</label>
            <div className="flex gap-2">
              {[
                { value: "basic", label: "기본" },
                { value: "mid", label: "중급" },
                { value: "premium", label: "고급" },
              ].map((g) => (
                <button
                  key={g.value}
                  onClick={() => { setInteriorGrade(g.value); setCalculated(false); }}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium border transition ${
                    interiorGrade === g.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={handleCalculate}
          disabled={areaNum <= 0}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          비용 계산하기
        </button>
      </div>

      {/* Results */}
      {calculated && areaNum > 0 && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign size={18} className="text-blue-600" />
                <span className="text-sm text-gray-500">총 예상 창업비용</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {totalStartup.toLocaleString()}<span className="text-lg text-gray-500 font-normal">만원</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">약 {(totalStartup / 10000).toFixed(1)}억원</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={18} className="text-green-600" />
                <span className="text-sm text-gray-500">월 고정비 예상</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {monthlyFixed.toLocaleString()}<span className="text-lg text-gray-500 font-normal">만원/월</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">임대료 + 관리비 + 공과금 + 보험</p>
            </div>
          </div>

          {/* Detail Table */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">비용 상세 내역</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-gray-500 font-medium">항목</th>
                    <th className="text-right py-2 px-3 text-gray-500 font-medium">예상 비용 (만원)</th>
                    <th className="text-right py-2 px-3 text-gray-500 font-medium">비율</th>
                  </tr>
                </thead>
                <tbody>
                  {costBreakdown.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-2.5 px-3 text-gray-700">{item.name}</td>
                      <td className="py-2.5 px-3 text-right text-gray-800 font-medium">
                        {item.value.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-gray-500">
                        {totalStartup > 0 ? ((item.value / totalStartup) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50">
                    <td className="py-3 px-3 font-bold text-blue-800">합계</td>
                    <td className="py-3 px-3 text-right font-bold text-blue-800">
                      {totalStartup.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-blue-800">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-xs text-gray-500">월 임대료 (예상)</span>
                <p className="text-lg font-bold text-gray-800">{rentEst.toLocaleString()}만원</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-xs text-gray-500">인테리어 단가</span>
                <p className="text-lg font-bold text-gray-800">{interiorPerPyeong.toLocaleString()}만원/평</p>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">비용 구성 비율</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={60}
                    paddingAngle={2}
                    label={(props: PieLabelRenderProps) =>
                      `${props.name ?? ""} ${(((props.percent as number) ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={{ strokeWidth: 1 }}
                  >
                    {costBreakdown.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${Number(value).toLocaleString()}만원`, ""]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <TipBox type="info">
            위 금액은 평균적인 추정치이며, 실제 비용은 입지, 건물 상태, 업체 선택 등에 따라 크게 달라질 수 있습니다.
            정확한 견적은 전문 업체 상담을 권장합니다.
          </TipBox>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Tab 4: 프랜차이즈 가이드
// ============================================================
function FranchiseTab() {
  const franchiseAccordion: AccordionItem[] = [
    {
      title: "프랜차이즈 vs 독립 창업 비교",
      content: (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-3 text-gray-500 font-medium">항목</th>
                <th className="text-center py-3 px-3 text-blue-600 font-medium">프랜차이즈</th>
                <th className="text-center py-3 px-3 text-green-600 font-medium">독립 창업</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["초기 비용", "높음 (가맹비+교육비+인테리어 지정)", "유동적 (본인 선택)"],
                ["브랜드 인지도", "높음 (기존 브랜드 활용)", "없음 (직접 구축 필요)"],
                ["메뉴 개발", "본사 제공 (변경 제한)", "자유로움"],
                ["마케팅", "본사 지원 + 개별 진행", "100% 자체 진행"],
                ["식자재 구매", "본사 지정 (가격 고정)", "자유 구매 (원가 절감 가능)"],
                ["운영 자유도", "낮음 (매뉴얼 준수)", "높음 (자유 운영)"],
                ["성공 확률", "상대적 높음 (검증된 모델)", "변동폭 큼"],
                ["로열티", "월 매출의 1~5%", "없음"],
                ["퇴점 리스크", "계약 해지 시 위약금", "자유로운 폐업"],
                ["인테리어", "본사 지정 업체/비용", "자유 선택"],
              ].map(([item, franchise, independent], idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-2.5 px-3 font-medium text-gray-700">{item}</td>
                  <td className="py-2.5 px-3 text-center text-gray-600">{franchise}</td>
                  <td className="py-2.5 px-3 text-center text-gray-600">{independent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      title: "프랜차이즈 선택 체크리스트 (10개 항목)",
      content: (
        <InteractiveChecklist
          items={[
            { id: "f1", label: "정보공개서 확인 (공정거래위원회 가맹사업정보제공시스템)", detail: <p>공정위 사이트에서 모든 프랜차이즈의 정보공개서를 무료로 열람할 수 있습니다. 가맹점 수, 폐업률, 매출 정보를 반드시 확인하세요.</p> },
            { id: "f2", label: "가맹점 수 추이 확인 (최근 3년간 증감)", detail: <p>가맹점이 급증하는 브랜드는 시장 포화 위험이 있고, 급감하는 브랜드는 운영 문제가 있을 수 있습니다.</p> },
            { id: "f3", label: "가맹점 평균 매출 확인", detail: <p>정보공개서에 기재된 평균 매출과 실제 가맹점 매출의 차이를 확인하세요. 직접 가맹점을 방문하여 점주와 대화하는 것이 가장 정확합니다.</p> },
            { id: "f4", label: "폐업률 확인 (3년 내 폐업 비율)", detail: <p>폐업률이 20%를 넘으면 주의가 필요합니다. 업종 평균과 비교해서 판단하세요.</p> },
            { id: "f5", label: "가맹비/교육비/로열티 상세 확인", detail: <p>가맹비 500~3,000만원, 교육비 100~500만원, 로열티 월 0~5%가 일반적입니다. 숨은 비용(인테리어 마진, 물류 마진)도 확인하세요.</p> },
            { id: "f6", label: "영업 지역 보호 범위 확인", detail: <p>반경 몇 미터 내 동일 브랜드 출점이 제한되는지 계약서에 명시되어 있는지 확인하세요. 영업지역 보호가 없으면 매우 위험합니다.</p> },
            { id: "f7", label: "본사 재무 상태 확인 (기업신용조회)", detail: <p>본사가 부도나면 가맹점도 큰 피해를 봅니다. NICE, KCB 등에서 기업 신용정보를 조회할 수 있습니다.</p> },
            { id: "f8", label: "기존 가맹점주 3곳 이상 직접 방문 인터뷰", detail: <p>본사가 추천하는 가맹점이 아닌, 직접 무작위로 선택한 가맹점을 방문하세요. 실제 수익, 본사 지원, 불만 사항을 솔직하게 들을 수 있습니다.</p> },
            { id: "f9", label: "계약 해지/양도 조건 확인", detail: <p>중도 해지 시 위약금, 가맹점 양도 가능 여부, 경업금지 기간 등을 반드시 확인하세요.</p> },
            { id: "f10", label: "인테리어 비용 적정성 검증 (시장가 대비)", detail: <p>본사 지정 인테리어 비용이 시장가 대비 30% 이상 비싸다면 재협상을 시도하세요.</p> },
          ]}
        />
      ),
    },
    {
      title: "가맹 계약 시 주의사항",
      content: (
        <div className="space-y-3">
          <TipBox type="warning">
            가맹 계약서에 서명하기 전, 반드시 14일간의 숙려 기간을 가져야 합니다 (가맹사업법). 이 기간에 변호사 검토를 받으세요.
          </TipBox>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <BadgeCheck size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <span><strong>정보공개서 수령:</strong> 계약 체결 14일 전에 정보공개서를 받아야 합니다. 미수령 시 계약 취소 가능.</span>
            </li>
            <li className="flex items-start gap-2">
              <BadgeCheck size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <span><strong>예상매출 서면 제시:</strong> 본사가 예상매출을 말했다면 반드시 서면으로 받으세요. 허위/과장 시 손해배상 청구 가능.</span>
            </li>
            <li className="flex items-start gap-2">
              <BadgeCheck size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <span><strong>영업지역 보호:</strong> 구체적인 보호 범위(반경 ○m 또는 행정구역)를 계약서에 명시.</span>
            </li>
            <li className="flex items-start gap-2">
              <BadgeCheck size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <span><strong>계약 기간:</strong> 최소 계약 기간은 없지만, 초기 투자금 회수를 고려하면 최소 3년 이상 권장.</span>
            </li>
            <li className="flex items-start gap-2">
              <BadgeCheck size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <span><strong>광고/판촉비 분담:</strong> 본사의 전국 광고비와 지역 마케팅 비용 분담 비율을 확인.</span>
            </li>
            <li className="flex items-start gap-2">
              <BadgeCheck size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <span><strong>필수품목 구매 의무:</strong> 본사 지정 식자재 구매 의무 범위와 가격 적정성 확인. 부당한 끼워팔기는 신고 가능.</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "정보공개서 확인 포인트",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            공정거래위원회 <strong>가맹사업정보제공시스템</strong> (franchise.ftc.go.kr)에서 무료 열람 가능
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: "가맹본부 일반현황", desc: "설립일, 대표자, 임원 변동, 소송 이력" },
              { title: "가맹점 현황", desc: "전국 가맹점 수, 지역별 분포, 개점/폐점 수" },
              { title: "가맹점 매출", desc: "면적별/지역별 평균 매출 (최근 3년)" },
              { title: "비용 내역", desc: "가맹비, 교육비, 보증금, 인테리어, 장비" },
              { title: "영업지역", desc: "영업지역 설정 기준, 보호 범위" },
              { title: "계약 조건", desc: "계약기간, 갱신 조건, 해지 사유, 위약금" },
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
                <h5 className="text-sm font-bold text-gray-700 mb-1">{item.title}</h5>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "프랜차이즈 비용 구조",
      content: (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">비용 항목</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">일반 범위</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">비고</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["가맹비", "500~3,000만원", "브랜드 사용권, 일회성"],
                  ["교육비", "100~500만원", "초기 교육, 일회성"],
                  ["보증금", "200~1,000만원", "계약 종료 시 반환"],
                  ["인테리어", "3,000~8,000만원", "본사 지정 업체, 평당 200~400만원"],
                  ["장비/설비", "1,000~3,000만원", "본사 지정 장비"],
                  ["간판/사인물", "200~500만원", "CI 규정에 따른 제작"],
                  ["초기 물류", "200~500만원", "오픈 물량"],
                  ["로열티", "월 매출 0~5%", "브랜드별 상이, 매월 납부"],
                  ["광고분담금", "월 10~30만원", "전국 광고비 분담"],
                ].map(([item, range, note], idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-2.5 px-3 font-medium text-gray-700">{item}</td>
                    <td className="py-2.5 px-3 text-right text-gray-800">{range}</td>
                    <td className="py-2.5 px-3 text-gray-500">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TipBox type="warning">
            &ldquo;가맹비 0원&rdquo; 프랜차이즈는 인테리어비, 물류 마진 등에서 비용을 회수하는 경우가 많습니다.
            총 투자비용을 기준으로 비교하세요.
          </TipBox>
        </div>
      ),
    },
    {
      title: "프랜차이즈 법적 보호 (가맹사업법 핵심)",
      content: (
        <div className="space-y-3">
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <Shield size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <strong>정보공개서 사전 제공 의무 (14일 전)</strong>
                <p className="text-gray-500 mt-0.5">미제공 시 가맹금 반환 청구 가능</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Shield size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <strong>허위/과장 정보 제공 금지</strong>
                <p className="text-gray-500 mt-0.5">예상매출을 과장하면 손해배상 및 가맹금 반환 청구 가능</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Shield size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <strong>부당한 영업지역 침해 금지</strong>
                <p className="text-gray-500 mt-0.5">정당한 사유 없이 영업지역 내 직영점/가맹점 추가 출점 금지</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Shield size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <strong>부당한 계약 해지 금지</strong>
                <p className="text-gray-500 mt-0.5">2개월 이상의 유예기간 부여 후에만 계약 해지 가능</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Shield size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <strong>가맹점 단체 구성권</strong>
                <p className="text-gray-500 mt-0.5">가맹점사업자단체를 구성하여 본사와 협의할 수 있는 권리 보장</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Shield size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <strong>분쟁 조정</strong>
                <p className="text-gray-500 mt-0.5">한국공정거래조정원에 분쟁 조정 신청 가능 (무료)</p>
              </div>
            </li>
          </ul>
          <TipBox type="info">
            가맹사업 관련 상담: 공정거래위원회 (국번없이 1372) 또는 한국공정거래조정원 (02-2023-8199)
          </TipBox>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Building2 size={20} className="text-blue-600" />
          프랜차이즈 창업 가이드
        </h2>
        <p className="text-sm text-gray-500">
          프랜차이즈 가맹 계약 전 반드시 확인해야 할 사항들을 정리했습니다
        </p>
      </div>
      <Accordion items={franchiseAccordion} />
    </div>
  );
}

// ============================================================
// Tab 5: 세금/노무 가이드
// ============================================================
function TaxTab() {
  const taxAccordion: AccordionItem[] = [
    {
      title: "간이과세 vs 일반과세 차이",
      content: (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-3 text-gray-500 font-medium">구분</th>
                  <th className="text-center py-3 px-3 text-blue-600 font-medium">간이과세자</th>
                  <th className="text-center py-3 px-3 text-green-600 font-medium">일반과세자</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["기준", "연 매출 8,000만원 미만", "연 매출 8,000만원 이상"],
                  ["부가세율", "업종별 부가가치율 적용 (1.5~4%)", "10% (매입세액 공제 가능)"],
                  ["세금계산서", "발행 불가 (4,800만원 미만)", "발행 가능 (필수)"],
                  ["신고 횟수", "연 1회 (1월)", "연 2회 (1월, 7월)"],
                  ["매입세액 공제", "일부만 공제 (0.5%)", "전액 공제"],
                  ["장부 의무", "간편장부", "복식부기 (매출 규모별)"],
                  ["유리한 경우", "소규모, 현금 거래 비중 높을 때", "인테리어 등 초기 투자 클 때"],
                ].map(([item, simple, general], idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-2.5 px-3 font-medium text-gray-700">{item}</td>
                    <td className="py-2.5 px-3 text-center text-gray-600 text-xs">{simple}</td>
                    <td className="py-2.5 px-3 text-center text-gray-600 text-xs">{general}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TipBox type="tip">
            창업 초기에 인테리어/장비 등 큰 투자가 있으면 <strong>일반과세자</strong>로 시작하는 것이 유리합니다.
            매입세액(부가세 10%)을 전액 환급받을 수 있기 때문입니다.
          </TipBox>
          <TipBox type="info">
            간이과세에서 일반과세로의 전환은 세무서에 신청 가능합니다. 단, 일반 &rarr; 간이 전환은 매출 요건 충족 시 자동 전환됩니다.
          </TipBox>
        </div>
      ),
    },
    {
      title: "부가세 신고 방법/시기",
      content: (
        <div className="space-y-4">
          <h5 className="text-sm font-bold text-gray-700">일반과세자 신고 일정</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-4">
              <h6 className="font-bold text-blue-800 text-sm mb-1">1기 확정 (1~6월분)</h6>
              <p className="text-sm text-blue-700">신고기한: 7월 25일까지</p>
              <p className="text-xs text-blue-600 mt-1">예정신고: 4월 25일 (1~3월분)</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h6 className="font-bold text-green-800 text-sm mb-1">2기 확정 (7~12월분)</h6>
              <p className="text-sm text-green-700">신고기한: 다음해 1월 25일까지</p>
              <p className="text-xs text-green-600 mt-1">예정신고: 10월 25일 (7~9월분)</p>
            </div>
          </div>
          <h5 className="text-sm font-bold text-gray-700 mt-4">부가세 절감 팁</h5>
          <ul className="text-sm text-gray-600 space-y-1.5">
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
              모든 매입은 세금계산서 또는 카드 결제로 증빙
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
              사업용 신용카드를 홈택스에 등록 (자동 매입세액 집계)
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
              의제매입세액 공제 활용 (농산물 등 면세 원재료 구매 시)
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
              사업 관련 모든 지출 영수증 보관 (5년)
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "종합소득세 가이드",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            매년 5월 1일~31일까지 전년도 소득에 대해 신고·납부
          </p>
          <h5 className="text-sm font-bold text-gray-700">소득세율 (2026년 기준)</h5>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">과세표준</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">세율</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">누진공제</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["1,400만원 이하", "6%", "-"],
                  ["1,400~5,000만원", "15%", "126만원"],
                  ["5,000~8,800만원", "24%", "576만원"],
                  ["8,800만원~1.5억", "35%", "1,544만원"],
                  ["1.5억~3억", "38%", "1,994만원"],
                  ["3억~5억", "40%", "2,594만원"],
                  ["5억~10억", "42%", "3,594만원"],
                  ["10억 초과", "45%", "6,594만원"],
                ].map(([bracket, rate, deduction], idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-2 px-3 text-gray-700">{bracket}</td>
                    <td className="py-2 px-3 text-right text-gray-800 font-medium">{rate}</td>
                    <td className="py-2 px-3 text-right text-gray-600">{deduction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TipBox type="tip">
            매출 2,400만원 미만이면 단순경비율, 2,400만원 이상이면 기준경비율이 적용됩니다. 장부를 기장하면 더 많은 경비를 인정받을 수 있습니다.
          </TipBox>
        </div>
      ),
    },
    {
      title: "직원 채용 시 필수 사항",
      content: (
        <div className="space-y-4">
          <SubHeading icon={Users}>채용 필수 체크리스트</SubHeading>
          <InteractiveChecklist
            items={[
              {
                id: "t4-1",
                label: "근로계약서 서면 작성 (미작성 시 과태료 500만원)",
                detail: (
                  <div>
                    <p className="mb-1">필수 기재 사항:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>임금 (시급/월급, 지급일, 계산방법)</li>
                      <li>근로시간 (시작/종료, 휴게시간)</li>
                      <li>휴일 (주휴일, 유급/무급)</li>
                      <li>업무 내용 및 장소</li>
                      <li>계약 기간 (기간제의 경우)</li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">고용노동부 표준근로계약서 양식을 활용하세요.</p>
                  </div>
                ),
              },
              {
                id: "t4-2",
                label: "4대보험 가입 (채용 후 14일 이내)",
                detail: (
                  <div>
                    <p>사업주 부담 비율:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>국민연금: 4.5%</li>
                      <li>건강보험: 3.545% (장기요양보험 포함 약 4.0%)</li>
                      <li>고용보험: 0.9%</li>
                      <li>산재보험: 업종별 상이 (음식점 약 0.7%)</li>
                    </ul>
                    <p className="font-medium mt-1">총 사업주 부담: 약 9.5~10%</p>
                  </div>
                ),
              },
              {
                id: "t4-3",
                label: "최저임금 준수 (2026년 시급 10,030원)",
                detail: (
                  <div>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>월급 환산: 10,030 x 209시간 = 2,096,270원 (주 40시간, 주휴 포함)</li>
                      <li>주휴수당: 주 15시간 이상 근무 시 발생</li>
                      <li>최저임금 미달 시 3년 이하 징역 또는 2,000만원 이하 벌금</li>
                    </ul>
                  </div>
                ),
              },
              {
                id: "t4-4",
                label: "건강진단서(보건증) 확인",
                detail: <p>음식점 종사자는 건강진단서 필수. 채용 전 발급받은 것으로 확인하거나, 채용 후 즉시 발급받도록 하세요.</p>,
              },
              {
                id: "t4-5",
                label: "임금대장 및 근로자명부 비치",
                detail: <p>5인 미만 사업장도 근로기준법 일부가 적용됩니다. 임금대장은 3년간 보관 의무가 있습니다.</p>,
              },
            ]}
          />
        </div>
      ),
    },
    {
      title: "아르바이트 관리 팁",
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-bold text-sm text-blue-800 mb-2">주휴수당 계산</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>- 주 15시간 이상 근무 시 발생</li>
                <li>- 해당 주 개근 조건</li>
                <li>- 1일 소정근로시간 x 시급</li>
                <li>- 예: 주5일 4시간 = 시급 x 4시간</li>
              </ul>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <h5 className="font-bold text-sm text-amber-800 mb-2">야간/휴일 수당</h5>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>- 야간 (22시~06시): 50% 가산</li>
                <li>- 휴일 근무: 50% 가산</li>
                <li>- 연장 근무: 50% 가산</li>
                <li>- 5인 미만 사업장은 가산수당 미적용</li>
              </ul>
            </div>
          </div>
          <TipBox type="warning">
            단시간 근로자(주 15시간 미만)도 근로계약서 작성은 필수입니다. 다만 주휴수당, 연차유급휴가는 적용되지 않습니다.
          </TipBox>
          <h5 className="text-sm font-bold text-gray-700">효율적인 인력 관리</h5>
          <ul className="text-sm text-gray-600 space-y-1.5">
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
              시간대별 매출 분석으로 최적 인력 배치 (피크타임 집중)
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
              근태관리 앱 활용 (출퇴근 기록 자동화)
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
              명확한 업무 매뉴얼로 교육 시간 단축
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
              급여 명세서 교부 의무 (2021년부터 시행)
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "세금 절약 팁",
      content: (
        <div className="space-y-4">
          <SubHeading icon={DollarSign}>경비 처리 가능 항목</SubHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: "임대료/관리비", items: ["매장 임대료", "관리비", "주차장 임대료"] },
              { title: "인건비", items: ["직원 급여", "4대보험 사업주 부담", "퇴직금"] },
              { title: "재료비", items: ["식자재 구매비", "소모품 (포장재, 냅킨 등)", "음료/주류 구매비"] },
              { title: "운영비", items: ["수도/전기/가스 요금", "통신비 (매장 전화, 인터넷)", "보험료 (화재, 배상)"] },
              { title: "감가상각비", items: ["인테리어 비용 (5년 상각)", "주방 설비/장비", "가구/집기"] },
              { title: "마케팅비", items: ["배달앱 수수료/광고비", "SNS 광고비", "전단지/현수막 제작비"] },
            ].map((cat, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
                <h5 className="text-sm font-bold text-gray-700 mb-2">{cat.title}</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {cat.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle size={12} className="text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <SubHeading icon={Lightbulb}>추가 절세 전략</SubHeading>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <span><strong>사업용 카드/계좌 분리:</strong> 개인 지출과 사업 지출을 분리하면 경비 증빙이 명확해집니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <span><strong>노란우산공제 가입:</strong> 연 최대 500만원 소득공제. 폐업 시 퇴직금 성격의 공제금 수령 가능.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <span><strong>중소기업특별세액감면:</strong> 음식점업은 5년간 소득세 5~30% 감면 (수도권 10%, 비수도권 30%).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">4</span>
              <span><strong>의제매입세액 공제:</strong> 면세 농산물 등 구매 시 일정 비율 부가세 공제 (음식점 8/108 또는 6/106).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">5</span>
              <span><strong>두루누리 사회보험:</strong> 10인 미만 사업장, 월 보수 270만원 미만 근로자의 4대보험료 80% 지원.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">6</span>
              <span><strong>세무사 기장 대리:</strong> 월 10~20만원이지만, 절세 효과가 비용 이상인 경우가 대부분입니다.</span>
            </li>
          </ul>
          <TipBox type="warning">
            현금 매출을 누락하면 가산세(무신고 20%, 부정 40%) + 세무조사 대상이 될 수 있습니다. 모든 매출을 성실하게 신고하세요.
          </TipBox>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Receipt size={20} className="text-blue-600" />
          세금 & 노무 관리 가이드
        </h2>
        <p className="text-sm text-gray-500">
          외식업 운영에 필요한 세금 신고, 직원 관리, 절세 전략을 안내합니다
        </p>
      </div>
      <Accordion items={taxAccordion} />
    </div>
  );
}
