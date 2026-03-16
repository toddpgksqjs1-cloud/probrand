"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Eye, MousePointer, MapPin, Phone } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { storesStorage, analysesStorage } from "@/lib/storage";
import { generateMarketingStats, generateAnalysis } from "@/lib/analysis-engine";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export default function MarketingPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ReturnType<typeof generateMarketingStats> | null>(null);
  const [storeName, setStoreName] = useState("");
  const [storeScore, setStoreScore] = useState(0);
  const [competitors, setCompetitors] = useState<{ name: string; score: number; grade: string; strengths: string[] }[]>([]);

  useEffect(() => {
    if (!user) return;

    const stores = storesStorage.getAll(user.id);
    const store = stores[0];
    if (!store) return;

    setStoreName(store.name);

    // Get the latest analysis for score
    const analyses = analysesStorage.getByStoreId(user.id, store.id);

    // Generate analysis result to get competitors
    const analysisResult = generateAnalysis({
      businessName: store.name,
      category: store.category,
      location: store.address,
      naverPlaceUrl: store.naverPlaceUrl,
    });

    if (analyses.length > 0) {
      const latest = analyses[analyses.length - 1];
      setStoreScore(latest.score);
    } else {
      setStoreScore(analysisResult.totalScore);
    }

    setCompetitors(analysisResult.competitors);

    // Generate marketing stats
    const mktStats = generateMarketingStats({
      businessName: store.name,
      category: store.category,
      location: store.address,
    });
    setStats(mktStats);
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Eye size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">마케팅 데이터가 없습니다</h2>
          <p className="text-gray-500 mb-6">먼저 매장을 등록하고 분석을 실행해주세요.</p>
          <a href="/dashboard" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            대시보드로 이동
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Eye size={16} /> 주간 검색 노출
          </div>
          <div className="text-2xl font-bold">{stats.summary.impressions.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-xs mt-1">
            {stats.summary.impressionsChange >= 0 ? (
              <span className="text-green-600 flex items-center gap-1"><TrendingUp size={12} /> +{stats.summary.impressionsChange}% vs 전주</span>
            ) : (
              <span className="text-red-500 flex items-center gap-1"><TrendingDown size={12} /> {stats.summary.impressionsChange}% vs 전주</span>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <MousePointer size={16} /> 주간 클릭 수
          </div>
          <div className="text-2xl font-bold">{stats.summary.clicks.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-xs mt-1">
            {stats.summary.clicksChange >= 0 ? (
              <span className="text-green-600 flex items-center gap-1"><TrendingUp size={12} /> +{stats.summary.clicksChange}% vs 전주</span>
            ) : (
              <span className="text-red-500 flex items-center gap-1"><TrendingDown size={12} /> {stats.summary.clicksChange}% vs 전주</span>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Phone size={16} /> 전화 문의
          </div>
          <div className="text-2xl font-bold">{stats.summary.calls}</div>
          <div className="flex items-center gap-1 text-xs mt-1">
            {stats.summary.callsChange >= 0 ? (
              <span className="text-green-600 flex items-center gap-1"><TrendingUp size={12} /> +{stats.summary.callsChange}% vs 전주</span>
            ) : (
              <span className="text-red-500 flex items-center gap-1"><TrendingDown size={12} /> {stats.summary.callsChange}% vs 전주</span>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <MapPin size={16} /> 저장(찜) 수
          </div>
          <div className="text-2xl font-bold">{stats.summary.saves}</div>
          <div className="flex items-center gap-1 text-xs mt-1">
            {stats.summary.savesChange >= 0 ? (
              <span className="text-green-600 flex items-center gap-1"><TrendingUp size={12} /> +{stats.summary.savesChange} 이번 주</span>
            ) : (
              <span className="text-red-500 flex items-center gap-1"><TrendingDown size={12} /> {stats.summary.savesChange} 이번 주</span>
            )}
          </div>
        </div>
      </div>

      {/* Keyword Rankings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold">네이버 키워드 순위</h3>
          <p className="text-sm text-gray-500 mt-1">내 매장의 네이버 검색 순위를 추적합니다</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-sm text-gray-500">
              <tr>
                <th className="text-left px-6 py-3 font-medium">키워드</th>
                <th className="text-center px-6 py-3 font-medium">현재 순위</th>
                <th className="text-center px-6 py-3 font-medium">변동</th>
                <th className="text-center px-6 py-3 font-medium">최고 순위</th>
                <th className="text-right px-6 py-3 font-medium">월 검색량</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.keywordRankings.map((kw) => (
                <tr key={kw.keyword} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{kw.keyword}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-lg font-bold ${
                      kw.rank <= 5 ? "text-green-600" :
                      kw.rank <= 10 ? "text-blue-600" :
                      kw.rank <= 20 ? "text-amber-600" :
                      "text-gray-400"
                    }`}>
                      {kw.rank}위
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {kw.change > 0 ? (
                      <span className="flex items-center justify-center gap-1 text-sm text-green-600">
                        <TrendingUp size={14} /> {kw.change}
                      </span>
                    ) : kw.change < 0 ? (
                      <span className="flex items-center justify-center gap-1 text-sm text-red-500">
                        <TrendingDown size={14} /> {Math.abs(kw.change)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">{kw.bestRank}위</td>
                  <td className="px-6 py-4 text-right text-sm text-gray-500">
                    {kw.volume.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Search Trend Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold mb-6">검색 노출/클릭 추이</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="impressions" name="검색 노출" stroke="#2563eb" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="clicks" name="클릭 수" stroke="#10b981" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="calls" name="전화 문의" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Competitor Comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold mb-4">경쟁 매장 비교</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-4 py-3 font-medium">매장명</th>
                <th className="text-center px-4 py-3 font-medium">마케팅 점수</th>
                <th className="text-center px-4 py-3 font-medium">등급</th>
                <th className="text-left px-4 py-3 font-medium">강점</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-blue-50/50">
                <td className="px-4 py-3 font-medium">
                  {storeName} <span className="text-xs text-blue-600">(내 매장)</span>
                </td>
                <td className="px-4 py-3 text-center font-bold text-blue-600">{storeScore}점</td>
                <td className="px-4 py-3 text-center">
                  <span className={`font-bold ${
                    storeScore >= 90 ? "text-purple-600" :
                    storeScore >= 75 ? "text-green-600" :
                    storeScore >= 60 ? "text-blue-600" :
                    storeScore >= 40 ? "text-amber-600" :
                    "text-red-600"
                  }`}>
                    {storeScore >= 90 ? "S" : storeScore >= 75 ? "A" : storeScore >= 60 ? "B" : storeScore >= 40 ? "C" : "D"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">-</td>
              </tr>
              {competitors.map((comp) => (
                <tr key={comp.name}>
                  <td className="px-4 py-3 font-medium">{comp.name}</td>
                  <td className="px-4 py-3 text-center font-bold" style={{
                    color: comp.score >= 75 ? "#10b981" : comp.score >= 60 ? "#f59e0b" : "#ef4444"
                  }}>{comp.score}점</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-bold ${
                      comp.grade === "S" ? "text-purple-600" :
                      comp.grade === "A" ? "text-green-600" :
                      comp.grade === "B" ? "text-blue-600" :
                      comp.grade === "C" ? "text-amber-600" :
                      "text-red-600"
                    }`}>{comp.grade}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {comp.strengths.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
