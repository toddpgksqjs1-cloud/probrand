"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Search, TrendingUp, TrendingDown, Minus, Target, FileText,
  BarChart3, Users, ArrowRight, Sparkles, Eye, MousePointer, Star,
} from "lucide-react";
import { sampleKeywords, sampleSEOScore, sampleCompetitors, sampleContentSuggestions } from "@/lib/mock-data/sample-store";
import { toast } from "sonner";

function ScoreCard({ label, score, icon: Icon }: { label: string; score: number; icon: React.ElementType }) {
  const color = score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-red-400";
  const bg = score >= 80 ? "bg-emerald-500/10" : score >= 60 ? "bg-amber-500/10" : "bg-red-500/10";
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/3">
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="flex-1">
        <p className="text-slate-400 text-xs">{label}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-lg font-bold ${color}`}>{score}</span>
          <Progress value={score} className="flex-1 h-1.5 bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export default function SEOPage() {
  const [activeTab, setActiveTab] = useState("keywords");
  const score = sampleSEOScore;
  const keywords = sampleKeywords;
  const competitors = sampleCompetitors;
  const contentSuggestions = sampleContentSuggestions;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">SEO 관리</h1>
          <p className="text-slate-400 text-sm mt-1">검색 노출 최적화를 관리하세요</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-500" onClick={() => toast.success("SEO 리포트가 생성되었습니다.")}>
          <FileText className="w-4 h-4 mr-2" /> SEO 리포트 생성
        </Button>
      </div>

      {/* SEO Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10 lg:col-span-1">
          <CardContent className="p-6 text-center">
            <p className="text-slate-400 text-sm mb-3">종합 SEO 점수</p>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(255 255 255 / 0.05)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(99 102 241)" strokeWidth="8"
                  strokeDasharray={`${score.overall * 2.64} 264`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{score.overall}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1 text-emerald-400 text-sm">
              <TrendingUp className="w-4 h-4" /> +5 지난주 대비
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">카테고리별 점수</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ScoreCard label="플레이스 최적화" score={score.categories.placeOptimization} icon={Target} />
            <ScoreCard label="콘텐츠 SEO" score={score.categories.contentSEO} icon={FileText} />
            <ScoreCard label="리뷰 점수" score={score.categories.reviewScore} icon={Search} />
            <ScoreCard label="사진 점수" score={score.categories.photoScore} icon={Eye} />
            <ScoreCard label="경쟁 포지션" score={score.categories.competitivePosition} icon={Users} />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="keywords" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400">
            키워드 순위
          </TabsTrigger>
          <TabsTrigger value="niche" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400">
            니치 키워드
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400">
            콘텐츠 생성
          </TabsTrigger>
          <TabsTrigger value="competitors" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400">
            경쟁 분석
          </TabsTrigger>
        </TabsList>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="mt-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">타겟 키워드 순위</CardTitle>
                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                  {keywords.length}개 추적 중
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 px-3 py-2 text-slate-500 text-xs font-medium">
                  <div className="col-span-4">키워드</div>
                  <div className="col-span-2 text-center">유형</div>
                  <div className="col-span-2 text-right">검색량</div>
                  <div className="col-span-2 text-center">현재 순위</div>
                  <div className="col-span-2 text-right">변동</div>
                </div>
                {keywords.map((kw) => (
                  <div key={kw.id} className="grid grid-cols-12 gap-2 px-3 py-3 rounded-lg bg-white/3 items-center">
                    <div className="col-span-4 text-white text-sm font-medium">{kw.keyword}</div>
                    <div className="col-span-2 text-center">
                      <Badge variant="secondary" className={`text-xs border-0 ${
                        kw.type === "main" ? "bg-red-500/10 text-red-400" :
                        kw.type === "niche" ? "bg-emerald-500/10 text-emerald-400" :
                        kw.type === "season" ? "bg-purple-500/10 text-purple-400" :
                        kw.type === "menu" ? "bg-blue-500/10 text-blue-400" :
                        "bg-amber-500/10 text-amber-400"
                      }`}>
                        {kw.type === "main" ? "대표" : kw.type === "detail" ? "세부" : kw.type === "niche" ? "니치" : kw.type === "season" ? "시즌" : "메뉴"}
                      </Badge>
                    </div>
                    <div className="col-span-2 text-right text-slate-400 text-sm">
                      {kw.searchVolume.toLocaleString()}
                    </div>
                    <div className="col-span-2 text-center text-white font-bold">
                      {kw.currentRank}위
                    </div>
                    <div className="col-span-2 text-right">
                      {kw.rankChange && kw.rankChange > 0 ? (
                        <span className="flex items-center justify-end gap-1 text-emerald-400 text-sm">
                          <TrendingUp className="w-3 h-3" /> {kw.rankChange}
                        </span>
                      ) : kw.rankChange && kw.rankChange < 0 ? (
                        <span className="flex items-center justify-end gap-1 text-red-400 text-sm">
                          <TrendingDown className="w-3 h-3" /> {Math.abs(kw.rankChange)}
                        </span>
                      ) : (
                        <span className="flex items-center justify-end gap-1 text-slate-500 text-sm">
                          <Minus className="w-3 h-3" /> 0
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Niche Keywords Tab */}
        <TabsContent value="niche" className="mt-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                니치 키워드 기회
              </CardTitle>
              <p className="text-slate-400 text-sm">경쟁이 적고 전환율이 높은 키워드를 공략하세요</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {keywords.filter((k) => k.type === "niche").map((kw) => (
                <div key={kw.id} className="p-4 rounded-xl bg-white/3 border border-emerald-500/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium">{kw.keyword}</span>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      기회도 {kw.opportunity}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-slate-500 text-xs">월 검색량</p>
                      <p className="text-white font-bold">{kw.searchVolume.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">경쟁도</p>
                      <p className="text-emerald-400 font-bold">낮음</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">현재 순위</p>
                      <p className="text-white font-bold">{kw.currentRank}위</p>
                    </div>
                  </div>
                  <Progress value={kw.opportunity} className="h-1.5 bg-white/5 mb-3" />
                  <Button size="sm" className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/20" onClick={() => toast.success(`"${kw.keyword}" 키워드 콘텐츠 생성이 시작되었습니다.`)}>
                    <Sparkles className="w-4 h-4 mr-1" /> 이 키워드로 콘텐츠 생성
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Generation Tab */}
        <TabsContent value="content" className="mt-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                AI 콘텐츠 제안
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contentSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-4 rounded-xl bg-white/3 border border-white/5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 border-0 mb-2 text-xs">
                        {suggestion.keyword}
                      </Badge>
                      <h3 className="text-white font-medium">{suggestion.title}</h3>
                    </div>
                    <Badge className={`shrink-0 ml-3 ${
                      suggestion.difficulty === "easy" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      suggestion.difficulty === "medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {suggestion.difficulty === "easy" ? "쉬움" : suggestion.difficulty === "medium" ? "보통" : "어려움"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {suggestion.outline.map((item, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded bg-white/5 text-slate-400">
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500 text-xs">
                      <MousePointer className="w-3 h-3" /> 예상 월 트래픽: {suggestion.estimatedTraffic}
                    </span>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white" onClick={() => toast.success(`"${suggestion.title}" 콘텐츠가 생성되었습니다.`)}>
                      <Sparkles className="w-4 h-4 mr-1" /> AI 글 생성
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitors Tab */}
        <TabsContent value="competitors" className="mt-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                경쟁 매장 분석
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {competitors.map((comp, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/3 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-white font-medium">{comp.competitorName}</h3>
                      <p className="text-slate-500 text-xs">{comp.distance} 거리</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-white font-bold">{comp.rating}</span>
                      </div>
                      <p className="text-slate-500 text-xs">리뷰 {comp.reviewCount}개</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-emerald-400 text-xs font-medium mb-1">강점</p>
                      {comp.strengths.map((s, j) => (
                        <p key={j} className="text-slate-400 text-xs">+ {s}</p>
                      ))}
                    </div>
                    <div>
                      <p className="text-red-400 text-xs font-medium mb-1">약점</p>
                      {comp.weaknesses.map((w, j) => (
                        <p key={j} className="text-slate-400 text-xs">- {w}</p>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {comp.keywords.map((kw, j) => (
                      <Badge key={j} variant="secondary" className="bg-white/5 text-slate-500 border-0 text-xs">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
