// ===== Hyun Storage Layer (localStorage) =====

// ===== Types =====

export interface User {
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  businessName?: string;
  businessCategory?: string;
  location?: string;
  naverPlaceUrl?: string;
  plan: 'free' | 'pro' | 'business';
  createdAt: string;
}

export interface Store {
  id: string;
  userId: string;
  name: string;
  category: string;
  address: string;
  naverPlaceUrl: string;
  phone?: string;
  createdAt: string;
}

export interface ScoreBreakdown {
  review: { score: number; max: number; details: any; grade?: string };
  photo: { score: number; max: number; details: any; grade?: string };
  basicInfo: { score: number; max: number; details: any; grade?: string };
  keyword: { score: number; max: number; details: any; grade?: string };
  menu: { score: number; max: number; details: any; grade?: string };
  hours: { score: number; max: number; details: any; grade?: string };
}

export interface Analysis {
  id: string;
  storeId: string;
  userId: string;
  score: number;
  grade: string;
  breakdown: ScoreBreakdown;
  createdAt: string;
}

export interface Action {
  id: string;
  storeId: string;
  analysisId: string;
  title: string;
  category: string;
  impact: number;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  completed: boolean;
  completedAt?: string;
}

// ===== Keys =====

const KEYS = {
  USERS: 'hyun2_users',
  SESSION: 'hyun2_session',
  stores: (userId: string) => `hyun2_stores_${userId}`,
  analyses: (userId: string) => `hyun2_analyses_${userId}`,
  actions: (storeId: string) => `hyun2_actions_${storeId}`,
} as const;

// ===== Helpers =====

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}

/**
 * Simple hash function for client-side password hashing.
 * NOT cryptographically secure - suitable for localStorage demo only.
 */
export function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0; // Convert to 32bit integer
  }
  // Run multiple rounds for slightly better distribution
  let hash2 = hash;
  for (let i = 0; i < 100; i++) {
    hash2 = ((hash2 << 5) - hash2 + (hash ^ i)) | 0;
  }
  // Convert to hex-like string with prefix to indicate it's hashed
  const h1 = (hash >>> 0).toString(16).padStart(8, '0');
  const h2 = (hash2 >>> 0).toString(16).padStart(8, '0');
  return `hsh_${h1}${h2}`;
}

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ===== Session =====

export const sessionStorage = {
  get(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(KEYS.SESSION);
  },

  set(userId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.SESSION, userId);
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(KEYS.SESSION);
  },
};

// ===== Users CRUD =====

export const usersStorage = {
  getAll(): User[] {
    return getItem<User[]>(KEYS.USERS, []);
  },

  getById(id: string): User | undefined {
    return this.getAll().find((u) => u.id === id);
  },

  getByEmail(email: string): User | undefined {
    return this.getAll().find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  create(data: Omit<User, 'id' | 'createdAt' | 'plan'>): User {
    const users = this.getAll();
    const newUser: User = {
      ...data,
      id: generateId(),
      plan: 'free',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    setItem(KEYS.USERS, users);
    return newUser;
  },

  update(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): User | undefined {
    const users = this.getAll();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return undefined;
    users[index] = { ...users[index], ...data };
    setItem(KEYS.USERS, users);
    return users[index];
  },

  delete(id: string): boolean {
    const users = this.getAll();
    const filtered = users.filter((u) => u.id !== id);
    if (filtered.length === users.length) return false;
    setItem(KEYS.USERS, filtered);
    return true;
  },
};

// ===== Stores CRUD =====

export const storesStorage = {
  getAll(userId: string): Store[] {
    return getItem<Store[]>(KEYS.stores(userId), []);
  },

  getById(userId: string, storeId: string): Store | undefined {
    return this.getAll(userId).find((s) => s.id === storeId);
  },

  create(userId: string, data: Omit<Store, 'id' | 'userId' | 'createdAt'>): Store {
    const stores = this.getAll(userId);
    const newStore: Store = {
      ...data,
      id: generateId(),
      userId,
      createdAt: new Date().toISOString(),
    };
    stores.push(newStore);
    setItem(KEYS.stores(userId), stores);
    return newStore;
  },

  update(userId: string, storeId: string, data: Partial<Omit<Store, 'id' | 'userId' | 'createdAt'>>): Store | undefined {
    const stores = this.getAll(userId);
    const index = stores.findIndex((s) => s.id === storeId);
    if (index === -1) return undefined;
    stores[index] = { ...stores[index], ...data };
    setItem(KEYS.stores(userId), stores);
    return stores[index];
  },

  delete(userId: string, storeId: string): boolean {
    const stores = this.getAll(userId);
    const filtered = stores.filter((s) => s.id !== storeId);
    if (filtered.length === stores.length) return false;
    setItem(KEYS.stores(userId), filtered);
    return true;
  },
};

// ===== Analyses CRUD =====

export const analysesStorage = {
  getAll(userId: string): Analysis[] {
    return getItem<Analysis[]>(KEYS.analyses(userId), []);
  },

  getById(userId: string, analysisId: string): Analysis | undefined {
    return this.getAll(userId).find((a) => a.id === analysisId);
  },

  getByStoreId(userId: string, storeId: string): Analysis[] {
    return this.getAll(userId).filter((a) => a.storeId === storeId);
  },

  create(userId: string, data: Omit<Analysis, 'id' | 'userId' | 'createdAt'>): Analysis {
    const analyses = this.getAll(userId);
    const newAnalysis: Analysis = {
      ...data,
      id: generateId(),
      userId,
      createdAt: new Date().toISOString(),
    };
    analyses.push(newAnalysis);
    setItem(KEYS.analyses(userId), analyses);
    return newAnalysis;
  },

  delete(userId: string, analysisId: string): boolean {
    const analyses = this.getAll(userId);
    const filtered = analyses.filter((a) => a.id !== analysisId);
    if (filtered.length === analyses.length) return false;
    setItem(KEYS.analyses(userId), filtered);
    return true;
  },
};

// ===== Actions CRUD =====

export const actionsStorage = {
  getAll(storeId: string): Action[] {
    return getItem<Action[]>(KEYS.actions(storeId), []);
  },

  getById(storeId: string, actionId: string): Action | undefined {
    return this.getAll(storeId).find((a) => a.id === actionId);
  },

  create(storeId: string, data: Omit<Action, 'id' | 'storeId' | 'completed' | 'completedAt'>): Action {
    const actions = this.getAll(storeId);
    const newAction: Action = {
      ...data,
      id: generateId(),
      storeId,
      completed: false,
    };
    actions.push(newAction);
    setItem(KEYS.actions(storeId), actions);
    return newAction;
  },

  update(storeId: string, actionId: string, data: Partial<Omit<Action, 'id' | 'storeId'>>): Action | undefined {
    const actions = this.getAll(storeId);
    const index = actions.findIndex((a) => a.id === actionId);
    if (index === -1) return undefined;
    actions[index] = { ...actions[index], ...data };
    setItem(KEYS.actions(storeId), actions);
    return actions[index];
  },

  toggleComplete(storeId: string, actionId: string): Action | undefined {
    const actions = this.getAll(storeId);
    const index = actions.findIndex((a) => a.id === actionId);
    if (index === -1) return undefined;
    actions[index].completed = !actions[index].completed;
    actions[index].completedAt = actions[index].completed ? new Date().toISOString() : undefined;
    setItem(KEYS.actions(storeId), actions);
    return actions[index];
  },

  delete(storeId: string, actionId: string): boolean {
    const actions = this.getAll(storeId);
    const filtered = actions.filter((a) => a.id !== actionId);
    if (filtered.length === actions.length) return false;
    setItem(KEYS.actions(storeId), filtered);
    return true;
  },
};
