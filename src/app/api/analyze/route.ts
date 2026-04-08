import { NextRequest, NextResponse } from "next/server";
import { sampleStore, sampleDiagnosticReport } from "@/lib/mock-data/sample-store";
import { generateDiagnosticReport } from "@/lib/services/ai-analyzer";
import { isValidNaverPlaceUrl } from "@/lib/services/naver-crawler";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL이 필요합니다." }, { status: 400 });
    }

    // Simulate analysis delay (1 second)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let report;
    let usedSampleData = false;

    if (isValidNaverPlaceUrl(url)) {
      // Valid Naver URL: generate report from sample store data
      const storeInfo = { ...sampleStore, naverPlaceUrl: url };
      report = await generateDiagnosticReport(storeInfo);
    } else {
      // Invalid URL: fallback to pre-built sample report
      report = {
        ...sampleDiagnosticReport,
        storeInfo: { ...sampleDiagnosticReport.storeInfo, naverPlaceUrl: url },
        generatedAt: new Date().toISOString(),
      };
      usedSampleData = true;
    }

    return NextResponse.json({ success: true, report, usedSampleData });
  } catch (error) {
    // Ultimate fallback
    const fallbackReport = {
      ...sampleDiagnosticReport,
      generatedAt: new Date().toISOString(),
    };
    return NextResponse.json({ success: true, report: fallbackReport, usedSampleData: true });
  }
}
