"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, TrendingDown, Star, CalendarDays, ShoppingBag,
  Users, Search, MessageSquare, ArrowRight, CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useAdminStore } from "@/lib/store/admin-store";

function formatDate(d: Date) {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

const todoItems = [
  { id: 1, text: '"홍대 혼밥 파스타" 블로그 글 발행', category: "SEO", href: "/seo", priority: "high" },
  { id: 2, text: "신규 리뷰 3건 답글 달기", category: "리뷰", href: "/reviews", priority: "high" },
  { id: 3, text: "메뉴 사진 2장 추가 업로드", category: "홈페이지", href: "/website", priority: "medium" },
  { id: 4, text: "VIP 고객 감사 쿠폰 발송 확인", category: "마케팅", href: "/marketing", priority: "medium" },
  { id: 5, text: "내일 예약 4건 확인", category: "예약", href: "/bookings", priority: "low" },
];

const keywordChanges = [
  { keyword: "홍대 파스타", rank: 8, change: 4, direction: "up" },
  { keyword: "홍대 데이트 파스타", rank: 5, change: 3, direction: "up" },
  { keyword: "마포 생면파스타", rank: 2, change: 1, direction: "up" },
  { keyword: "홍대 점심 맛집", rank: 25, change: -2, direction: "down" },
];

export default function DashboardPage() {
  const customers = useAdminStore((s) => s.customers);
  const reviews = useAdminStore((s) => s.reviews);
  const bookings = useAdminStore((s) => s.bookings);
  const orders = useAdminStore((s) => s.orders);

  const today = new Date().toISOString().split("T")[0];
  const todayBookingsCount = bookings.filter((b) => b.date === today).length;
  const todayOrdersCount = orders.length;

  // Dynamic customer stats
  const totalCustomers = customers.length;
  const vipCount = customers.filter((c) => c.tier === "vip").length;
  const returningCount = customers.filter((c) => c.totalVisits >= 2).length;
  const returnRate = totalCustomers > 0 ? Math.round((returningCount / totalCustomers) * 100) : 0;
  const avgSpend = totalCustomers > 0 ? Math.round(customers.reduce((sum, c) => sum + c.totalSpent / Math.max(c.totalVisits, 1), 0) / totalCustomers) : 0;

  // Recent reviews (last 3)
  const recentReviews = [...reviews]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)
    .map((r) => {
      const daysDiff = Math.floor((Date.now() - new Date(r.date).getTime()) / (1000 * 60 * 60 * 24));
      const dateLabel = daysDiff === 0 ? "오늘" : daysDiff === 1 ? "어제" : `${daysDiff}일 전`;
      return { ...r, dateLabel, hasReply: !!r.reply };
    });

  const stats = [
    { label: "SEO 점수", value: "72", change: "+5", trend: "up", icon: Search, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { label: "이번 주 리뷰", value: String(reviews.length), change: "+3", trend: "up", icon: Star, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "오늘 예약", value: String(todayBookingsCount), change: "0", trend: "neutral", icon: CalendarDays, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "오늘 주문", value: String(todayOrdersCount), change: "+5", trend: "up", icon: ShoppingBag, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">안녕하세요, 사장님</h1>
          <p className="text-slate-400 text-sm mt-1">오늘의 가게 현황을 확인하세요</p>
        </div>
        <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
          {formatDate(new Date())}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                {stat.trend !== "neutral" && (
                  <div className={`flex items-center gap-1 text-xs ${
                    stat.trend === "up" ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {stat.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.change}
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-slate-500 text-sm">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Todo List */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-400" />
              오늘의 할 일
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todoItems.map((item) => (
              <Link key={item.id} href={item.href} className="flex items-center gap-3 p-3 rounded-lg bg-white/3 hover:bg-white/5 transition-colors group">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  item.priority === "high" ? "bg-red-400" : item.priority === "medium" ? "bg-amber-400" : "bg-slate-400"
                }`} />
                <span className="text-slate-300 text-sm flex-1">{item.text}</span>
                <Badge variant="secondary" className="bg-white/5 text-slate-500 text-xs border-0">
                  {item.category}
                </Badge>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                최근 리뷰
              </CardTitle>
              <Link href="/reviews" className="text-indigo-400 text-sm hover:text-indigo-300">
                전체 보기
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentReviews.map((review) => (
              <div key={review.id} className="p-3 rounded-lg bg-white/3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">{review.author}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-3 h-3 ${j < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"}`} />
                      ))}
                    </div>
                  </div>
                  <span className="text-slate-500 text-xs">{review.dateLabel}</span>
                </div>
                <p className="text-slate-400 text-sm truncate">{review.content}</p>
                {!review.hasReply && (
                  <Link href="/reviews">
                    <Button variant="ghost" size="sm" className="mt-2 text-indigo-400 hover:text-indigo-300 h-7 px-2 text-xs">
                      답글 작성
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Keyword Rankings */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-400" />
                키워드 순위 변동
              </CardTitle>
              <Link href="/seo" className="text-indigo-400 text-sm hover:text-indigo-300">
                상세 보기
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {keywordChanges.map((kw, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/3">
                <span className="text-slate-300 text-sm">{kw.keyword}</span>
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold">{kw.rank}위</span>
                  <div className={`flex items-center gap-1 text-xs ${
                    kw.direction === "up" ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {kw.direction === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(kw.change)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Customer Stats - Dynamic */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              고객 현황
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/3 text-center">
                <p className="text-2xl font-bold text-white">{totalCustomers}</p>
                <p className="text-slate-500 text-xs">총 고객</p>
              </div>
              <div className="p-3 rounded-lg bg-white/3 text-center">
                <p className="text-2xl font-bold text-indigo-400">{vipCount}</p>
                <p className="text-slate-500 text-xs">VIP 고객</p>
              </div>
              <div className="p-3 rounded-lg bg-white/3 text-center">
                <p className="text-2xl font-bold text-emerald-400">{returnRate}%</p>
                <p className="text-slate-500 text-xs">재방문율</p>
              </div>
              <div className="p-3 rounded-lg bg-white/3 text-center">
                <p className="text-2xl font-bold text-amber-400">{avgSpend.toLocaleString()}</p>
                <p className="text-slate-500 text-xs">평균 객단가</p>
              </div>
            </div>
            <Link href="/customers">
              <Button variant="ghost" className="w-full text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/5">
                고객 관리 바로가기 <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
