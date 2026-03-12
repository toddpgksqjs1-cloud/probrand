"use client";

import { useState, useEffect } from "react";
import { Search, Star, Copy, BookOpen, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { storesStorage } from "@/lib/storage";
import { generateSeoKeywords } from "@/lib/analysis-engine";
import type { SeoResult } from "@/lib/analysis-engine";

export default function SeoPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [seoResult, setSeoResult] = useState<SeoResult | null>(null);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    const stores = storesStorage.getAll(user.id);
    const store = stores[0];
    const category = store?.category || user.businessCategory || "카페/디저트";
    const location = store?.address || user.location || "서울 강남구";
    const businessName = store?.name || user.businessName || "";

    // Set default search query from user data
    const locShort = location.split(" ").slice(0, 2).join(" ");
    const defaultQuery = `${locShort} ${category}`;
    setSearchQuery(defaultQuery);

    // Generate suggested tags
    const catWord = category.split("/")[0];
    const locParts = location.split(" ");
    const gu = (locParts[1] || locParts[0] || "강남구").replace(/[구시군]/g, "");
    setSuggestedTags([
      `${gu} ${catWord}`,
      `${gu}역 ${catWord}`,
      `${gu} 맛집`,
    ]);

    // Generate initial SEO data
    const result = generateSeoKeywords({
      businessName,
      category,
      location,
    });
    setSeoResult(result);
  }, [user]);

  const handleSearch = () => {
    if (!user || !searchQuery.trim()) return;

    const stores = storesStorage.getAll(user.id);
    const store = stores[0];

    const result = generateSeoKeywords({
      businessName: store?.name || user.businessName || searchQuery,
      category: store?.category || user.businessCategory || "카페/디저트",
      location: store?.address || user.location || "서울 강남구",
    });
    setSeoResult(result);
  };

  const handleCopyTitle = (title: string, idx: number) => {
    navigator.clipboard.writeText(title).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  if (!user || !seoResult) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const recommendedKeywords = seoResult.keywords.filter((k) => k.recommended);
  const hiddenGems = seoResult.keywords.filter((k) => k.competition === "low" && k.volume >= 1000);

  const competitionLabel = (comp: string) => {
    switch (comp) {
      case "low": return "낮음";
      case "medium": return "중";
      case "high": return "높음";
      default: return comp;
    }
  };

  const competitionColor = (comp: string) => {
    switch (comp) {
      case "low": return "bg-green-50 text-green-600";
      case "medium": return "bg-amber-50 text-amber-600";
      case "high": return "bg-red-50 text-red-600";
      default: return "bg-gray-50 text-gray-600";
    }
  };

  const difficultyStars = (difficulty: number) => {
    // Convert 0-100 difficulty to 1-5 stars (inverted: low difficulty = more stars)
    return Math.max(1, Math.min(5, 5 - Math.floor(difficulty / 25)));
  };

  const difficultyGrade = (difficulty: number) => {
    if (difficulty < 25) return { grade: "S", color: "text-purple-600" };
    if (difficulty < 40) return { grade: "A", color: "text-green-600" };
    if (difficulty < 60) return { grade: "B", color: "text-blue-600" };
    return { grade: "C", color: "text-amber-600" };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Search Input */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold mb-4">키워드 리서치</h2>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="업종 + 위치로 검색 (예: 강남역 카페)"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            검색
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="text-xs text-gray-400">추천:</span>
          {suggestedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Keywords Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">발굴된 키워드</div>
          <div className="text-2xl font-bold">{seoResult.keywords.length}개</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">추천 키워드</div>
          <div className="text-2xl font-bold text-blue-600">{recommendedKeywords.length}개</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">숨은 기회 키워드</div>
          <div className="text-2xl font-bold text-green-600">{hiddenGems.length}개</div>
        </div>
      </div>

      {/* Keyword Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">키워드 분석 결과</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-sm text-gray-500">
              <tr>
                <th className="text-left px-6 py-3 font-medium">키워드</th>
                <th className="text-right px-6 py-3 font-medium">월 검색량</th>
                <th className="text-center px-6 py-3 font-medium">경쟁도</th>
                <th className="text-center px-6 py-3 font-medium">난이도</th>
                <th className="text-center px-6 py-3 font-medium">추천도</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {seoResult.keywords.map((kw) => {
                const dg = difficultyGrade(kw.difficulty);
                const stars = difficultyStars(kw.difficulty);
                return (
                  <tr key={kw.keyword} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">
                      {kw.keyword}
                      {kw.recommended && (
                        <span className="ml-2 text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">추천</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">{kw.volume.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className={`px-2 py-0.5 rounded text-xs ${competitionColor(kw.competition)}`}>
                        {competitionLabel(kw.competition)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className={`font-bold ${dg.color}`}>
                        {dg.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i <= stars ? "fill-amber-400 text-amber-400" : "text-gray-200"}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blog Title Recommendations */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={18} className="text-blue-600" />
          <h3 className="font-bold">블로그 제목 추천 (AI)</h3>
        </div>
        <div className="space-y-4">
          {seoResult.blogTitles.map((title, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{title}</span>
                <button
                  onClick={() => handleCopyTitle(title, idx)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition"
                >
                  <Copy size={14} /> {copiedIdx === idx ? "복사됨!" : "복사"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleSearch}
          className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          + 더 생성하기
        </button>
      </div>

      {/* Content Guide */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-green-600" />
          <h3 className="font-bold">콘텐츠 작성 가이드</h3>
        </div>
        <div className="space-y-4">
          {seoResult.contentGuide.map((guide, idx) => (
            <div key={idx} className="bg-green-50 rounded-lg p-5">
              <h4 className="font-medium mb-3">{guide.topic}</h4>
              <div className="space-y-2 text-sm text-gray-700">
                {guide.tips.map((tip, tipIdx) => (
                  <div key={tipIdx} className="flex gap-3">
                    <span className="text-green-600 font-medium shrink-0">{tipIdx + 1}.</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
