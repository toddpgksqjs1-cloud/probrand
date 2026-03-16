"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, Download, ChevronRight, Users } from "lucide-react";
import { usersStorage, storesStorage, analysesStorage } from "@/lib/storage";
import type { User } from "@/lib/storage";

interface UserRow {
  id: string;
  name: string;
  email: string;
  category: string;
  location: string;
  plan: string;
  signupDate: string;
  lastActive: string;
  analysisCount: number;
  score: number;
  status: "active" | "new" | "at_risk";
}

const planLabelMap: Record<string, string> = {
  free: "무료",
  pro: "프로",
  business: "비즈니스",
};

function buildUserRows(users: User[]): UserRow[] {
  const now = Date.now();
  const DAY_MS = 86400000;

  return users.map((u) => {
    const stores = storesStorage.getAll(u.id);
    const store = stores[0];
    const allAnalyses = analysesStorage.getAll(u.id);
    const latestAnalysis = allAnalyses.length > 0 ? allAnalyses[allAnalyses.length - 1] : null;

    const createdAt = new Date(u.createdAt);
    const daysSinceCreated = (now - createdAt.getTime()) / DAY_MS;

    let status: "active" | "new" | "at_risk" = "active";
    if (daysSinceCreated < 3) {
      status = "new";
    } else if (allAnalyses.length === 0 && daysSinceCreated > 7) {
      status = "at_risk";
    }

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      category: store?.category || u.businessCategory || "-",
      location: store?.address || u.location || "-",
      plan: planLabelMap[u.plan] || u.plan,
      signupDate: createdAt.toLocaleDateString("ko-KR"),
      lastActive: latestAnalysis
        ? new Date(latestAnalysis.createdAt).toLocaleString("ko-KR")
        : createdAt.toLocaleString("ko-KR"),
      analysisCount: allAnalyses.length,
      score: latestAnalysis?.score || 0,
      status,
    };
  });
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [userRows, setUserRows] = useState<UserRow[]>([]);

  useEffect(() => {
    const users = usersStorage.getAll();
    setUserRows(buildUserRows(users));
  }, []);

  const filtered = userRows.filter((u) => {
    const matchSearch =
      u.name.includes(searchQuery) ||
      u.email.includes(searchQuery) ||
      u.category.includes(searchQuery);
    const matchPlan = filterPlan === "all" || u.plan === filterPlan;
    return matchSearch && matchPlan;
  });

  const totalUsers = userRows.length;
  const activeUsers = userRows.filter((u) => u.status === "active").length;
  const atRiskUsers = userRows.filter((u) => u.status === "at_risk").length;
  const newUsers = userRows.filter((u) => u.status === "new").length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs text-gray-500">전체 유저</div>
          <div className="text-xl font-bold mt-1">{totalUsers}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs text-gray-500">활성 유저</div>
          <div className="text-xl font-bold mt-1 text-green-600">{activeUsers}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs text-gray-500">이탈 위험</div>
          <div className="text-xl font-bold mt-1 text-amber-600">{atRiskUsers}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs text-gray-500">신규</div>
          <div className="text-xl font-bold mt-1 text-blue-600">{newUsers}</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이름, 이메일, 업종으로 검색..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">전체 플랜</option>
              <option value="무료">무료</option>
              <option value="프로">프로</option>
              <option value="비즈니스">비즈니스</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            <Download size={16} /> CSV
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {totalUsers === 0 ? "등록된 유저가 없습니다." : "검색 결과가 없습니다."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-sm text-gray-500">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">유저</th>
                  <th className="text-left px-6 py-3 font-medium">업종/위치</th>
                  <th className="text-center px-6 py-3 font-medium">플랜</th>
                  <th className="text-center px-6 py-3 font-medium">분석 횟수</th>
                  <th className="text-center px-6 py-3 font-medium">점수</th>
                  <th className="text-center px-6 py-3 font-medium">상태</th>
                  <th className="text-left px-6 py-3 font-medium">가입일</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{user.category}</div>
                      <div className="text-xs text-gray-400">{user.location}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          user.plan === "비즈니스"
                            ? "bg-purple-100 text-purple-600"
                            : user.plan === "프로"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm">{user.analysisCount}</td>
                    <td className="px-6 py-4 text-center">
                      {user.score > 0 ? (
                        <span
                          className={`text-sm font-bold ${
                            user.score >= 80
                              ? "text-green-600"
                              : user.score >= 60
                              ? "text-blue-600"
                              : user.score >= 40
                              ? "text-amber-600"
                              : "text-red-500"
                          }`}
                        >
                          {user.score}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          user.status === "active"
                            ? "bg-green-100 text-green-600"
                            : user.status === "new"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {user.status === "active" ? "활성" : user.status === "new" ? "신규" : "이탈위험"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.signupDate}</td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/users/${user.id}`} className="text-gray-400 hover:text-blue-600">
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
