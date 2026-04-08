"use client";

import { PlatformSidebar } from "@/components/platform/sidebar";
import { usePlatformStore } from "@/lib/store/platform-store";
import { Button } from "@/components/ui/button";
import { Database, Download } from "lucide-react";
import { toast } from "sonner";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const stores = usePlatformStore((s) => s.stores);
  const loadSampleData = usePlatformStore((s) => s.loadSampleData);

  const isEmpty = stores.length === 0;

  return (
    <div className="min-h-screen bg-slate-950">
      <PlatformSidebar />
      <main className="md:ml-64 min-h-screen pt-14 md:pt-0">
        {isEmpty && (
          <div className="mx-6 mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white text-sm font-medium">데이터가 비어있습니다</p>
                <p className="text-slate-400 text-xs">샘플 데이터를 불러오거나 직접 가맹점을 추가해보세요</p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-500"
              onClick={() => {
                loadSampleData();
                toast.success("샘플 데이터 12개 가맹점, 15명 사용자가 로드되었습니다");
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
