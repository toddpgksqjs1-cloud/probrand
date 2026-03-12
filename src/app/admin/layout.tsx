"use client";

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
} from "lucide-react";

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

        <div className="p-3 border-t border-gray-800">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            <ArrowLeft size={16} />
            유저 대시보드
          </Link>
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
