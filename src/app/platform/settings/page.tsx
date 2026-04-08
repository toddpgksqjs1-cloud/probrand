"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Shield, Bell, Database, Key, Download, Trash2 } from "lucide-react";
import { usePlatformStore } from "@/lib/store/platform-store";
import { toast } from "sonner";

export default function PlatformSettingsPage() {
  const stores = usePlatformStore((s) => s.stores);
  const users = usePlatformStore((s) => s.users);
  const loadSampleData = usePlatformStore((s) => s.loadSampleData);
  const clearAllData = usePlatformStore((s) => s.clearAllData);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">플랫폼 설정</h1>
        <p className="text-slate-400 text-sm mt-1">시스템 설정을 관리합니다</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-rose-400" /> 관리자 계정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-slate-400 text-sm">관리자 이메일</label>
              <input
                type="email"
                defaultValue="admin@probrand.co.kr"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-rose-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-400 text-sm">현재 비밀번호</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-rose-500/50"
              />
            </div>
            <Button className="bg-rose-600 hover:bg-rose-500" onClick={() => toast.success("설정이 저장되었습니다.")}>
              저장
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-400" /> 알림 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "새 가맹점 가입 알림", checked: true },
              { label: "이탈 위험 가맹점 알림", checked: true },
              { label: "진단 점수 하락 알림", checked: false },
              { label: "일간 리포트 이메일", checked: true },
            ].map((item) => (
              <label key={item.label} className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">{item.label}</span>
                <input type="checkbox" defaultChecked={item.checked} className="accent-rose-500" />
              </label>
            ))}
            <Button className="bg-rose-600 hover:bg-rose-500" onClick={() => toast.success("알림 설정이 저장되었습니다.")}>
              저장
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" /> API 키 관리
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-white/3 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Naver API Key</p>
                <p className="text-slate-600 text-xs">pb_naver_••••••••••••</p>
              </div>
              <Button size="sm" variant="ghost" className="text-slate-400" onClick={() => toast.info("API 키 복사됨")}>복사</Button>
            </div>
            <div className="p-3 rounded-lg bg-white/3 flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Claude AI API Key</p>
                <p className="text-slate-600 text-xs">sk-ant-••••••••••••</p>
              </div>
              <Button size="sm" variant="ghost" className="text-slate-400" onClick={() => toast.info("API 키 복사됨")}>복사</Button>
            </div>
            <Button variant="outline" className="border-white/10 text-slate-400 hover:text-white" onClick={() => toast.info("새 API 키 생성 (준비중)")}>
              + 새 API 키 추가
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" /> 데이터 관리
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-white/3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-white text-sm font-medium">현재 데이터</p>
              </div>
              <p className="text-slate-500 text-xs mb-3">가맹점 {stores.length}개 | 사용자 {users.length}명</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-500"
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
            <div className="p-3 rounded-lg bg-white/3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-sm font-medium">데이터 내보내기</p>
                <p className="text-slate-500 text-xs">JSON 형식</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-white/10 text-slate-400 hover:text-white"
                onClick={() => {
                  const data = JSON.stringify({ stores, users }, null, 2);
                  const blob = new Blob([data], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `probrand-platform-${new Date().toISOString().split("T")[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success("데이터가 내보내졌습니다");
                }}
              >
                내보내기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
