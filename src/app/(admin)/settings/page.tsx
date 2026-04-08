"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Store, Bell, CreditCard, Users, Database, Download, Trash2,
} from "lucide-react";
import { useAdminStore } from "@/lib/store/admin-store";
import { toast } from "sonner";

export default function SettingsPage() {
  const bookings = useAdminStore((s) => s.bookings);
  const orders = useAdminStore((s) => s.orders);
  const customers = useAdminStore((s) => s.customers);
  const reviews = useAdminStore((s) => s.reviews);
  const loadSampleData = useAdminStore((s) => s.loadSampleData);
  const clearAllData = useAdminStore((s) => s.clearAllData);

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">설정</h1>
        <p className="text-slate-400 text-sm mt-1">가게와 계정을 관리하세요</p>
      </div>

      {/* Store Info */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Store className="w-5 h-5 text-indigo-400" />
            가게 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">가게 이름</Label>
              <Input defaultValue="" placeholder="가게 이름을 입력하세요" className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">카테고리</Label>
              <Input defaultValue="" placeholder="예: 이탈리안 레스토랑" className="bg-white/5 border-white/10 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">주소</Label>
            <Input defaultValue="" placeholder="가게 주소를 입력하세요" className="bg-white/5 border-white/10 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">전화번호</Label>
              <Input defaultValue="" placeholder="02-0000-0000" className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">영업시간</Label>
              <Input defaultValue="" placeholder="매일 11:00 - 22:00" className="bg-white/5 border-white/10 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">네이버 플레이스 URL</Label>
            <Input defaultValue="" placeholder="https://naver.me/..." className="bg-white/5 border-white/10 text-white" />
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-500" onClick={() => toast.success("가게 정보가 저장되었습니다.")}>저장</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            알림 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "새 리뷰 알림", desc: "새 리뷰가 등록되면 알림을 받습니다", defaultOn: true },
            { label: "예약 알림", desc: "새 예약이 접수되면 알림을 받습니다", defaultOn: true },
            { label: "주문 알림", desc: "새 주문이 들어오면 알림을 받습니다", defaultOn: true },
            { label: "주간 SEO 리포트", desc: "매주 월요일 SEO 리포트를 받습니다", defaultOn: true },
            { label: "마케팅 인사이트", desc: "AI가 발견한 마케팅 기회를 알려드립니다", defaultOn: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">{item.label}</p>
                <p className="text-slate-500 text-xs">{item.desc}</p>
              </div>
              <Switch defaultChecked={item.defaultOn} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            구독 관리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">현재 플랜: Free</p>
              <p className="text-slate-400 text-sm">기본 기능 사용 중</p>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-500" onClick={() => toast.info("Pro 업그레이드 기능 준비 중입니다.")}>
              Pro 업그레이드
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Team */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            팀 멤버
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-bold">
                사
              </div>
              <div>
                <p className="text-white text-sm">사장님 (나)</p>
                <p className="text-slate-500 text-xs">owner@example.com</p>
              </div>
            </div>
            <span className="text-indigo-400 text-xs">관리자</span>
          </div>
          <Button variant="ghost" className="w-full mt-3 text-slate-400 hover:text-white border border-dashed border-white/10" onClick={() => toast.info("팀 멤버 초대 기능 준비 중입니다.")}>
            + 팀 멤버 초대
          </Button>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            데이터 관리
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 rounded-lg bg-white/3">
            <p className="text-white text-sm font-medium mb-1">현재 데이터</p>
            <p className="text-slate-500 text-xs mb-3">
              예약 {bookings.length}건 | 주문 {orders.length}건 | 고객 {customers.length}명 | 리뷰 {reviews.length}건
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-500"
                onClick={() => {
                  loadSampleData();
                  toast.success("샘플 데이터가 로드되었습니다");
                }}
              >
                <Download className="w-3 h-3 mr-1" /> 샘플 데이터 불러오기
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                onClick={() => {
                  if (!confirm("모든 데이터를 삭제하시겠습니까?")) return;
                  clearAllData();
                  toast.success("모든 데이터가 삭제되었습니다");
                }}
              >
                <Trash2 className="w-3 h-3 mr-1" /> 전체 초기화
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
