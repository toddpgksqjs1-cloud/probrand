import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PlatformStore as PStore, PlatformUser, PlatformMetrics } from "@/lib/types/platform";

const PLAN_PRICES: Record<PStore["plan"], number> = {
  free: 0,
  basic: 49000,
  pro: 99000,
  enterprise: 199000,
};

interface PlatformStoreState {
  stores: PStore[];
  users: PlatformUser[];

  // Store CRUD
  addStore: (store: PStore) => void;
  updateStore: (id: string, data: Partial<PStore>) => void;
  deleteStore: (id: string) => void;

  // User CRUD
  addUser: (user: PlatformUser) => void;
  updateUser: (id: string, data: Partial<PlatformUser>) => void;
  deleteUser: (id: string) => void;

  // Bulk
  loadSampleData: () => void;
  clearAllData: () => void;
}

export const usePlatformStore = create<PlatformStoreState>()(
  persist(
    (set, get) => ({
      stores: [],
      users: [],

      addStore: (store) =>
        set((s) => ({ stores: [...s.stores, store] })),

      updateStore: (id, data) =>
        set((s) => ({
          stores: s.stores.map((st) =>
            st.id === id ? { ...st, ...data } : st
          ),
        })),

      deleteStore: (id) =>
        set((s) => ({
          stores: s.stores.filter((st) => st.id !== id),
          users: s.users.filter((u) => u.storeId !== id),
        })),

      addUser: (user) =>
        set((s) => ({ users: [...s.users, user] })),

      updateUser: (id, data) =>
        set((s) => ({
          users: s.users.map((u) =>
            u.id === id ? { ...u, ...data } : u
          ),
        })),

      deleteUser: (id) =>
        set((s) => ({
          users: s.users.filter((u) => u.id !== id),
        })),

      loadSampleData: async () => {
        const { platformStores, platformUsers } = await import(
          "@/lib/mock-data/platform-data"
        );
        set({ stores: platformStores as PStore[], users: platformUsers as PlatformUser[] });
      },

      clearAllData: () => set({ stores: [], users: [] }),
    }),
    { name: "probrand-platform-store" }
  )
);

// Selector helper — call outside the store so it always recalculates
export function computeMetrics(
  stores: PStore[],
  users: PlatformUser[]
): PlatformMetrics {
  const active = stores.filter(
    (s) => s.status === "active" || s.status === "trial"
  );
  const paid = stores.filter(
    (s) =>
      s.plan !== "free" &&
      (s.status === "active" || s.status === "trial")
  );
  const churned = stores.filter((s) => s.status === "churned").length;
  const nonChurned = stores.filter((s) => s.status !== "churned").length;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return {
    totalStores: stores.length,
    activeStores: active.length,
    totalUsers: users.length,
    mrr: paid.reduce((sum, s) => sum + PLAN_PRICES[s.plan], 0),
    totalOrdersThisMonth: active.reduce(
      (sum, s) => sum + s.monthlyOrders,
      0
    ),
    totalBookingsThisMonth: active.reduce(
      (sum, s) => sum + s.monthlyBookings,
      0
    ),
    avgDiagnosticScore:
      active.length > 0
        ? Math.round(
            active.reduce((sum, s) => sum + s.diagnosticScore, 0) /
              active.length
          )
        : 0,
    newSignupsThisWeek: stores.filter(
      (s) => new Date(s.signupDate) >= weekAgo
    ).length,
    churnRate:
      stores.length > 0
        ? Math.round((churned / stores.length) * 1000) / 10
        : 0,
    conversionRate:
      nonChurned > 0
        ? Math.round(
            (paid.length / nonChurned) * 1000
          ) / 10
        : 0,
  };
}
