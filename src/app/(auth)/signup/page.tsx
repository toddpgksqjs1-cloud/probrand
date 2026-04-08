"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "", password: "", passwordConfirm: "",
    storeName: "", storePhone: "", naverPlaceUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Auto-fill from analyzed store data in sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("diagnosticReport");
      if (stored) {
        const report = JSON.parse(stored);
        if (report?.storeInfo) {
          setForm((prev) => ({
            ...prev,
            storeName: prev.storeName || report.storeInfo.name || "",
            naverPlaceUrl: prev.naverPlaceUrl || report.storeInfo.naverPlaceUrl || "",
          }));
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (form.password !== form.passwordConfirm) {
        toast.error("비밀번호가 일치하지 않습니다.");
        return;
      }
      setStep(2);
      return;
    }
    setIsLoading(true);
    // TODO: Implement actual Supabase signup
    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true");
      toast.success("가입이 완료되었습니다!");
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white/5 border-white/10">
        <CardHeader className="text-center">
          <button onClick={() => router.push("/")} className="text-2xl font-bold text-white mb-2">
            D2C Food
          </button>
          <CardTitle className="text-white text-lg font-normal">
            {step === 1 ? "회원가입" : "가게 정보 입력"}
          </CardTitle>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className={`w-8 h-1 rounded ${step >= 1 ? "bg-indigo-500" : "bg-white/10"}`} />
            <div className={`w-8 h-1 rounded ${step >= 2 ? "bg-indigo-500" : "bg-white/10"}`} />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label className="text-slate-300">이메일</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@example.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">비밀번호</Label>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="8자 이상 입력하세요"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    required
                    minLength={8}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">비밀번호 확인</Label>
                  <Input
                    type="password"
                    value={form.passwordConfirm}
                    onChange={(e) => setForm({ ...form, passwordConfirm: e.target.value })}
                    placeholder="비밀번호를 다시 입력하세요"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label className="text-slate-300">가게 이름</Label>
                  <Input
                    value={form.storeName}
                    onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                    placeholder="예: 홍대 트러플 파스타"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">가게 전화번호</Label>
                  <Input
                    value={form.storePhone}
                    onChange={(e) => setForm({ ...form, storePhone: e.target.value })}
                    placeholder="02-1234-5678"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">네이버 플레이스 URL</Label>
                  <Input
                    value={form.naverPlaceUrl}
                    onChange={(e) => setForm({ ...form, naverPlaceUrl: e.target.value })}
                    placeholder="https://naver.me/xxxxx"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                  <p className="text-xs text-slate-500">나중에 입력하셔도 됩니다</p>
                </div>
              </>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-12"
            >
              {isLoading ? "처리 중..." : step === 1 ? "다음" : "가입 완료"}
            </Button>

            {step === 2 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(1)}
                className="w-full text-slate-400 hover:text-white"
              >
                이전으로
              </Button>
            )}
          </form>

          {step === 1 && (
            <>
              <Separator className="my-6 bg-white/10" />
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-12 bg-[#FEE500] hover:bg-[#FDD800] text-[#3C1E1E] border-0 font-medium"
                  onClick={() => setStep(2)}
                >
                  카카오로 시작하기
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 bg-white hover:bg-gray-100 text-gray-800 border-0 font-medium"
                  onClick={() => setStep(2)}
                >
                  Google로 시작하기
                </Button>
              </div>
              <p className="text-center text-slate-500 text-sm mt-6">
                이미 계정이 있으신가요?{" "}
                <button onClick={() => router.push("/login")} className="text-indigo-400 hover:text-indigo-300">
                  로그인
                </button>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
