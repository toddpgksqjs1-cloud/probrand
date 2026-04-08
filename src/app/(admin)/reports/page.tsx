"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3, TrendingUp, FileText, Download,
  Calendar, Search, Star, ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { ReportView } from "@/components/report/report-view";
import { sampleDiagnosticReport } from "@/lib/mock-data/sample-store";

export default function ReportsPage() {
  const [showReport, setShowReport] = useState(false);

  const handleShowReport = () => {
    setShowReport(true);
    toast.success("종합 진단 리포트를 불러왔습니다.");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI 리포트</h1>
          <p className="text-slate-400 text-sm mt-1">AI가 분석한 가게 성과 리포트를 확인하세요</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-500" onClick={() => toast.success("새 리포트 생성이 시작되었습니다.")}>
          <FileText className="w-4 h-4 mr-2" /> 새 리포트 생성
        </Button>
      </div>

      <Tabs defaultValue="comprehensive">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="comprehensive" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400">
            종합 진단
          </TabsTrigger>
          <TabsTrigger value="weekly" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400">
            주간 리포트
          </TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400">
            월간 리포트
          </TabsTrigger>
          <TabsTrigger value="competitor" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400">
            경쟁 분석
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comprehensive" className="mt-4">
          {showReport ? (
            <ReportView report={sampleDiagnosticReport} isAdmin />
          ) : (
            <>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-8 text-center">
                  <BarChart3 className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-white mb-2">종합 진단 리포트</h2>
                  <p className="text-slate-400 mb-6">
                    AI가 가게의 SEO, 리뷰, 마케팅, 경쟁력을 종합 분석합니다.
                  </p>
                  <Button className="bg-indigo-600 hover:bg-indigo-500" onClick={handleShowReport}>
                    <BarChart3 className="w-4 h-4 mr-2" /> 진단 리포트 보기
                  </Button>
                </CardContent>
              </Card>

              {/* Previous Reports */}
              <div className="mt-4 space-y-3">
                <h3 className="text-white font-medium">이전 리포트</h3>
                {[
                  { date: "2026-03-01", score: 68, change: "+5" },
                  { date: "2026-02-15", score: 63, change: "+3" },
                  { date: "2026-02-01", score: 60, change: "+4" },
                ].map((report, i) => (
                  <Card key={i} className="bg-white/5 border-white/10">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-slate-500" />
                        <div>
                          <p className="text-white text-sm font-medium">{report.date} 진단 리포트</p>
                          <p className="text-slate-500 text-xs">종합 점수 {report.score}점</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400 text-sm flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> {report.change}
                        </span>
                        <Button size="sm" variant="ghost" className="text-indigo-400" onClick={handleShowReport}>
                          <Download className="w-4 h-4 mr-1" /> 보기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="weekly" className="mt-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">이번 주 리포트</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Search, label: "SEO 점수", value: "72 (+5)", color: "text-indigo-400" },
                  { icon: Star, label: "새 리뷰", value: "12건", color: "text-amber-400" },
                  { icon: ShoppingBag, label: "주문", value: "45건", color: "text-emerald-400" },
                  { icon: TrendingUp, label: "키워드 상승", value: "7개", color: "text-blue-400" },
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/3 text-center">
                    <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                    <p className="text-white font-bold">{stat.value}</p>
                    <p className="text-slate-500 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/10">
                <h3 className="text-white font-medium mb-2">AI 주간 인사이트</h3>
                <ul className="space-y-2">
                  {[
                    "니치 키워드 '홍대 혼밥 파스타'가 8위에서 4위로 상승했습니다",
                    "리뷰 답글 비율이 12%에서 25%로 개선되었습니다",
                    "다음 주에는 '홍대 데이트 파스타' 키워드 공략을 추천합니다",
                  ].map((insight, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                      <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8 text-center">
              <Calendar className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">2월 월간 리포트</h2>
              <p className="text-slate-400 mb-6">
                2026년 2월의 가게 성과를 종합 분석합니다.
              </p>
              <Button className="bg-indigo-600 hover:bg-indigo-500" onClick={() => toast.info("월간 리포트를 불러오고 있습니다.")}>
                <Download className="w-4 h-4 mr-2" /> 리포트 확인
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitor" className="mt-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8 text-center">
              <BarChart3 className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">경쟁 매장 분석</h2>
              <p className="text-slate-400 mb-6">
                주변 경쟁 매장 3곳과의 비교 분석 리포트입니다.
              </p>
              <Button className="bg-indigo-600 hover:bg-indigo-500" onClick={() => toast.info("경쟁 분석 리포트를 불러오고 있습니다.")}>
                <Download className="w-4 h-4 mr-2" /> 분석 리포트 보기
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
