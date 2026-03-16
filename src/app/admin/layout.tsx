"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Database,
  FileText,
  CreditCard,
  Settings,
  ArrowLeft,
  Activity,
  Shield,
  LogOut,
} from "lucide-react";

const ADMIN_SESSION_KEY = "hyun_admin_session";

const navItems = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/users", label: "유저 관리", icon: Users },
  { href: "/admin/data", label: "데이터 분석", icon: Database },
  { href: "/admin/content", label: "콘텐츠 관리", icon: FileText },
  { href: "/admin/subscriptions", label: "구독/결제", icon: CreditCard },
  { href: "/admin/system", label: "시스템", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (session === "authenticated") {
      setIsAdminAuth(true);
    }
    setIsChecking(false);
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        localStorage.setItem(ADMIN_SESSION_KEY, "authenticated");
        setIsAdminAuth(true);
        setError("");
      } else {
        const data = await res.json();
        setError(data.error || "관리자 비밀번호가 올바르지 않습니다.");
      }
    } catch {
      setError("서버 연결에 실패했습니다.");
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdminAuth(false);
    setPassword("");
  };

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdminAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-sm text-gray-400 mt-2">슈퍼 관리자 전용 페이지입니다</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="admin-pw" className="block text-sm font-medium text-gray-300 mb-1.5">
                관리자 비밀번호
              </label>
              <input
                id="admin-pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                autoFocus
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600 transition flex items-center justify-center gap-2"
            >
              <Shield size={18} />
              관리자 로그인
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-300 transition">
              ← 유저 대시보드로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-sm">H</span>
            </div>
            <div>
              <span className="text-lg font-bold">Hyun</span>
              <span className="text-xs text-orange-400 ml-1">Admin</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-800 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            <ArrowLeft size={16} />
            유저 대시보드
          </Link>
          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition w-full"
          >
            <LogOut size={16} />
            어드민 로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold">
              {navItems.find((i) => i.href === pathname)?.label || "어드민"}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              <Activity size={12} />
              <span>시스템 정상</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>관리자: admin@hyun.io</span>
            <select className="border border-gray-200 rounded px-2 py-1 text-xs">
              <option>최근 30일</option>
              <option>최근 7일</option>
              <option>최근 90일</option>
            </select>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
