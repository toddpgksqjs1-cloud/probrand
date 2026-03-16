import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-2xl">H</span>
        </div>
        <h1 className="text-6xl font-bold text-gray-200 mb-2">404</h1>
        <h2 className="text-xl font-bold text-gray-900 mb-2">페이지를 찾을 수 없습니다</h2>
        <p className="text-gray-500 mb-8">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            홈으로 가기
          </Link>
          <Link
            href="/dashboard"
            className="border border-gray-200 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
          >
            대시보드
          </Link>
        </div>
      </div>
    </div>
  );
}
