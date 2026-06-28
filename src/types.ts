// VibeMatch shared types and constants (mirrors web app)

// Multi-region: UK + India
export const CITIES = [
  "Edinburgh",
  "London",
  "Manchester",
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Goa",
  "Pune",
] as const;

export type City = (typeof CITIES)[number];

export const REGIONS: Record<string, "UK" | "India"> = {
  Edinburgh: "UK",
  London: "UK",
  Manchester: "UK",
  Delhi: "India",
  Mumbai: "India",
  Bangalore: "India",
  Goa: "India",
  Pune: "India",
};

export function currencyForCity(city: string): "£" | "₹" {
  return REGIONS[city] === "UK" ? "£" : "₹";
}

export const VIBE_TAGS = [
  "R&B",
  "Bollywood",
  "BYOB",
  "Games",
  "Lo-fi",
  "Chill",
  "EDM",
  "Retro",
] as const;

export type VibeTag = (typeof VIBE_TAGS)[number];

export const VIBE_EMOJI: Record<string, string> = {
  "R&B": "🎵",
  Bollywood: "🌿",
  BYOB: "🍾",
  Games: "🎮",
  "Lo-fi": "🌙",
  Chill: "🧊",
  EDM: "⚡",
  Retro: "📼",
};

export const VIBE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "R&B": { bg: "rgba(168,85,247,0.15)", text: "#c084fc", border: "rgba(168,85,247,0.45)" },
  Bollywood: { bg: "rgba(22,163,74,0.15)", text: "#4ade80", border: "rgba(22,163,74,0.45)" },
  BYOB: { bg: "rgba(168,85,247,0.15)", text: "#c084fc", border: "rgba(168,85,247,0.45)" },
  Games: { bg: "rgba(20,184,166,0.15)", text: "#5eead4", border: "rgba(20,184,166,0.45)" },
  "Lo-fi": { bg: "rgba(168,85,247,0.15)", text: "#c084fc", border: "rgba(168,85,247,0.45)" },
  Chill: { bg: "rgba(6,182,212,0.15)", text: "#67e8f9", border: "rgba(6,182,212,0.45)" },
  EDM: { bg: "rgba(249,115,22,0.15)", text: "#fb923c", border: "rgba(249,115,22,0.45)" },
  Retro: { bg: "rgba(244,63,94,0.15)", text: "#fb7185", border: "rgba(244,63,94,0.45)" },
};

export const PROFESSIONS = [
  "Student",
  "Software eng.",
  "Designer",
  "Healthcare",
  "Finance",
  "Other",
] as const;
export type Profession = (typeof PROFESSIONS)[number];

export interface Party {
  id: string;
  title: string;
  city: string;
  area: string;
  date: string;
  time: string;
  fee: number;
  maxGuests: number;
  vibes: string;
  description: string;
  hostName: string;
  hostId?: string | null;
  coverUrl?: string | null;
  lat?: number | null;
  lng?: number | null;
  guestCount: number;
  approvalRequired?: boolean;
  acceptJoiners?: boolean;
  menuOpen?: boolean;
  locationRevealAt?: string | null;
  createdAt: string;
}

export interface PartyCreateInput {
  title: string;
  city: string;
  area: string;
  date: string;
  time: string;
  fee: number;
  maxGuests: number;
  vibes: string[];
  description: string;
  hostName: string;
  coverUrl?: string;
  lat?: number;
  lng?: number;
}

export interface JoinRequest {
  id: string;
  partyId: string;
  requesterName: string;
  introMessage: string;
  status: "pending" | "accepted" | "rejected";
  requesterId?: string | null;
  createdAt: string;
}

export interface JoinRequestInput {
  partyId: string;
  requesterName: string;
  introMessage: string;
}

export interface VibeUser {
  id: string;
  name: string;
  username?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  city?: string | null;
  instagram?: string | null;
  vibePrefs?: string;
  profession?: string | null;
  vibes: number;
  hosted: number;
  rating: number;
  ratingCount: number;
}

export interface ChatThread {
  id: string;
  userAId: string;
  userBId: string;
  partyId?: string | null;
  createdAt: string;
  updatedAt: string;
  otherUser?: VibeUser;
  lastMessage?: ChatMessage;
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface PartyReview {
  id: string;
  partyId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
}

export interface HostAnalytics {
  hostId: string;
  totalViews: number;
  partyCount: number;
  totalGuests: number;
  totalCapacity: number;
  totalRequests: number;
  acceptedRequests: number;
  pendingRequests: number;
  rejectedRequests: number;
  acceptanceRate: number;
  avgRating: number;
  reviewCount: number;
  topParties: {
    partyId: string;
    title: string;
    views: number;
    requests: number;
    guests: number;
    capacity: number;
  }[];
}

export interface MenuItem {
  id: string;
  partyId: string;
  name: string;
  price: number;
  emoji: string;
  category: "drink" | "snack" | "soft";
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  partyId: string;
  items: OrderItem[];
  totalAmount: number;
  currency: "£" | "₹";
  status: "pending" | "paid" | "refunded";
  stripePaymentId?: string | null;
  createdAt: string;
  party?: Party;
  ticket?: Ticket;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string | null;
  name: string;
  emoji: string;
  unitPrice: number;
  quantity: number;
}

export interface Ticket {
  id: string;
  orderId: string;
  userId: string;
  partyId: string;
  qrHash: string;
  scannedAt?: string | null;
  scannedById?: string | null;
  createdAt: string;
  party?: Party;
  order?: Order;
}

// ===== Utility functions =====

export function parseVibes(vibes: string): string[] {
  if (!vibes) return [];
  return vibes.split(",").map((v) => v.trim()).filter(Boolean);
}

export function formatFee(fee: number, city?: string): string {
  if (fee === 0) return "Free";
  const sym = city ? currencyForCity(city) : "£";
  return `${sym}${fee}`;
}

export function formatDateLabel(date: string): string {
  const d = new Date(date + "T00:00:00");
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatTime(time: string): string {
  const [hStr, m] = time.split(":");
  const h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${m} ${ampm}`;
}

export function relativeTime(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-GB", { month: "short", day: "numeric" });
}

export function slotsLeft(maxGuests: number, guestCount: number): number {
  return Math.max(0, maxGuests - guestCount);
}

export type PartyLiveStatus = "live" | "starting-soon" | "today" | "upcoming" | "past";

export function partyLiveStatus(date: string, time: string, durationHours = 4): PartyLiveStatus {
  const start = new Date(`${date}T${time || "00:00"}:00`);
  const end = new Date(start.getTime() + durationHours * 3_600_000);
  const now = new Date();
  const d = new Date(date + "T00:00:00");
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayDiff = Math.round((target.getTime() - today.getTime()) / 86_400_000);

  if (now >= start && now <= end) return "live";
  if (dayDiff < 0 || now > end) return "past";
  if (dayDiff === 0) {
    const msToStart = start.getTime() - now.getTime();
    if (msToStart > 0 && msToStart <= 2 * 3_600_000) return "starting-soon";
    return "today";
  }
  return "upcoming";
}

export function countdownTo(date: string, time: string, durationHours = 4): string {
  const start = new Date(`${date}T${time || "00:00"}:00`);
  const end = new Date(start.getTime() + durationHours * 3_600_000);
  const now = new Date();

  if (now >= start && now <= end) return "Live now";
  if (now > end) return "Ended";

  const ms = start.getTime() - now.getTime();
  const totalMin = Math.floor(ms / 60_000);
  const days = Math.floor(totalMin / (60 * 24));
  const hours = Math.floor((totalMin % (60 * 24)) / 60);
  const mins = totalMin % 60;

  if (days > 0) return `in ${days}d ${hours}h`;
  if (hours > 0) return `in ${hours}h ${mins}m`;
  if (mins > 0) return `in ${mins}m`;
  return "starting";
}

// Fun score for party cards
export type FunTier = "low" | "warm" | "lively" | "lit";

export function funScore(p: {
  guestCount: number;
  maxGuests: number;
  vibes: string;
  date: string;
  time: string;
  fee: number;
}): number {
  const fillRatio = p.maxGuests > 0 ? Math.min(1, p.guestCount / p.maxGuests) : 0;
  const crowd = fillRatio * 50;
  const vibeCount = parseVibes(p.vibes).length;
  const vibeScore = Math.min(20, vibeCount * 5);
  const status = partyLiveStatus(p.date, p.time);
  const liveBonus =
    status === "live" ? 25 : status === "starting-soon" ? 18 : status === "today" ? 10 : 0;
  const freeBonus = p.fee === 0 ? 5 : 0;
  return Math.round(crowd + vibeScore + liveBonus + freeBonus);
}

export function funTier(score: number): FunTier {
  if (score >= 80) return "lit";
  if (score >= 60) return "lively";
  if (score >= 35) return "warm";
  return "low";
}

export const FUN_TIER_COLORS: Record<FunTier, { color: string; label: string }> = {
  low: { color: "#a855f7", label: "Low-key" },
  warm: { color: "#f59e0b", label: "Warming up" },
  lively: { color: "#14b8a6", label: "Lively" },
  lit: { color: "#a78bfa", label: "Lit 🔥" },
};
