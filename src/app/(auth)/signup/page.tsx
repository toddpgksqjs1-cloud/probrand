"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const BUSINESS_CATEGORIES = [
  "카페/디저트",
  "한식",
  "일식",
  "중식",
  "양식",
  "치킨/피자",
  "미용/뷰티",
  "헬스/피트니스",
  "학원/교육",
  "기타",
];

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessCategory: "",
    businessName: "",
    location: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
    }

    if (!form.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    if (!form.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (form.password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다.";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    if (!form.businessCategory) {
      newErrors.businessCategory = "업종을 선택해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    if (!validate()) return;

    setIsSubmitting(true);

    const result = await signup(form.email, form.password, form.name, {
      businessName: form.businessName || undefined,
      businessCategory: form.businessCategory,
      location: form.location || undefined,
    });

    if (result.success) {
      router.push("/dashboard");
    } else {
      setGeneralError(result.error || "회원가입에 실패했습니다.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
        <p className="text-sm text-gray-500 mt-2">
          무료로 시작하고 내 매장을 성장시키세요
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General Error */}
        {generalError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {generalError}
          </div>
        )}

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            이름 <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="홍길동"
            autoComplete="name"
            className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition ${
              errors.name ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            이메일 <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="example@email.com"
            autoComplete="email"
            className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition ${
              errors.email ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            비밀번호 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="6자 이상 입력하세요"
              autoComplete="new-password"
              className={`w-full px-4 py-3 pr-12 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition ${
                errors.password ? "border-red-300" : "border-gray-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
            비밀번호 확인 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              autoComplete="new-password"
              className={`w-full px-4 py-3 pr-12 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition ${
                errors.confirmPassword ? "border-red-300" : "border-gray-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Business Category */}
        <div>
          <label htmlFor="businessCategory" className="block text-sm font-medium text-gray-700 mb-1.5">
            업종 <span className="text-red-500">*</span>
          </label>
          <select
            id="businessCategory"
            value={form.businessCategory}
            onChange={(e) => updateField("businessCategory", e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition appearance-none bg-white ${
              errors.businessCategory ? "border-red-300" : "border-gray-200"
            } ${!form.businessCategory ? "text-gray-400" : "text-gray-900"}`}
          >
            <option value="" disabled>
              업종을 선택하세요
            </option>
            {BUSINESS_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.businessCategory && (
            <p className="mt-1 text-xs text-red-500">{errors.businessCategory}</p>
          )}
        </div>

        {/* Business Name (optional) */}
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1.5">
            매장명 <span className="text-xs text-gray-400 font-normal">(선택)</span>
          </label>
          <input
            id="businessName"
            type="text"
            value={form.businessName}
            onChange={(e) => updateField("businessName", e.target.value)}
            placeholder="예: 강남 디저트카페"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
          />
        </div>

        {/* Location (optional) */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1.5">
            지역 <span className="text-xs text-gray-400 font-normal">(선택)</span>
          </label>
          <input
            id="location"
            type="text"
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="예: 서울 강남구"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          <UserPlus size={18} />
          {isSubmitting ? "가입 처리 중..." : "회원가입"}
        </button>
      </form>

      {/* Login link */}
      <div className="mt-6 text-center text-sm text-gray-500">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/login"
          className="text-blue-600 font-medium hover:text-blue-700 transition"
        >
          로그인
        </Link>
      </div>
    </div>
  );
}
