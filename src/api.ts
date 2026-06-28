// VibeMatch API client for React Native
import type {
  Party,
  PartyCreateInput,
  JoinRequestInput,
  ChatThread,
  ChatMessage,
  VibeUser,
  PartyReview,
  HostAnalytics,
  MenuItem,
  Order,
  Ticket,
} from "./types";

// Base URL for the VibeMatch backend API — configurable via env
const API_BASE = process.env.EXPO_PUBLIC_API_URL || "https://vibematch.app";

async function jfetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const j = await res.json();
      if (j.error) msg = j.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Parties
  listParties: (params: { city?: string | null; vibe?: string | null; q?: string } = {}) => {
    const sp = new URLSearchParams();
    if (params.city) sp.set("city", params.city);
    if (params.vibe) sp.set("vibe", params.vibe);
    if (params.q) sp.set("q", params.q);
    const qs = sp.toString();
    return jfetch<{ parties: Party[] }>(`/api/parties${qs ? `?${qs}` : ""}`);
  },

  getParty: (id: string) =>
    jfetch<{ party: Party; host?: VibeUser; vibes: string[]; requests?: JoinRequest[] }>(
      `/api/parties/${id}`
    ),

  createParty: (input: PartyCreateInput) =>
    jfetch<{ party: Party }>("/api/parties", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  // Requests
  sendRequest: (input: JoinRequestInput) =>
    jfetch<{ id: string; message: string; status: string }>("/api/requests", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  listRequests: (partyId: string) =>
    jfetch<{ requests: JoinRequest[] }>(`/api/requests?partyId=${partyId}`),

  updateRequest: (id: string, status: "accepted" | "rejected") =>
    jfetch<{ id: string; status: string }>(`/api/requests/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // Threads
  listThreads: (userId: string) =>
    jfetch<{ threads: ChatThread[] }>(`/api/threads?userId=${userId}`),

  getThread: (id: string, userId: string) =>
    jfetch<{
      thread: ChatThread;
      otherUser: VibeUser | null;
      messages: ChatMessage[];
    }>(`/api/threads/${id}?userId=${userId}`),

  ensureThread: (userAId: string, userBId: string, partyId?: string) =>
    jfetch<{ threadId: string; created: boolean }>("/api/threads", {
      method: "POST",
      body: JSON.stringify({ userAId, userBId, partyId }),
    }),

  // Messages
  sendMessage: (input: {
    threadId: string;
    senderId: string;
    receiverId: string;
    content: string;
  }) =>
    jfetch<ChatMessage>("/api/messages", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  // Users
  getUser: (by: { phone?: string; id?: string }) => {
    const sp = new URLSearchParams();
    if (by.phone) sp.set("phone", by.phone);
    if (by.id) sp.set("id", by.id);
    return jfetch<{ user: VibeUser }>(`/api/users?${sp.toString()}`);
  },

  updateUser: (id: string, patch: Partial<VibeUser>) =>
    jfetch<{ user: VibeUser }>(`/api/users?id=${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),

  // Auth
  sendOtp: (phone: string) =>
    jfetch<{ sent: boolean; devOtp: string }>("/api/auth/otp", {
      method: "POST",
      body: JSON.stringify({ step: "send", phone }),
    }),

  verifyOtp: (phone: string, otp: string, name?: string) =>
    jfetch<{ user: VibeUser; token: string }>("/api/auth/otp", {
      method: "POST",
      body: JSON.stringify({ step: "verify", phone, otp, name }),
    }),

  // Saved parties
  listSaved: (userId: string) =>
    jfetch<{ saved: Party[]; partyIds: string[] }>(`/api/saved?userId=${userId}`),

  toggleSaved: (userId: string, partyId: string) =>
    jfetch<{ saved: boolean; partyId: string }>("/api/saved", {
      method: "POST",
      body: JSON.stringify({ userId, partyId }),
    }),

  // Party views
  recordView: (partyId: string, userId?: string) =>
    jfetch<{ recorded: boolean }>("/api/views", {
      method: "POST",
      body: JSON.stringify({ partyId, userId }),
    }),

  // Host analytics
  getHostAnalytics: (hostId: string) =>
    jfetch<HostAnalytics>(`/api/analytics?hostId=${hostId}`),

  // Reviews
  listReviews: (partyId: string) =>
    jfetch<{ reviews: PartyReview[]; avgRating: number; count: number }>(
      `/api/reviews?partyId=${partyId}`
    ),

  submitReview: (input: {
    partyId: string;
    userId: string;
    rating: number;
    comment: string;
  }) =>
    jfetch<{ review: PartyReview }>("/api/reviews", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  // For You
  forYou: (userId: string) =>
    jfetch<{ parties: Party[]; matchedVibes: string[] }>(
      `/api/parties/for-you?userId=${userId}`
    ),

  // Menu
  listMenu: (partyId: string) =>
    jfetch<{ items: MenuItem[] }>(`/api/menus?partyId=${partyId}`),

  // Orders
  listOrders: (by: { userId?: string; partyId?: string }) => {
    const sp = new URLSearchParams();
    if (by.userId) sp.set("userId", by.userId);
    if (by.partyId) sp.set("partyId", by.partyId);
    return jfetch<{ orders: Order[] }>(`/api/orders?${sp.toString()}`);
  },

  createOrder: (input: {
    userId: string;
    partyId: string;
    items: {
      menuItemId?: string;
      name: string;
      emoji: string;
      unitPrice: number;
      quantity: number;
    }[];
  }) =>
    jfetch<{ order: Order; ticket: Ticket }>("/api/orders", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  // Tickets
  listTickets: (userId: string) =>
    jfetch<{ tickets: Ticket[] }>(`/api/tickets?userId=${userId}`),
};
