import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Hyun - 소상공인 마케팅 코치",
    template: "%s | Hyun",
  },
  description: "30초 만에 내 네이버 플레이스 점수를 진단하고, 맞춤 SEO 전략을 세우세요. 소상공인 마케팅 코치 Hyun.",
  keywords: ["소상공인", "마케팅", "네이버 플레이스", "SEO", "매장 분석", "마케팅 코치"],
  openGraph: {
    title: "Hyun - 소상공인 마케팅 코치",
    description: "30초 만에 내 매장 네이버 플레이스 점수를 확인하세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "Hyun",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
