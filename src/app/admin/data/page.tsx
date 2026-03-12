"use client";

import { Database, TrendingUp, AlertTriangle } from "lucide-react";
import { dataCollectionStats, dataQuality, scoreDistribution, cohortRetention } from "@/lib/mock-data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function DataPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Data Collection Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "매장 데이터", total: dataCollectionStats.stores.total, weekly: dataCollectionStats.stores.thisWeek, icon: "🏪" },
          { label: "리뷰 데이터", total: dataCollectionStats.reviews.total, weekly: dataCollectionStats.reviews.thisWeek, icon: "💬" },
          { label: "메뉴 데이터", total: dataCollectionStats.menus.total, weekly: dataCollectionStats.menus.thisWeek, icon: "🍽" },
          { label: "키워드 데이터", total: dataCollectionStats.keywords.total, weekly: dataCollectionStats.keywords.thisWeek, icon: "🔍" },
          { label: "홈페이지", total: dataCollectionStats.homepages.total, weekly: dataCollectionStats.homepages.thisWeek, icon: "🌐" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm text-gray-500">{item.label}</span>
            </div>
            <div className="text-xl font-bold">{item.total.toLocaleString()}</div>
            <div className="text-xs text-green-600 mt-1">+{item.weekly.toLocaleString()} 이번 주</div>
          </div>
        ))}
      </div>

      {/* Score Distribution + Data Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold mb-4">마케팅 점수 분포</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="count" name="매장 수" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">평균 점수: 64.2점 | 중앙값: 62점</p>
        </div>

        {/* Data Quality */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold mb-4">데이터 품질 지표</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500">
                <tr>
                  <th className="text-left py-2 font-medium">필드</th>
                  <th className="text-center py-2 font-medium">완성도</th>
                  <th className="text-center py-2 font-medium">정확도</th>
                  <th className="text-center py-2 font-medium">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dataQuality.map((d) => (
                  <tr key={d.field}>
                    <td className="py-3 font-medium">{d.field}</td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-blue-500"
                            style={{ width: `${d.completeness}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{d.completeness}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-green-500"
                            style={{ width: `${d.accuracy}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{d.accuracy}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      {d.completeness >= 90 && d.accuracy >= 90 ? (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">양호</span>
                      ) : d.completeness >= 70 ? (
                        <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded">보통</span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">개선필요</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cohort Retention */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold mb-4">코호트 리텐션</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="text-left py-2 font-medium">코호트</th>
                <th className="text-center py-2 font-medium">W0</th>
                <th className="text-center py-2 font-medium">W1</th>
                <th className="text-center py-2 font-medium">W2</th>
                <th className="text-center py-2 font-medium">W3</th>
                <th className="text-center py-2 font-medium">W4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cohortRetention.map((row) => (
                <tr key={row.cohort}>
                  <td className="py-3 font-medium">{row.cohort}</td>
                  {[row.w0, row.w1, row.w2, row.w3, row.w4].map((val, idx) => (
                    <td key={idx} className="py-3 text-center">
                      {val !== null ? (
                        <span
                          className="inline-block px-3 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: `rgba(37, 99, 235, ${(val as number) / 100})`,
                            color: (val as number) > 50 ? "white" : "#1e293b",
                          }}
                        >
                          {val}%
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Business Insights */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold mb-4">비즈니스 인사이트</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Database size={16} className="text-blue-600" />
              <span className="text-sm font-medium">업종별 평균 점수</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>카페/디저트</span><span className="font-medium">68.4점</span></div>
              <div className="flex justify-between"><span>한식</span><span className="font-medium">58.2점</span></div>
              <div className="flex justify-between"><span>미용/뷰티</span><span className="font-medium">72.1점</span></div>
              <div className="flex justify-between"><span>일식</span><span className="font-medium">65.8점</span></div>
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-green-600" />
              <span className="text-sm font-medium">트렌드 키워드</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>무인카페</span><span className="text-green-600">+245%</span></div>
              <div className="flex justify-between"><span>소금빵</span><span className="text-green-600">+180%</span></div>
              <div className="flex justify-between"><span>제로음료</span><span className="text-green-600">+156%</span></div>
              <div className="flex justify-between"><span>비건메뉴</span><span className="text-green-600">+98%</span></div>
            </div>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-amber-600" />
              <span className="text-sm font-medium">주의 지표</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>D7 리텐션</span><span className="text-amber-600">15.2%</span></div>
              <div className="flex justify-between"><span>가입→분석 전환</span><span className="text-amber-600">68%</span></div>
              <div className="flex justify-between"><span>강남 이탈률</span><span className="text-amber-600">+5pp</span></div>
              <div className="flex justify-between"><span>SEO 도구 사용률</span><span className="text-amber-600">34%</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
