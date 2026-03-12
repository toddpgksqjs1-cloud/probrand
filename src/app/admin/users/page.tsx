"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Download, ChevronRight } from "lucide-react";
import { adminUsers } from "@/lib/mock-data";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");

  const filtered = adminUsers.filter((u) => {
    const matchSearch = u.name.includes(searchQuery) || u.email.includes(searchQuery) || u.category.includes(searchQuery);
    const matchPlan = filterPlan === "all" || u.plan === filterPlan;
    return matchSearch && matchPlan;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs text-gray-500">전체 유저</div>
          <div className="text-xl font-bold mt-1">18,420</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs text-gray-500">활성 유저 (30일)</div>
          <div className="text-xl font-bold mt-1 text-green-600">12,400</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs text-gray-500">이탈 위험</div>
          <div className="text-xl font-bold mt-1 text-amber-600">842</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs text-gray-500">신규 (오늘)</div>
          <div className="text-xl font-bold mt-1 text-blue-600">89</div>
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
                <th className="text-left px-6 py-3 font-medium">마지막 활동</th>
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
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.plan === "비즈니스" ? "bg-purple-100 text-purple-600" :
                      user.plan === "프로" ? "bg-blue-100 text-blue-600" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm">{user.analysisCount}</td>
                  <td className="px-6 py-4 text-center">
                    {user.score > 0 ? (
                      <span className={`text-sm font-bold ${
                        user.score >= 80 ? "text-green-600" :
                        user.score >= 60 ? "text-blue-600" :
                        user.score >= 40 ? "text-amber-600" :
                        "text-red-500"
                      }`}>
                        {user.score}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.status === "active" ? "bg-green-100 text-green-600" :
                      user.status === "new" ? "bg-blue-100 text-blue-600" :
                      "bg-amber-100 text-amber-600"
                    }`}>
                      {user.status === "active" ? "활성" : user.status === "new" ? "신규" : "이탈위험"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.lastActive}</td>
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
      </div>
    </div>
  );
}
