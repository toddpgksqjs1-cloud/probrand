"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag, Clock, Truck, Package, CheckCircle,
  XCircle, CreditCard,
} from "lucide-react";
import { useAdminStore } from "@/lib/store/admin-store";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const statusMap = {
  pending: { label: "접수 대기", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: Clock },
  accepted: { label: "접수", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: CheckCircle },
  preparing: { label: "조리 중", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", icon: Package },
  delivering: { label: "배달 중", color: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: Truck },
  completed: { label: "완료", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: CheckCircle },
  cancelled: { label: "취소", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: XCircle },
};

const typeMap = {
  delivery: { label: "배달", icon: Truck, color: "text-purple-400" },
  pickup: { label: "포장", icon: Package, color: "text-blue-400" },
  "dine-in": { label: "매장", icon: ShoppingBag, color: "text-emerald-400" },
};

export default function OrdersPage() {
  const orders = useAdminStore((s) => s.orders);
  const updateOrderStatus = useAdminStore((s) => s.updateOrderStatus);
  const deleteOrder = useAdminStore((s) => s.deleteOrder);

  const todayRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const preparingCount = orders.filter((o) => o.status === "preparing").length;

  const handleAccept = (id: string, orderNumber: string) => {
    updateOrderStatus(id, "preparing");
    toast.success(`${orderNumber} 주문이 접수되었습니다.`);
  };

  const handleReject = (id: string, orderNumber: string) => {
    updateOrderStatus(id, "cancelled");
    toast.info(`${orderNumber} 주문이 거절되었습니다.`);
  };

  const handleNextStatus = (id: string, orderNumber: string, type: string) => {
    const nextStatus = type === "delivery" ? "delivering" as const : "completed" as const;
    const label = type === "delivery" ? "배달이 시작" : "준비가 완료";
    updateOrderStatus(id, nextStatus);
    toast.success(`${orderNumber} ${label}되었습니다.`);
  };

  const handleDeliveryComplete = (id: string, orderNumber: string) => {
    updateOrderStatus(id, "completed");
    toast.success(`${orderNumber} 배달이 완료되었습니다.`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">주문 관리</h1>
          <p className="text-slate-400 text-sm mt-1">실시간 주문 현황을 관리하세요</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-white">{orders.length}</p>
            <p className="text-slate-500 text-xs">오늘 주문</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{todayRevenue.toLocaleString()}원</p>
            <p className="text-slate-500 text-xs">오늘 매출</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
            <p className="text-slate-500 text-xs">접수 대기</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-indigo-400">{preparingCount}</p>
            <p className="text-slate-500 text-xs">조리 중</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">실시간 주문</CardTitle>
            <div className="flex gap-2">
              {["전체", "배달", "포장", "매장"].map((type) => (
                <Badge key={type} variant="secondary" className="bg-white/5 text-slate-400 border-0 cursor-pointer hover:bg-white/10">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.map((order) => {
            const status = statusMap[order.status];
            const type = typeMap[order.type];
            return (
              <div key={order.id} className="p-4 rounded-xl bg-white/3 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                      <type.icon className={`w-5 h-5 ${type.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{order.orderNumber}</span>
                        <Badge className={status.color}>{status.label}</Badge>
                        <Badge variant="secondary" className="bg-white/5 text-slate-500 border-0 text-xs">
                          {type.label}
                        </Badge>
                      </div>
                      <p className="text-slate-500 text-xs">
                        {order.customerName} | {order.customerPhone}
                        {order.customerAddress && ` | ${order.customerAddress}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{order.totalAmount.toLocaleString()}원</p>
                    <p className="text-slate-500 text-xs flex items-center gap-1 justify-end">
                      <CreditCard className="w-3 h-3" /> {order.paymentMethod}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white/3 rounded-lg p-3 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{item.name} x{item.quantity}</span>
                      <span className="text-slate-400">{(item.price * item.quantity).toLocaleString()}원</span>
                    </div>
                  ))}
                  {order.deliveryFee && (
                    <div className="flex items-center justify-between text-sm border-t border-white/5 mt-2 pt-2">
                      <span className="text-slate-500">배달비</span>
                      <span className="text-slate-400">{order.deliveryFee.toLocaleString()}원</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {order.status === "pending" && (
                    <>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500" onClick={() => handleAccept(order.id, order.orderNumber)}>접수</Button>
                      <Button size="sm" variant="ghost" className="text-red-400" onClick={() => handleReject(order.id, order.orderNumber)}>거절</Button>
                    </>
                  )}
                  {order.status === "preparing" && (
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500" onClick={() => handleNextStatus(order.id, order.orderNumber, order.type)}>
                      {order.type === "delivery" ? "배달 시작" : "준비 완료"}
                    </Button>
                  )}
                  {order.status === "delivering" && (
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500" onClick={() => handleDeliveryComplete(order.id, order.orderNumber)}>배달 완료</Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-400" onClick={() => {
                    if (!confirm(`${order.orderNumber} 주문을 삭제하시겠습니까?`)) return;
                    deleteOrder(order.id);
                    toast.success("주문이 삭제되었습니다");
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
