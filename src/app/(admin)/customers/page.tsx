"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Users, Crown, UserCheck, UserX, Phone, Mail, Plus, Trash2, Pencil,
} from "lucide-react";
import { useAdminStore } from "@/lib/store/admin-store";
import { Customer } from "@/lib/types";
import { toast } from "sonner";

const tierMap = {
  vip: { label: "VIP", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: Crown },
  regular: { label: "일반", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: UserCheck },
  inactive: { label: "이탈", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: UserX },
};

const emptyCustomer: Omit<Customer, "id"> = {
  name: "", phone: "", email: "", tier: "regular",
  totalVisits: 0, totalSpent: 0,
  lastVisitDate: new Date().toISOString().split("T")[0],
  firstVisitDate: new Date().toISOString().split("T")[0],
  favoriteMenus: [], notes: "", tags: [], marketingConsent: true,
};

export default function CustomersPage() {
  const customers = useAdminStore((s) => s.customers);
  const addCustomer = useAdminStore((s) => s.addCustomer);
  const updateCustomer = useAdminStore((s) => s.updateCustomer);
  const deleteCustomer = useAdminStore((s) => s.deleteCustomer);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyCustomer);

  const stats = {
    total: customers.length,
    vip: customers.filter((c) => c.tier === "vip").length,
    regular: customers.filter((c) => c.tier === "regular").length,
    inactive: customers.filter((c) => c.tier === "inactive").length,
  };

  function openAdd() {
    setEditingId(null);
    setForm(emptyCustomer);
    setDialogOpen(true);
  }

  function openEdit(c: Customer) {
    setEditingId(c.id);
    const { id, ...rest } = c;
    setForm(rest);
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("이름과 전화번호는 필수입니다");
      return;
    }
    if (editingId) {
      updateCustomer(editingId, form);
      toast.success(`${form.name} 정보가 수정되었습니다`);
    } else {
      addCustomer({ ...form, id: `cust-${Date.now()}` });
      toast.success(`${form.name}이(가) 추가되었습니다`);
    }
    setDialogOpen(false);
  }

  function handleDelete(c: Customer) {
    if (!confirm(`"${c.name}" 고객을 삭제하시겠습니까?`)) return;
    deleteCustomer(c.id);
    toast.success(`${c.name}이(가) 삭제되었습니다`);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">고객 관리</h1>
          <p className="text-slate-400 text-sm mt-1">고객 데이터를 관리하고 마케팅에 활용하세요</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-500" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" /> 고객 추가
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-slate-500 text-xs">총 고객</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">{stats.vip}</p>
              <p className="text-slate-500 text-xs">VIP</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">{stats.regular}</p>
              <p className="text-slate-500 text-xs">일반</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">{stats.inactive}</p>
              <p className="text-slate-500 text-xs">이탈</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">고객 목록</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {customers.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-8">등록된 고객이 없습니다</p>
          )}
          {customers.map((customer) => {
            const tier = tierMap[customer.tier];
            return (
              <div key={customer.id} className="p-4 rounded-xl bg-white/3 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                      {customer.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{customer.name}</span>
                        <Badge className={tier.color}>{tier.label}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 text-xs mt-0.5">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {customer.phone}</span>
                        {customer.email && (
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {customer.email}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white" onClick={() => openEdit(customer)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-400" onClick={() => handleDelete(customer)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="p-2 rounded-lg bg-white/3 text-center">
                    <p className="text-white text-sm font-bold">{customer.totalVisits}회</p>
                    <p className="text-slate-500 text-xs">총 방문</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/3 text-center">
                    <p className="text-white text-sm font-bold">{customer.totalSpent.toLocaleString()}원</p>
                    <p className="text-slate-500 text-xs">총 결제</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/3 text-center">
                    <p className="text-white text-sm font-bold">{customer.lastVisitDate}</p>
                    <p className="text-slate-500 text-xs">마지막 방문</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/3 text-center">
                    <p className="text-white text-sm font-bold truncate">{customer.favoriteMenus[0] || "-"}</p>
                    <p className="text-slate-500 text-xs">선호 메뉴</p>
                  </div>
                </div>

                {customer.tags.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {customer.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Add/Edit Customer Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "고객 수정" : "고객 추가"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">이름 *</Label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">전화번호 *</Label>
                <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="bg-white/5 border-white/10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">이메일</Label>
              <Input value={form.email || ""} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="bg-white/5 border-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">등급</Label>
                <select value={form.tier} onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value as Customer["tier"] }))} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white text-sm">
                  <option value="regular">일반</option>
                  <option value="vip">VIP</option>
                  <option value="inactive">이탈</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">총 방문</Label>
                <Input type="number" value={form.totalVisits} onChange={(e) => setForm((f) => ({ ...f, totalVisits: Number(e.target.value) }))} className="bg-white/5 border-white/10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">메모</Label>
              <Input value={form.notes || ""} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="특이사항" className="bg-white/5 border-white/10" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-slate-400">취소</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-500" onClick={handleSave}>
              {editingId ? "수정" : "추가"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
