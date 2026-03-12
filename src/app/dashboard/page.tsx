"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle, Circle, Search, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { storesStorage, analysesStorage, actionsStorage } from "@/lib/storage";
import type { Store, Analysis, Action } from "@/lib/storage";
import { generateAnalysis, generateScoreHistory, generateMarketingStats } from "@/lib/analysis-engine";
import { ScoreGauge } from "@/components/ui/score-gauge";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const planLabels: Record<string, string> = {
  free: "무료",
  pro: "프로",
  business: "비즈니스",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [actions, setActions] = useState<Action[]>([]);
  const [scoreHistory, setScoreHistory] = useState<{ week: string; score: number }[]>([]);
  const [quickUrl, setQuickUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recentAnalyses, setRecentAnalyses] = useState<{ name: string; score: number }[]>([]);
  const [marketingData, setMarketingData] = useState<ReturnType<typeof generateMarketingStats> | null>(null);

  const runAnalysis = useCallback((targetStore: Store, userId: string) => {
    const result = generateAnalysis({
      businessName: targetStore.name,
      category: targetStore.category,
      location: targetStore.address,
      naverPlaceUrl: targetStore.naverPlaceUrl,
    });

    const saved = analysesStorage.create(userId, {
      storeId: targetStore.id,
      score: result.totalScore,
      grade: result.grade,
      breakdown: result.breakdown,
    });

    // Save improvement actions
    result.improvements.forEach((action) => {
      actionsStorage.create(targetStore.id, {
        analysisId: saved.id,
        title: action.title,
        category: action.category,
        impact: action.impact,
        difficulty: action.difficulty,
        description: action.description,
      });
    });

    return saved;
  }, []);

  useEffect(() => {
    if (!user) return;

    // Get or create store
    let stores = storesStorage.getAll(user.id);
    let currentStore: Store;

    if (stores.length === 0) {
      currentStore = storesStorage.create(user.id, {
        name: user.businessName || `${user.name}의 매장`,
        category: user.businessCategory || "카페/디저트",
        address: user.location || "서울 강남구",
        naverPlaceUrl: user.naverPlaceUrl || "",
      });
    } else {
      currentStore = stores[0];
    }
    setStore(currentStore);

    // Get or create analysis
    const allAnalyses = analysesStorage.getByStoreId(user.id, currentStore.id);
    let latestAnalysis: Analysis;

    if (allAnalyses.length === 0) {
      latestAnalysis = runAnalysis(currentStore, user.id);
    } else {
      latestAnalysis = allAnalyses[allAnalyses.length - 1];
    }
    setAnalysis(latestAnalysis);

    // Load actions
    const storeActions = actionsStorage.getAll(currentStore.id);
    setActions(storeActions);

    // Generate score history
    setScoreHistory(generateScoreHistory(latestAnalysis.score));

    // Generate marketing stats
    setMarketingData(generateMarketingStats({
      businessName: currentStore.name,
      category: currentStore.category,
      location: currentStore.address,
    }));

    // Build recent analyses list
    const allUserAnalyses = analysesStorage.getAll(user.id);
    const recent = allUserAnalyses.slice(-3).reverse().map((a) => {
      const s = storesStorage.getById(user.id, a.storeId);
      return { name: s?.name || "매장", score: a.score };
    });
    setRecentAnalyses(recent);
  }, [user, runAnalysis]);

  const handleReanalyze = () => {
    if (!user || !store) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const newAnalysis = runAnalysis(store, user.id);
      setAnalysis(newAnalysis);
      setActions(actionsStorage.getAll(store.id));
      setScoreHistory(generateScoreHistory(newAnalysis.score));

      const allUserAnalyses = analysesStorage.getAll(user.id);
      const recent = allUserAnalyses.slice(-3).reverse().map((a) => {
        const s = storesStorage.getById(user.id, a.storeId);
        return { name: s?.name || "매장", score: a.score };
      });
      setRecentAnalyses(recent);
      setIsAnalyzing(false);
    }, 500);
  };

  const handleQuickAnalysis = () => {
    if (!user || !quickUrl.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      // Use store data as base for quick analysis
      const stores = storesStorage.getAll(user.id);
      const baseStore = stores[0];

      const result = generateAnalysis({
        businessName: baseStore?.name || "분석 매장",
        category: baseStore?.category || "카페/디저트",
        location: baseStore?.address || "서울 강남구",
        naverPlaceUrl: quickUrl,
      });

      // Create a temporary store for this URL analysis
      const tempStore = storesStorage.create(user.id, {
        name: `분석 - ${quickUrl.substring(0, 30)}`,
        category: baseStore?.category || "카페/디저트",
        address: baseStore?.address || "서울 강남구",
        naverPlaceUrl: quickUrl,
      });

      analysesStorage.create(user.id, {
        storeId: tempStore.id,
        score: result.totalScore,
        grade: result.grade,
        breakdown: result.breakdown,
      });

      // Update recent analyses
      const allUserAnalyses = analysesStorage.getAll(user.id);
      const recent = allUserAnalyses.slice(-3).reverse().map((a) => {
        const s = storesStorage.getById(user.id, a.storeId);
        return { name: s?.name || "매장", score: a.score };
      });
      setRecentAnalyses(recent);
      setQuickUrl("");
      setIsAnalyzing(false);
    }, 500);
  };

  const handleToggleAction = (actionId: string) => {
    if (!store) return;
    const updated = actionsStorage.toggleComplete(store.id, actionId);
    if (updated) {
      setActions(actionsStorage.getAll(store.id));
    }
  };

  if (!user || !store || !analysis) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const completedCount = actions.filter((a) => a.completed).length;
  const previousScore = scoreHistory.length >= 2 ? scoreHistory[scoreHistory.length - 2]?.score : analysis.score;
  const scoreDiff = analysis.score - (previousScore ?? analysis.score);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold">안녕하세요, {user.name}님!</h2>
        <p className="text-gray-500 mt-1">
          등록 매장: {storesStorage.getAll(user.id).length}개 | 구독: {planLabels[user.plan] || user.plan} | 마지막 분석: {new Date(analysis.createdAt).toLocaleDateString("ko-KR")}
        </p>
      </div>

      {/* Store Summary + Quick Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Store Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">{store.name}</h3>
              <p className="text-sm text-gray-500">{store.category} | {store.address}</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp size={16} className={scoreDiff >= 0 ? "text-green-500" : "text-red-500"} />
              <span className={`font-medium ${scoreDiff >= 0 ? "text-green-600" : "text-red-600"}`}>
                {scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff}점
              </span>
              <span className="text-gray-400">지난주 대비</span>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <ScoreGauge score={analysis.score} size={160} />

            <div className="flex-1">
              <h4 className="font-medium mb-3">점수 변화 추이</h4>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scoreHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <YAxis domain={[40, 100]} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#2563eb" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Link
              href="/dashboard/analysis"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              상세 보기
            </Link>
            <button
              onClick={handleReanalyze}
              disabled={isAnalyzing}
              className="border border-gray-200 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
            >
              {isAnalyzing ? "분석 중..." : "재분석하기"}
            </button>
          </div>
        </div>

        {/* Quick Analysis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold mb-4">빠른 분석</h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              placeholder="네이버 플레이스 URL..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              onKeyDown={(e) => e.key === "Enter" && handleQuickAnalysis()}
            />
          </div>
          <button
            onClick={handleQuickAnalysis}
            disabled={isAnalyzing || !quickUrl.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isAnalyzing ? "분석 중..." : "분석하기"}
          </button>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-500 mb-3">최근 분석</h4>
            <div className="space-y-3">
              {recentAnalyses.length > 0 ? (
                recentAnalyses.map((ra, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="truncate">{ra.name}</span>
                    <span className={`font-medium ${
                      ra.score >= 75 ? "text-green-600" :
                      ra.score >= 60 ? "text-blue-600" :
                      "text-amber-600"
                    }`}>{ra.score}점</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">분석 기록이 없습니다</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Todo + Marketing Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Todo */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">오늘의 할 일</h3>
            <span className="text-sm text-gray-400">
              {completedCount}/{actions.length} 완료
            </span>
          </div>
          <div className="space-y-3">
            {actions.slice(0, 5).map((action) => (
              <button
                key={action.id}
                onClick={() => handleToggleAction(action.id)}
                className={`flex items-start gap-3 p-3 rounded-lg w-full text-left ${
                  action.completed ? "bg-gray-50" : "bg-blue-50/50"
                }`}
              >
                {action.completed ? (
                  <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                ) : (
                  <Circle size={18} className="text-gray-300 mt-0.5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${action.completed ? "line-through text-gray-400" : ""}`}>
                    {action.title}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {action.category} | 예상 효과: +{action.impact}점
                  </div>
                </div>
              </button>
            ))}
            {actions.length === 0 && (
              <p className="text-sm text-gray-400 py-4 text-center">개선 항목이 없습니다</p>
            )}
          </div>
        </div>

        {/* Marketing Quick View */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">마케팅 성과 요약</h3>
            <Link href="/dashboard/marketing" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              자세히 <ArrowUpRight size={14} />
            </Link>
          </div>

          {marketingData ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">네이버 노출 순위</div>
                  <div className="text-2xl font-bold text-blue-600">{marketingData.keywordRankings[0]?.rank || "-"}위</div>
                  <div className="text-xs text-green-600 mt-1">
                    {marketingData.keywordRankings[0]?.change > 0 ? `+${marketingData.keywordRankings[0].change}위 상승` :
                     marketingData.keywordRankings[0]?.change < 0 ? `${marketingData.keywordRankings[0].change}위 하락` :
                     "변동 없음"}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">이번 주 검색 유입</div>
                  <div className="text-2xl font-bold text-green-600">{marketingData.summary.clicks}건</div>
                  <div className="text-xs text-green-600 mt-1">
                    {marketingData.summary.clicksChange > 0 ? `+${marketingData.summary.clicksChange}%` : `${marketingData.summary.clicksChange}%`} vs 전주
                  </div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">저장(찜) 수</div>
                  <div className="text-2xl font-bold text-amber-600">{marketingData.summary.saves}</div>
                  <div className="text-xs text-green-600 mt-1">
                    {marketingData.summary.savesChange > 0 ? `+${marketingData.summary.savesChange}` : marketingData.summary.savesChange} 이번 주
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">검색 노출</div>
                  <div className="text-2xl font-bold text-purple-600">{marketingData.summary.impressions.toLocaleString()}</div>
                  <div className="text-xs text-green-600 mt-1">
                    {marketingData.summary.impressionsChange > 0 ? `+${marketingData.summary.impressionsChange}%` : `${marketingData.summary.impressionsChange}%`} vs 전주
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">키워드 순위 변화</h4>
                <div className="space-y-2">
                  {marketingData.keywordRankings.slice(0, 3).map((kw) => (
                    <div key={kw.keyword} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 truncate">{kw.keyword}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{kw.rank}위</span>
                        <span className={`text-xs ${kw.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                          {kw.change >= 0 ? `+${kw.change}` : kw.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
