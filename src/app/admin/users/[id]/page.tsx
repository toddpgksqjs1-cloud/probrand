"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar, CreditCard, BarChart3 } from "lucide-react";
import { use } from "react";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <Link href="/admin/users" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} /> 유저 목록
      </Link>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">이** (카페 운영)</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Mail size={14} /> lee***@gmail.com</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> 가입: 2026.02.15</span>
              <span className="flex items-center gap-1"><CreditCard size={14} /> 프로 (매월 15일 결제)</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">마지막 활동: 2026-03-12 14:20 | ID: user_{id}</div>
          </div>
          <div className="flex gap-2">
            <button className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">메모 추가</button>
            <button className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">이메일 발송</button>
            <button className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">구독 관리</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "분석 횟수", value: "12" },
          { label: "방문 횟수", value: "34" },
          { label: "등록 매장", value: "1" },
          { label: "구독 기간", value: "25일" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className="text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-200">
          {["활동로그", "매장정보", "분석이력", "구독", "CS"].map((tab, idx) => (
            <button
              key={tab}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                idx === 0 ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Activity Log */}
        <div className="p-6">
          <div className="space-y-0">
            {[
              { date: "2026.03.12", items: [
                { time: "14:20", action: "SEO 키워드 리서치 사용", detail: "'강남역 카페' 검색" },
                { time: "14:05", action: "네이버 플레이스 재분석", detail: "78점 (A등급)" },
                { time: "13:50", action: "로그인", detail: "Chrome / macOS" },
              ]},
              { date: "2026.03.11", items: [
                { time: "16:30", action: "홈페이지 에디터 사용", detail: "12분 체류" },
                { time: "16:15", action: "블로그 제목 추천 3개 복사", detail: "AI 생성" },
                { time: "15:40", action: "로그인", detail: "Chrome / macOS" },
              ]},
              { date: "2026.03.09", items: [
                { time: "11:20", action: "개선 액션 2개 완료 체크", detail: "사진 추가, 리뷰 답변" },
                { time: "11:00", action: "분석 결과 리포트 다운로드", detail: "PDF 형식" },
              ]},
            ].map((day) => (
              <div key={day.date} className="mb-6">
                <div className="text-sm font-medium text-gray-500 mb-3">{day.date}</div>
                <div className="space-y-3 ml-4 border-l-2 border-gray-100 pl-4">
                  {day.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 -ml-[21px]" />
                      <span className="text-xs text-gray-400 w-12 shrink-0 mt-0.5">{item.time}</span>
                      <div>
                        <div className="text-sm">{item.action}</div>
                        <div className="text-xs text-gray-400">{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold mb-4">등록 매장</h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">강남 디저트카페</div>
              <div className="text-sm text-gray-500 mt-1">업종: 카페/디저트 | 위치: 서울 강남구</div>
              <div className="text-sm text-gray-500">최근 점수: 78점 (A등급) | 분석 12회</div>
              <div className="text-sm text-gray-500">개선 완료: 8/12 항목</div>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              매장 상세 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
