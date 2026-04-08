export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  partySize: number;
  tableId?: string;
  status: "pending" | "confirmed" | "cancelled" | "noshow" | "completed";
  deposit?: number;
  depositPaid?: boolean;
  memo?: string;
  createdAt: string;
  remindSent?: boolean;
}

export interface TableSlot {
  id: string;
  name: string;
  capacity: number;
  isActive: boolean;
}

export interface BookingSettings {
  tables: TableSlot[];
  timeSlots: string[];
  maxAdvanceDays: number;
  depositRequired: boolean;
  depositAmount: number;
  autoConfirm: boolean;
  reminderHoursBefore: number[];
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  type: "delivery" | "pickup" | "dine-in";
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "accepted" | "preparing" | "delivering" | "completed" | "cancelled";
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "refunded";
  createdAt: string;
  estimatedTime?: string;
  deliveryFee?: number;
  memo?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  options?: string[];
}
