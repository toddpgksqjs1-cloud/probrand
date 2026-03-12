"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { storesStorage } from "@/lib/storage";
import type { Store } from "@/lib/storage";

const planLabels: Record<string, string> = {
  free: "무료 플랜",
  pro: "프로 플랜",
  business: "비즈니스 플랜",
};

const planPrices: Record<string, string> = {
  free: "0원/월",
  pro: "29,000원/월",
  business: "79,000원/월",
};

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();

  const [storeName, setStoreName] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [naverPlaceUrl, setNaverPlaceUrl] = useState("");
  const [store, setStore] = useState<Store | null>(null);
  const [saveMessage, setSaveMessage] = useState("");

  const [notifications, setNotifications] = useState({
    weeklyReport: true,
    competitorAlert: true,
    keywordRankAlert: false,
    marketingTip: true,
  });

  useEffect(() => {
    if (!user) return;

    const stores = storesStorage.getAll(user.id);
    const currentStore = stores[0];

    if (currentStore) {
      setStore(currentStore);
      setStoreName(currentStore.name);
      setCategory(currentStore.category);
      setPhone(currentStore.phone || "");
      setAddress(currentStore.address);
      setNaverPlaceUrl(currentStore.naverPlaceUrl);
    } else {
      setStoreName(user.businessName || "");
      setCategory(user.businessCategory || "");
      setAddress(user.location || "");
      setNaverPlaceUrl(user.naverPlaceUrl || "");
    }
  }, [user]);

  const handleSave = () => {
    if (!user) return;

    // Update store
    if (store) {
      storesStorage.update(user.id, store.id, {
        name: storeName,
        category,
        phone,
        address,
        naverPlaceUrl,
      });
    }

    // Update user profile
    updateProfile({
      businessName: storeName,
      businessCategory: category,
      location: address,
      naverPlaceUrl,
    });

    setSaveMessage("저장되었습니다!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold mb-4">매장 정보</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">매장명</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">업종</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">전화번호</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">주소</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">네이버 플레이스 URL</label>
            <input
              type="text"
              value={naverPlaceUrl}
              onChange={(e) => setNaverPlaceUrl(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            저장
          </button>
          {saveMessage && (
            <span className="text-sm text-green-600 font-medium">{saveMessage}</span>
          )}
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold mb-4">계정 정보</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">이름</span>
            <span className="font-medium">{user.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">이메일</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">가입일</span>
            <span className="font-medium">{new Date(user.createdAt).toLocaleDateString("ko-KR")}</span>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold mb-4">구독 관리</h3>
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <div className="font-medium">{planLabels[user.plan] || user.plan}</div>
            <div className="text-sm text-gray-500">{planPrices[user.plan] || ""}</div>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">변경</button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold mb-4">알림 설정</h3>
        <div className="space-y-4">
          {[
            { key: "weeklyReport" as const, label: "주간 리포트 이메일" },
            { key: "competitorAlert" as const, label: "경쟁사 변화 알림" },
            { key: "keywordRankAlert" as const, label: "키워드 순위 변동 알림" },
            { key: "marketingTip" as const, label: "마케팅 팁 카카오톡" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => toggleNotification(item.key)}
              className="flex items-center justify-between w-full cursor-pointer"
            >
              <span className="text-sm">{item.label}</span>
              <div className={`relative w-10 h-5 rounded-full transition ${notifications[item.key] ? "bg-blue-600" : "bg-gray-200"}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition ${notifications[item.key] ? "left-5" : "left-0.5"}`} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
