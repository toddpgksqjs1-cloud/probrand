"use client";

import { CreditCard, TrendingUp, Users } from "lucide-react";
import { revenueData, subscriptionBreakdown } from "@/lib/mock-data";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

export default function SubscriptionsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Revenue Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "MRR", value: "₩210만", change: "+22%", color: "blue" },
          { label: "ARR (추정)", value: "₩2,520만", change: "+22%", color: "green" },
          { label: "유료 유저", value: "842", change: "+18%", color: "purple" },
          { label: "ARPU", value: "₩24,940", change: "+3%", color: "amber" },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-sm text-gray-500 mb-1">{m.label}</div>
            <div className="text-2xl font-bold">{m.value}</div>
            <div className="text-xs text-green-600 mt-1">{m.change}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold mb-4">MRR 추이</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#94a3b8"
                tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`}
              />
              <Tooltip formatter={(value) => [`₩${Number(value).toLocaleString()}`, "MRR"]} />
              <Line type="monotone" dataKey="mrr" name="MRR" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Plan Breakdown + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold mb-4">플랜별 분포</h3>
          <div className="space-y-4">
            {subscriptionBreakdown.map((plan) => (
              <div key={plan.plan}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${
                      plan.plan === "비즈니스" ? "bg-purple-500" :
                      plan.plan === "프로" ? "bg-blue-500" :
                      "bg-gray-300"
                    }`} />
                    <span className="text-sm font-medium">{plan.plan}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {plan.count.toLocaleString()}명 ({plan.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      plan.plan === "비즈니스" ? "bg-purple-500" :
                      plan.plan === "프로" ? "bg-blue-500" :
                      "bg-gray-300"
                    }`}
                    style={{ width: `${plan.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-medium mb-3">전환율</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">무료→프로</div>
                <div className="text-lg font-bold">3.4%</div>
              </div>
              <div>
                <div className="text-gray-500">프로→비즈니스</div>
                <div className="text-lg font-bold">34.9%</div>
              </div>
              <div>
                <div className="text-gray-500">월간 해지율</div>
                <div className="text-lg font-bold text-amber-600">3.2%</div>
              </div>
              <div>
                <div className="text-gray-500">평균 구독 기간</div>
                <div className="text-lg font-bold">4.2개월</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold mb-4">최근 결제</h3>
          <div className="space-y-3">
            {[
              { user: "박**", action: "프로 구독 시작", amount: "29,000", date: "03/12 14:28", type: "new" },
              { user: "정**", action: "프로 갱신", amount: "29,000", date: "03/12 09:00", type: "renewal" },
              { user: "김**", action: "비즈니스 업그레이드", amount: "79,000", date: "03/11 16:45", type: "upgrade" },
              { user: "이**", action: "프로 갱신", amount: "29,000", date: "03/11 15:00", type: "renewal" },
              { user: "최**", action: "프로 구독 해지", amount: "-", date: "03/11 11:20", type: "cancel" },
              { user: "한**", action: "프로 구독 시작", amount: "29,000", date: "03/10 18:30", type: "new" },
              { user: "윤**", action: "비즈니스 갱신", amount: "79,000", date: "03/10 09:00", type: "renewal" },
            ].map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    tx.type === "new" ? "bg-green-500" :
                    tx.type === "upgrade" ? "bg-blue-500" :
                    tx.type === "cancel" ? "bg-red-500" :
                    "bg-gray-300"
                  }`} />
                  <span className="font-medium w-10">{tx.user}</span>
                  <span className="text-gray-500">{tx.action}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-medium ${tx.type === "cancel" ? "text-gray-400" : ""}`}>
                    {tx.amount !== "-" ? `₩${tx.amount}` : "-"}
                  </span>
                  <span className="text-xs text-gray-400">{tx.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
