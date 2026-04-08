"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp, TrendingDown, Store,
  CreditCard, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { usePlatformStore, computeMetrics } from "@/lib/store/platform-store";

function formatKRW(n: number) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n.toLocaleString();
}

export default function PlatformAnalyticsPage() {
  const stores = usePlatformStore((s) => s.stores);
  const users = usePlatformStore((s) => s.users);
  const metrics = computeMetrics(stores, users);

  const totalPlatformRevenue = stores.reduce((sum, s) => sum + s.monthlyRevenue, 0);

  const kpiCards = [
    {
      label: "플랫폼 GMV",
      value: `${formatKRW(totalPlatformRevenue)}원`,
      change: "+12.5%",
      positive: true,
      icon: CreditCard,
    },
    {
      label: "MRR (구독 매출)",
      value: `${formatKRW(metrics.mrr)}원`,
      change: "+8.2%",
      positive: true,
      icon: TrendingUp,
    },
    {
      label: "ARPU (가맹점당 매출)",
      value: metrics.activeStores > 0 ? `${formatKRW(Math.round(metrics.mrr / metrics.activeStores))}원` : "0원",
      change: "+3.1%",
      positive: true,
      icon: Store,
    },
    {
      label: "이탈율",
      value: `${metrics.churnRate}%`,
      change: "-1.2%",
      positive: true,
      icon: TrendingDown,
    },
  ];

  const categoryDist = stores.reduce((acc, s) => {
    const cat = s.category.split("/")[0];
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const regionDist = stores.reduce((acc, s) => {
    const match = s.address.match(/서울\s+(\S+구)/);
    const region = match ? match[1] : "기타";
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (stores.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">플랫폼 분석</h1>
        <p className="text-slate-400 text-sm mt-1 mb-8">핵심 지표와 트렌드를 분석합니다</p>
        <div className="text-center py-20 text-slate-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>분석할 데이터가 없습니다</p>
          <p className="text-xs mt-1">가맹점을 추가하면 분석 지표가 표시됩니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">플랫폼 분석</h1>
        <p className="text-slate-400 text-sm mt-1">핵심 지표와 트렌드를 분석합니다</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className="w-5 h-5 text-slate-500" />
                <span className={`text-xs flex items-center gap-0.5 ${kpi.positive ? "text-emerald-400" : "text-red-400"}`}>
                  {kpi.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change}
                </span>
              </div>
              <p className="text-xl font-bold text-white">{kpi.value}</p>
              <p className="text-slate-500 text-xs mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">전환 퍼널</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "총 가맹점", value: metrics.totalStores, pct: 100 },
              { label: "활성 가맹점", value: metrics.activeStores, pct: metrics.totalStores > 0 ? Math.round((metrics.activeStores / metrics.totalStores) * 100) : 0 },
              { label: "유료 전환", value: stores.filter((s) => s.plan !== "free" && (s.status === "active" || s.status === "trial")).length, pct: metrics.conversionRate },
            ].map((step) => (
              <div key={step.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{step.label}</span>
                  <span className="text-white">{step.value}개 <span className="text-slate-600">({step.pct}%)</span></span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-400"
                    style={{ width: `${step.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">플랜별 분포</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(["free", "basic", "pro", "enterprise"] as const).map((plan) => {
              const count = stores.filter((s) => s.plan === plan).length;
              const labels = { free: "무료", basic: "베이직", pro: "프로", enterprise: "엔터프라이즈" };
              return (
                <div key={plan} className="flex items-center justify-between p-3 rounded-lg bg-white/3">
                  <span className="text-slate-300 text-sm">{labels[plan]}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-400 rounded-full" style={{ width: `${stores.length > 0 ? (count / stores.length) * 100 : 0}%` }} />
                    </div>
                    <span className="text-white text-sm font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">카테고리별 분포</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(categoryDist)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between p-3 rounded-lg bg-white/3">
                  <span className="text-slate-300 text-sm">{cat}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-400 rounded-full" style={{ width: `${(count / stores.length) * 100}%` }} />
                    </div>
                    <span className="text-white text-sm font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Region Distribution */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">지역별 분포</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(regionDist)
              .sort(([, a], [, b]) => b - a)
              .map(([region, count]) => (
                <div key={region} className="flex items-center justify-between p-3 rounded-lg bg-white/3">
                  <span className="text-slate-300 text-sm">{region}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(count / stores.length) * 100}%` }} />
                    </div>
                    <span className="text-white text-sm font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
