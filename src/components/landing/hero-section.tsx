"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, TrendingUp, Star, BarChart3 } from "lucide-react";

export function HeroSection() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError("네이버 플레이스 URL을 입력해주세요.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "분석 중 오류가 발생했습니다.");
        return;
      }

      // Store report data and navigate to report page
      sessionStorage.setItem("diagnosticReport", JSON.stringify(data.report));
      router.push("/report");
    } catch {
      setError("서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm mb-8">
          <TrendingUp className="w-4 h-4" />
          AI 기반 가게 진단 서비스
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          내 가게,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
            지금 어떤 상태
          </span>
          인지
          <br />
          궁금하지 않으세요?
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
          네이버 플레이스 주소 하나만 넣으면,
          <br />
          AI가 내 가게를 360도 분석해드립니다.
        </p>

        {/* URL Input */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                type="url"
                placeholder="네이버 플레이스 URL을 붙여넣으세요"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                className="pl-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-500 text-lg rounded-xl focus:border-indigo-500 focus:ring-indigo-500/20"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="h-14 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-lg font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/25"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  분석 중...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  무료 진단 <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </div>
          {error && <p className="mt-3 text-red-400 text-sm text-left">{error}</p>}
          <p className="mt-3 text-slate-500 text-sm">
            예: https://naver.me/xxxxx 또는 https://map.naver.com/...
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-white font-semibold">AI 종합 진단</h3>
            <p className="text-slate-400 text-sm">기본정보, 메뉴, 리뷰, 사진을 한번에 분석</p>
          </div>
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Search className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold">SEO 자동화</h3>
            <p className="text-slate-400 text-sm">키워드 분석부터 콘텐츠 생성까지 자동으로</p>
          </div>
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold">매출 성장</h3>
            <p className="text-slate-400 text-sm">예약, 주문, 고객관리까지 올인원</p>
          </div>
        </div>
      </div>
    </section>
  );
}
