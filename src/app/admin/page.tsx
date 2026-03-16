"use client";

import { useState, useEffect } from "react";
import { Users, BarChart3, CreditCard, Database, ArrowUpRight } from "lucide-react";
import { usersStorage, storesStorage, analysesStorage } from "@/lib/storage";
import type { User } from "@/lib/storage";

interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  atRiskUsers: number;
  totalAnalyses: number;
  totalStores: number;
  paidUsers: number;
  freeUsers: number;
  recentSignups: { name: string; email: string; date: string; category: string }[];
}

function calculateMetrics(users: User[]): DashboardMetrics {
  const now = Date.now();
  const DAY_MS = 86400000;

  let totalAnalyses = 0;
  let totalStores = 0;
  let activeUsers = 0;
  let newUsers = 0;
  let atRiskUsers = 0;
  let paidUsers = 0;
  let freeUsers = 0;

  users.forEach((u) => {
    const stores = storesStorage.getAll(u.id);
    const analyses = analysesStorage.getAll(u.id);
    totalStores += stores.length;
    totalAnalyses += analyses.length;

    const daysSinceCreated = (now - new Date(u.createdAt).getTime()) / DAY_MS;

    if (daysSinceCreated < 3) newUsers++;
    else if (analyses.length === 0 && daysSinceCreated > 7) atRiskUsers++;
    else activeUsers++;

    if (u.plan === "pro" || u.plan === "business") paidUsers++;
    else freeUsers++;
  });

  const recentSignups = users
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)
    .map((u) => ({
      name: u.name,
      email: u.email,
      date: new Date(u.createdAt).toLocaleString("ko-KR"),
      category: u.businessCategory || "-",
    }));

  return {
    totalUsers: users.length,
    activeUsers,
    newUsers,
    atRiskUsers,
    totalAnalyses,
    totalStores,
    paidUsers,
    freeUsers,
    recentSignups,
  };
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    const users = usersStorage.getAll();
    setMetrics(calculateMetrics(users));
  }, []);

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const conversionRate = metrics.totalUsers > 0
    ? ((metrics.paidUsers / metrics.totalUsers) * 100).toFixed(1)
    : "0";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "전체 유저", value: metrics.totalUsers, icon: Users, color: "text-gray-900" },
          { label: "활성 유저", value: metrics.activeUsers, icon: Users, color: "text-green-600" },
          { label: "총 분석 실행", value: metrics.totalAnalyses, icon: BarChart3, color: "text-blue-600" },
          { label: "등록 매장", value: metrics.totalStores, icon: Database, color: "text-purple-600" },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{m.label}</span>
              <m.icon size={16} className="text-gray-400" />
            </div>
            <span className={`text-2xl font-bold ${m.color}`}>{m.value.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Second row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "유료 유저", value: String(metrics.paidUsers) },
          { label: "무료 유저", value: String(metrics.freeUsers) },
          { label: "유료 전환율", value: `${conversionRate}%` },
          { label: "신규 유저", value: String(metrics.newUsers) },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <span className="text-xs text-gray-500">{m.label}</span>
            <div className="text-xl font-bold mt-1">{m.value}</div>
          </div>
        ))}
      </div>

      {/* User Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold mb-4">유저 상태 분포</h3>
          <div className="space-y-4">
            {[
              { label: "활성", value: metrics.activeUsers, color: "#10b981", total: metrics.totalUsers },
              { label: "신규", value: metrics.newUsers, color: "#2563eb", total: metrics.totalUsers },
              { label: "이탈 위험", value: metrics.atRiskUsers, color: "#f59e0b", total: metrics.totalUsers },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{s.label}</span>
                  <span className="font-medium">{s.value}명 ({s.total > 0 ? ((s.value / s.total) * 100).toFixed(0) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${s.total > 0 ? (s.value / s.total) * 100 : 0}%`,
                      backgroundColor: s.color,
                      minWidth: s.value > 0 ? "8px" : "0",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold mb-4">플랜 분포</h3>
          <div className="space-y-4">
            {[
              { label: "무료", value: metrics.freeUsers, color: "#94a3b8" },
              { label: "프로", value: metrics.paidUsers > 0 ? metrics.paidUsers : 0, color: "#2563eb" },
              { label: "비즈니스", value: 0, color: "#8b5cf6" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{s.label}</span>
                  <span className="font-medium">{s.value}명</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${metrics.totalUsers > 0 ? (s.value / metrics.totalUsers) * 100 : 0}%`,
                      backgroundColor: s.color,
                      minWidth: s.value > 0 ? "8px" : "0",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Signups */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">최근 가입 유저</h3>
          <a href="/admin/users" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            전체 보기 <ArrowUpRight size={14} />
          </a>
        </div>
        {metrics.recentSignups.length === 0 ? (
          <div className="text-center py-8">
            <Users size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">아직 가입한 유저가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {metrics.recentSignups.map((signup, idx) => (
              <div key={idx} className="flex items-center gap-4 text-sm">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs shrink-0">
                  {signup.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium">{signup.name}</span>
                  <span className="text-gray-400 ml-2">{signup.email}</span>
                </div>
                <span className="text-gray-400 text-xs">{signup.category}</span>
                <span className="text-gray-400 text-xs shrink-0">{signup.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
