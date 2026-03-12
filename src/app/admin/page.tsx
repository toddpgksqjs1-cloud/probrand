"use client";

import { Users, BarChart3, CreditCard, Database, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  adminMetrics, funnelData, featureUsage, categoryDistribution, dauTrend,
  recentActivities, regionDistribution,
} from "@/lib/mock-data";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#f97316"];

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "DAU", value: adminMetrics.dau.value, change: adminMetrics.dau.change, icon: Users, prefix: "" },
          { label: "신규 가입", value: adminMetrics.newSignups.value, change: adminMetrics.newSignups.change, icon: Users, prefix: "" },
          { label: "분석 실행", value: adminMetrics.analyses.value, change: adminMetrics.analyses.change, icon: BarChart3, prefix: "" },
          { label: "MRR", value: `${(adminMetrics.mrr.value / 10000).toFixed(0)}만`, change: adminMetrics.mrr.change, icon: CreditCard, prefix: "₩" },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{m.label}</span>
              <m.icon size={16} className="text-gray-400" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold">
                {m.prefix}{typeof m.value === "number" ? m.value.toLocaleString() : m.value}
              </span>
              <span className={`flex items-center text-sm font-medium mb-0.5 ${
                m.change > 0 ? "text-green-600" : "text-red-500"
              }`}>
                {m.change > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {m.change > 0 ? "+" : ""}{m.change}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Second row metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "총 유저", value: adminMetrics.totalUsers.value.toLocaleString() },
          { label: "유료 유저", value: adminMetrics.paidUsers.value.toLocaleString() },
          { label: "전환율", value: `${adminMetrics.conversionRate.value}%` },
          { label: "수집 데이터", value: `${(adminMetrics.dataCollected.value / 10000).toFixed(1)}만건` },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <span className="text-xs text-gray-500">{m.label}</span>
            <div className="text-xl font-bold mt-1">{m.value}</div>
          </div>
        ))}
      </div>

      {/* DAU Trend + Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DAU Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold mb-4">DAU / WAU 추이</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dauTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="dau" name="DAU" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="wau" name="WAU" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold mb-4">유저 퍼널</h3>
          <div className="space-y-3">
            {funnelData.map((stage, idx) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">{stage.stage}</span>
                  <span className="text-gray-500">{stage.value.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-6 rounded-full flex items-center pl-3 text-xs text-white font-medium progress-animate"
                    style={{
                      width: `${(stage.value / funnelData[0].value) * 100}%`,
                      backgroundColor: COLORS[idx],
                      minWidth: "40px",
                    }}
                  >
                    {idx > 0 ? `${stage.rate}%` : "100%"}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-xs text-gray-500">
            <div>가입전환: <span className="font-medium text-gray-700">33.7%</span></div>
            <div>활성화: <span className="font-medium text-gray-700">75.0%</span></div>
            <div>리텐션: <span className="font-medium text-gray-700">45.1%</span></div>
            <div>유료전환: <span className="font-medium text-gray-700">22.5%</span></div>
          </div>
        </div>
      </div>

      {/* Feature Usage + Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold mb-4">기능별 사용률</h3>
          <div className="space-y-4">
            {featureUsage.map((f) => (
              <div key={f.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{f.name}</span>
                  <span className="font-medium">{f.usage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full progress-animate"
                    style={{ width: `${f.usage}%`, backgroundColor: f.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold mb-4">업종별 분포</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {categoryDistribution.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold mb-4">지역별 분포</h3>
          <div className="space-y-3">
            {regionDistribution.map((r) => (
              <div key={r.name} className="flex items-center justify-between">
                <span className="text-sm">{r.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-500 progress-animate"
                      style={{ width: `${(r.value / 42) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{r.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold mb-4">실시간 활동</h3>
        <div className="space-y-3">
          {recentActivities.map((activity, idx) => (
            <div key={idx} className="flex items-center gap-4 text-sm">
              <span className="text-gray-400 w-12 shrink-0">{activity.time}</span>
              <span className="font-medium w-12 shrink-0">{activity.user}</span>
              <span className="flex-1">{activity.action}</span>
              <span className="text-gray-500">{activity.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
