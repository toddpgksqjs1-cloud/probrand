"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, BarChart3, Globe, Zap, ArrowRight, Star, CheckCircle, TrendingUp, Users, Shield } from "lucide-react";

export default function LandingPage() {
  const [url, setUrl] = useState("");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold">Hyun</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition">
              로그인
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              무료 시작하기
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-3xl mx-auto text-center animate-enter-up">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-sm px-4 py-1.5 rounded-full mb-6">
            <TrendingUp size={14} />
            <span>평균 +15점 개선 효과</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            내 매장, 네이버에서
            <br />
            <span className="text-gradient">몇 점</span>일까?
          </h1>
          <p className="text-lg text-gray-500 mb-10">
            30초 만에 무료로 내 네이버 플레이스를 진단해보세요.
            <br />
            점수와 함께 구체적인 개선 방법을 알려드립니다.
          </p>

          <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="네이버 플레이스 URL을 입력하세요..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>
            <Link
              href="/dashboard/analysis"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 shrink-0"
            >
              분석하기
              <ArrowRight size={18} />
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">가입 없이 바로 분석 가능 &middot; 30초 소요</p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">18,420</div>
              <div className="text-gray-500 mt-1">등록 사업장</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">286,400+</div>
              <div className="text-gray-500 mt-1">수집된 데이터</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">평균 +15점</div>
              <div className="text-gray-500 mt-1">3개월 개선 효과</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">어떤 기능이 있나요?</h2>
          <p className="text-gray-500 text-center mb-12">소상공인에게 꼭 필요한 마케팅 도구만 모았습니다.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
                <BarChart3 className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">네이버 플레이스 분석기</h3>
              <p className="text-gray-500 leading-relaxed">
                100점 만점 마케팅 점수 진단.
                리뷰, 사진, 키워드, 메뉴까지
                항목별 개선 가이드를 제공합니다.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">점수 진단</span>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">경쟁 비교</span>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">개선 가이드</span>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-5">
                <Zap className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">SEO 전략 도구</h3>
              <p className="text-gray-500 leading-relaxed">
                우리 동네 검색 키워드를 찾아드려요.
                블로그 제목 추천, 콘텐츠 가이드까지
                한 번에 해결합니다.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">키워드 발굴</span>
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">블로그 가이드</span>
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">순위 추적</span>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-5">
                <Globe className="text-amber-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">홈페이지 빌더</h3>
              <p className="text-gray-500 leading-relaxed">
                5분 만에 내 매장 홈페이지 완성.
                네이버 플레이스에서 정보를 자동으로
                가져와 초안을 만들어드립니다.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded">자동 생성</span>
                <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded">무료 도메인</span>
                <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded">모바일 최적화</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">사장님들이 말하는 Hyun</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                &quot;리뷰 답변율 높이라는 게 이런 뜻이었구나. 점수 52점에서 시작해서 3개월 만에 78점까지 올렸어요. 실제로 손님도 늘었습니다.&quot;
              </p>
              <div className="text-sm text-gray-500">강남구 음식점 K사장님</div>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                &quot;블로그 키워드 잡는 법을 처음 알았어요. SEO 도구로 찾은 키워드로 블로그 쓰니까 검색 유입이 확 늘었습니다.&quot;
              </p>
              <div className="text-sm text-gray-500">마포구 카페 L대표님</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">요금제</h2>
          <p className="text-gray-500 text-center mb-12">무료로 시작하고, 필요할 때 업그레이드하세요.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-2xl p-8">
              <h3 className="text-lg font-bold mb-1">무료</h3>
              <div className="text-3xl font-bold mb-6">
                0<span className="text-base font-normal text-gray-500">원/월</span>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500 shrink-0" /> 분석 3회/월</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500 shrink-0" /> 기본 개선 가이드</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500 shrink-0" /> 키워드 5개</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500 shrink-0" /> 홈페이지 1개 (서브도메인)</li>
              </ul>
              <Link href="/dashboard" className="block mt-8 text-center py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition">
                시작하기
              </Link>
            </div>

            <div className="border-2 border-blue-600 rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                인기
              </div>
              <h3 className="text-lg font-bold mb-1">프로</h3>
              <div className="text-3xl font-bold mb-6">
                29,000<span className="text-base font-normal text-gray-500">원/월</span>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500 shrink-0" /> 무제한 분석</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500 shrink-0" /> 경쟁 매장 비교 (3개)</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500 shrink-0" /> SEO 도구 전체</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500 shrink-0" /> 홈페이지 (커스텀 도메인)</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500 shrink-0" /> 월간 리포트</li>
              </ul>
              <Link href="/dashboard" className="block mt-8 text-center py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
                14일 무료체험
              </Link>
            </div>

            <div className="border border-gray-200 rounded-2xl p-8">
              <h3 className="text-lg font-bold mb-1">비즈니스</h3>
              <div className="text-3xl font-bold mb-6">
                79,000<span className="text-base font-normal text-gray-500">원/월</span>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500 shrink-0" /> 프로 기능 전체</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500 shrink-0" /> 다매장 관리 (10개)</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500 shrink-0" /> 팀원 초대 (3명)</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500 shrink-0" /> 주간 + 월간 리포트</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500 shrink-0" /> 전용 CS</li>
              </ul>
              <Link href="/dashboard" className="block mt-8 text-center py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition">
                상담 신청
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">지금 바로 내 매장 점수를 확인하세요</h2>
          <p className="text-blue-100 mb-8">무료로 시작, 30초면 충분합니다.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition"
          >
            무료로 시작하기
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">H</span>
            </div>
            <span>Hyun</span>
          </div>
          <div className="flex gap-6">
            <span>이용약관</span>
            <span>개인정보</span>
            <span>고객센터</span>
          </div>
          <span>&copy; Hyun 2026</span>
        </div>
      </footer>
    </div>
  );
}
