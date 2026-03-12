"use client";

import { FileText, Layout, Settings, Database } from "lucide-react";

export default function ContentPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Template Management */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layout size={18} className="text-blue-600" />
            <h3 className="font-bold">홈페이지 템플릿 관리</h3>
          </div>
          <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            + 템플릿 추가
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-4 py-3 font-medium">템플릿명</th>
                <th className="text-center px-4 py-3 font-medium">업종</th>
                <th className="text-center px-4 py-3 font-medium">사용 수</th>
                <th className="text-center px-4 py-3 font-medium">완성률</th>
                <th className="text-center px-4 py-3 font-medium">상태</th>
                <th className="px-4 py-3 font-medium">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { name: "카페 모던", category: "카페", usage: 234, completion: 78, status: "active" },
                { name: "카페 내추럴", category: "카페", usage: 189, completion: 82, status: "active" },
                { name: "한식 전통", category: "음식점", usage: 156, completion: 71, status: "active" },
                { name: "한식 모던", category: "음식점", usage: 142, completion: 75, status: "active" },
                { name: "뷰티 심플", category: "미용실", usage: 89, completion: 68, status: "active" },
                { name: "피트니스", category: "헬스", usage: 45, completion: 65, status: "draft" },
              ].map((t) => (
                <tr key={t.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{t.name}</td>
                  <td className="px-4 py-3 text-center text-gray-500">{t.category}</td>
                  <td className="px-4 py-3 text-center">{t.usage}</td>
                  <td className="px-4 py-3 text-center">{t.completion}%</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      t.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                    }`}>
                      {t.status === "active" ? "활성" : "초안"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-blue-600 hover:text-blue-700">편집</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guide Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-green-600" />
            <h3 className="font-bold">가이드 콘텐츠</h3>
          </div>
          <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            + 가이드 추가
          </button>
        </div>
        <div className="space-y-3">
          {[
            { title: "네이버 플레이스 사진 최적화 가이드", views: 3420, category: "사진" },
            { title: "리뷰 답변 작성 가이드", views: 2810, category: "리뷰" },
            { title: "키워드 소개글 작성법", views: 1920, category: "키워드" },
            { title: "메뉴판 사진 촬영 팁", views: 1680, category: "사진" },
            { title: "블로그 SEO 기초 가이드", views: 1450, category: "SEO" },
          ].map((guide) => (
            <div key={guide.title} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium">{guide.title}</span>
                <span className="text-xs text-gray-400 ml-2">{guide.category}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">조회 {guide.views.toLocaleString()}</span>
                <button className="text-xs text-blue-600 hover:text-blue-700">편집</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Algorithm Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={18} className="text-amber-600" />
          <h3 className="font-bold">분석 알고리즘 설정</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { category: "리뷰 관리", weight: 25, items: "답변율, 평점, 리뷰 수" },
            { category: "사진", weight: 20, items: "대표사진, 수량, 최신성" },
            { category: "기본정보", weight: 15, items: "상호, 주소, 전화, 소개" },
            { category: "키워드 최적화", weight: 15, items: "소개글, 메뉴명, 태그" },
            { category: "메뉴/상품", weight: 15, items: "등록, 가격, 사진, 설명" },
            { category: "영업시간/편의", weight: 10, items: "시간, 휴무, 시설" },
          ].map((algo) => (
            <div key={algo.category} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{algo.category}</span>
                <span className="text-sm text-blue-600 font-bold">{algo.weight}점</span>
              </div>
              <span className="text-xs text-gray-400">{algo.items}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
