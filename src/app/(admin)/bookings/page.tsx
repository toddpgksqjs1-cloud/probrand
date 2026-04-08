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
  CalendarDays, Users, Phone, CheckCircle,
  XCircle, AlertTriangle, Plus, Settings, Trash2,
} from "lucide-react";
import { useAdminStore } from "@/lib/store/admin-store";
import { toast } from "sonner";

const statusMap = {
  pending: { label: "대기", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: AlertTriangle },
  confirmed: { label: "확정", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: CheckCircle },
  cancelled: { label: "취소", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: XCircle },
  noshow: { label: "노쇼", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: XCircle },
  completed: { label: "완료", color: "bg-slate-500/10 text-slate-400 border-slate-500/20", icon: CheckCircle },
};

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function BookingsPage() {
  const bookings = useAdminStore((s) => s.bookings);
  const addBooking = useAdminStore((s) => s.addBooking);
  const updateBookingStatus = useAdminStore((s) => s.updateBookingStatus);
  const deleteBooking = useAdminStore((s) => s.deleteBooking);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    customerName: "", customerPhone: "", date: new Date().toISOString().split("T")[0],
    time: "18:00", partySize: 2, memo: "",
  });

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const todayBookings = bookings.filter((b) => b.date === today);
  const tomorrowBookings = bookings.filter((b) => b.date === tomorrow);
  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  const handleConfirm = (id: string, name: string) => {
    updateBookingStatus(id, "confirmed");
    toast.success(`${name}님 예약이 확정되었습니다.`);
  };

  const handleReject = (id: string, name: string) => {
    updateBookingStatus(id, "cancelled");
    toast.info(`${name}님 예약이 취소되었습니다.`);
  };

  const handleAdd = () => {
    if (!form.customerName.trim() || !form.customerPhone.trim()) {
      toast.error("고객명과 전화번호는 필수입니다");
      return;
    }
    addBooking({
      id: `bk-${Date.now()}`,
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      date: form.date,
      time: form.time,
      partySize: form.partySize,
      status: "pending",
      memo: form.memo || undefined,
      createdAt: new Date().toISOString(),
    });
    toast.success("예약이 등록되었습니다");
    setDialogOpen(false);
    setForm({ customerName: "", customerPhone: "", date: today, time: "18:00", partySize: 2, memo: "" });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`"${name}" 예약을 삭제하시겠습니까?`)) return;
    deleteBooking(id);
    toast.success("예약이 삭제되었습니다");
  };

  const renderBookingList = (list: typeof bookings, title: string, dateStr: string, icon: React.ReactNode) => (
    <Card className="bg-white/5 border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          {icon}
          {title} ({formatDateLabel(dateStr)})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {list.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">{title.includes("오늘") ? "오늘" : "내일"} 예약이 없습니다</p>
        ) : (
          list.map((booking) => {
            const status = statusMap[booking.status];
            return (
              <div key={booking.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/5">
                <div className="w-16 text-center">
                  <p className="text-white font-bold text-lg">{booking.time}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">{booking.customerName}</span>
                    <Badge className={status.color}>{status.label}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500 text-xs">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {booking.partySize}명</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {booking.customerPhone}</span>
                    {booking.deposit && (
                      <span className="text-amber-400">
                        예약금 {booking.deposit.toLocaleString()}원 {booking.depositPaid ? "(입금)" : "(미입금)"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {booking.status === "pending" && (
                    <>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 h-8" onClick={() => handleConfirm(booking.id, booking.customerName)}>확정</Button>
                      <Button size="sm" variant="ghost" className="text-red-400 h-8" onClick={() => handleReject(booking.id, booking.customerName)}>거절</Button>
                    </>
                  )}
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-400 h-8" onClick={() => handleDelete(booking.id, booking.customerName)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">예약 관리</h1>
          <p className="text-slate-400 text-sm mt-1">예약 현황을 확인하고 관리하세요</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5" onClick={() => toast.info("예약 설정 페이지 준비 중입니다.")}>
            <Settings className="w-4 h-4 mr-2" /> 예약 설정
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-500" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> 수동 등록
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-white">{todayBookings.length}</p>
            <p className="text-slate-500 text-xs">오늘 예약</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{tomorrowBookings.length}</p>
            <p className="text-slate-500 text-xs">내일 예약</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{bookings.length}</p>
            <p className="text-slate-500 text-xs">전체 예약</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
            <p className="text-slate-500 text-xs">대기 확인 필요</p>
          </CardContent>
        </Card>
      </div>

      {renderBookingList(todayBookings, "오늘", today, <CalendarDays className="w-5 h-5 text-indigo-400" />)}
      {renderBookingList(tomorrowBookings, "내일", tomorrow, <CalendarDays className="w-5 h-5 text-blue-400" />)}

      {/* Add Booking Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>예약 수동 등록</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">고객명 *</Label>
                <Input value={form.customerName} onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">전화번호 *</Label>
                <Input value={form.customerPhone} onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value }))} className="bg-white/5 border-white/10" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">날짜</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">시간</Label>
                <Input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">인원</Label>
                <Input type="number" min={1} value={form.partySize} onChange={(e) => setForm((f) => ({ ...f, partySize: Number(e.target.value) }))} className="bg-white/5 border-white/10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">메모</Label>
              <Input value={form.memo} onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))} placeholder="특이사항 등" className="bg-white/5 border-white/10" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-slate-400">취소</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-500" onClick={handleAdd}>등록</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
