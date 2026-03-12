"use client";

import { Shield, Key, Activity, Server, AlertTriangle } from "lucide-react";

export default function SystemPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* System Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={18} className="text-green-600" />
          <h3 className="font-bold">시스템 상태</h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { name: "API 서버", status: "정상", uptime: "99.98%", latency: "42ms" },
            { name: "데이터베이스", status: "정상", uptime: "99.99%", latency: "12ms" },
            { name: "크롤러", status: "정상", uptime: "99.5%", latency: "850ms" },
            { name: "CDN", status: "정상", uptime: "100%", latency: "8ms" },
          ].map((sys) => (
            <div key={sys.name} className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium">{sys.name}</span>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>가동률: {sys.uptime}</div>
                <div>응답: {sys.latency}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Accounts */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-blue-600" />
            <h3 className="font-bold">관리자 계정</h3>
          </div>
          <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            + 관리자 추가
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: "Hyun (슈퍼관리자)", email: "admin@hyun.io", role: "Super Admin", lastLogin: "2026-03-12 14:00" },
            { name: "김PM", email: "pm@hyun.io", role: "PM", lastLogin: "2026-03-12 10:30" },
            { name: "이개발", email: "dev@hyun.io", role: "Developer", lastLogin: "2026-03-11 18:00" },
          ].map((admin) => (
            <div key={admin.email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium">{admin.name}</div>
                <div className="text-xs text-gray-400">{admin.email}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  admin.role === "Super Admin" ? "bg-red-100 text-red-600" :
                  admin.role === "PM" ? "bg-blue-100 text-blue-600" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {admin.role}
                </span>
                <span className="text-xs text-gray-400">{admin.lastLogin}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key size={18} className="text-amber-600" />
          <h3 className="font-bold">API 키 관리</h3>
        </div>
        <div className="space-y-3">
          {[
            { name: "네이버 검색 API", key: "naver_***_abc123", status: "active", usage: "2,340/5,000" },
            { name: "Amplitude", key: "amp_***_xyz789", status: "active", usage: "8.2M/10M" },
            { name: "Claude API (분석)", key: "sk-***_hyun01", status: "active", usage: "1,240/10,000" },
            { name: "AWS S3", key: "AKIA***_s3prod", status: "active", usage: "12GB/50GB" },
          ].map((api) => (
            <div key={api.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div>
                  <div className="text-sm font-medium">{api.name}</div>
                  <div className="text-xs text-gray-400 font-mono">{api.key}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">{api.usage}</span>
                <button className="text-xs text-blue-600 hover:text-blue-700">갱신</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Log */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={18} className="text-red-500" />
          <h3 className="font-bold">최근 에러 로그</h3>
        </div>
        <div className="space-y-2 text-sm">
          {[
            { time: "14:18", level: "WARN", message: "네이버 크롤링 속도 제한 감지 (429)", count: 3 },
            { time: "13:45", level: "ERROR", message: "분석 타임아웃 (place_id: 38291)", count: 1 },
            { time: "12:00", level: "INFO", message: "일일 배치 작업 완료 (데이터 정제)", count: 1 },
            { time: "09:30", level: "WARN", message: "Amplitude 이벤트 큐 지연 (2.1초)", count: 5 },
          ].map((log, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded font-mono text-xs">
              <span className="text-gray-400">{log.time}</span>
              <span className={`px-1.5 py-0.5 rounded ${
                log.level === "ERROR" ? "bg-red-100 text-red-600" :
                log.level === "WARN" ? "bg-amber-100 text-amber-600" :
                "bg-blue-100 text-blue-600"
              }`}>
                {log.level}
              </span>
              <span className="flex-1">{log.message}</span>
              {log.count > 1 && (
                <span className="text-gray-400">x{log.count}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
