"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Store, Users, CreditCard, ShoppingBag,
  TrendingUp, AlertTriangle, UserPlus, BarChart3,
} from "lucide-react";
import { usePlatformStore, computeMetrics } from "@/lib/store/platform-store";

function formatKRW(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n.toLocaleString();
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "bg-emerald-400" : score >= 60 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
    </div>
  );
}

export default function PlatformDashboardPage() {
  const stores = usePlatformStore((s) => s.stores);
  const users = usePlatformStore((s) => s.users);
  const metrics = computeMetrics(stores, users);

  const statCards = [
    { label: "총 가맹점", value: metrics.totalStores, sub: `활성 ${metrics.activeStores}`, icon: Store, color: "text-rose-400", bg: "bg-rose-500/10" },
    { label: "총 사용자", value: metrics.totalUsers, sub: `이번 주 +${metrics.newSignupsThisWeek}`, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "MRR", value: `${formatKRW(metrics.mrr)}원`, sub: "월 반복 매출", icon: CreditCard, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "이번 달 주문", value: metrics.totalOrdersThisMonth.toLocaleString(), sub: `예약 ${metrics.totalBookingsThisMonth}건`, icon: ShoppingBag, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  const recentSignups = [...stores]
    .sort((a, b) => new Date(b.signupDate).getTime() - new Date(a.signupDate).getTime())
    .slice(0, 5);

  const lowScoreStores = stores
    .filter((s) => s.status === "active" || s.status === "trial")
    .filter((s) => s.diagnosticScore < 60)
    .sort((a, b) => a.diagnosticScore - b.diagnosticScore);

  const topStores = [...stores]
    .filter((s) => s.status === "active")
    .sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
    .slice(0, 5);

  const planDist = { free: 0, basic: 0, pro: 0, enterprise: 0 };
  stores.forEach((s) => { planDist[s.plan]++; });

  const statusDist = { active: 0, trial: 0, churned: 0, suspended: 0 };
  stores.forEach((s) => { statusDist[s.status]++; });

  if (stores.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">플랫폼 대시보드</h1>
        <p className="text-slate-400 text-sm mt-1 mb-8">PRO BRAND 전체 현황을 한눈에 확인하세요</p>
        <div className="text-center py-20 text-slate-500">
          <Store className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>가맹점 데이터가 없습니다</p>
          <p className="text-xs mt-1">상단 배너에서 샘플 데이터를 불러오거나, 가맹점 관리에서 직접 추가하세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">플랫폼 대시보드</h1>
        <p className="text-slate-400 text-sm mt-1">PRO BRAND 전체 현황을 한눈에 확인하세요</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-slate-500 text-sm">{stat.label}</p>
              <p className="text-xs text-slate-600 mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/3 border border-white/5">
          <p className="text-slate-500 text-xs mb-1">평균 진단 점수</p>
          <p className="text-xl font-bold text-white">{metrics.avgDiagnosticScore}점</p>
        </div>
        <div className="p-4 rounded-xl bg-white/3 border border-white/5">
          <p className="text-slate-500 text-xs mb-1">전환율 (무료→유료)</p>
          <p className="text-xl font-bold text-emerald-400">{metrics.conversionRate}%</p>
        </div>
        <div className="p-4 rounded-xl bg-white/3 border border-white/5">
          <p className="text-slate-500 text-xs mb-1">이탈율</p>
          <p className="text-xl font-bold text-red-400">{metrics.churnRate}%</p>
        </div>
        <div className="p-4 rounded-xl bg-white/3 border border-white/5">
          <p className="text-slate-500 text-xs mb-1">플랜 분포</p>
          <div className="flex gap-1 mt-1">
            {Object.entries(planDist).map(([plan, count]) => (
              <Badge key={plan} variant="secondary" className="bg-white/10 text-slate-400 border-white/5 text-[10px]">
                {plan} {count}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Revenue Stores */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              매출 TOP 5
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topStores.map((store, i) => (
              <div key={store.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{store.name}</p>
                  <p className="text-slate-500 text-xs">{store.category} | {store.ownerName}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-emerald-400 text-sm font-medium">{formatKRW(store.monthlyRevenue)}원</p>
                  <p className="text-slate-600 text-xs">{store.plan}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Low Score Alerts */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              진단 점수 낮은 가맹점
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowScoreStores.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">모든 가맹점이 양호합니다</p>
            ) : (
              lowScoreStores.map((store) => (
                <div key={store.id} className="p-3 rounded-lg bg-white/3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{store.name}</p>
                      <p className="text-slate-500 text-xs">{store.ownerName} | {store.plan}</p>
                    </div>
                    <span className={`text-lg font-bold ${store.diagnosticScore < 40 ? "text-red-400" : "text-amber-400"}`}>
                      {store.diagnosticScore}점
                    </span>
                  </div>
                  <ScoreBar score={store.diagnosticScore} />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Signups */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-400" />
              최근 가입
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSignups.map((store) => (
              <div key={store.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-bold">
                  {store.ownerName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{store.name}</p>
                  <p className="text-slate-500 text-xs">{store.ownerName} | {store.ownerEmail}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge className={`text-[10px] ${
                    store.status === "trial" ? "bg-blue-500/20 text-blue-400 border-blue-500/20" :
                    store.status === "active" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" :
                    "bg-slate-500/20 text-slate-400 border-slate-500/20"
                  }`}>
                    {store.status === "trial" ? "체험중" : store.status === "active" ? "활성" : store.status}
                  </Badge>
                  <p className="text-slate-600 text-xs mt-1">{store.signupDate}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-rose-400" />
              가맹점 현황
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "활성", count: statusDist.active, total: stores.length, color: "bg-emerald-400" },
              { label: "체험중", count: statusDist.trial, total: stores.length, color: "bg-blue-400" },
              { label: "이탈", count: statusDist.churned, total: stores.length, color: "bg-amber-400" },
              { label: "정지", count: statusDist.suspended, total: stores.length, color: "bg-red-400" },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-white font-medium">{item.count}개 ({item.total > 0 ? Math.round((item.count / item.total) * 100) : 0}%)</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.total > 0 ? (item.count / item.total) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
