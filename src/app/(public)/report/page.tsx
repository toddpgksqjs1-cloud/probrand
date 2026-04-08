"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DiagnosticReport } from "@/lib/types";
import { ReportView } from "@/components/report/report-view";
import { sampleDiagnosticReport } from "@/lib/mock-data/sample-store";

export default function ReportPage() {
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("diagnosticReport");
    if (stored) {
      try {
        setReport(JSON.parse(stored));
      } catch {
        setReport(sampleDiagnosticReport);
      }
    } else {
      // Use sample data for development
      setReport(sampleDiagnosticReport);
    }
  }, []);

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => router.push("/")} className="text-white font-bold text-lg">
            D2C Food
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
          >
            무료로 시작하기
          </button>
        </div>
      </header>
      <ReportView report={report} />
    </div>
  );
}
