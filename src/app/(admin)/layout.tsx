"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { useAdminStore } from "@/lib/store/admin-store";
import { Button } from "@/components/ui/button";
import { Database, Download } from "lucide-react";
import { toast } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const bookings = useAdminStore((s) => s.bookings);
  const loadSampleData = useAdminStore((s) => s.loadSampleData);
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (!loggedIn) {
      router.push("/login");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-500 text-sm">로딩 중...</div>
      </div>
    );
  }

  const isEmpty = bookings.length === 0;

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />
      <main className="md:ml-64 min-h-screen pt-14 md:pt-0">
        {isEmpty && (
          <div className="mx-6 mt-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-white text-sm font-medium">데이터가 비어있습니다</p>
                <p className="text-slate-400 text-xs">샘플 데이터를 불러와서 기능을 체험해보세요</p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-500"
              onClick={() => {
                loadSampleData();
                toast.success("샘플 데이터가 로드되었습니다");
              }}
            >
              <Download className="w-4 h-4 mr-2" /> 샘플 데이터 불러오기
            </Button>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
