"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Calendar, CreditCard, Users } from "lucide-react";
import { use } from "react";
import { usersStorage, storesStorage, analysesStorage } from "@/lib/storage";
import type { User, Store, Analysis } from "@/lib/storage";

const planLabels: Record<string, string> = {
  free: "무료 플랜",
  pro: "프로 플랜",
  business: "비즈니스 플랜",
};

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [userData, setUserData] = useState<User | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const user = usersStorage.getById(id);
    if (!user) {
      setNotFound(true);
      return;
    }
    setUserData(user);
    setStores(storesStorage.getAll(user.id));
    setAnalyses(analysesStorage.getAll(user.id));
  }, [id]);

  if (notFound) {
    return (
      <div className="max-w-5xl mx-auto">
        <Link href="/admin/users" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft size={16} /> 유저 목록
        </Link>
        <div className="text-center py-20">
          <Users size={40} className="text-gray-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">유저를 찾을 수 없습니다</h2>
          <p className="text-gray-500 text-sm">ID: {id}</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const store = stores[0];
  const latestAnalysis = analyses.length > 0 ? analyses[analyses.length - 1] : null;
  const createdAt = new Date(userData.createdAt);
  const daysSinceSignup = Math.floor((Date.now() - createdAt.getTime()) / 86400000);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <Link href="/admin/users" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} /> 유저 목록
      </Link>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">{userData.name}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1"><Mail size={14} /> {userData.email}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> 가입: {createdAt.toLocaleDateString("ko-KR")}</span>
              <span className="flex items-center gap-1"><CreditCard size={14} /> {planLabels[userData.plan] || userData.plan}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">ID: {userData.id}</div>
          </div>
          <div className="flex gap-2">
            <button className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">메모 추가</button>
            <button className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">구독 관리</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "분석 횟수", value: String(analyses.length) },
          { label: "등록 매장", value: String(stores.length) },
          { label: "최근 점수", value: latestAnalysis ? `${latestAnalysis.score}점` : "-" },
          { label: "가입 기간", value: `${daysSinceSignup}일` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className="text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Analyses History */}
      {analyses.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold mb-4">분석 이력</h3>
          <div className="space-y-3">
            {analyses.slice().reverse().map((a) => {
              const aStore = storesStorage.getById(userData.id, a.storeId);
              return (
                <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium">{aStore?.name || "매장"}</div>
                    <div className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleString("ko-KR")}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold ${
                      a.score >= 80 ? "text-green-600" :
                      a.score >= 60 ? "text-blue-600" :
                      a.score >= 40 ? "text-amber-600" :
                      "text-red-500"
                    }`}>{a.score}점</span>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                      a.grade === "S" || a.grade === "A" ? "bg-green-100 text-green-700" :
                      a.grade === "B" ? "bg-blue-100 text-blue-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>{a.grade}등급</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Store Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold mb-4">등록 매장</h3>
        {stores.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">등록된 매장이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {stores.map((s) => (
              <div key={s.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  업종: {s.category} | 위치: {s.address || "-"}
                </div>
                {s.naverPlaceUrl && (
                  <div className="text-sm text-gray-500">URL: {s.naverPlaceUrl}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
