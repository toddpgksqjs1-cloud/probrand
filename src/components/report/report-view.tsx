"use client";

import { useState, useEffect, useRef } from "react";
import { DiagnosticReport, ReportSection } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ClipboardList, UtensilsCrossed, Star, Camera, Search,
  Lock, CheckCircle, AlertTriangle, XCircle, ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

const iconMap: Record<string, React.ElementType> = {
  ClipboardList, UtensilsCrossed, Star, Camera, Search,
};

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

function StatusIcon({ status }: { status: string }) {
  if (status === "good") return <CheckCircle className="w-4 h-4 text-emerald-400" />;
  if (status === "warning") return <AlertTriangle className="w-4 h-4 text-amber-400" />;
  return <XCircle className="w-4 h-4 text-red-400" />;
}

function useCountUp(target: number, duration: number = 1500) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return value;
}

function SectionCard({ section, index }: { section: ReportSection; index: number }) {
  const Icon = iconMap[section.icon] || ClipboardList;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 150 * index);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Card className={`bg-white/5 border-white/10 transition-all duration-500 ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              section.isLocked ? "bg-slate-500/10" : section.score >= 80 ? "bg-emerald-500/10" : section.score >= 60 ? "bg-amber-500/10" : "bg-red-500/10"
            }`}>
              {section.isLocked ? (
                <Lock className="w-5 h-5 text-slate-500" />
              ) : (
                <Icon className={`w-5 h-5 ${getScoreColor(section.score)}`} />
              )}
            </div>
            <CardTitle className="text-white text-lg">{section.title}</CardTitle>
          </div>
          {!section.isLocked && (
            <span className={`text-2xl font-bold ${getScoreColor(section.score)}`}>
              {section.score}점
            </span>
          )}
        </div>
        {!section.isLocked && (
          <Progress value={visible ? section.score : 0} className="mt-3 h-2 bg-white/5 transition-all duration-1000" />
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {section.items.map((item, i) => (
          <div key={i} className={`flex items-start gap-3 p-3 rounded-lg bg-white/3`}>
            {section.isLocked ? (
              <Lock className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
            ) : (
              <StatusIcon status={item.status} />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-300 text-sm">{item.label}</span>
                <span className={`text-sm shrink-0 ${
                  section.isLocked ? "text-slate-600" : item.status === "good" ? "text-emerald-400" : item.status === "warning" ? "text-amber-400" : "text-red-400"
                }`}>
                  {item.value}
                </span>
              </div>
              {item.suggestion && !section.isLocked && (
                <p className="text-xs text-indigo-300/70 mt-1">{item.suggestion}</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ReportView({ report, isAdmin }: { report: DiagnosticReport; isAdmin?: boolean }) {
  const router = useRouter();
  const animatedScore = useCountUp(report.overallScore);
  const [progressVisible, setProgressVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setProgressVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // In admin mode, unlock SEO section
  const sections = isAdmin
    ? report.sections.map((s) => s.id === "seo" ? { ...s, isLocked: false } : s)
    : report.sections;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Store Info + Overall Score */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">{report.storeInfo.name}</h1>
        <p className="text-slate-400 mb-6">{report.storeInfo.category} | {report.storeInfo.address}</p>

        <div className="inline-flex flex-col items-center gap-3 p-8 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-slate-400 text-sm">AI 종합 진단 점수</span>
          <span className={`text-7xl font-bold ${getScoreColor(report.overallScore)}`}>
            {animatedScore}
          </span>
          <span className="text-slate-500 text-sm">/ 100점</span>
          <div className="w-48">
            <Progress
              value={progressVisible ? report.overallScore : 0}
              className="h-3 bg-white/5 transition-all duration-1500"
            />
          </div>
        </div>
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {sections.map((section, i) => (
          <SectionCard key={section.id} section={section} index={i} />
        ))}
      </div>

      {/* Top Recommendations */}
      <Card className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border-indigo-500/20 mb-10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            AI 핵심 제안 (Top 3)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {report.topRecommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-sm flex items-center justify-center shrink-0 font-bold">
                {i + 1}
              </span>
              <span className="text-slate-300 text-sm">{rec}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Locked Content + CTA (only for non-admin) */}
      {!isAdmin && (
        <Card className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500/30 mb-10">
          <CardContent className="py-10 text-center">
            <Lock className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">
              더 자세한 분석이 필요하신가요?
            </h2>
            <p className="text-slate-400 mb-2">회원가입하면 이용 가능한 기능:</p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {["SEO 키워드 분석", "경쟁 매장 비교", "니치 키워드 발굴", "AI 콘텐츠 생성", "리뷰 자동 관리", "예약/주문 시스템"].map((feature) => (
                <Badge key={feature} variant="secondary" className="bg-white/10 text-slate-300 border-white/10">
                  {feature}
                </Badge>
              ))}
            </div>
            <Button
              onClick={() => router.push("/signup")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-6 text-lg rounded-xl"
            >
              무료로 시작하기 <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-slate-500 text-sm mt-3">30초 만에 가입 완료</p>
          </CardContent>
        </Card>
      )}

      {/* Action Items */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">맞춤 개선 액션 플랜</CardTitle>
            <Badge variant="secondary" className="bg-white/10 text-slate-400 border-white/10">
              {report.detailedActions.length}개 항목
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {report.detailedActions.slice(0, isAdmin ? undefined : 3).map((action) => (
            <div key={action.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/3">
              <Badge className={`shrink-0 ${
                action.priority === "high" ? "bg-red-500/20 text-red-400 border-red-500/20" :
                action.priority === "medium" ? "bg-amber-500/20 text-amber-400 border-amber-500/20" :
                "bg-slate-500/20 text-slate-400 border-slate-500/20"
              }`}>
                {action.priority === "high" ? "긴급" : action.priority === "medium" ? "권장" : "선택"}
              </Badge>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{action.title}</p>
                <p className="text-slate-500 text-xs mt-1">{action.description}</p>
              </div>
              <span className="text-indigo-400 text-xs shrink-0">{action.estimatedImpact}</span>
            </div>
          ))}
          {!isAdmin && report.detailedActions.length > 3 && (
            <div className="text-center py-3">
              <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                <Lock className="w-4 h-4" />
                나머지 {report.detailedActions.length - 3}개 항목은 회원가입 후 확인
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
