"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Search, Star, Megaphone, Globe, CalendarDays,
  ShoppingBag, Users, BarChart3, Settings, LogOut, ChevronLeft,
  Store, Menu, X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const menuItems = [
  { icon: LayoutDashboard, label: "대시보드", href: "/dashboard" },
  { icon: Search, label: "SEO 관리", href: "/seo" },
  { icon: Star, label: "리뷰 관리", href: "/reviews" },
  { icon: Megaphone, label: "마케팅", href: "/marketing" },
  { icon: Globe, label: "내 홈페이지", href: "/website" },
  { icon: CalendarDays, label: "예약 관리", href: "/bookings" },
  { icon: ShoppingBag, label: "주문 관리", href: "/orders" },
  { icon: Users, label: "고객 관리", href: "/customers" },
  { icon: BarChart3, label: "AI 리포트", href: "/reports" },
  { icon: Settings, label: "설정", href: "/settings" },
];

function SidebarContent({ collapsed, onCollapse, onNavigate }: {
  collapsed: boolean;
  onCollapse?: (v: boolean) => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-indigo-400" />
            <span className="text-white font-bold text-lg">D2C Food</span>
          </div>
        )}
        {onCollapse && (
          <button
            onClick={() => onCollapse(!collapsed)}
            className={cn(
              "w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors",
              collapsed && "mx-auto"
            )}
          >
            <ChevronLeft className={cn("w-4 h-4 text-slate-400 transition-transform", collapsed && "rotate-180")} />
          </button>
        )}
      </div>

      {/* Store Info */}
      {!collapsed && (
        <div className="p-4 border-b border-white/5">
          <p className="text-white text-sm font-medium truncate">홍대 트러플 파스타</p>
          <p className="text-slate-500 text-xs truncate">서울 마포구 와우산로 21</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-slate-400 hover:text-white hover:bg-white/5",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-white/5">
        <button
          onClick={() => { localStorage.removeItem("isLoggedIn"); router.push("/login"); }}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-colors w-full",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>로그아웃</span>}
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile header bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-slate-950 border-b border-white/5 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-indigo-400" />
          <span className="text-white font-bold">D2C Food</span>
        </div>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10">
              <Menu className="w-5 h-5 text-slate-400" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-slate-950 border-white/5">
            <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
      {/* Mobile spacer */}
      <div className="md:hidden h-14" />

      {/* Desktop sidebar */}
      <aside className={cn(
        "hidden md:flex fixed left-0 top-0 h-screen bg-slate-950 border-r border-white/5 flex-col transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64"
      )}>
        <SidebarContent collapsed={collapsed} onCollapse={setCollapsed} />
      </aside>
    </>
  );
}
