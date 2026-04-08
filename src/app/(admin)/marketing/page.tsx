"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Megaphone, Send, Calendar, Ticket, Plus, Eye, MousePointer,
} from "lucide-react";
import { useAdminStore } from "@/lib/store/admin-store";
import { toast } from "sonner";

export default function MarketingPage() {
  const campaigns = useAdminStore((s) => s.campaigns);
  const coupons = useAdminStore((s) => s.coupons);
  const updateCampaignStatus = useAdminStore((s) => s.updateCampaignStatus);

  const totalCouponUsed = coupons.reduce((sum, c) => sum + c.totalUsed, 0);

  const handleSendCampaign = (id: string, name: string) => {
    updateCampaignStatus(id, "sent");
    toast.success(`"${name}" 캠페인이 발송되었습니다.`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">마케팅</h1>
          <p className="text-slate-400 text-sm mt-1">캠페인과 쿠폰을 관리하세요</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-500" onClick={() => toast.info("새 캠페인 생성 기능 준비 중입니다.")}>
          <Plus className="w-4 h-4 mr-2" /> 새 캠페인
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-white">{campaigns.length}</p>
            <p className="text-slate-500 text-xs">총 캠페인</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">68%</p>
            <p className="text-slate-500 text-xs">평균 열람률</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-indigo-400">25%</p>
            <p className="text-slate-500 text-xs">평균 클릭률</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{totalCouponUsed}</p>
            <p className="text-slate-500 text-xs">쿠폰 사용</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400">
            캠페인
          </TabsTrigger>
          <TabsTrigger value="coupons" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400">
            쿠폰 관리
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400">
            시즌 이벤트
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-4 space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                      <Megaphone className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{campaign.name}</h3>
                      <p className="text-slate-500 text-xs">
                        {campaign.type === "kakao" ? "카카오톡" : "문자"} | 대상: {
                          campaign.targetAudience === "all" ? "전체 고객" :
                          campaign.targetAudience === "vip" ? "VIP 고객" : "이탈 고객"
                        } ({campaign.targetCount}명)
                      </p>
                    </div>
                  </div>
                  <Badge className={`${
                    campaign.status === "sent" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    campaign.status === "scheduled" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                    "bg-slate-500/10 text-slate-400 border-slate-500/20"
                  }`}>
                    {campaign.status === "sent" ? "발송 완료" : campaign.status === "scheduled" ? "예약됨" : "초안"}
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm mb-3 bg-white/3 p-3 rounded-lg">{campaign.content}</p>
                {campaign.status === "sent" && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-white text-sm font-bold">{campaign.sentCount}/{campaign.targetCount}</p>
                        <p className="text-slate-500 text-xs">발송</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-white text-sm font-bold">{campaign.openRate}%</p>
                        <p className="text-slate-500 text-xs">열람률</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-white text-sm font-bold">{campaign.clickRate}%</p>
                        <p className="text-slate-500 text-xs">클릭률</p>
                      </div>
                    </div>
                  </div>
                )}
                {campaign.status === "draft" && (
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500" onClick={() => handleSendCampaign(campaign.id, campaign.name)}>
                    <Send className="w-4 h-4 mr-1" /> 발송하기
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="coupons" className="mt-4 space-y-4">
          {coupons.map((coupon) => (
            <Card key={coupon.id} className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Ticket className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{coupon.name}</h3>
                      <p className="text-slate-500 text-xs">
                        {coupon.type === "percentage" ? `${coupon.value}% 할인` : `${coupon.value.toLocaleString()}원 할인`}
                        {coupon.minimumOrder && ` (${coupon.minimumOrder.toLocaleString()}원 이상)`}
                      </p>
                    </div>
                  </div>
                  <Badge className={coupon.isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"}>
                    {coupon.isActive ? "활성" : "비활성"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs">{coupon.validFrom} ~ {coupon.validUntil}</span>
                  <span className="text-slate-400 text-sm">
                    사용 {coupon.totalUsed}/{coupon.totalIssued}
                  </span>
                </div>
                <Progress value={(coupon.totalUsed / coupon.totalIssued) * 100} className="mt-2 h-1.5 bg-white/5" />
              </CardContent>
            </Card>
          ))}
          <Button className="w-full bg-white/5 hover:bg-white/10 text-slate-400 border border-dashed border-white/10" onClick={() => toast.info("새 쿠폰 생성 기능 준비 중입니다.")}>
            <Plus className="w-4 h-4 mr-2" /> 새 쿠폰 만들기
          </Button>
        </TabsContent>

        <TabsContent value="seasonal" className="mt-4">
          <Card className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-pink-400" />
                <h3 className="text-white font-bold text-lg">3월 추천 이벤트</h3>
              </div>
              <div className="space-y-3">
                {[
                  { name: "화이트데이 이벤트 (3/14)", desc: "커플 세트 메뉴 + 디저트 서비스", impact: "매출 +25% 예상" },
                  { name: "봄맞이 신메뉴 프로모션", desc: "신메뉴 출시 기념 10% 할인", impact: "신규 고객 유입 +15%" },
                  { name: "졸업/입학 시즌 단체 할인", desc: "4인 이상 단체 예약 시 15% 할인", impact: "단체 예약 +30%" },
                ].map((event, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{event.name}</p>
                      <p className="text-slate-400 text-xs">{event.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 text-xs">{event.impact}</p>
                      <Button size="sm" variant="ghost" className="text-indigo-400 text-xs h-7 mt-1" onClick={() => toast.success(`"${event.name}" 이벤트가 적용되었습니다.`)}>
                        적용하기
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
