import { StoreInfo } from "@/lib/types";

/**
 * Naver Place Crawler Service
 * TODO: Implement actual crawling with Puppeteer when API keys are available
 * Currently returns mock data for development
 */
export async function crawlNaverPlace(url: string): Promise<StoreInfo> {
  // Validate URL format
  if (!isValidNaverPlaceUrl(url)) {
    throw new Error("유효하지 않은 네이버 플레이스 URL입니다.");
  }

  // TODO: Replace with actual Puppeteer crawling
  // Simulate crawling delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Return mock data for now
  const { sampleStore } = await import("@/lib/mock-data/sample-store");
  return { ...sampleStore, naverPlaceUrl: url };
}

export function isValidNaverPlaceUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/naver\.me\/.+/,
    /^https?:\/\/map\.naver\.com\/.+/,
    /^https?:\/\/m\.place\.naver\.com\/.+/,
    /^https?:\/\/place\.naver\.com\/.+/,
  ];
  return patterns.some((pattern) => pattern.test(url));
}

export function extractPlaceId(url: string): string | null {
  const match = url.match(/\/(\d+)/);
  return match ? match[1] : null;
}
