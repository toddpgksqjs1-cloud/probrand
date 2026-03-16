"use client";

import { useState, useEffect } from "react";
import { Download, Share2, CheckCircle, Circle, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { storesStorage, analysesStorage, actionsStorage } from "@/lib/storage";
import type { Store, Analysis, Action } from "@/lib/storage";
import { generateAnalysis } from "@/lib/analysis-engine";
import { ScoreGauge } from "@/components/ui/score-gauge";
import { ProgressBar } from "@/components/ui/progress-bar";

const categoryColorMap: Record<string, string> = {
  "리뷰 관리": "#f59e0b",
  "사진": "#ef4444",
  "기본정보": "#10b981",
  "키워드 최적화": "#8b5cf6",
  "메뉴/상품": "#2563eb",
  "영업시간/편의": "#06b6d4",
};

const categoryTips: Record<string, string> = {
  "리뷰 관리": "리뷰 답변율이 높을수록 신뢰도가 올라갑니다. 부정 리뷰에도 정중하게 답변하세요.",
  "사진": "밝은 자연광 사진이 클릭률 2.3배 높습니다. 대표사진은 매장 전경 또는 시그니처 메뉴가 효과적이에요.",
  "기본정보": "기본정보가 완전할수록 네이버 검색 노출이 유리합니다. 전화번호, 주소, 카테고리를 빠짐없이 등록하세요.",
  "키워드 최적화": "소개글에 지역명+업종 키워드를 자연스럽게 포함시키세요. 검색 상위 노출 확률이 3배 높아집니다.",
  "메뉴/상품": "메뉴에 사진과 가격을 등록하면 고객의 방문 결정률이 35% 증가합니다.",
  "영업시간/편의": "정확한 영업시간 등록은 고객 신뢰의 기본입니다. 브레이크타임과 휴무일도 반드시 등록하세요.",
};

const breakdownKeyToCategory: Record<string, string> = {
  review: "리뷰 관리",
  photo: "사진",
  basicInfo: "기본정보",
  keyword: "키워드 최적화",
  menu: "메뉴/상품",
  hours: "영업시간/편의",
};

interface BreakdownItem {
  category: string;
  score: number;
  max: number;
  color: string;
}

export default function AnalysisPage() {
  const { user } = useAuth();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [actions, setActions] = useState<Action[]>([]);
  const [breakdownItems, setBreakdownItems] = useState<BreakdownItem[]>([]);

  useEffect(() => {
    if (!user) return;

    const stores = storesStorage.getAll(user.id);
    if (stores.length === 0) return;
    const currentStore = stores[0];
    setStore(currentStore);

    const allAnalyses = analysesStorage.getByStoreId(user.id, currentStore.id);
    if (allAnalyses.length === 0) return; // No analysis yet

    const latestAnalysis = allAnalyses[allAnalyses.length - 1];

    setAnalysis(latestAnalysis);

    // Build breakdown items from the analysis
    const bd = latestAnalysis.breakdown;
    const items: BreakdownItem[] = Object.entries(bd).map(([key, val]) => {
      const catName = breakdownKeyToCategory[key] || key;
      return {
        category: catName,
        score: (val as any).score,
        max: (val as any).max,
        color: categoryColorMap[catName] || "#2563eb",
      };
    });
    setBreakdownItems(items);

    // Load actions
    const storeActions = actionsStorage.getAll(currentStore.id);
    setActions(storeActions);
  }, [user]);

  const handleToggleAction = (actionId: string) => {
    if (!store) return;
    const updated = actionsStorage.toggleComplete(store.id, actionId);
    if (updated) {
      setActions(actionsStorage.getAll(store.id));
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!store || !analysis) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Download size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">분석 결과가 없습니다</h2>
          <p className="text-gray-500 mb-6">대시보드에서 먼저 분석을 실행해주세요.</p>
          <a href="/dashboard" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            대시보드로 이동
          </a>
        </div>
      </div>
    );
  }

  const categoryActions = (category: string) =>
    actions.filter((a) => a.category === category);

  const incompleteActions = actions.filter((a) => !a.completed);
  const potentialGain = incompleteActions.reduce((sum, a) => sum + a.impact, 0);
  const projectedScore = Math.min(100, analysis.score + potentialGain);

  function getGradeLabel(score: number) {
    if (score >= 90) return "S등급";
    if (score >= 75) return "A등급";
    if (score >= 60) return "B등급";
    if (score >= 40) return "C등급";
    return "D등급";
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">네이버 플레이스 분석 결과</h2>
            <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">시뮬레이션</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {store.name} | 분석일: {new Date(analysis.createdAt).toLocaleDateString("ko-KR")}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">* 실제 네이버 크롤링이 아닌 시뮬레이션 기반 분석입니다</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition">
            <Download size={16} /> 리포트 다운로드
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition">
            <Share2 size={16} /> 공유하기
          </button>
        </div>
      </div>

      {/* Score Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <h3 className="text-lg font-bold mb-6">종합 점수</h3>
        <ScoreGauge score={analysis.score} size={200} strokeWidth={14} />
      </div>

      {/* Score Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold mb-6">항목별 상세</h3>
        <div className="space-y-4">
          {breakdownItems.map((item) => {
            const isExpanded = expandedCategory === item.category;
            const catActions = categoryActions(item.category);
            const percentage = (item.score / item.max) * 100;
            let status = "text-green-600";
            if (percentage < 50) status = "text-red-600";
            else if (percentage < 75) status = "text-amber-600";

            return (
              <div key={item.category}>
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : item.category)}
                  className="w-full"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{item.category}</span>
                      <span className={`text-sm font-bold ${status}`}>
                        {item.score}/{item.max}
                      </span>
                      {percentage < 60 && (
                        <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded">
                          개선 필요
                        </span>
                      )}
                    </div>
                    {catActions.length > 0 && (
                      isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />
                    )}
                  </div>
                  <ProgressBar
                    value={item.score}
                    max={item.max}
                    color={item.color}
                    showValue={false}
                  />
                </button>

                {isExpanded && catActions.length > 0 && (
                  <div className="mt-4 ml-4 p-4 bg-gray-50 rounded-lg space-y-4">
                    {percentage < 75 && categoryTips[item.category] && (
                      <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg mb-3">
                        <Lightbulb size={16} className="text-amber-500 mt-0.5 shrink-0" />
                        <div className="text-sm">
                          <span className="font-medium">개선 팁:</span>{" "}
                          {categoryTips[item.category]}
                        </div>
                      </div>
                    )}

                    {catActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={(e) => { e.stopPropagation(); handleToggleAction(action.id); }}
                        className="flex items-start gap-3 w-full text-left"
                      >
                        {action.completed ? (
                          <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                        ) : (
                          <Circle size={18} className="text-gray-300 mt-0.5 shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${action.completed ? "line-through text-gray-400" : ""}`}>
                            {action.title}
                            <span className="text-blue-600 ml-2">(+{action.impact}점)</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Before/After Simulation */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold mb-4">Before/After 시뮬레이션</h3>
        <div className="flex items-center justify-center gap-8 py-6">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">현재</div>
            <div className="text-4xl font-bold text-gray-700">{analysis.score}점</div>
            <div className="text-sm text-blue-600 mt-1">{getGradeLabel(analysis.score)}</div>
          </div>
          <div className="text-3xl text-gray-300">&rarr;</div>
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">예상</div>
            <div className="text-4xl font-bold text-green-600">{projectedScore}점</div>
            <div className="text-sm text-green-600 mt-1">{getGradeLabel(projectedScore)}</div>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500">
          남은 개선 항목을 모두 완료하면 <span className="font-medium text-green-600">+{potentialGain}점</span> 개선 예상
        </p>
      </div>
    </div>
  );
}
