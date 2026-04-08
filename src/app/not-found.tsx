import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-indigo-400 mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">페이지를 찾을 수 없습니다</h1>
        <p className="text-slate-400 mb-8">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            홈으로
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
          >
            대시보드
          </Link>
        </div>
      </div>
    </div>
  );
}
