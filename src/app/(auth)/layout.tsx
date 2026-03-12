import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">Hyun</span>
        </Link>
      </div>

      {/* Page Content */}
      {children}

      {/* Footer */}
      <p className="mt-8 text-xs text-gray-400">
        &copy; Hyun 2026 &middot; 소상공인 마케팅 코치
      </p>
    </div>
  );
}
