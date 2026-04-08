"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Store, Search, ExternalLink, Star, Trash2, Pencil, Plus,
} from "lucide-react";
import { usePlatformStore } from "@/lib/store/platform-store";
import { PlatformStore } from "@/lib/types/platform";
import { toast } from "sonner";

function formatKRW(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n.toLocaleString();
}

const planLabels: Record<string, { label: string; color: string }> = {
  free: { label: "무료", color: "bg-slate-500/20 text-slate-400 border-slate-500/20" },
  basic: { label: "베이직", color: "bg-blue-500/20 text-blue-400 border-blue-500/20" },
  pro: { label: "프로", color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/20" },
  enterprise: { label: "엔터프라이즈", color: "bg-rose-500/20 text-rose-400 border-rose-500/20" },
};

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: "활성", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" },
  trial: { label: "체험중", color: "bg-blue-500/20 text-blue-400 border-blue-500/20" },
  churned: { label: "이탈", color: "bg-amber-500/20 text-amber-400 border-amber-500/20" },
  suspended: { label: "정지", color: "bg-red-500/20 text-red-400 border-red-500/20" },
};

const emptyStore: Omit<PlatformStore, "id"> = {
  name: "", category: "", address: "", ownerName: "", ownerEmail: "", phone: "",
  plan: "free", status: "trial",
  diagnosticScore: 50, reviewCount: 0, rating: 0, monthlyOrders: 0,
  monthlyBookings: 0, monthlyRevenue: 0,
  signupDate: new Date().toISOString().split("T")[0],
  lastActiveDate: new Date().toISOString().split("T")[0],
};

export default function PlatformStoresPage() {
  const stores = usePlatformStore((s) => s.stores);
  const addStore = usePlatformStore((s) => s.addStore);
  const updateStore = usePlatformStore((s) => s.updateStore);
  const deleteStore = usePlatformStore((s) => s.deleteStore);

  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyStore);

  const filtered = stores.filter((s) => {
    if (search && !s.name.includes(search) && !s.ownerName.includes(search) && !s.category.includes(search)) return false;
    if (filterPlan !== "all" && s.plan !== filterPlan) return false;
    if (filterStatus !== "all" && s.status !== filterStatus) return false;
    return true;
  });

  function openAdd() {
    setEditingId(null);
    setForm(emptyStore);
    setDialogOpen(true);
  }

  function openEdit(store: PlatformStore) {
    setEditingId(store.id);
    const { id, ...rest } = store;
    setForm(rest);
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.name.trim() || !form.ownerName.trim()) {
      toast.error("가게명과 사장님 이름은 필수입니다");
      return;
    }
    if (editingId) {
      updateStore(editingId, form);
      toast.success(`${form.name} 정보가 수정되었습니다`);
    } else {
      addStore({ ...form, id: `s-${Date.now()}` });
      toast.success(`${form.name}이(가) 추가되었습니다`);
    }
    setDialogOpen(false);
  }

  function handleDelete(store: PlatformStore) {
    if (!confirm(`"${store.name}" 가맹점을 삭제하시겠습니까? 연관 사용자도 함께 삭제됩니다.`)) return;
    deleteStore(store.id);
    toast.success(`${store.name}이(가) 삭제되었습니다`);
  }

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">가맹점 관리</h1>
          <p className="text-slate-400 text-sm mt-1">등록된 모든 가맹점을 관리합니다</p>
        </div>
        <Button className="bg-rose-600 hover:bg-rose-500" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" /> 가맹점 추가
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="가게명, 사장님, 카테고리 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50"
          />
        </div>
        <select
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value)}
          className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 text-sm focus:outline-none focus:border-rose-500/50"
        >
          <option value="all">모든 플랜</option>
          <option value="free">무료</option>
          <option value="basic">베이직</option>
          <option value="pro">프로</option>
          <option value="enterprise">엔터프라이즈</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 text-sm focus:outline-none focus:border-rose-500/50"
        >
          <option value="all">모든 상태</option>
          <option value="active">활성</option>
          <option value="trial">체험중</option>
          <option value="churned">이탈</option>
          <option value="suspended">정지</option>
        </select>
      </div>

      <p className="text-slate-500 text-sm">{filtered.length}개 가맹점</p>

      {filtered.length === 0 && stores.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Store className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>등록된 가맹점이 없습니다</p>
        </div>
      )}

      {/* Store Cards */}
      <div className="space-y-3">
        {filtered.map((store) => (
          <Card key={store.id} className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium truncate">{store.name}</h3>
                    <Badge className={statusLabels[store.status].color + " text-[10px]"}>
                      {statusLabels[store.status].label}
                    </Badge>
                    <Badge className={planLabels[store.plan].color + " text-[10px]"}>
                      {planLabels[store.plan].label}
                    </Badge>
                  </div>
                  <p className="text-slate-500 text-sm">{store.category} | {store.address}</p>
                  <p className="text-slate-600 text-xs mt-0.5">{store.ownerName} ({store.ownerEmail})</p>
                </div>

                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="text-center">
                    <p className={`text-lg font-bold ${
                      store.diagnosticScore >= 80 ? "text-emerald-400" :
                      store.diagnosticScore >= 60 ? "text-amber-400" : "text-red-400"
                    }`}>{store.diagnosticScore}</p>
                    <p className="text-slate-600 text-xs">진단점수</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400" />
                      <p className="text-white font-medium">{store.rating}</p>
                    </div>
                    <p className="text-slate-600 text-xs">평점</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium">{store.reviewCount}</p>
                    <p className="text-slate-600 text-xs">리뷰</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium">{store.monthlyOrders}</p>
                    <p className="text-slate-600 text-xs">주문/월</p>
                  </div>
                  <div className="text-center">
                    <p className="text-emerald-400 font-medium">{formatKRW(store.monthlyRevenue)}원</p>
                    <p className="text-slate-600 text-xs">매출/월</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white" onClick={() => openEdit(store)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-400" onClick={() => handleDelete(store)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "가맹점 수정" : "가맹점 추가"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">가게명 *</Label>
                <Input value={form.name} onChange={(e) => setField("name", e.target.value)} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">카테고리</Label>
                <Input value={form.category} onChange={(e) => setField("category", e.target.value)} className="bg-white/5 border-white/10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">주소</Label>
              <Input value={form.address} onChange={(e) => setField("address", e.target.value)} className="bg-white/5 border-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">사장님 이름 *</Label>
                <Input value={form.ownerName} onChange={(e) => setField("ownerName", e.target.value)} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">이메일</Label>
                <Input value={form.ownerEmail} onChange={(e) => setField("ownerEmail", e.target.value)} className="bg-white/5 border-white/10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">전화번호</Label>
              <Input value={form.phone} onChange={(e) => setField("phone", e.target.value)} className="bg-white/5 border-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">플랜</Label>
                <select value={form.plan} onChange={(e) => setField("plan", e.target.value as PlatformStore["plan"])} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white text-sm">
                  <option value="free">무료</option>
                  <option value="basic">베이직</option>
                  <option value="pro">프로</option>
                  <option value="enterprise">엔터프라이즈</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">상태</Label>
                <select value={form.status} onChange={(e) => setField("status", e.target.value as PlatformStore["status"])} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white text-sm">
                  <option value="active">활성</option>
                  <option value="trial">체험중</option>
                  <option value="churned">이탈</option>
                  <option value="suspended">정지</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">진단 점수</Label>
                <Input type="number" value={form.diagnosticScore} onChange={(e) => setField("diagnosticScore", Number(e.target.value))} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">월 주문</Label>
                <Input type="number" value={form.monthlyOrders} onChange={(e) => setField("monthlyOrders", Number(e.target.value))} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">월 매출</Label>
                <Input type="number" value={form.monthlyRevenue} onChange={(e) => setField("monthlyRevenue", Number(e.target.value))} className="bg-white/5 border-white/10" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-slate-400">취소</Button>
            <Button className="bg-rose-600 hover:bg-rose-500" onClick={handleSave}>
              {editingId ? "수정" : "추가"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
