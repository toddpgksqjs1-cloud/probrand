import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Booking, Order, Customer, Review, MarketingCampaign, Coupon } from "@/lib/types";

interface AdminStore {
  bookings: Booking[];
  orders: Order[];
  customers: Customer[];
  reviews: Review[];
  campaigns: MarketingCampaign[];
  coupons: Coupon[];

  // Booking CRUD
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, data: Partial<Booking>) => void;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;
  deleteBooking: (id: string) => void;

  // Order CRUD
  addOrder: (order: Order) => void;
  updateOrder: (id: string, data: Partial<Order>) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  deleteOrder: (id: string) => void;

  // Customer CRUD
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Review actions
  addReviewReply: (id: string, reply: string) => void;
  deleteReview: (id: string) => void;

  // Campaign CRUD
  addCampaign: (campaign: MarketingCampaign) => void;
  updateCampaignStatus: (id: string, status: MarketingCampaign["status"]) => void;
  deleteCampaign: (id: string) => void;

  // Coupon CRUD
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, data: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;

  // Bulk
  loadSampleData: () => void;
  clearAllData: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      bookings: [],
      orders: [],
      customers: [],
      reviews: [],
      campaigns: [],
      coupons: [],

      // Booking CRUD
      addBooking: (booking) =>
        set((s) => ({ bookings: [...s.bookings, booking] })),
      updateBooking: (id, data) =>
        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === id ? { ...b, ...data } : b)),
        })),
      updateBookingStatus: (id, status) =>
        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
        })),
      deleteBooking: (id) =>
        set((s) => ({ bookings: s.bookings.filter((b) => b.id !== id) })),

      // Order CRUD
      addOrder: (order) =>
        set((s) => ({ orders: [...s.orders, order] })),
      updateOrder: (id, data) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, ...data } : o)),
        })),
      updateOrderStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
      deleteOrder: (id) =>
        set((s) => ({ orders: s.orders.filter((o) => o.id !== id) })),

      // Customer CRUD
      addCustomer: (customer) =>
        set((s) => ({ customers: [...s.customers, customer] })),
      updateCustomer: (id, data) =>
        set((s) => ({
          customers: s.customers.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),
      deleteCustomer: (id) =>
        set((s) => ({ customers: s.customers.filter((c) => c.id !== id) })),

      // Review actions
      addReviewReply: (id, reply) =>
        set((s) => ({
          reviews: s.reviews.map((r) =>
            r.id === id ? { ...r, reply, replyDate: new Date().toISOString() } : r
          ),
        })),
      deleteReview: (id) =>
        set((s) => ({ reviews: s.reviews.filter((r) => r.id !== id) })),

      // Campaign CRUD
      addCampaign: (campaign) =>
        set((s) => ({ campaigns: [...s.campaigns, campaign] })),
      updateCampaignStatus: (id, status) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, status } : c)),
        })),
      deleteCampaign: (id) =>
        set((s) => ({ campaigns: s.campaigns.filter((c) => c.id !== id) })),

      // Coupon CRUD
      addCoupon: (coupon) =>
        set((s) => ({ coupons: [...s.coupons, coupon] })),
      updateCoupon: (id, data) =>
        set((s) => ({
          coupons: s.coupons.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),
      deleteCoupon: (id) =>
        set((s) => ({ coupons: s.coupons.filter((c) => c.id !== id) })),

      // Bulk
      loadSampleData: async () => {
        const {
          sampleBookings, sampleOrders, sampleCustomers,
          sampleReviews, sampleCampaigns, sampleCoupons,
        } = await import("@/lib/mock-data/sample-store");
        set({
          bookings: sampleBookings as Booking[],
          orders: sampleOrders as Order[],
          customers: sampleCustomers as Customer[],
          reviews: sampleReviews as Review[],
          campaigns: sampleCampaigns as MarketingCampaign[],
          coupons: sampleCoupons as Coupon[],
        });
      },

      clearAllData: () =>
        set({
          bookings: [],
          orders: [],
          customers: [],
          reviews: [],
          campaigns: [],
          coupons: [],
        }),
    }),
    { name: "probrand-admin-store" }
  )
);
