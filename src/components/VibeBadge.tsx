// Reusable VibeBadge component — displays a vibe tag as a styled chip
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { VIBE_COLORS, VIBE_EMOJI } from "../types";
import { theme } from "../theme";

interface VibeBadgeProps {
  vibe: string;
  size?: "sm" | "md";
}

export function VibeBadge({ vibe, size = "sm" }: VibeBadgeProps) {
  const colors = VIBE_COLORS[vibe] || VIBE_COLORS["Chill"];
  const emoji = VIBE_EMOJI[vibe] || "✨";

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          paddingVertical: size === "sm" ? 3 : 5,
          paddingHorizontal: size === "sm" ? 8 : 12,
        },
      ]}
    >
      <Text style={[styles.emoji, { fontSize: size === "sm" ? 10 : 14 }]}>
        {emoji}
      </Text>
      <Text
        style={[
          styles.label,
          { color: colors.text, fontSize: size === "sm" ? 10 : 13 },
        ]}
      >
        {vibe}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    gap: 3,
  },
  emoji: {
    lineHeight: 14,
  },
  label: {
    fontWeight: "600",
  },
});
