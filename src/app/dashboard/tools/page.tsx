"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, QrCode, Calculator, Clock, FileText, Sparkles, X, Star, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { storesStorage } from "@/lib/storage";
import { generateReviewReply, generateBusinessDescription } from "@/lib/analysis-engine";
import QRCode from "qrcode";

type ToolId = "review" | "qr" | "calculator" | "hours" | "menuDesign" | "description";

interface ToolDef {
  id: ToolId;
  icon: typeof MessageSquare;
  name: string;
  description: string;
  badge: string | null;
  color: string;
  locked?: boolean;
}

const tools: ToolDef[] = [
  {
    id: "review",
    icon: MessageSquare,
    name: "리뷰 답글 생성기",
    description: "AI가 고객 리뷰에 맞는 정성스러운 답글을 자동 생성합니다.",
    badge: "AI",
    color: "blue",
  },
  {
    id: "qr",
    icon: QrCode,
    name: "QR 코드 생성기",
    description: "매장 메뉴판, 홈페이지, 네이버 플레이스 링크를 QR로 변환합니다.",
    badge: null,
    color: "green",
  },
  {
    id: "calculator",
    icon: Calculator,
    name: "매출 계산기",
    description: "일매출, 원가율, 임대료를 입력하면 손익을 계산해드립니다.",
    badge: null,
    color: "amber",
  },
  {
    id: "hours",
    icon: Clock,
    name: "영업시간 최적화",
    description: "상권 데이터 기반으로 최적 영업시간을 추천합니다.",
    badge: "Pro",
    color: "purple",
    locked: true,
  },
  {
    id: "menuDesign",
    icon: FileText,
    name: "메뉴판 디자인",
    description: "메뉴 정보를 입력하면 깔끔한 디지털 메뉴판을 만들어줍니다.",
    badge: "Pro",
    color: "pink",
    locked: true,
  },
  {
    id: "description",
    icon: Sparkles,
    name: "매장 소개글 생성",
    description: "업종과 특징을 입력하면 AI가 매력적인 소개글을 작성합니다.",
    badge: "AI",
    color: "indigo",
  },
];

const colorMap: Record<string, { bg: string; icon: string }> = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600" },
  green: { bg: "bg-green-50", icon: "text-green-600" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600" },
  pink: { bg: "bg-pink-50", icon: "text-pink-600" },
  indigo: { bg: "bg-indigo-50", icon: "text-indigo-600" },
};

export default function ToolsPage() {
  const { user } = useAuth();
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);

  // Review Reply State
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTone, setReviewTone] = useState<"formal" | "friendly" | "casual">("friendly");
  const [generatedReply, setGeneratedReply] = useState("");

  // QR Code State
  const [qrUrl, setQrUrl] = useState("");
  const [qrImage, setQrImage] = useState("");
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Revenue Calculator State
  const [dailyCustomers, setDailyCustomers] = useState("");
  const [avgSpend, setAvgSpend] = useState("");
  const [daysOpen, setDaysOpen] = useState("26");
  const [calcResult, setCalcResult] = useState<{ monthly: number; yearly: number } | null>(null);

  // Description Generator State
  const [descName, setDescName] = useState("");
  const [descCategory, setDescCategory] = useState("");
  const [descLocation, setDescLocation] = useState("");
  const [descSpecialties, setDescSpecialties] = useState("");
  const [descAtmosphere, setDescAtmosphere] = useState("");
  const [descTarget, setDescTarget] = useState("");
  const [generatedDesc, setGeneratedDesc] = useState("");

  useEffect(() => {
    if (!user) return;
    const stores = storesStorage.getAll(user.id);
    const store = stores[0];
    if (store) {
      setQrUrl(store.naverPlaceUrl || "");
      setDescName(store.name || "");
      setDescCategory(store.category || "");
      setDescLocation(store.address || "");
    }
  }, [user]);

  const handleGenerateReply = () => {
    if (!reviewText.trim()) return;
    const stores = storesStorage.getAll(user?.id || "");
    const storeName = stores[0]?.name;
    const reply = generateReviewReply(reviewText, reviewRating, reviewTone, storeName);
    setGeneratedReply(reply);
  };

  const handleGenerateQR = async () => {
    if (!qrUrl.trim()) return;
    try {
      const dataUrl = await QRCode.toDataURL(qrUrl, {
        width: 300,
        margin: 2,
        color: { dark: "#1e293b", light: "#ffffff" },
      });
      setQrImage(dataUrl);
    } catch (err) {
      console.error("QR generation failed:", err);
    }
  };

  const handleCalculate = () => {
    const customers = parseInt(dailyCustomers) || 0;
    const spend = parseInt(avgSpend) || 0;
    const days = parseInt(daysOpen) || 26;
    const monthly = customers * spend * days;
    const yearly = monthly * 12;
    setCalcResult({ monthly, yearly });
  };

  const handleGenerateDescription = () => {
    if (!descName.trim() || !descCategory.trim()) return;
    const desc = generateBusinessDescription({
      businessName: descName,
      category: descCategory,
      location: descLocation || "서울",
      specialties: descSpecialties ? descSpecialties.split(",").map((s) => s.trim()) : undefined,
      atmosphere: descAtmosphere || undefined,
      targetCustomer: descTarget || undefined,
    });
    setGeneratedDesc(desc);
  };

  const handleToolClick = (toolId: ToolId, locked?: boolean) => {
    if (locked) return;
    setActiveTool(activeTool === toolId ? null : toolId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <p className="text-gray-500 mb-6">소상공인에게 필요한 간편 도구 모음</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool) => {
          const colors = colorMap[tool.color];
          const isActive = activeTool === tool.id;

          return (
            <div key={tool.id} className="flex flex-col">
              <button
                onClick={() => handleToolClick(tool.id, tool.locked)}
                className={`bg-white rounded-xl border ${isActive ? "border-blue-300 ring-2 ring-blue-100" : "border-gray-200"} p-6 text-left hover:shadow-md transition group ${tool.locked ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <tool.icon className={colors.icon} size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold group-hover:text-blue-600 transition">{tool.name}</h3>
                      {tool.badge && (
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          tool.badge === "AI" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                        }`}>
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{tool.description}</p>
                  </div>
                </div>
              </button>

              {/* Review Reply Tool */}
              {isActive && tool.id === "review" && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 mt-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold">리뷰 답글 생성기</h4>
                    <button onClick={() => setActiveTool(null)} className="text-gray-400 hover:text-gray-600">
                      <X size={18} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">고객 리뷰 내용</label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="리뷰 내용을 입력하세요..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none h-24"
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-500 mb-1">평점</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <button
                            key={i}
                            onClick={() => setReviewRating(i)}
                            className="p-1"
                          >
                            <Star
                              size={20}
                              className={i <= reviewRating ? "fill-amber-400 text-amber-400" : "text-gray-200"}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-500 mb-1">톤</label>
                      <div className="relative">
                        <select
                          value={reviewTone}
                          onChange={(e) => setReviewTone(e.target.value as "formal" | "friendly" | "casual")}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 appearance-none bg-white"
                        >
                          <option value="friendly">친근한</option>
                          <option value="formal">격식체</option>
                          <option value="casual">캐주얼</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateReply}
                    disabled={!reviewText.trim()}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    답글 생성하기
                  </button>

                  {generatedReply && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-700">생성된 답글</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(generatedReply)}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          복사
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{generatedReply}</p>
                    </div>
                  )}
                </div>
              )}

              {/* QR Code Tool */}
              {isActive && tool.id === "qr" && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 mt-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold">QR 코드 생성기</h4>
                    <button onClick={() => setActiveTool(null)} className="text-gray-400 hover:text-gray-600">
                      <X size={18} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">URL 입력</label>
                    <input
                      type="text"
                      value={qrUrl}
                      onChange={(e) => setQrUrl(e.target.value)}
                      placeholder="https://naver.me/example"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    />
                  </div>

                  <button
                    onClick={handleGenerateQR}
                    disabled={!qrUrl.trim()}
                    className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                  >
                    QR 코드 생성
                  </button>

                  {qrImage && (
                    <div className="flex flex-col items-center gap-3 pt-2">
                      <img src={qrImage} alt="QR Code" className="w-48 h-48 rounded-lg border border-gray-200" />
                      <a
                        href={qrImage}
                        download="qrcode.png"
                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                      >
                        다운로드
                      </a>
                    </div>
                  )}
                  <canvas ref={qrCanvasRef} className="hidden" />
                </div>
              )}

              {/* Revenue Calculator */}
              {isActive && tool.id === "calculator" && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 mt-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold">매출 계산기</h4>
                    <button onClick={() => setActiveTool(null)} className="text-gray-400 hover:text-gray-600">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">일 방문 고객</label>
                      <input
                        type="number"
                        value={dailyCustomers}
                        onChange={(e) => setDailyCustomers(e.target.value)}
                        placeholder="50"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">객단가 (원)</label>
                      <input
                        type="number"
                        value={avgSpend}
                        onChange={(e) => setAvgSpend(e.target.value)}
                        placeholder="15000"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">월 영업일</label>
                      <input
                        type="number"
                        value={daysOpen}
                        onChange={(e) => setDaysOpen(e.target.value)}
                        placeholder="26"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleCalculate}
                    disabled={!dailyCustomers || !avgSpend}
                    className="w-full bg-amber-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-amber-600 transition disabled:opacity-50"
                  >
                    계산하기
                  </button>

                  {calcResult && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-amber-50 rounded-lg p-4 text-center">
                        <div className="text-sm text-gray-500 mb-1">예상 월 매출</div>
                        <div className="text-xl font-bold text-amber-600">
                          {calcResult.monthly.toLocaleString()}원
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <div className="text-sm text-gray-500 mb-1">예상 연 매출</div>
                        <div className="text-xl font-bold text-green-600">
                          {calcResult.yearly.toLocaleString()}원
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Business Description Generator */}
              {isActive && tool.id === "description" && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 mt-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold">매장 소개글 생성</h4>
                    <button onClick={() => setActiveTool(null)} className="text-gray-400 hover:text-gray-600">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">매장명</label>
                      <input
                        type="text"
                        value={descName}
                        onChange={(e) => setDescName(e.target.value)}
                        placeholder="매장 이름"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">업종</label>
                      <input
                        type="text"
                        value={descCategory}
                        onChange={(e) => setDescCategory(e.target.value)}
                        placeholder="카페/디저트"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">위치</label>
                    <input
                      type="text"
                      value={descLocation}
                      onChange={(e) => setDescLocation(e.target.value)}
                      placeholder="서울 강남구"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">특색 메뉴/서비스 (쉼표로 구분)</label>
                    <input
                      type="text"
                      value={descSpecialties}
                      onChange={(e) => setDescSpecialties(e.target.value)}
                      placeholder="수제 케이크, 핸드드립 커피, 시즌 디저트"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">분위기</label>
                      <input
                        type="text"
                        value={descAtmosphere}
                        onChange={(e) => setDescAtmosphere(e.target.value)}
                        placeholder="모던하고 세련된"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">타겟 고객</label>
                      <input
                        type="text"
                        value={descTarget}
                        onChange={(e) => setDescTarget(e.target.value)}
                        placeholder="2030 직장인"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateDescription}
                    disabled={!descName.trim() || !descCategory.trim()}
                    className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    소개글 생성하기
                  </button>

                  {generatedDesc && (
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-indigo-700">생성된 소개글</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(generatedDesc)}
                          className="text-xs text-indigo-600 hover:text-indigo-700"
                        >
                          복사
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{generatedDesc}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
