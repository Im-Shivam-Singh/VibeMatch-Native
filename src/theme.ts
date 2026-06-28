// VibeMatch Dark Theme — deep purple/black backgrounds, neon pink/violet accents
export const theme = {
  colors: {
    background: "#0a0a0f",
    surface: "#13131a",
    surfaceLight: "#1a1a25",
    surfaceHover: "#22222f",
    border: "#2a2a3a",
    borderLight: "#3a3a4a",

    // Text
    text: "#f0f0f5",
    textSecondary: "#a0a0b0",
    textMuted: "#6a6a7a",

    // Accent — purple/violet
    primary: "#a855f7",
    primaryLight: "#c084fc",
    primaryDark: "#7c3aed",
    primaryBg: "rgba(168,85,247,0.15)",

    // Neon pink
    neonPink: "#ec4899",
    neonPinkBg: "rgba(236,72,153,0.15)",

    // Coral (unread badge)
    coral: "#f97316",

    // Status
    success: "#22c55e",
    successBg: "rgba(34,197,94,0.15)",
    warning: "#f59e0b",
    warningBg: "rgba(245,158,11,0.15)",
    danger: "#ef4444",
    dangerBg: "rgba(239,68,68,0.15)",

    // Glass
    glass: "rgba(255,255,255,0.05)",
    glassStrong: "rgba(20,20,30,0.85)",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },

  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    xxxl: 28,
    title: 34,
  },
};

export type Theme = typeof theme;
