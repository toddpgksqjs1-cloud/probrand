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
import { Users, Search, Mail, Phone, Store, Trash2, Pencil, Plus } from "lucide-react";
import { usePlatformStore } from "@/lib/store/platform-store";
import { PlatformUser } from "@/lib/types/platform";
import { toast } from "sonner";

const roleLabels: Record<string, { label: string; color: string }> = {
  owner: { label: "사장님", color: "bg-rose-500/20 text-rose-400 border-rose-500/20" },
  manager: { label: "매니저", color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/20" },
  staff: { label: "스태프", color: "bg-slate-500/20 text-slate-400 border-slate-500/20" },
};

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: "활성", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" },
  inactive: { label: "비활성", color: "bg-amber-500/20 text-amber-400 border-amber-500/20" },
  suspended: { label: "정지", color: "bg-red-500/20 text-red-400 border-red-500/20" },
};

const emptyUser: Omit<PlatformUser, "id"> = {
  name: "", email: "", phone: "", storeName: "", storeId: "",
  role: "staff", plan: "free", status: "active",
  signupDate: new Date().toISOString().split("T")[0],
  lastLoginDate: new Date().toISOString().split("T")[0],
};

export default function PlatformUsersPage() {
  const users = usePlatformStore((s) => s.users);
  const stores = usePlatformStore((s) => s.stores);
  const addUser = usePlatformStore((s) => s.addUser);
  const updateUser = usePlatformStore((s) => s.updateUser);
  const deleteUser = usePlatformStore((s) => s.deleteUser);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyUser);

  const filtered = users.filter((u) => {
    if (search && !u.name.includes(search) && !u.email.includes(search) && !u.storeName.includes(search)) return false;
    if (filterRole !== "all" && u.role !== filterRole) return false;
    return true;
  });

  const stats = {
    total: users.length,
    owners: users.filter((u) => u.role === "owner").length,
    managers: users.filter((u) => u.role === "manager").length,
    staff: users.filter((u) => u.role === "staff").length,
    active: users.filter((u) => u.status === "active").length,
  };

  function openAdd() {
    setEditingId(null);
    setForm(emptyUser);
    setDialogOpen(true);
  }

  function openEdit(user: PlatformUser) {
    setEditingId(user.id);
    const { id, ...rest } = user;
    setForm(rest);
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("이름과 이메일은 필수입니다");
      return;
    }
    // Auto-fill storeName from selected storeId
    let storeName = form.storeName;
    if (form.storeId) {
      const matched = stores.find((s) => s.id === form.storeId);
      if (matched) storeName = matched.name;
    }
    const data = { ...form, storeName };

    if (editingId) {
      updateUser(editingId, data);
      toast.success(`${form.name} 정보가 수정되었습니다`);
    } else {
      addUser({ ...data, id: `u-${Date.now()}` });
      toast.success(`${form.name}이(가) 추가되었습니다`);
    }
    setDialogOpen(false);
  }

  function handleDelete(user: PlatformUser) {
    if (!confirm(`"${user.name}" 사용자를 삭제하시겠습니까?`)) return;
    deleteUser(user.id);
    toast.success(`${user.name}이(가) 삭제되었습니다`);
  }

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">사용자 관리</h1>
          <p className="text-slate-400 text-sm mt-1">플랫폼에 등록된 모든 사용자를 관리합니다</p>
        </div>
        <Button className="bg-rose-600 hover:bg-rose-500" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" /> 사용자 추가
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "전체", value: stats.total },
          { label: "사장님", value: stats.owners },
          { label: "매니저", value: stats.managers },
          { label: "스태프", value: stats.staff },
          { label: "활성", value: stats.active },
        ].map((s) => (
          <div key={s.label} className="p-3 rounded-xl bg-white/3 border border-white/5 text-center">
            <p className="text-white font-bold text-lg">{s.value}</p>
            <p className="text-slate-500 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="이름, 이메일, 가게명 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 text-sm focus:outline-none focus:border-rose-500/50"
        >
          <option value="all">모든 역할</option>
          <option value="owner">사장님</option>
          <option value="manager">매니저</option>
          <option value="staff">스태프</option>
        </select>
      </div>

      <p className="text-slate-500 text-sm">{filtered.length}명</p>

      {filtered.length === 0 && users.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>등록된 사용자가 없습니다</p>
        </div>
      )}

      {/* User List */}
      <div className="space-y-3">
        {filtered.map((user) => (
          <Card key={user.id} className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm shrink-0">
                  {user.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white font-medium">{user.name}</p>
                    <Badge className={roleLabels[user.role].color + " text-[10px]"}>
                      {roleLabels[user.role].label}
                    </Badge>
                    <Badge className={statusLabels[user.status].color + " text-[10px]"}>
                      {statusLabels[user.status].label}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {user.phone}</span>
                    <span className="flex items-center gap-1"><Store className="w-3 h-3" /> {user.storeName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600 shrink-0">
                  <div className="text-right">
                    <p>가입 {user.signupDate}</p>
                    <p>마지막 접속 {user.lastLoginDate}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white" onClick={() => openEdit(user)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-400" onClick={() => handleDelete(user)}>
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
            <DialogTitle>{editingId ? "사용자 수정" : "사용자 추가"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">이름 *</Label>
                <Input value={form.name} onChange={(e) => setField("name", e.target.value)} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">이메일 *</Label>
                <Input value={form.email} onChange={(e) => setField("email", e.target.value)} className="bg-white/5 border-white/10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">전화번호</Label>
              <Input value={form.phone} onChange={(e) => setField("phone", e.target.value)} className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">소속 가맹점</Label>
              <select
                value={form.storeId}
                onChange={(e) => setField("storeId", e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white text-sm"
              >
                <option value="">선택 없음</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">역할</Label>
                <select value={form.role} onChange={(e) => setField("role", e.target.value as PlatformUser["role"])} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white text-sm">
                  <option value="owner">사장님</option>
                  <option value="manager">매니저</option>
                  <option value="staff">스태프</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">플랜</Label>
                <select value={form.plan} onChange={(e) => setField("plan", e.target.value as PlatformUser["plan"])} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white text-sm">
                  <option value="free">무료</option>
                  <option value="basic">베이직</option>
                  <option value="pro">프로</option>
                  <option value="enterprise">엔터프라이즈</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">상태</Label>
                <select value={form.status} onChange={(e) => setField("status", e.target.value as PlatformUser["status"])} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white text-sm">
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                  <option value="suspended">정지</option>
                </select>
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
