"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe, Eye, Palette, ImageIcon, UtensilsCrossed, Link2,
  ExternalLink, Settings, Smartphone, Monitor,
} from "lucide-react";
import { sampleStore } from "@/lib/mock-data/sample-store";

export default function WebsitePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">내 홈페이지</h1>
          <p className="text-slate-400 text-sm mt-1">가게 홈페이지를 관리하세요</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5">
            <Eye className="w-4 h-4 mr-2" /> 미리보기
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-500">
            <ExternalLink className="w-4 h-4 mr-2" /> 홈페이지 열기
          </Button>
        </div>
      </div>

      {/* Website Preview */}
      <Card className="bg-white/5 border-white/10 overflow-hidden">
        <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-slate-400 text-xs bg-slate-700 px-3 py-0.5 rounded-full">
              hongdae-truffle-pasta.d2cfood.kr
            </span>
          </div>
        </div>
        <CardContent className="p-8 bg-gradient-to-b from-slate-900 to-slate-950">
          {/* Mock Website Preview */}
          <div className="max-w-lg mx-auto text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-indigo-500/20 mx-auto flex items-center justify-center">
              <UtensilsCrossed className="w-10 h-10 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{sampleStore.name}</h2>
              <p className="text-slate-400 mt-1">{sampleStore.category}</p>
              <p className="text-slate-500 text-sm mt-2">{sampleStore.address}</p>
            </div>
            <div className="flex justify-center gap-3">
              <Button className="bg-indigo-600 hover:bg-indigo-500">예약하기</Button>
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">배달 주문</Button>
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">포장 주문</Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {sampleStore.menuItems.slice(0, 3).map((menu) => (
                <div key={menu.id} className="p-3 rounded-xl bg-white/5 text-center">
                  <div className="w-full h-16 rounded-lg bg-white/5 mb-2 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-slate-600" />
                  </div>
                  <p className="text-white text-sm font-medium truncate">{menu.name}</p>
                  <p className="text-indigo-400 text-sm">{menu.price.toLocaleString()}원</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Management Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: Palette, title: "테마 변경", desc: "홈페이지 디자인과 색상을 변경하세요", badge: "3개 테마" },
          { icon: UtensilsCrossed, title: "메뉴 관리", desc: "메뉴 추가, 수정, 가격 변경", badge: `${sampleStore.menuItems.length}개 메뉴` },
          { icon: ImageIcon, title: "사진 관리", desc: "가게 사진을 추가하고 관리하세요", badge: `${sampleStore.photos.length}장` },
          { icon: Link2, title: "도메인 설정", desc: "커스텀 도메인을 연결하세요", badge: "기본 도메인" },
          { icon: Settings, title: "SEO 설정", desc: "메타태그, 구조화 데이터 자동 관리", badge: "자동 적용" },
          { icon: Globe, title: "SNS 연결", desc: "인스타그램, 블로그 링크 추가", badge: "미연결" },
        ].map((item, i) => (
          <Card key={i} className="bg-white/5 border-white/10 hover:bg-white/8 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm font-medium">{item.title}</h3>
                <p className="text-slate-500 text-xs">{item.desc}</p>
              </div>
              <Badge variant="secondary" className="bg-white/5 text-slate-500 border-0 text-xs shrink-0">
                {item.badge}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
